import json
import asyncio
import sys
import os

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from confluent_kafka import Consumer, KafkaException, KafkaError
from kafka_service.confluent_config import CONSUMER_CONFIG
from state.emotion_buffer import add_emotion, get_last_three
from services.emotion_logic import calculate_final_emotion
from services.background_manager import (
    get_background_for_emotion,
    emotion_to_bucket
)
from kafka_service.topics import EMOTION_TOPIC
from websocket_manager import ws_manager

consumer = None

def send_websocket_update(session_id: str, data: dict):
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(ws_manager.send(session_id, data))
        finally:
            loop.close()
    except Exception as e:
        print(f"⚠️  Error sending WebSocket update: {e}")

def start_consumer():
    global consumer
    
    try:
        print("🔥 Initializing Confluent Kafka consumer...")
        
        consumer = Consumer(CONSUMER_CONFIG)
        consumer.subscribe([EMOTION_TOPIC])
        
        print("✅ Kafka consumer initialized (Confluent Cloud)")
        print(f"📡 Subscribed to topic: {EMOTION_TOPIC}")
        print("   Listening for emotion events...")
        print("   (Press Ctrl+C to stop)")
        print("-" * 50)
        
        running = True
        while running:
            try:
                msg = consumer.poll(timeout=1.0)
                
                if msg is None:
                    continue
                
                if msg.error():
                    if msg.error().code() == KafkaError._PARTITION_EOF:
                        print(f"📄 Reached end of partition {msg.partition()}")
                        continue
                    else:
                        print(f"❌ Consumer error: {msg.error()}")
                        raise KafkaException(msg.error())
                
                try:
                    message_str = msg.value().decode('utf-8')
                    data = json.loads(message_str)
                except (UnicodeDecodeError, json.JSONDecodeError) as e:
                    print(f"⚠️  Error decoding message: {e}")
                    continue
                
                session_id = data.get("session_id")
                emotion_value = data.get("emotion_value")
                
                if not session_id or emotion_value is None:
                    print(f"⚠️  Invalid message format: {data}")
                    continue

                add_emotion(session_id, emotion_value)
                final_emotion = calculate_final_emotion(session_id)
                bucket = emotion_to_bucket(final_emotion)
                background = get_background_for_emotion(session_id, final_emotion)

                ws_message = {
                    "session_id": session_id,
                    "buffer": get_last_three(session_id),
                    "final_emotion": final_emotion,
                    "bucket": bucket,
                    "background": background,
                    "emotion_value": emotion_value,
                    "background_type": "static"
                }

                send_websocket_update(session_id, ws_message)
                print(f"📡 [{session_id[:8]}...] Emotion: {emotion_value} → Final: {final_emotion} → {bucket} → BG: {background}")
                
            except KeyboardInterrupt:
                print("\n\n⚠️  Consumer stopped by user")
                running = False
                break
            except KafkaException as e:
                print(f"❌ Kafka error: {e}")
                import traceback
                traceback.print_exc()
                continue
            except Exception as e:
                print(f"⚠️  Error processing message: {e}")
                import traceback
                traceback.print_exc()
                continue
                
    except Exception as e:
        print(f"❌ Unexpected error initializing consumer: {e}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        if consumer:
            print("\n🔄 Closing consumer...")
            consumer.close()
            print("✅ Consumer closed")
