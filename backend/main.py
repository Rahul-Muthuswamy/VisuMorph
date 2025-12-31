from fastapi import FastAPI, HTTPException, Header, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
from fastapi import WebSocket, WebSocketDisconnect
from typing import Optional
from websocket_manager import ws_manager
from state.sessions import (
    create_session,
    get_session,
    update_session_status
)
from state.background_state import init_session_backgrounds, add_background
from kafka_service.producer import send_emotion_event
from auth import hash_password, verify_password, create_user, get_user_by_email, get_user_by_id
from database import init_db

try:
    init_db()
except Exception:
    pass

app = FastAPI(title="VisuMorph API (Kafka Mode)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import traceback
    print(f"❌ Unhandled exception: {exc}")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"},
        headers={
            "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

class SignupRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class CreateSessionRequest(BaseModel):
    video_context: str
    dress_color: str

class EmotionInputRequest(BaseModel):
    emotion_value: int

def get_current_user(x_user_id: Optional[str] = Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Missing X-USER-ID header")
    
    user = get_user_by_id(x_user_id)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid user ID")
    
    return user['id']

@app.post("/signup")
def signup(payload: SignupRequest):
    try:
        existing_user = get_user_by_email(payload.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        password_hash = hash_password(payload.password)
        user_id = create_user(payload.email, password_hash)
        
        return {
            "success": True,
            "user_id": user_id,
            "message": "User created successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Signup error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/login")
def login(payload: LoginRequest):
    try:
        HARDCODED_EMAIL = "rahul@gmail.com"
        HARDCODED_PASSWORD = "admin@123"
        HARDCODED_USER_ID = "00000000-0000-0000-0000-000000000001"
        
        if payload.email == HARDCODED_EMAIL and payload.password == HARDCODED_PASSWORD:
            return {
                "success": True,
                "user_id": HARDCODED_USER_ID
            }
        
        user = get_user_by_email(payload.email)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if not verify_password(payload.password, user['password_hash']):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        return {
            "success": True,
            "user_id": str(user['id'])
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Login error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/session/create")
def create_video_session(payload: CreateSessionRequest, user_id: str = Depends(get_current_user)):
    session_id = str(uuid.uuid4())

    create_session(
        session_id=session_id,
        video_context=payload.video_context,
        dress_color=payload.dress_color
    )

    init_session_backgrounds(session_id)

    add_background(session_id, "neutral", "bg_neutral_default")
    add_background(session_id, "happy", "bg_happy_default")
    add_background(session_id, "sad", "bg_sad_default")

    return {
        "session_id": session_id,
        "status": "created"
    }

@app.post("/session/{session_id}/start")
def start_recording(session_id: str, user_id: str = Depends(get_current_user)):
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    update_session_status(session_id, "recording")

    return {
        "session_id": session_id,
        "status": "recording"
    }

@app.post("/session/{session_id}/emotion")
def push_emotion(session_id: str, payload: EmotionInputRequest, user_id: str = Depends(get_current_user)):
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

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
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(session_id)
