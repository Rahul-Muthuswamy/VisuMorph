from typing import Optional
from state.sessions import update_current_background
from state.background_state import (
    get_next_background,
    has_backgrounds
)

def emotion_to_bucket(value: int) -> str:
    if value <= -2:
        return "sad"
    if value >= 2:
        return "happy"
    return "neutral"

def get_background_for_emotion(
    session_id: str,
    emotion_value: int
) -> Optional[str]:
    bucket = emotion_to_bucket(emotion_value)

    if has_backgrounds(session_id, bucket):
        bg = get_next_background(session_id, bucket)
        update_current_background(session_id, bg)
        return bg

    if bucket != "neutral" and has_backgrounds(session_id, "neutral"):
        bg = get_next_background(session_id, "neutral")
        update_current_background(session_id, bg)
        return bg

    update_current_background(session_id, None)
    return None
