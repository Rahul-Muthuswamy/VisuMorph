import json
from confluent_kafka import Producer
from confluent_kafka import KafkaException
from kafka_service.topics import EMOTION_TOPIC
from kafka_service.confluent_config import PRODUCER_CONFIG

producer = Producer(PRODUCER_CONFIG)

def delivery_callback(err, msg):
    if err:
        print(f"❌ Message delivery failed: {err}")
    else:
        print(f"✅ Message delivered to {msg.topic()} [{msg.partition()}]")

def send_emotion_event(session_id: str, emotion_value: int):
    try:
        message_data = {
            "session_id": session_id,
            "emotion_value": emotion_value
        }
        
        message_json = json.dumps(message_data)
        
        producer.produce(
            EMOTION_TOPIC,
            value=message_json.encode('utf-8'),
            callback=delivery_callback
        )
        
        producer.poll(0)
        
    except KafkaException as e:
        print(f"❌ Kafka error sending emotion event: {e}")
        raise
    except Exception as e:
        print(f"❌ Error sending emotion event: {e}")
        raise

def flush_producer():
    producer.flush()
