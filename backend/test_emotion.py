
from state.emotion_buffer import add_emotion
from services.emotion_logic import calculate_final_emotion

add_emotion("s1", -5)
add_emotion("s1", -5)
add_emotion("s1", 2)

print(calculate_final_emotion("s1"))  # expect -5
