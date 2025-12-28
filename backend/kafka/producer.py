import json
from kafka import KafkaProducer
from kafka.topics import EMOTION_TOPIC

producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

def send_emotion_event(session_id: str, emotion_value: int):
    producer.send(
        EMOTION_TOPIC,
        {
            "session_id": session_id,
            "emotion_value": emotion_value
        }
    )
