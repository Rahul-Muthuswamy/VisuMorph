from state.sessions import *
from state.emotion_buffer import *
from state.background_state import *

create_session("s1", "gaming", "red")

add_emotion("s1", -5)
add_emotion("s1", -5)
add_emotion("s1", 2)
print(get_last_three("s1"))  # expect [-5, -5, 2]

init_session_backgrounds("s1")
add_background("s1", "neutral", "bg_neutral_1")
print(get_next_background("s1", "neutral"))  # expect bg_neutral_1
print(get_next_background("s1", "neutral"))  # expect None
