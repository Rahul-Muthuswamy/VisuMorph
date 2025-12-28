import json
from kafka import KafkaConsumer

from state.emotion_buffer import add_emotion, get_last_three
from services.emotion_logic import calculate_final_emotion
from services.background_manager import (
    get_background_for_emotion,
    emotion_to_bucket
)
from kafka.topics import EMOTION_TOPIC

consumer = KafkaConsumer(
    EMOTION_TOPIC,
    bootstrap_servers="localhost:9092",
    value_deserializer=lambda v: json.loads(v.decode("utf-8")),
    auto_offset_reset="latest",
    group_id="visumorph-group"
)

def start_consumer():
    print("🔥 Kafka consumer started")

    for msg in consumer:
        data = msg.value
        session_id = data["session_id"]
        emotion_value = data["emotion_value"]

        # 1️⃣ buffer
        add_emotion(session_id, emotion_value)

        # 2️⃣ logic
        final_emotion = calculate_final_emotion(session_id)
        bucket = emotion_to_bucket(final_emotion)

        # 3️⃣ background
        background = get_background_for_emotion(session_id, final_emotion)

        # 4️⃣ DEBUG OUTPUT (for now)
        print({
            "session": session_id,
            "buffer": get_last_three(session_id),
            "final_emotion": final_emotion,
            "bucket": bucket,
            "background": background
        })
