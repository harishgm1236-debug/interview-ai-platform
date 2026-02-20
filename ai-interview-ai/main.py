# main.py - Production Safe Version

import os
import io
import uuid
import json
import shutil
from typing import Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pydub import AudioSegment

from question_bank import QUESTION_BANK
from evaluator import evaluate_multimodal, sanitize_for_json

app = FastAPI(
    title="AI Interview Evaluation Service",
    version="2.1.0"
)

# -------------------------
# CORS (restrict in production)
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

SESSIONS_DIR = "saved_sessions"
TEMP_DIR = "temp_eval"

os.makedirs(SESSIONS_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

# -------------------------
# ROOT ROUTE (Fixes Not Found)
# -------------------------
@app.get("/")
async def root():
    return {
        "message": "AI Interview Service Running 🚀",
        "docs": "/docs",
        "health": "/health"
    }

# -------------------------
# Health Check
# -------------------------
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "AI Interview Engine",
        "version": "2.1.0"
    }

# -------------------------
# Models
# -------------------------
class StartRequest(BaseModel):
    domain: str
    level: Optional[str] = "all"

# -------------------------
# Check FFmpeg Availability
# -------------------------
def check_ffmpeg():
    if not shutil.which("ffmpeg"):
        raise RuntimeError("FFmpeg not installed on server")

# -------------------------
# Audio Conversion
# -------------------------
def save_uploaded_audio_as_wav(upload: UploadFile, audio_bytes: bytes) -> str:
    check_ffmpeg()

    source_format = upload.filename.split(".")[-1] if "." in upload.filename else "webm"

    wav_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}.wav")

    audio = AudioSegment.from_file(io.BytesIO(audio_bytes), format=source_format)
    audio = audio.set_channels(1).set_frame_rate(16000).set_sample_width(2)
    audio.export(wav_path, format="wav")

    return wav_path

# -------------------------
# Session Helpers
# -------------------------
def save_session(session_id, data):
    path = os.path.join(SESSIONS_DIR, f"{session_id}.json")
    with open(path, "w") as f:
        json.dump(sanitize_for_json(data), f, indent=4)

def load_session(session_id):
    path = os.path.join(SESSIONS_DIR, f"{session_id.strip()}.json")
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return None

# -------------------------
# Start Interview
# -------------------------
@app.post("/interview/start")
async def start(req: StartRequest):

    session_id = str(uuid.uuid4())
    domain_key = req.domain.lower().replace(" ", "").replace("-", "")

    if domain_key not in QUESTION_BANK:
        domain_key = "backend"

    raw_rounds = QUESTION_BANK[domain_key]
    questions = []

    for r in raw_rounds:
        questions.extend(raw_rounds[r])

    session_data = {
        "session_id": session_id,
        "domain": domain_key,
        "level": req.level,
        "questions": questions,
        "scores": []
    }

    save_session(session_id, session_data)

    return {
        "session_id": session_id,
        "total_questions": len(questions)
    }

# -------------------------
# Background Evaluation Logic
# -------------------------
def process_evaluation(session_id, index, answer_text, img_path, audio_path):
    session = load_session(session_id)
    q_data = session["questions"][index]

    eval_res = evaluate_multimodal(
        answer_text=answer_text,
        keywords=q_data.get("keywords", []),
        weight=q_data.get("weight", 1.0),
        image_path=img_path,
        audio_path=audio_path,
        model_answer=q_data.get("model_answer", "")
    )

    result = sanitize_for_json(eval_res)
    session["scores"].append(result)
    save_session(session_id, session)

    # Cleanup
    for p in [img_path, audio_path]:
        if os.path.exists(p):
            os.remove(p)

# -------------------------
# Evaluate Endpoint (Non-blocking)
# -------------------------
@app.post("/interview/evaluate")
async def evaluate(
    background_tasks: BackgroundTasks,
    session_id: str = Form(...),
    index: int = Form(...),
    answer_text: str = Form(""),
    image: UploadFile = File(...),
    audio: UploadFile = File(...)
):
    session = load_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    img_bytes = await image.read()
    img_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}.jpg")

    with open(img_path, "wb") as f:
        f.write(img_bytes)

    audio_bytes = await audio.read()

    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Invalid audio file")

    audio_path = save_uploaded_audio_as_wav(audio, audio_bytes)

    background_tasks.add_task(
        process_evaluation,
        session_id,
        index,
        answer_text,
        img_path,
        audio_path
    )

    return {
        "message": "Evaluation started",
        "status": "processing"
    }

# -------------------------
# Get Session
# -------------------------
@app.get("/interview/session/{session_id}")
async def get_session(session_id: str):
    session = load_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    return sanitize_for_json(session)