# evaluator.py - Complete AI Evaluation Engine
# Updated: Audio conversion + numpy serialization fix

import re
import io
import os
import tempfile
import numpy as np
import librosa
from deepface import DeepFace
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from textblob import TextBlob
import speech_recognition as sr
from pydub import AudioSegment


# ============================
# NUMPY SERIALIZATION FIX
# ============================
def sanitize_for_json(obj):
    """
    Recursively convert numpy types to native Python types
    so FastAPI can serialize the response to JSON.
    """
    if isinstance(obj, dict):
        return {k: sanitize_for_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [sanitize_for_json(item) for item in obj]
    elif isinstance(obj, tuple):
        return tuple(sanitize_for_json(item) for item in obj)
    elif isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, np.bool_):
        return bool(obj)
    elif isinstance(obj, (np.str_, np.bytes_)):
        return str(obj)
    else:
        return obj


# ============================
# AUDIO FORMAT CONVERSION
# ============================
def convert_to_wav(audio_path: str) -> str:
    """
    Convert any audio file (WebM, OGG, MP4, etc.) to PCM WAV.
    Returns path to converted WAV file.
    If already WAV, returns original path.
    """
    converted_path = None

    try:
        if not os.path.exists(audio_path):
            print(f"Audio file not found: {audio_path}")
            return audio_path

        with open(audio_path, "rb") as f:
            header = f.read(12)

        if header[:4] == b"RIFF" and header[8:12] == b"WAVE":
            print(f"File is already WAV: {audio_path}")
            return audio_path

        source_format = _detect_format_from_header(header, audio_path)

        print(f"Converting {source_format} → WAV: {audio_path} "
              f"({os.path.getsize(audio_path)} bytes)")

        audio = AudioSegment.from_file(audio_path, format=source_format)
        audio = audio.set_channels(1)
        audio = audio.set_frame_rate(16000)
        audio = audio.set_sample_width(2)

        converted_path = os.path.join(
            os.path.dirname(audio_path),
            os.path.splitext(os.path.basename(audio_path))[0] + "_converted.wav"
        )
        audio.export(converted_path, format="wav")

        print(f"Conversion successful: {converted_path} "
              f"({os.path.getsize(converted_path)} bytes)")

        return converted_path

    except Exception as e:
        print(f"Audio conversion error: {e}")
        if converted_path and os.path.exists(converted_path):
            try:
                os.unlink(converted_path)
            except Exception:
                pass
        return audio_path


def _detect_format_from_header(header: bytes, filepath: str) -> str:
    """Detect audio format from file header bytes and extension."""
    if header[:4] == b"\x1aE\xdf\xa3":
        return "webm"
    elif header[:4] == b"OggS":
        return "ogg"
    elif header[:4] == b"fLaC":
        return "flac"
    elif header[:3] == b"ID3" or header[:2] == b"\xff\xfb":
        return "mp3"
    elif header[4:8] == b"ftyp":
        return "mp4"

    ext = filepath.rsplit(".", 1)[-1].lower() if "." in filepath else ""
    ext_map = {
        "webm": "webm", "ogg": "ogg", "mp4": "mp4",
        "m4a": "mp4", "mp3": "mp3", "wav": "wav",
        "flac": "flac", "aac": "aac",
    }

    detected = ext_map.get(ext, "webm")
    print(f"Format detected from extension: .{ext} → {detected}")
    return detected


# ============================
# SPEECH TO TEXT
# ============================
def transcribe_audio(audio_path: str) -> str:
    """Convert audio file to text. Automatically converts non-WAV formats."""
    converted_path = None

    try:
        recognizer = sr.Recognizer()
        wav_path = convert_to_wav(audio_path)

        if wav_path != audio_path:
            converted_path = wav_path

        with sr.AudioFile(wav_path) as source:
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
            print(f"Transcribed: {text}")
            return text

    except sr.UnknownValueError:
        print("Speech Recognition: Could not understand audio")
        return ""
    except sr.RequestError as e:
        print(f"Speech Recognition API error: {e}")
        return ""
    except Exception as e:
        print(f"Transcription error: {e}")
        return ""
    finally:
        if converted_path and os.path.exists(converted_path):
            try:
                os.unlink(converted_path)
            except Exception:
                pass


# ============================
# TEXT EVALUATION (NLP)
# ============================
def evaluate_text_nlp(answer: str, model_answer: str, keywords: list) -> dict:
    if not answer or len(answer.strip()) < 5:
        return {
            "relevance": 0, "completeness": 0, "clarity": 0,
            "text_score": 0, "matched_keywords": [], "missed_keywords": keywords
        }

    ans_clean = answer.lower().strip()

    # 1. RELEVANCE
    try:
        vectorizer = TfidfVectorizer(
            stop_words='english', max_features=5000, ngram_range=(1, 2)
        )
        tfidf_matrix = vectorizer.fit_transform([model_answer, ans_clean])
        similarity = float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])
        relevance = min(similarity * 100 * 1.5, 100)
    except Exception:
        relevance = 30.0

    # 2. COMPLETENESS
    matched = []
    missed = []
    for k in keywords:
        k_lower = k.lower()
        if re.search(r'\b' + re.escape(k_lower) + r'\b', ans_clean):
            matched.append(k)
        else:
            parts = k_lower.split()
            if any(part in ans_clean for part in parts if len(part) > 3):
                matched.append(k)
            else:
                missed.append(k)

    completeness = (len(matched) / len(keywords) * 100) if keywords else 50.0

    # 3. CLARITY
    words = ans_clean.split()
    word_count = len(words)
    sentences = re.split(r'[.!?]+', answer)
    sentences = [s.strip() for s in sentences if s.strip()]

    if word_count < 10:
        length_score = 20
    elif word_count < 30:
        length_score = 50
    elif word_count <= 200:
        length_score = 100
    else:
        length_score = max(70, 100 - (word_count - 200) / 5)

    if sentences:
        avg_sent_len = word_count / len(sentences)
        if 10 <= avg_sent_len <= 25:
            structure_score = 100
        elif avg_sent_len < 10:
            structure_score = avg_sent_len * 10
        else:
            structure_score = max(40, 100 - (avg_sent_len - 25) * 3)
    else:
        structure_score = 40

    unique = len(set(w.lower() for w in words))
    diversity = min((unique / max(word_count, 1)) * 130, 100)

    fillers = ['um', 'uh', 'like', 'basically', 'actually', 'literally',
               'you know', 'i mean', 'sort of', 'kind of']
    filler_count = sum(1 for f in fillers if f in ans_clean)
    filler_penalty = min(filler_count * 5, 25)

    clarity = (length_score * 0.25 + structure_score * 0.3 +
               diversity * 0.3 + (100 - filler_penalty) * 0.15)

    text_score = relevance * 0.4 + completeness * 0.35 + clarity * 0.25

    return {
        "relevance": round(float(relevance), 1),
        "completeness": round(float(completeness), 1),
        "clarity": round(float(clarity), 1),
        "text_score": round(float(text_score), 1),
        "matched_keywords": matched,
        "missed_keywords": missed
    }


# ============================
# SENTIMENT & CONFIDENCE
# ============================
def analyze_sentiment_confidence(answer: str) -> dict:
    if not answer or len(answer.strip()) < 5:
        return {"sentiment": "neutral", "polarity": 0.0, "confidence": 0.0}

    ans_lower = answer.lower()

    blob = TextBlob(answer)
    polarity = float(blob.sentiment.polarity)

    if polarity > 0.1:
        sentiment = "positive"
    elif polarity < -0.1:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    confident_words = [
        'definitely', 'certainly', 'absolutely', 'clearly', 'specifically',
        'precisely', 'implemented', 'built', 'designed', 'created',
        'developed', 'achieved', 'successfully', 'demonstrated', 'proven',
        'strong', 'efficient', 'effective', 'expertise', 'proficient'
    ]

    hesitation_words = [
        'maybe', 'perhaps', 'possibly', 'might', 'could be',
        'i think', 'i guess', 'not sure', 'probably', 'i believe',
        'somewhat', 'sort of', 'kind of', 'um', 'uh', 'hmm'
    ]

    negative_words = [
        "don't know", "no idea", "not familiar", "can't remember",
        "forgot", "unclear", "confused", "not confident"
    ]

    conf_count = sum(1 for w in confident_words if w in ans_lower)
    hes_count = sum(1 for w in hesitation_words if w in ans_lower)
    neg_count = sum(1 for w in negative_words if w in ans_lower)

    base = 50.0
    boost = min(conf_count * 7, 35)
    penalty_h = min(hes_count * 6, 25)
    penalty_n = min(neg_count * 10, 25)

    word_count = len(ans_lower.split())
    if word_count < 10:
        length_mod = -20
    elif word_count < 30:
        length_mod = -5
    else:
        length_mod = 10

    confidence = min(max(base + boost - penalty_h - penalty_n + length_mod, 0), 100)

    return {
        "sentiment": sentiment,
        "polarity": round(float(polarity), 4),
        "confidence": round(float(confidence), 1)
    }


# ============================
# FACE EMOTION ANALYSIS
# ============================
def analyze_face(image_path: str) -> dict:
    try:
        if not image_path or not os.path.exists(image_path):
            return {"emotion": "unknown", "visual_confidence": 50, "emotion_details": {}}

        results = DeepFace.analyze(
            img_path=image_path,
            actions=['emotion'],
            enforce_detection=False
        )

        if results:
            emotion = results[0]['dominant_emotion']
            emotion_scores = results[0].get('emotion', {})

            confidence_map = {
                'happy': 95, 'neutral': 85, 'surprise': 75,
                'fear': 35, 'sad': 30, 'angry': 25, 'disgust': 20
            }
            visual_confidence = confidence_map.get(emotion, 50)

            # ✅ Convert numpy values to float
            return {
                "emotion": str(emotion),
                "visual_confidence": int(visual_confidence),
                "emotion_details": {
                    str(k): round(float(v), 1)
                    for k, v in emotion_scores.items()
                }
            }
    except Exception as e:
        print(f"Face analysis error: {e}")

    return {"emotion": "unknown", "visual_confidence": 50, "emotion_details": {}}


# ============================
# VOICE ANALYSIS
# ============================
def analyze_voice(audio_path: str, word_count: int) -> dict:
    converted_path = None

    try:
        wav_path = convert_to_wav(audio_path)
        if wav_path != audio_path:
            converted_path = wav_path

        y, sr_rate = librosa.load(wav_path)
        duration = float(librosa.get_duration(y=y, sr=sr_rate))

        if duration < 1:
            return {
                "wpm": 0, "vocal_confidence": 30,
                "duration": 0, "pace": "too_short"
            }

        wpm = float((word_count / duration) * 60) if duration > 0 else 0.0

        if 110 <= wpm <= 160:
            pace_score = 100
            pace = "ideal"
        elif 80 <= wpm < 110:
            pace_score = 80
            pace = "slow"
        elif 160 < wpm <= 190:
            pace_score = 80
            pace = "fast"
        elif wpm < 80:
            pace_score = 50
            pace = "very_slow"
        else:
            pace_score = 50
            pace = "very_fast"

        rms = librosa.feature.rms(y=y)[0]
        avg_energy = float(np.mean(rms))
        energy_score = min(avg_energy * 1000, 100)

        vocal_confidence = float(pace_score * 0.7 + min(energy_score, 100) * 0.3)

        return {
            "wpm": round(float(wpm), 1),
            "vocal_confidence": round(float(vocal_confidence), 1),
            "duration": round(float(duration), 1),
            "pace": pace,
            "energy": round(float(avg_energy), 4)
        }

    except Exception as e:
        print(f"Voice analysis error: {e}")
        return {
            "wpm": 0, "vocal_confidence": 50,
            "duration": 0, "pace": "error"
        }

    finally:
        if converted_path and os.path.exists(converted_path):
            try:
                os.unlink(converted_path)
            except Exception:
                pass


# ============================
# SKILL SCORING ENGINE
# ============================
def calculate_skill_scores(text_eval: dict, sentiment_data: dict,
                           face_data: dict, voice_data: dict,
                           category: str) -> dict:
    relevance = float(text_eval.get("relevance", 0))
    completeness = float(text_eval.get("completeness", 0))
    clarity = float(text_eval.get("clarity", 0))
    text_confidence = float(sentiment_data.get("confidence", 0))
    visual_conf = float(face_data.get("visual_confidence", 0))
    vocal_conf = float(voice_data.get("vocal_confidence", 0))

    if category == "technical":
        technical = relevance * 0.4 + completeness * 0.4 + clarity * 0.2
    elif category == "problem_solving":
        technical = relevance * 0.3 + completeness * 0.5 + clarity * 0.2
    else:
        technical = relevance * 0.3 + completeness * 0.3 + clarity * 0.4

    sentiment_bonus = (5 if sentiment_data.get("sentiment") == "positive"
                       else (-5 if sentiment_data.get("sentiment") == "negative"
                             else 0))
    communication = (clarity * 0.4 + vocal_conf * 0.3 +
                     visual_conf * 0.2 + (50 + sentiment_bonus) * 0.1)

    problem_solving = (completeness * 0.4 + relevance * 0.35 +
                       clarity * 0.15 + text_confidence * 0.1)

    confidence = text_confidence * 0.4 + visual_conf * 0.3 + vocal_conf * 0.3

    return {
        "technical": round(float(min(max(technical, 0), 100)), 1),
        "communication": round(float(min(max(communication, 0), 100)), 1),
        "problem_solving": round(float(min(max(problem_solving, 0), 100)), 1),
        "confidence": round(float(min(max(confidence, 0), 100)), 1)
    }


# ============================
# FEEDBACK GENERATOR
# ============================
def generate_feedback(text_eval: dict, sentiment_data: dict,
                      skill_scores: dict, overall: float) -> str:
    parts = []

    if overall >= 80:
        parts.append("🌟 Excellent answer! You demonstrated strong understanding.")
    elif overall >= 60:
        parts.append("👍 Good answer with solid understanding. Room for improvement.")
    elif overall >= 40:
        parts.append("💪 Fair answer. Covered some points but missed important concepts.")
    else:
        parts.append("📚 Your answer needs improvement. Review the core concepts.")

    if float(text_eval.get("relevance", 0)) < 50:
        parts.append("Try to address the question more directly.")

    missed = text_eval.get("missed_keywords", [])
    matched = text_eval.get("matched_keywords", [])
    if matched:
        parts.append(f"✅ Good coverage of: {', '.join(matched[:5])}.")
    if missed:
        parts.append(f"❌ Consider mentioning: {', '.join(missed[:5])}.")

    if float(text_eval.get("clarity", 0)) < 50:
        parts.append("Structure your answer more clearly.")
    elif float(text_eval.get("clarity", 0)) >= 80:
        parts.append("Your answer was well-structured and clear.")

    if float(sentiment_data.get("confidence", 0)) < 40:
        parts.append("Express answers with more confidence.")
    elif float(sentiment_data.get("confidence", 0)) >= 80:
        parts.append("You demonstrated strong confidence.")

    if sentiment_data.get("sentiment") == "negative":
        parts.append("Try to maintain a more positive tone.")

    return " ".join(parts)


# ============================
# MAIN EVALUATION FUNCTION
# ============================
def evaluate_multimodal(answer_text: str, keywords: list, weight: float,
                        image_path: str, audio_path: str,
                        model_answer: str = "",
                        category: str = "technical") -> dict:
    transcript = answer_text
    if not transcript or len(transcript.strip()) < 3:
        transcript = transcribe_audio(audio_path)

    if not transcript or len(transcript.strip()) < 5:
        return _empty_response()

    text_eval = evaluate_text_nlp(transcript, model_answer, keywords)
    sentiment_data = analyze_sentiment_confidence(transcript)
    face_data = analyze_face(image_path)

    word_count = len(transcript.split())
    voice_data = analyze_voice(audio_path, word_count)

    skill_scores = calculate_skill_scores(
        text_eval, sentiment_data, face_data, voice_data, category
    )

    overall = float(
        float(text_eval["text_score"]) * 0.50 +
        float(face_data["visual_confidence"]) * 0.15 +
        float(voice_data["vocal_confidence"]) * 0.15 +
        float(sentiment_data["confidence"]) * 0.10 +
        float(skill_scores["communication"]) * 0.10
    )
    overall = float(min(max(overall, 0), 100))
    marks_out_of_10 = float(min(10.0, overall / 10))

    feedback = generate_feedback(text_eval, sentiment_data, skill_scores, overall)

    result = {
        "overall_marks": round(float(marks_out_of_10), 1),
        "overall_percentage": round(float(overall), 1),
        "transcript": str(transcript),
        "emotion_detected": str(face_data["emotion"]),
        "emotion_details": face_data.get("emotion_details", {}),
        "sentiment": str(sentiment_data["sentiment"]),
        "sentiment_polarity": float(sentiment_data["polarity"]),
        "feedback": str(feedback),
        "breakdown": {
            "technical_accuracy": round(float(text_eval["text_score"]), 1),
            "relevance": round(float(text_eval["relevance"]), 1),
            "completeness": round(float(text_eval["completeness"]), 1),
            "clarity": round(float(text_eval["clarity"]), 1),
            "visual_confidence": round(float(face_data["visual_confidence"]), 1),
            "vocal_confidence": round(float(voice_data["vocal_confidence"]), 1),
            "text_confidence": round(float(sentiment_data["confidence"]), 1)
        },
        "skill_scores": skill_scores,
        "voice_analysis": {
            "wpm": round(float(voice_data["wpm"]), 1),
            "pace": str(voice_data["pace"]),
            "duration": round(float(voice_data["duration"]), 1)
        },
        "keywords": {
            "matched": text_eval["matched_keywords"],
            "missed": text_eval["missed_keywords"]
        }
    }

    # ✅ Final safety net: sanitize ALL numpy types
    return sanitize_for_json(result)


def _empty_response():
    return {
        "overall_marks": 0.0,
        "overall_percentage": 0.0,
        "transcript": "",
        "emotion_detected": "none",
        "emotion_details": {},
        "sentiment": "neutral",
        "sentiment_polarity": 0.0,
        "feedback": "No answer was provided. Please speak clearly into the microphone.",
        "breakdown": {
            "technical_accuracy": 0.0, "relevance": 0.0, "completeness": 0.0,
            "clarity": 0.0, "visual_confidence": 0.0, "vocal_confidence": 0.0,
            "text_confidence": 0.0
        },
        "skill_scores": {
            "technical": 0.0, "communication": 0.0,
            "problem_solving": 0.0, "confidence": 0.0
        },
        "voice_analysis": {"wpm": 0.0, "pace": "none", "duration": 0.0},
        "keywords": {"matched": [], "missed": []}
    }