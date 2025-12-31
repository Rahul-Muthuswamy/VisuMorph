from dotenv import load_dotenv
import os

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_file = os.path.join(backend_dir, '.env')
load_dotenv(dotenv_path=env_file)

USE_LOCAL_KAFKA = os.getenv("USE_LOCAL_KAFKA", "false").lower() == "true"

if USE_LOCAL_KAFKA:
    KAFKA_CONFIG = {
        'bootstrap.servers': 'localhost:9092',
    }
    print("⚠️  Using LOCAL Kafka (localhost:9092) - not Confluent Cloud")
else:
    BOOTSTRAP_SERVERS = os.getenv("CONFLUENT_BOOTSTRAP_SERVERS")
    API_KEY = os.getenv("CONFLUENT_API_KEY")
    API_SECRET = os.getenv("CONFLUENT_API_SECRET")
    
    print("BOOTSTRAP:", BOOTSTRAP_SERVERS)
    
    if not BOOTSTRAP_SERVERS or not API_KEY or not API_SECRET:
        raise ValueError(
            "Missing Confluent Cloud configuration!\n"
            "Please set the following environment variables:\n"
            "  - CONFLUENT_BOOTSTRAP_SERVERS (e.g., 'pkc-xxxxx.us-east-1.aws.confluent.cloud:9092')\n"
            "  - CONFLUENT_API_KEY\n"
            "  - CONFLUENT_API_SECRET\n"
            "\nOr set USE_LOCAL_KAFKA=true to use local Kafka for development."
        )
    
    KAFKA_CONFIG = {
        'bootstrap.servers': BOOTSTRAP_SERVERS,
        'security.protocol': 'SASL_SSL',
        'sasl.mechanisms': 'PLAIN',
        'sasl.username': API_KEY,
        'sasl.password': API_SECRET,
    }
    print("✅ Using Confluent Cloud Kafka")

PRODUCER_CONFIG = {
    **KAFKA_CONFIG,
    'acks': 'all',
    'retries': 3,
}

CONSUMER_CONFIG = {
    **KAFKA_CONFIG,
    'group.id': 'visumorph-group',
    'auto.offset.reset': 'latest',
    'enable.auto.commit': True,
}

