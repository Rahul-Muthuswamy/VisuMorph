from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uuid
from state.emotion_buffer import get_last_three
from services.background_manager import emotion_to_bucket

from state.sessions import (
    create_session,
    get_session,
    update_session_status
)
from state.emotion_buffer import add_emotion
from services.emotion_logic import calculate_final_emotion
from services.background_manager import get_background_for_emotion
from state.background_state import init_session_backgrounds, add_background

app = FastAPI(title="VisuMorph API")


# ----------- Request models -----------

class CreateSessionRequest(BaseModel):
    video_context: str
    dress_color: str


class EmotionInputRequest(BaseModel):
    emotion_value: int  # temporary manual input


# ----------- Routes -----------

@app.post("/session/create")
def create_video_session(payload: CreateSessionRequest):
    session_id = str(uuid.uuid4())

    create_session(
        session_id=session_id,
        video_context=payload.video_context,
        dress_color=payload.dress_color
    )

    # initialize background pools
    init_session_backgrounds(session_id)

    # add predefined starter backgrounds
    add_background(session_id, "neutral", "bg_neutral_default")
    add_background(session_id, "happy", "bg_happy_default")
    add_background(session_id, "sad", "bg_sad_default")

    return {"session_id": session_id}


@app.post("/session/{session_id}/start")
def start_recording(session_id: str):
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    update_session_status(session_id, "recording")
    return {"status": "recording"}


@app.post("/session/{session_id}/emotion")
def push_emotion(session_id: str, payload: EmotionInputRequest):
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # 1️⃣ Add emotion to buffer
    add_emotion(session_id, payload.emotion_value)

    # 2️⃣ Calculate final emotion
    final_emotion = calculate_final_emotion(session_id)

    # 3️⃣ Decide background
    background = get_background_for_emotion(session_id, final_emotion)
    buffer = get_last_three(session_id)
    bucket = emotion_to_bucket(final_emotion)

    return {
        "input_emotion": payload.emotion_value,
        "buffer": buffer,
        "final_emotion": final_emotion,
        "bucket": bucket,
        "background": background
    }