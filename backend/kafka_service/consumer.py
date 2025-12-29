import json
import asyncio
import sys
import os

# Add backend directory to path for imports
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from kafka import KafkaConsumer
from kafka.errors import KafkaError

from state.emotion_buffer import add_emotion, get_last_three
from services.emotion_logic import calculate_final_emotion
from services.background_manager import (
    get_background_for_emotion,
    emotion_to_bucket
)
from kafka_service.topics import EMOTION_TOPIC
from websocket_manager import ws_manager

# Initialize consumer (will be created in start_consumer function)
consumer = None

def send_websocket_update(session_id: str, data: dict):
    """Send update to WebSocket client (synchronous wrapper)"""
    try:
        # Create new event loop for this thread
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(ws_manager.send(session_id, data))
        finally:
            loop.close()
    except Exception as e:
        print(f"⚠️  Error sending WebSocket update: {e}")
        # Don't raise - continue processing even if WebSocket fails

def start_consumer():
    """Start the Kafka consumer with proper error handling."""
    global consumer
    
    try:
        print("🔥 Initializing Kafka consumer...")
        
        # Create consumer without consumer_timeout_ms
        # When not set, kafka-python waits indefinitely for messages
        # Setting it to None causes a TypeError, so we omit it entirely
        consumer = KafkaConsumer(
            EMOTION_TOPIC,
            bootstrap_servers="localhost:9092",
            value_deserializer=lambda v: json.loads(v.decode("utf-8")),
            auto_offset_reset="latest",
            group_id="visumorph-group",
            api_version=(0, 10, 1)
        )
        
        print("✅ Kafka consumer initialized")
        print("📡 Listening for emotion events...")
        print("   (Press Ctrl+C to stop)")
        print("-" * 50)
        
        # Main consumer loop - will run indefinitely until interrupted
        # When no messages are available, it will wait and continue polling
        for msg in consumer:
            try:
                data = msg.value
                session_id = data["session_id"]
                emotion_value = data["emotion_value"]

                # 1️⃣ Buffer emotion in state
                add_emotion(session_id, emotion_value)

                # 2️⃣ Calculate final emotion using weighted average logic
                final_emotion = calculate_final_emotion(session_id)
                bucket = emotion_to_bucket(final_emotion)

                # 3️⃣ Get background from static pool
                background = get_background_for_emotion(session_id, final_emotion)

                # 4️⃣ Prepare WebSocket message
                ws_message = {
                    "session_id": session_id,
                    "buffer": get_last_three(session_id),
                    "final_emotion": final_emotion,
                    "bucket": bucket,
                    "background": background,
                    "emotion_value": emotion_value,
                    "background_type": "static"
                }

                # 5️⃣ Send via WebSocket
                send_websocket_update(session_id, ws_message)

                # 6️⃣ DEBUG OUTPUT
                print(f"📡 [{session_id[:8]}...] Emotion: {emotion_value} → Final: {final_emotion} → {bucket} → BG: {background}")
                
            except Exception as e:
                print(f"⚠️  Error processing message: {e}")
                import traceback
                traceback.print_exc()
                continue
                
    except KafkaError as e:
        print(f"❌ Kafka error: {e}")
        print("\n💡 Troubleshooting:")
        print("   1. Ensure Kafka broker is running: docker ps | grep kafka")
        print("   2. Check Kafka is accessible on localhost:9092")
        print("   3. Verify topic exists: emotion-stream")
        raise
    except KeyboardInterrupt:
        print("\n\n⚠️  Consumer stopped by user")
        if consumer:
            consumer.close()
        raise
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        if consumer:
            consumer.close()
        raise
