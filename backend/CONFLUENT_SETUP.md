# Confluent Cloud Setup Guide

This application uses **Confluent Cloud** for real-time data streaming, which is required for the Confluent Challenge.

## Prerequisites

1. A Confluent Cloud account (sign up at https://confluent.cloud)
2. A Confluent Cloud cluster (Basic cluster is fine for development)

## Setup Steps

### 1. Get Your Confluent Cloud Credentials

1. Log into your Confluent Cloud console: https://confluent.cloud
2. Navigate to your cluster
3. Go to **Cluster Settings** → **Bootstrap servers** - copy the bootstrap server address
   - Format: `pkc-xxxxx.region.provider.confluent.cloud:9092`
   - Example: `pkc-abc123.us-east-1.aws.confluent.cloud:9092`

### 2. Create API Keys

1. In Confluent Cloud console, go to **API Keys**
2. Click **Add Key**
3. Select your cluster and click **Next**
4. Copy the **API Key** and **API Secret** (you'll only see the secret once!)

### 3. Create the Required Topic

1. In Confluent Cloud console, go to **Topics**
2. Click **Add Topic**
3. Create a topic named: `emotion-stream`
4. Use default settings (or configure as needed)

### 4. Configure Environment Variables

Create a `.env` file in the `backend/` directory with your Confluent Cloud credentials:

```env
# Confluent Cloud Bootstrap Servers
CONFLUENT_BOOTSTRAP_SERVERS=pkc-xxxxx.us-east-1.aws.confluent.cloud:9092

# Confluent Cloud API Key
CONFLUENT_API_KEY=your_api_key_here

# Confluent Cloud API Secret
CONFLUENT_API_SECRET=your_api_secret_here

# Set to false to use Confluent Cloud (required for challenge)
USE_LOCAL_KAFKA=false
```

**Important:** Never commit the `.env` file to git! It contains sensitive credentials.

### 5. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

The `requirements.txt` now includes:
- `confluent-kafka` - Confluent's Python client for Kafka
- `python-dotenv` - For loading environment variables from `.env` file

### 6. Verify Connection

Run the consumer startup script to test your connection:

```bash
python start_consumer.py
```

You should see:
```
✅ Using Confluent Cloud Kafka
✅ Confluent Cloud connection successful
🔥 Initializing Confluent Kafka consumer...
```

## Using Local Kafka for Development (Optional)

If you want to test locally without Confluent Cloud, you can:

1. Set `USE_LOCAL_KAFKA=true` in your `.env` file
2. Start a local Kafka instance:
   ```bash
   docker run -d --name kafka -p 9092:9092 apache/kafka:latest
   ```

**Note:** For the Confluent Challenge submission, you **must** use Confluent Cloud (set `USE_LOCAL_KAFKA=false`).

## Troubleshooting

### Connection Errors

- **"Missing Confluent Cloud configuration"**: Make sure your `.env` file exists and has all required variables
- **"Error connecting to Confluent Cloud"**: 
  - Verify your API key and secret are correct
  - Check that your bootstrap server address is correct
  - Ensure your network allows connections to Confluent Cloud (check firewall/proxy settings)
  - Verify the topic `emotion-stream` exists in your cluster

### Topic Not Found

- Make sure you've created the `emotion-stream` topic in Confluent Cloud
- Check topic permissions for your API key

## Architecture

The application now uses:
- **Confluent Cloud** for managed Kafka infrastructure
- **confluent-kafka-python** client library (Confluent's official Python client)
- Real-time emotion data streaming through Kafka topics
- WebSocket connections for pushing updates to frontend clients

This architecture demonstrates real-time AI/ML processing on data in motion, which is the core requirement of the Confluent Challenge.


