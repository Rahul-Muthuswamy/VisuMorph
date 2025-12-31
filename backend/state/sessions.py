import time
from typing import Dict, Optional

# In-memory session store
_sessions: Dict[str, dict] = {}


def create_session(session_id: str, video_context: str, dress_color: str) -> dict:
    """
    Create a new video recording session.
    """
    session = {
        "session_id": session_id,
        "video_context": video_context,
        "dress_color": dress_color,
        "status": "created",            # created | recording | stopped
        "current_background": None,     # background id or name
        "created_at": time.time()
    }
    _sessions[session_id] = session
    return session


def get_session(session_id: str) -> Optional[dict]:
    """
    Fetch a session by ID.
    """
    return _sessions.get(session_id)


def update_session_status(session_id: str, status: str) -> bool:
    session = _sessions.get(session_id)
    if not session:
        return False

    session["status"] = status
    return True


def update_current_background(session_id: str, background_id: str) -> bool:
    session = _sessions.get(session_id)
    if not session:
        return False

    session["current_background"] = background_id
    return True
