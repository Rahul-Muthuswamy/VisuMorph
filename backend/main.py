from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uuid
from fastapi import WebSocket, WebSocketDisconnect
from websocket_manager import ws_manager
from state.sessions import (
    create_session,
    get_session,
    update_session_status
)
from state.background_state import init_session_backgrounds, add_background

from kafka.producer import send_emotion_event

app = FastAPI(title="VisuMorph API (Kafka Mode)")


# =========================
# Request Models
# =========================

class CreateSessionRequest(BaseModel):
    video_context: str
    dress_color: str


class EmotionInputRequest(BaseModel):
    emotion_value: int


# =========================
# Routes
# =========================

@app.post("/session/create")
def create_video_session(payload: CreateSessionRequest):
    """
    Create a new video session.
    Initializes default background buckets.
    """
    session_id = str(uuid.uuid4())

    create_session(
        session_id=session_id,
        video_context=payload.video_context,
        dress_color=payload.dress_color
    )

    # Initialize background pools
    init_session_backgrounds(session_id)

    # Default starter backgrounds
    add_background(session_id, "neutral", "bg_neutral_default")
    add_background(session_id, "happy", "bg_happy_default")
    add_background(session_id, "sad", "bg_sad_default")

    return {
        "session_id": session_id,
        "status": "created"
    }


@app.post("/session/{session_id}/start")
def start_recording(session_id: str):
    """
    Mark session as recording.
    """
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    update_session_status(session_id, "recording")

    return {
        "session_id": session_id,
        "status": "recording"
    }


@app.post("/session/{session_id}/emotion")
def push_emotion(session_id: str, payload: EmotionInputRequest):
    """
    Kafka PRODUCER endpoint.
    Sends emotion event into the stream.
    """
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # 🔥 Send emotion to Kafka (NO local processing)
    send_emotion_event(session_id, payload.emotion_value)

    return {
        "mode": "kafka",
        "status": "emotion sent to kafka"
    }


@app.get("/")
def health_check():
    return {
        "status": "VisuMorph backend running",
        "mode": "kafka"
    }


@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await ws_manager.connect(session_id, websocket)

    try:
        while True:
            await websocket.receive_text()  # keep alive
    except WebSocketDisconnect:
        ws_manager.disconnect(session_id)
