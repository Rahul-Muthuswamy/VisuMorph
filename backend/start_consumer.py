#!/usr/bin/env python
"""
Kafka Consumer Startup Script for VisuMorph
Handles Windows-specific paths and provides clear error messages.
"""

import sys
import os

# Add backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

def check_dependencies():
    """Check if all required dependencies are installed."""
    missing_deps = []
    
    try:
        import fastapi
    except ImportError:
        missing_deps.append("fastapi")
    
    try:
        from kafka import KafkaConsumer, KafkaProducer
    except ImportError:
        missing_deps.append("kafka-python")
    
    try:
        import six
    except ImportError:
        missing_deps.append("six")
    
    if missing_deps:
        print("❌ Missing dependencies:")
        for dep in missing_deps:
            print(f"   - {dep}")
        print("\n💡 Install missing dependencies:")
        print("   pip install -r requirements.txt")
        return False
    
    return True

def check_kafka_broker():
    """Check if Kafka broker is accessible."""
    try:
        from kafka import KafkaConsumer
        from kafka.errors import KafkaError
        import socket
        
        print("🔍 Checking Kafka broker connection...")
        
        # First, check if port is open
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
        
        # Try to create a consumer - this will attempt to connect to broker
        # If broker is not accessible, this will raise an error
        test_consumer = None
        try:
            test_consumer = KafkaConsumer(
                bootstrap_servers="localhost:9092",
                consumer_timeout_ms=3000,  # 3 second timeout
                api_version=(0, 10, 1),
                request_timeout_ms=3000
            )
            
            # Verify consumer was created and has a client
            # The consumer creation itself will fail if broker is not accessible
            if not hasattr(test_consumer, '_client'):
                raise Exception("Consumer client not initialized")
            
            # Try to get topics - this requires broker connection
            # This is a simple operation that will fail if broker is down
            try:
                # Getting topics requires active connection to broker
                _ = test_consumer.topics()
            except Exception as topics_error:
                # If topics() fails, it might be because:
                # 1. Broker is not accessible (connection error)
                # 2. Permission issues (we'll catch this separately)
                error_str = str(topics_error).lower()
                if "connection" in error_str or "timeout" in error_str or "refused" in error_str:
                    raise  # Re-raise connection errors
                # Other errors (like permission) might be OK for now
                # The consumer will work even if we can't list topics
            
            test_consumer.close()
            print("✅ Kafka broker is accessible")
            return True
            
        except (KafkaError, ConnectionError, TimeoutError, OSError) as e:
            error_msg = str(e).lower()
            
            if test_consumer:
                try:
                    test_consumer.close()
                except:
                    pass
            
            if "connection" in error_msg or "refused" in error_msg or "timeout" in error_msg or "cannot connect" in error_msg:
                print("❌ Kafka broker is not running or not accessible")
                print("\n💡 Start Kafka broker:")
                print("   docker run -d --name kafka -p 9092:9092 apache/kafka:latest")
                print("\n   Or check if Kafka container is running:")
                print("   docker ps")
                print("   docker logs kafka")
            else:
                print(f"❌ Error connecting to Kafka: {e}")
                print("\n💡 Troubleshooting:")
                print("   1. Ensure Kafka is running on localhost:9092")
                print("   2. Check firewall settings")
                print("   3. Verify Docker container is running: docker ps")
                print("   4. Check Kafka logs: docker logs kafka")
            
            return False
    except Exception as e:
        if test_consumer:
            try:
                test_consumer.close()
            except:
                pass
        
        # If it's a different error, might still be connection issue
        error_msg = str(e).lower()
        if "broker" in error_msg or "connection" in error_msg:
            print(f"❌ Kafka connection error: {e}")
            print("\n💡 Start Kafka broker:")
            print("   docker run -d --name kafka -p 9092:9092 apache/kafka:latest")
        else:
            print(f"⚠️  Warning: {e}")
            print("   Attempting to continue anyway...")
            # Allow to continue - might work despite the warning
            return True
        
        return False

def start_consumer():
    """Start the Kafka consumer."""
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
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    print()
    
    # Check Kafka broker
    if not check_kafka_broker():
        sys.exit(1)
    
    print()
    
    # Start consumer
    start_consumer()

