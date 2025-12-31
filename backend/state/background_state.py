from typing import Dict, List, Optional

_backgrounds: Dict[str, Dict[str, List[str]]] = {}

def init_session_backgrounds(session_id: str) -> None:
    _backgrounds[session_id] = {
        "happy": [],
        "neutral": [],
        "sad": []
    }

def add_background(
    session_id: str,
    emotion: str,
    background_id: str
) -> None:
    if session_id not in _backgrounds:
        init_session_backgrounds(session_id)
    _backgrounds[session_id][emotion].append(background_id)

def get_next_background(
    session_id: str,
    emotion: str
) -> Optional[str]:
    session_bgs = _backgrounds.get(session_id)
    if not session_bgs:
        return None
    bucket = session_bgs.get(emotion, [])
    if not bucket:
        return None
    return bucket.pop(0)

def has_backgrounds(session_id: str, emotion: str) -> bool:
    return bool(
        _backgrounds.get(session_id, {}).get(emotion)
    )

def clear_session_backgrounds(session_id: str) -> None:
    _backgrounds.pop(session_id, None)
