from typing import Dict, List, Optional

# session_id -> emotion -> list of background ids
_backgrounds: Dict[str, Dict[str, List[str]]] = {}


def init_session_backgrounds(session_id: str) -> None:
    """
    Initialize empty background buckets for a session.
    """
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
    """
    Add a generated or predefined background to a bucket.
    """
    if session_id not in _backgrounds:
        init_session_backgrounds(session_id)

    _backgrounds[session_id][emotion].append(background_id)


def get_next_background(
    session_id: str,
    emotion: str
) -> Optional[str]:
    """
    Get and REMOVE the next background for an emotion bucket.
    """
    session_bgs = _backgrounds.get(session_id)
    if not session_bgs:
        return None

    bucket = session_bgs.get(emotion, [])
    if not bucket:
        return None

    # Pop first background (delete-after-use)
    return bucket.pop(0)


def has_backgrounds(session_id: str, emotion: str) -> bool:
    """
    Check if any background exists for an emotion bucket.
    """
    return bool(
        _backgrounds.get(session_id, {}).get(emotion)
    )


def clear_session_backgrounds(session_id: str) -> None:
    """
    Remove all background state for a session.
    """
    _backgrounds.pop(session_id, None)
