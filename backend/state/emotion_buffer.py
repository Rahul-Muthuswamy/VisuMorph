from collections import deque
from typing import Dict, List

_buffers: Dict[str, deque] = {}

def add_emotion(session_id: str, value: int) -> None:
    if session_id not in _buffers:
        _buffers[session_id] = deque(maxlen=3)
    _buffers[session_id].append(value)

def get_last_three(session_id: str) -> List[int]:
    buffer = _buffers.get(session_id, deque())
    values = list(buffer)
    while len(values) < 3:
        values.insert(0, 0)
    return values

def clear_buffer(session_id: str) -> None:
    _buffers.pop(session_id, None)
