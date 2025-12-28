from state.sessions import create_session
from state.background_state import init_session_backgrounds, add_background
from services.background_manager import get_background_for_emotion

create_session("s1", "gaming", "red")
init_session_backgrounds("s1")

add_background("s1", "neutral", "bg_neutral_1")
add_background("s1", "happy", "bg_happy_1")

print(get_background_for_emotion("s1", 3))   # expect bg_happy_1
print(get_background_for_emotion("s1", 0))   # expect bg_neutral_1
print(get_background_for_emotion("s1", 0))   # expect None
