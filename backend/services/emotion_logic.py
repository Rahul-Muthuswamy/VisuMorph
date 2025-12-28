from state.emotion_buffer import get_last_three


def clamp(value: int, min_value: int = -5, max_value: int = 5) -> int:
    return max(min_value, min(max_value, value))


def calculate_final_emotion(session_id: str) -> int:
    """
    Calculate final emotion value using weighted last-3 logic.
    """
    e1, e2, e3 = get_last_three(session_id)

    # Weighted calculation
    final_value = e1 + e2 + (e3 * 2)

    return clamp(final_value)
