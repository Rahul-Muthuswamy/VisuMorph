from state.emotion_buffer import add_emotion
from state.emotion_buffer import get_last_three
add_emotion("s1", -5)
add_emotion("s1", -5)
print(get_last_three("s1"))   # [0, -5, -5]

add_emotion("s1", 2)
print(get_last_three("s1"))   # [-5, -5, 2]

add_emotion("s1", 3)
print(get_last_three("s1"))   # [-5, 2, 3]
