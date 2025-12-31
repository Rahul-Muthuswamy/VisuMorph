#!/usr/bin/env python

import sys
import os

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

def check_dependencies():
    missing_deps = []
    
    try:
        import fastapi
    except ImportError:
        missing_deps.append("fastapi")
    
    try:
        from confluent_kafka import Consumer, Producer
    except ImportError:
        missing_deps.append("confluent-kafka")
    
    try:
        from dotenv import load_dotenv
    except ImportError:
        missing_deps.append("python-dotenv")
    
    if missing_deps:
        print("❌ Missing dependencies:")
        for dep in missing_deps:
            print(f"   - {dep}")
        print("\n💡 Install missing dependencies:")
        print("   pip install -r requirements.txt")
        return False
    
    return True

def check_kafka_broker():
    try:
        from confluent_kafka import Consumer
        from confluent_kafka import KafkaException
        from kafka_service.confluent_config import CONSUMER_CONFIG, USE_LOCAL_KAFKA
        import socket
        import re
        
        if USE_LOCAL_KAFKA:
            print("🔍 Checking local Kafka broker connection...")
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(2)
                result = sock.connect_ex(('localhost', 9092))
                sock.close()
                
                if result != 0:
                    print("❌ Cannot connect to localhost:9092")
                    print("\n💡 Start Kafka broker:")
                    print("   docker run -d --name kafka -p 9092:9092 apache/kafka:latest")
                    print("\n   Check if Kafka is running:")
                    print("   docker ps | findstr kafka")
                    return False
            except Exception as e:
                print(f"❌ Socket connection test failed: {e}")
                return False
        else:
            print("🔍 Checking Confluent Cloud connection...")
        
        test_consumer = None
        try:
            test_config = CONSUMER_CONFIG.copy()
            test_config['group.id'] = 'test-connection-group'
            test_config['session.timeout.ms'] = 10000
            test_config['socket.timeout.ms'] = 5000
            
            test_consumer = Consumer(test_config)
            test_consumer.poll(timeout=1.0)
            test_consumer.close()
            
            if USE_LOCAL_KAFKA:
                print("✅ Local Kafka broker is accessible")
            else:
                print("✅ Confluent Cloud connection successful")
            return True
            
        except (KafkaException, Exception) as e:
            error_msg = str(e).lower()
            
            if test_consumer:
                try:
                    test_consumer.close()
                except:
                    pass
            
            if USE_LOCAL_KAFKA:
                print(f"❌ Error connecting to local Kafka: {e}")
                print("\n💡 Troubleshooting:")
                print("   1. Ensure Kafka is running on localhost:9092")
                print("   2. Start Kafka: docker run -d --name kafka -p 9092:9092 apache/kafka:latest")
                print("   3. Check Docker: docker ps | findstr kafka")
                print("   4. Check logs: docker logs kafka")
            else:
                print(f"❌ Error connecting to Confluent Cloud: {e}")
                print("\n💡 Troubleshooting:")
                print("   1. Verify environment variables are set:")
                print("      - CONFLUENT_BOOTSTRAP_SERVERS")
                print("      - CONFLUENT_API_KEY")
                print("      - CONFLUENT_API_SECRET")
                print("   2. Check your .env file exists with correct values")
                print("   3. Verify API key/secret are valid in Confluent Cloud console")
                print("   4. Check network connectivity to Confluent Cloud")
                print("\n   Or set USE_LOCAL_KAFKA=true to use local Kafka for development")
            
            return False
            
    except Exception as e:
        print(f"❌ Unexpected error checking Kafka connection: {e}")
        import traceback
        traceback.print_exc()
        return False

def start_consumer():
    try:
        from kafka_service.consumer import start_consumer
        
        print("🔥 Starting Kafka consumer...")
        print("=" * 50)
        start_consumer()
        
    except KeyboardInterrupt:
        print("\n\n⚠️  Consumer stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error starting consumer: {e}")
        print("\n💡 Troubleshooting:")
        print("   1. Ensure all dependencies are installed: pip install -r requirements.txt")
        print("   2. Check that Kafka broker is running")
        print("   3. Verify imports are correct")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    print("=" * 50)
    print("🚀 VisuMorph Kafka Consumer")
    print("=" * 50)
    print()
    
    if not check_dependencies():
        sys.exit(1)
    
    print()
    
    if not check_kafka_broker():
        sys.exit(1)
    
    print()
    
    start_consumer()

