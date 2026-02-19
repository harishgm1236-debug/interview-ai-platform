# main.py - FastAPI Server with all endpoints
# Updated: Audio conversion + numpy serialization fix

import os
import io
import uuid
import json
import numpy as np
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from pydub import AudioSegment
from question_bank import QUESTION_BANK
from evaluator import evaluate_multimodal, sanitize_for_json

app = FastAPI(
    title="AI Interview Evaluation Service",
    description="Multimodal interview evaluation with NLP, Face & Voice analysis",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SESSIONS_DIR = "saved_sessions"
TEMP_DIR = "temp_eval"
os.makedirs(SESSIONS_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)


# -------------------------
# Models
# -------------------------
class StartRequest(BaseModel):
    domain: str
    level: Optional[str] = "all"


# -------------------------
# Audio Conversion Helper
# -------------------------
def save_uploaded_audio_as_wav(upload: UploadFile, audio_bytes: bytes) -> str:
    """Convert uploaded audio to PCM WAV."""
    content_type = upload.content_type or ""
    filename = upload.filename or ""

    source_format = _detect_upload_format(content_type, filename, audio_bytes)

    print(f"Audio upload: {filename} | {content_type} | "
          f"{len(audio_bytes)} bytes | detected: {source_format}")

    # Already WAV?
    if audio_bytes[:4] == b"RIFF" and audio_bytes[8:12] == b"WAVE":
        print("Audio is already WAV format")
        wav_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}.wav")
        with open(wav_path, "wb") as f:
            f.write(audio_bytes)
        return wav_path

    # Convert with pydub
    try:
        audio = AudioSegment.from_file(
            io.BytesIO(audio_bytes), format=source_format
        )
        audio = audio.set_channels(1)
        audio = audio.set_frame_rate(16000)
        audio = audio.set_sample_width(2)

        wav_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}.wav")
        audio.export(wav_path, format="wav")

        print(f"Converted to WAV: {wav_path} ({os.path.getsize(wav_path)} bytes)")
        return wav_path

    except Exception as e:
        print(f"Audio conversion failed: {e}")
        fallback_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}.{source_format}")
        with open(fallback_path, "wb") as f:
            f.write(audio_bytes)
        return fallback_path


def _detect_upload_format(content_type: str, filename: str,
                          audio_bytes: bytes) -> str:
    """Detect audio format from content type, filename, and magic bytes."""
    if len(audio_bytes) >= 12:
        if audio_bytes[:4] == b"\x1aE\xdf\xa3":
            return "webm"
        elif audio_bytes[:4] == b"OggS":
            return "ogg"
        elif audio_bytes[:4] == b"fLaC":
            return "flac"
        elif audio_bytes[:3] == b"ID3" or audio_bytes[:2] == b"\xff\xfb":
            return "mp3"
        elif audio_bytes[4:8] == b"ftyp":
            return "mp4"
        elif audio_bytes[:4] == b"RIFF":
            return "wav"

    ct_map = {
        "audio/webm": "webm", "video/webm": "webm",
        "audio/ogg": "ogg", "audio/mp4": "mp4",
        "audio/mpeg": "mp3", "audio/wav": "wav",
        "audio/x-wav": "wav", "audio/flac": "flac",
    }
    for key, fmt in ct_map.items():
        if key in content_type:
            return fmt

    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    ext_map = {
        "webm": "webm", "ogg": "ogg", "mp4": "mp4",
        "m4a": "mp4", "mp3": "mp3", "wav": "wav", "flac": "flac",
    }
    return ext_map.get(ext, "webm")


# -------------------------
# Session Helpers
# -------------------------
def save_session(session_id, data):
    path = os.path.join(SESSIONS_DIR, f"{session_id}.json")
    # ✅ Sanitize before saving to JSON
    clean_data = sanitize_for_json(data)
    with open(path, "w") as f:
        json.dump(clean_data, f, indent=4, default=str)


def load_session(session_id):
    path = os.path.join(SESSIONS_DIR, f"{session_id.strip()}.json")
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return None


# -------------------------
# Health Check
# -------------------------
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "AI Interview Engine",
        "version": "2.0.0"
    }


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
    flattened_questions = []

    if req.level and req.level != "all":
        level_map = {
            "easy": "round_1_background",
            "medium": "round_2_domain",
            "hard": "round_3_project"
        }
        round_key = level_map.get(req.level, None)
        if round_key and round_key in raw_rounds:
            flattened_questions = raw_rounds[round_key]
        else:
            for rk in raw_rounds:
                flattened_questions.extend(raw_rounds[rk])
    else:
        for round_key in raw_rounds:
            flattened_questions.extend(raw_rounds[round_key])

    session_data = {
        "session_id": session_id,
        "domain": domain_key,
        "level": req.level or "all",
        "questions": flattened_questions,
        "scores": [],
        "total_questions": len(flattened_questions)
    }

    save_session(session_id, session_data)

    safe_questions = []
    for q in flattened_questions:
        safe_questions.append({
            "q": q["q"],
            "category": q.get("category", "technical"),
            "difficulty": q.get("difficulty", "medium"),
            "weight": q.get("weight", 1.0)
        })

    return {
        "session_id": session_id,
        "domain": domain_key,
        "level": req.level,
        "total_questions": len(flattened_questions),
        "questions": safe_questions
    }


# -------------------------
# Evaluate Answer (Multimodal)
# -------------------------
@app.post("/interview/evaluate")
async def evaluate(
    session_id: str = Form(...),
    index: int = Form(...),
    answer_text: str = Form(""),
    image: UploadFile = File(...),
    audio: UploadFile = File(...)
):
    session = load_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if index < 0 or index >= len(session["questions"]):
        raise HTTPException(status_code=400, detail="Invalid question index")

    q_data = session["questions"][index]

    # Save image
    img_bytes = await image.read()
    img_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}.jpg")
    with open(img_path, "wb") as f:
        f.write(img_bytes)

    # ✅ Convert audio to WAV
    audio_bytes = await audio.read()

    if not audio_bytes or len(audio_bytes) < 100:
        raise HTTPException(
            status_code=400,
            detail="Empty or invalid audio file received"
        )

    audio_path = save_uploaded_audio_as_wav(audio, audio_bytes)

    print(f"Processing Q{index + 1}: {q_data['q'][:50]}...")
    print(f"Image: {img_path} ({len(img_bytes)} bytes)")
    print(f"Audio: {audio_path} ({os.path.getsize(audio_path)} bytes)")

    try:
        # Run evaluation
        eval_res = evaluate_multimodal(
            answer_text=answer_text,
            keywords=q_data.get("keywords", []),
            weight=q_data.get("weight", 1.0),
            image_path=img_path,
            audio_path=audio_path,
            model_answer=q_data.get("model_answer", ""),
            category=q_data.get("category", "technical")
        )

        # Build result
        result = {
            "question": q_data["q"],
            "question_index": index,
            "category": q_data.get("category", "technical"),
            "difficulty": q_data.get("difficulty", "medium"),
            "weight": float(q_data.get("weight", 1.0)),
            "transcript": eval_res.get("transcript", ""),
            "overall_marks": float(eval_res["overall_marks"]),
            "overall_percentage": float(eval_res["overall_percentage"]),
            "emotion": str(eval_res["emotion_detected"]),
            "emotion_details": eval_res.get("emotion_details", {}),
            "sentiment": str(eval_res.get("sentiment", "neutral")),
            "feedback": str(eval_res.get("feedback", "")),
            "breakdown": eval_res["breakdown"],
            "skill_scores": eval_res.get("skill_scores", {}),
            "voice_analysis": eval_res.get("voice_analysis", {}),
            "keywords": eval_res.get("keywords", {})
        }

        # ✅ Sanitize numpy types
        result = sanitize_for_json(result)

        session["scores"].append(result)

        is_finished = index >= len(session["questions"]) - 1

        if is_finished:
            total_marks = sum(float(s["overall_marks"]) for s in session["scores"])
            total_questions = len(session["questions"])
            max_possible = total_questions * 10
            average_score = round(total_marks / total_questions, 2)
            percentage = round((total_marks / max_possible) * 100, 2)

            avg_skills = {
                "technical": 0.0, "communication": 0.0,
                "problem_solving": 0.0, "confidence": 0.0
            }
            for s in session["scores"]:
                for skill in avg_skills:
                    avg_skills[skill] += float(
                        s.get("skill_scores", {}).get(skill, 0)
                    )
            avg_skills = {
                k: round(v / total_questions, 1)
                for k, v in avg_skills.items()
            }

            strengths = [k for k, v in avg_skills.items() if v >= 65]
            weaknesses = [k for k, v in avg_skills.items() if v < 50]

            emotions = [s.get("emotion", "neutral") for s in session["scores"]]
            dominant_emotion = (
                max(set(emotions), key=emotions.count) if emotions else "neutral"
            )

            if percentage >= 90:
                grade = "A+"
            elif percentage >= 80:
                grade = "A"
            elif percentage >= 70:
                grade = "B+"
            elif percentage >= 60:
                grade = "B"
            elif percentage >= 50:
                grade = "C"
            elif percentage >= 40:
                grade = "D"
            else:
                grade = "F"

            final_summary = {
                "total_marks": round(float(total_marks), 2),
                "average_score": float(average_score),
                "percentage": float(percentage),
                "total_questions": int(total_questions),
                "max_possible": int(max_possible),
                "skill_averages": avg_skills,
                "strengths": strengths,
                "weaknesses": weaknesses,
                "dominant_emotion": str(dominant_emotion),
                "grade": grade
            }

            session["final_result"] = final_summary
            save_session(session_id, session)

            return sanitize_for_json({
                "finished": True,
                "current_score": result,
                "final_result": final_summary,
                "all_scores": session["scores"]
            })

        save_session(session_id, session)

        return sanitize_for_json({
            "finished": False,
            "current_score": result,
            "progress": {
                "current": index + 1,
                "total": len(session["questions"]),
                "percentage": round(
                    ((index + 1) / len(session["questions"])) * 100, 1
                )
            }
        })

    finally:
        for p in [img_path, audio_path]:
            if p and os.path.exists(p):
                try:
                    os.remove(p)
                    print(f"Cleaned up: {p}")
                except Exception as e:
                    print(f"Cleanup error for {p}: {e}")


# -------------------------
# Get Session Data
# -------------------------
@app.get("/interview/session/{session_id}")
async def get_session(session_id: str):
    session = load_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    safe_session = {**session}
    if "questions" in safe_session:
        safe_session["questions"] = [
            {k: v for k, v in q.items() if k != "model_answer"}
            for q in safe_session["questions"]
        ]

    return sanitize_for_json(safe_session)


# -------------------------
# Get Available Domains
# -------------------------
@app.get("/interview/domains")
async def get_domains():
    domains = []
    for key in QUESTION_BANK:
        total = sum(len(QUESTION_BANK[key][r]) for r in QUESTION_BANK[key])
        domains.append({
            "key": key,
            "name": key.replace("_", " ").title(),
            "total_questions": total,
            "rounds": list(QUESTION_BANK[key].keys())
        })
    return {"domains": domains}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)