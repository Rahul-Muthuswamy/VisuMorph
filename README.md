<div align="center">

<!-- PROJECT LOGO -->
<img src="./assets/logo-modified.png" width="200" alt="VisuMorph Logo"/>

<br/>

# **VisuMorph – Emotion-Aware Backgrounds for Real-Time Streaming**


<br/>

<!-- BADGES -->
<p align="center">
  <img src="https://img.shields.io/badge/Powered%20by-Confluent-000000?style=flat-square&logo=apache-kafka"/>
  <img src="https://img.shields.io/badge/Apache-Kafka-231F20?style=flat-square&logo=apache-kafka"/>
  <img src="https://img.shields.io/badge/Real--time-Streaming-FF6B6B?style=flat-square"/>
  <img src="https://img.shields.io/badge/AI-Emotion%20Detection-4ECDC4?style=flat-square"/>
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react"/>
  <img src="https://img.shields.io/badge/FastAPI-0.104+-009688?style=flat-square&logo=fastapi"/>
</p>

<br/>

<!-- ACTION BUTTONS -->
<div align="center">
  <a href="#" target="_blank"><strong>🎥 Watch Demo</strong></a> • 
  <a href="#" target="_blank"><strong>📄 Documentation</strong></a>
</div>

<br/>

---

</div>

<br/>

## 📖 **About VisuMorph**

VisuMorph is a real-time, emotion-aware visual enhancement tool designed specifically for live streamers. By analyzing facial expressions and dynamically adapting backgrounds in real time, VisuMorph transforms streaming into a more expressive, immersive, and emotionally engaging experience. The platform leverages AI-powered emotion detection combined with Confluent Cloud and Apache Kafka to deliver instantaneous background changes that reflect the streamer's emotional state whether it's joy, frustration, excitement, or focus.

<br/>

---

<br/>

## 📑 **Table of Contents**

➤ [**Inspiration**](#-inspiration)  
➤ [**What It Does**](#️-what-it-does)  
➤ [**How We Built It**](#️-how-we-built-it)  
➤ [**Architecture**](#️-architecture)  
➤ [**Challenges We Ran Into**](#-challenges-we-ran-into)  
➤ [**Accomplishments That We're Proud Of**](#-accomplishments-that-were-proud-of)  
➤ [**What We Learned**](#-what-we-learned)  
➤ [**What's Next for VisuMorph**](#-whats-next-for-visumorph)  
➤ [**Technologies Used**](#️-technologies-used)  
➤ [**Getting Started**](#-getting-started)  
➤ [**Contributing**](#-contributing)  
➤ [**Team**](#-team)  
➤ [**License**](#-license)

<br/>

---

<br/>

## 💡 **Inspiration**

Live streamers express a wide spectrum of emotions during their broadcasts joy when winning a game, frustration during challenging moments, excitement during unexpected events, and focus during competitive gameplay. Yet despite these rich emotional experiences, the streaming environment itself remains static and unchanging.

We were inspired by a simple but powerful question:

**What if a live stream could visually react to the streamer's emotions in real time?**

Traditional streaming setups offer static backgrounds, predetermined overlays, and manual scene switching. But emotions are dynamic, spontaneous, and deeply human. We envisioned a system that could capture this emotional richness and translate it into visual storytelling automatically, seamlessly, and without interrupting the flow of the stream.

VisuMorph was born from the idea that emotional awareness shouldn't just enhance viewer experience it should transform how streamers connect with their audience. By making streams visually responsive to genuine human emotion, we're bridging the gap between the streamer's internal state and the viewer's external experience.

<br/>

---

<br/>

## ⚙️ **What It Does**

VisuMorph is a real-time, emotion-aware background enhancement system for live streamers. Here's what makes it powerful:

<div style="border-left: 4px solid #4ECDC4; padding-left: 20px; margin: 20px 0;">

### **Core Capabilities**

**Real-Time Emotion Detection**  
VisuMorph continuously monitors the streamer's facial expressions using AI-based computer vision models. It identifies dominant emotions such as happiness, sadness, anger, surprise, fear, disgust, and neutral states with high accuracy.

**Instant Background Adaptation**  
The moment an emotion is detected, VisuMorph seamlessly transitions the streamer's background to match their emotional state. Happy moments trigger vibrant, energetic visuals. Focused moments display calm, professional backgrounds. Frustrated moments adapt to darker, intense themes.

**Low-Latency Streaming Architecture**  
By leveraging Confluent Cloud and Apache Kafka, emotion events are streamed with sub-second latency, ensuring background changes feel instantaneous and natural never lagging behind the streamer's actual emotional shift.

**Non-Intrusive Integration**  
VisuMorph runs in the background without requiring manual intervention. Streamers can focus entirely on their content while the system handles visual adaptation automatically.

**Enhanced Viewer Engagement**  
Viewers experience a more dynamic, immersive stream where visuals authentically reflect the streamer's emotional journey, deepening connection and engagement.

</div>

<br/>

---

<br/>

## 🏗️ **How We Built It**

Building VisuMorph required combining cutting-edge AI with robust real-time data streaming infrastructure. Here's how we brought it to life:

<div style="border-left: 4px solid #4ECDC4; padding-left: 20px; margin: 20px 0;">

### **1. AI-Powered Emotion Detection**

We implemented a computer vision pipeline using deep learning models trained on facial expression recognition datasets. The emotion detection model analyzes video frames in real time, extracting facial landmarks and classifying the dominant emotion with high confidence scores.

**Key Technologies:**
- Pre-trained emotion recognition models (FER, DeepFace)
- OpenCV for video frame processing
- TensorFlow/PyTorch for model inference
- Real-time frame sampling for performance optimization

The model runs efficiently on both CPU and GPU, ensuring accessibility across different hardware configurations while maintaining responsiveness.

<br/>

### **2. Real-Time Streaming with Confluent Cloud**

Emotion events needed to flow from detection to background update with minimal latency. We chose Confluent Cloud and Apache Kafka for several critical reasons:

**Why Kafka?**
- **Sub-second latency:** Emotion changes happen instantly; our architecture needed to match that speed
- **Event-driven architecture:** Kafka's publish-subscribe model perfectly suited our emotion event streams
- **Scalability:** As streams grow, Kafka scales horizontally without performance degradation
- **Reliability:** Built-in replication and fault tolerance ensure no emotion events are lost
- **Decoupled architecture:** Producers (emotion detection) and consumers (background engine) operate independently

**Implementation:**
- Emotion detection service publishes emotion events to a dedicated Kafka topic
- Each event includes emotion type, confidence score, timestamp, and streamer ID
- Confluent Cloud manages cluster orchestration, monitoring, and scaling
- Consumer groups enable parallel processing for multiple streamers

<br/>

### **3. Backend Processing Engine**

The backend serves as the orchestration layer, consuming emotion events from Kafka and coordinating background updates.

**Core Responsibilities:**
- Consume emotion events from Kafka topics
- Apply emotion smoothing algorithms to prevent rapid flickering
- Map detected emotions to appropriate background themes
- Coordinate with the frontend for seamless visual transitions
- Log analytics data for streamer insights

**Technology Stack:**
- Python/Node.js for backend services
- Kafka Consumer API for event processing
- REST APIs for frontend communication
- PostgreSQL for analytics storage

<br/>

### **4. Dynamic Frontend Experience**

The frontend delivers the visual experience, rendering background changes in real time while maintaining stream quality.

**Key Features:**
- Real-time WebSocket connections for instant updates
- Smooth CSS transitions between background themes
- Optimized rendering to prevent frame drops
- Background library with emotion-specific visual themes
- Streamer dashboard for configuration and analytics

**Technologies:**
- React for component-based UI
- WebSockets for real-time communication
- Canvas API for advanced visual effects
- Tailwind CSS for responsive styling

</div>

<br/>

---

<br/>

## 🏛️ **Architecture**

<div style="border-left: 4px solid #4ECDC4; padding-left: 20px; margin: 20px 0;">

### **System Overview**

```
                                        ┌─────────────────┐
                                        │  Live Stream    │
                                        │  Video Feed     │
                                        └────────┬────────┘
                                                 │
                                                 ▼
                                        ┌─────────────────┐
                                        │   AI Emotion    │
                                        │   Detection     │──── Extracts emotion data
                                        └────────┬────────┘
                                                 │
                                                 ▼
                                        ┌─────────────────┐
                                        │  Confluent      │
                                        │  Cloud (Kafka)  │──── Streams emotion events
                                        └────────┬────────┘
                                                 │
                                                 ▼
                                        ┌─────────────────┐
                                        │   Backend       │
                                        │   Processing    │──── Maps emotions to backgrounds
                                        └────────┬────────┘
                                                 │
                                                 ▼
                                        ┌─────────────────┐
                                        │   Frontend      │
                                        │   Application   │──── Updates backgrounds instantly
                                        └─────────────────┘
```

<br/>

### **Data Flow**

**Step 1: Video Capture**  
The streamer's webcam feed is captured and processed frame by frame.

**Step 2: Emotion Detection**  
AI models analyze facial expressions and output emotion classifications with confidence scores.

**Step 3: Event Publishing**  
Detected emotions are published as events to a Kafka topic on Confluent Cloud.

**Step 4: Stream Processing**  
Backend consumers process emotion events, applying smoothing and mapping logic.

**Step 5: Background Selection**  
Appropriate background themes are selected based on the processed emotion data.

**Step 6: Real-Time Update**  
The frontend receives background update commands and applies visual transitions seamlessly.

<br/>

### **Why This Architecture Works**

**Decoupling for Flexibility**  
Each component operates independently. The emotion detection service doesn't need to know about background rendering it simply publishes events to Kafka.

**Scalability by Design**  
As more streamers join, additional Kafka consumers can be spun up without modifying existing infrastructure.

**Fault Tolerance**  
If a component fails, Kafka retains events, allowing the system to recover gracefully without data loss.

**Low Latency**  
Kafka's optimized networking stack ensures events travel from producer to consumer in milliseconds, meeting the real-time requirements of live streaming.

</div>

<br/>

---

<br/>

## 🚧 **Challenges We Ran Into**

Building a real-time, emotion-aware system presented unique technical and design challenges:

<div style="border-left: 4px solid #FF6B6B; padding-left: 20px; margin: 20px 0;">

### **1. Real-Time Latency Management**

**Challenge:** Background changes needed to feel instantaneous. Even a 1-2 second delay would break immersion and make the system feel disconnected from the streamer's actual emotions.

**Solution:** We optimized every stage of the pipeline—efficient model inference, Kafka's low-latency streaming, and frontend rendering optimizations. The result is sub-second end-to-end latency from emotion detection to visual update.

<br/>

### **2. Emotion Detection Noise**

**Challenge:** Facial expressions change rapidly. A streamer might show brief surprise before returning to focus. Without filtering, backgrounds would flicker chaotically.

**Solution:** We implemented emotion smoothing algorithms that consider confidence scores, temporal consistency, and threshold-based filtering. Only sustained emotions trigger background changes, creating a natural visual experience.

<br/>

### **3. System Integration Complexity**

**Challenge:** Coordinating AI inference, Kafka streaming, backend logic, and frontend rendering required careful orchestration. Each component had different performance characteristics and failure modes.

**Solution:** We adopted event-driven architecture principles, ensuring loose coupling between components. Kafka served as the reliable message backbone, while each service maintained clear responsibilities and error handling.

<br/>

### **4. Performance Optimization**

**Challenge:** Running AI models, processing video frames, and maintaining real-time streaming simultaneously demands significant computational resources.

**Solution:** We optimized model inference with batch processing, implemented frame sampling to reduce processing load, and leveraged GPU acceleration where available. For streamers without powerful hardware, we provided cloud-based processing options.

<br/>

### **5. CORS and Environment Configuration**

**Challenge:** During development, managing secure communication between frontend and backend services while handling CORS policies, environment variables, and API keys proved tricky.

**Solution:** We standardized environment configuration using .env files, implemented proper CORS middleware, and established clear API contract boundaries between services.

</div>

<br/>

---

<br/>

## 🏆 **Accomplishments That We're Proud Of**

<div style="border-left: 4px solid #4ECDC4; padding-left: 20px; margin: 20px 0;">

**Built a Complete Real-Time System**  
We successfully integrated AI emotion detection, Kafka-based streaming, backend orchestration, and frontend rendering into a cohesive, working system. Seeing emotions trigger background changes in real time felt like magic.

**Achieved Low-Latency Performance**  
Through careful optimization, we delivered sub-second latency from emotion detection to background update—meeting the demanding requirements of live streaming.

**Mastered Confluent Cloud Integration**  
We learned Kafka's event-driven architecture deeply, implementing producers, consumers, topics, and stream processing patterns effectively.

**Created a Streamer-Friendly Experience**  
VisuMorph runs automatically without manual intervention. Streamers can focus on content while the system enhances their visual presentation seamlessly.

**Designed for Scalability**  
Our architecture supports multiple concurrent streamers, horizontal scaling, and future feature additions without requiring fundamental redesigns.

**Solved Real-World Problems**  
We addressed genuine pain points in streaming—static visuals, lack of emotional expression, and limited viewer engagement—with practical, working solutions.

</div>

<br/>

---

<br/>

## 📚 **What We Learned**

<div style="border-left: 4px solid #4ECDC4; padding-left: 20px; margin: 20px 0;">

**Real-Time Systems Demand Thoughtful Design**  
Building systems that respond in milliseconds requires careful consideration of every component. Latency accumulates quickly, and each optimization matters.

**Kafka is Incredibly Powerful for Event-Driven AI**  
Kafka's publish-subscribe model, reliability guarantees, and performance characteristics make it ideal for streaming AI-generated events. We gained deep appreciation for event-driven architecture.

**Event Smoothing is Critical for UX**  
Raw emotion detection outputs are noisy. Smoothing algorithms transform chaotic data into natural, usable signals. Small architectural decisions dramatically impact user experience.

**Debugging Distributed Systems Requires Patience**  
When problems arise in distributed systems, root cause analysis becomes complex. We learned systematic debugging techniques, logging strategies, and monitoring approaches.

**Emotion-Aware UX Opens New Possibilities**  
This project revealed the potential of emotion-aware applications. Beyond streaming, we see applications in education, therapy, gaming, and human-computer interaction.

**Confluent Cloud Simplifies Kafka Management**  
Managing Kafka clusters manually is complex. Confluent Cloud handled infrastructure, monitoring, and scaling, letting us focus on building features rather than managing servers.

</div>

<br/>

---

<br/>

## 🚀 **What's Next for VisuMorph**

We see VisuMorph evolving far beyond background changes:

<div style="border-left: 4px solid #4ECDC4; padding-left: 20px; margin: 20px 0;">

### **Emotion Analytics Dashboard**

Provide streamers with detailed analytics about their emotional patterns during streams. Insights include:
- Dominant emotions throughout the broadcast
- Emotional intensity graphs
- Correlation between emotions and viewer engagement
- Stream highlights based on emotional peaks

### **Custom Emotion-to-Theme Mappings**

Allow streamers to define their own emotion-to-background mappings. Some may want energetic backgrounds for happiness, while others prefer calm visuals. Personalization enhances brand identity.

### **Audience Emotion Feedback Integration**

Expand beyond the streamer to capture audience emotions through chat sentiment analysis, emoji reactions, and viewer webcam feeds (with permission). Create bidirectional emotional feedback loops.

### **Advanced Emotion Smoothing**

Implement machine learning models that learn individual streamers' emotional patterns over time, providing more accurate, personalized emotion detection and smoothing.

### **Multi-Modal Emotional Analysis**

Combine facial expressions with voice tone analysis, body language detection, and physiological signals (heart rate, skin conductance) for richer emotional understanding.

### **Cloud Deployment for Large-Scale Streaming**

Optimize infrastructure for platforms like Twitch, YouTube Live, and Facebook Gaming, supporting thousands of concurrent streamers with consistent performance.

### **AR/VR Integration**

Extend VisuMorph into augmented and virtual reality environments, where emotional responsiveness could transform immersive experiences.

### **Accessibility Features**

Develop features that help streamers with disabilities express emotions more effectively, ensuring inclusive streaming experiences for all creators.

</div>

<br/>

---

<br/>

## 🛠️ **Technologies Used**

<div style="border-left: 4px solid #4ECDC4; padding-left: 20px; margin: 20px 0;">

### **Frontend Technologies**

**Core Framework & Libraries**
- **React** 18.2.0 – JavaScript library for building user interfaces
- **React DOM** 18.2.0 – React renderer for web applications
- **React Router DOM** 6.21.0 – Declarative routing for navigation
- **Vite** 5.0.8 – Next-generation frontend build tool and dev server

**Face Detection & Emotion Recognition**
- **face-api.js** 0.22.2 – JavaScript API for face detection and emotion recognition in browsers
- **@mediapipe/face_detection** 0.4.1635988164 – MediaPipe face detection
- **@mediapipe/face_mesh** 0.4.1635988164 – MediaPipe face mesh detection
- **@mediapipe/selfie_segmentation** 0.1.1675465747 – MediaPipe background segmentation
- **@mediapipe/camera_utils** 0.3.1675466862 – MediaPipe camera utilities

**Styling & UI**
- **Tailwind CSS** 3.4.0 – Utility-first CSS framework
- **PostCSS** 8.4.32 – CSS transformation tool
- **Autoprefixer** 10.4.16 – CSS vendor prefixer
- **Framer Motion** 10.16.16 – Production-ready motion library for animations

**Browser APIs**
- WebRTC (getUserMedia) – Camera access and video streaming
- Canvas API – Video processing and background rendering
- MediaRecorder API – Video recording functionality
- WebSocket API – Real-time bidirectional communication

### **Backend Technologies**

**Core Framework**
- **Python** 3.8+ – Programming language
- **FastAPI** 0.104.1 - 0.110.0 – Modern, fast web framework for building APIs
- **Uvicorn** 0.24.0 - 0.30.0 – ASGI server implementation
- **Pydantic** 2.5.0 - 3.0.0 – Data validation using Python type annotations

**Database**
- **PostgreSQL** – Primary relational database
- **psycopg2-binary** 2.9.0 - 3.0.0 – PostgreSQL adapter for Python

**Authentication & Security**
- **Passlib** 1.7.4 - 2.0.0 – Password hashing library
- **bcrypt** – Password hashing algorithm (via Passlib)

**Real-Time Communication & Streaming**
- **Apache Kafka** – Distributed event streaming platform
- **Confluent Kafka** 2.3.0 - 3.0.0 – Python client for Apache Kafka (Confluent Cloud compatible)
- **WebSockets** 12.0 - 13.0 – WebSocket protocol for real-time bidirectional communication

**Configuration**
- **python-dotenv** 1.0.0+ – Environment variable management from .env files

### **Message Queue & Event Streaming**

**Confluent Cloud & Apache Kafka**
- **Confluent Cloud** – Fully managed Kafka service
- **Kafka Topics** – Emotion event channels
- **Kafka Producer API** – Publishing emotion detection events
- **Kafka Consumer API** – Processing emotion event streams
- **Event-Driven Architecture** – Real-time emotion event handling

### **Deployment & Infrastructure**

**Development Tools**
- **Node.js** – JavaScript runtime for frontend development
- **npm** – Package manager for Node.js dependencies
- **pip** – Package manager for Python dependencies
- **Git** – Version control system

**Deployment Platforms**
- **Vercel** – Frontend deployment platform
- **Confluent Cloud** – Managed Kafka service for event streaming

</div>

<br/>

---

<br/>

## 🚀 **Getting Started**

<div style="border-left: 4px solid #4ECDC4; padding-left: 20px; margin: 20px 0;">

### **Prerequisites**

- Python 3.8+
- Node.js 16+
- Confluent Cloud account
- Webcam for emotion detection

### **Installation**

```bash
# Clone the repository
git clone https://github.com/yourusername/visumorph.git
cd visumorph

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your Confluent Cloud credentials
```

### **Running the Application**

```bash
# Start backend service
cd backend
python app.py

# Start frontend application
cd frontend
npm run dev
```

Visit `http://localhost:3000` to access VisuMorph.

</div>

<br/>

---

<br/>

## 🤝 **Contributing**

We welcome contributions from the community! Whether it's bug fixes, new features, documentation improvements, or performance optimizations, your contributions help make VisuMorph better for everyone.

<div style="border-left: 4px solid #4ECDC4; padding-left: 20px; margin: 20px 0;">

### **How to Contribute**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Areas for Contribution**

➤ Improving emotion detection accuracy  
➤ Adding new background themes  
➤ Optimizing performance and latency  
➤ Enhancing documentation  
➤ Building integrations with streaming platforms  
➤ Developing analytics features

</div>

<br/>

---

<br/>

## 👥 **Team**

<div style="border-left: 4px solid #4ECDC4; padding-left: 20px; margin: 20px 0;">

Built with passion by developers who believe in making streaming more expressive and emotionally engaging.

## **[Muthuswamy M]]** – [GitHub](https://github.com/Rahul-Muthuswamy) • [LinkedIn](https://linkedin.com/in/muthuswamym)
## **[Dilip Kumar P]** – [GitHub](https://github.com/) • [LinkedIn](https://linkedin.com/in/yourprofile)

</div>

<br/>

---

<br/>

## 📄 **License**

<div style="border-left: 4px solid #4ECDC4; padding-left: 20px; margin: 20px 0;">

VisuMorph is licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.

</div>

<br/>

---

<br/>

<div align="center">

<br/>

**VisuMorph isn't just about changing backgrounds—it's about making streams feel alive.**

By combining AI with real-time data streaming, we're bringing emotional awareness into the world of live content creation.

<br/>
<br/>

<img src="https://img.shields.io/badge/Powered%20by-Confluent-000000?style=flat-square&logo=apache-kafka"/>
<img src="https://img.shields.io/badge/Built%20with-AI-4ECDC4?style=flat-square"/>
<img src="https://img.shields.io/badge/For-Streamers-FF6B6B?style=flat-square"/>

<br/>
<br/>

**⭐ Star this repository if you believe in emotion-aware streaming!**

</div>
