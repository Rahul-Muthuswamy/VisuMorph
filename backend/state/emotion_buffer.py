from collections import deque
from typing import Dict, List

# session_id -> deque of emotion values
_buffers: Dict[str, deque] = {}


def add_emotion(session_id: str, value: int) -> None:
    """
    Add a new emotion value for a session.
    """
    if session_id not in _buffers:
        _buffers[session_id] = deque(maxlen=3)

    _buffers[session_id].append(value)


def get_last_three(session_id: str) -> List[int]:
    """
    Always return exactly 3 emotion values.
    Pads with 0 if needed.
    """
    buffer = _buffers.get(session_id, deque())
    values = list(buffer)

    # pad with zeros at the front
    while len(values) < 3:
        values.insert(0, 0)

    return values


def clear_buffer(session_id: str) -> None:
    """
    Clear emotion history for a session.
    """
    _buffers.pop(session_id, None)
