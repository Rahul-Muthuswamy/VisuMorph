import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../../../assets/logo-modified.png'

const Documentation = () => {
  const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }

  const orbVariants = {
    animate: {
      y: [0, -30, 0],
      x: [0, 20, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            <strong className="text-purple-400">VisuMorph</strong> is an innovative emotion-aware background intelligence application that transforms your video experience by dynamically changing backgrounds based on your real-time emotional state.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Using advanced AI-powered emotion detection, VisuMorph analyzes your facial expressions through your webcam and seamlessly transitions between AI-generated backgrounds that match your current mood. Whether you're happy, sad, or neutral, the application creates a personalized visual environment that responds to how you feel.
          </p>
        </div>
      ),
    },
    {
      id: 'features',
      title: 'Key Features',
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-purple-400 text-xl mt-1">▹</span>
              <div>
                <h4 className="text-lg font-semibold text-purple-300 mb-1">Real-Time Emotion Detection</h4>
                <p className="text-gray-300">Advanced facial expression analysis that detects emotions in real-time using your webcam feed.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 text-xl mt-1">▹</span>
              <div>
                <h4 className="text-lg font-semibold text-purple-300 mb-1">Dynamic Background Changes</h4>
                <p className="text-gray-300">Smooth, seamless transitions between AI-generated backgrounds that match your emotional state.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 text-xl mt-1">▹</span>
              <div>
                <h4 className="text-lg font-semibold text-purple-300 mb-1">Emotion Scoring System</h4>
                <p className="text-gray-300">Emotions are scored from -5 (very sad) to +5 (very happy), with 0 being neutral, allowing for precise background selection.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 text-xl mt-1">▹</span>
              <div>
                <h4 className="text-lg font-semibold text-purple-300 mb-1">Video Recording</h4>
                <p className="text-gray-300">Record your sessions with emotion-aware backgrounds and save them to your history for later viewing.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 text-xl mt-1">▹</span>
              <div>
                <h4 className="text-lg font-semibold text-purple-300 mb-1">Session Management</h4>
                <p className="text-gray-300">Create and manage multiple recording sessions with automatic background state tracking.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 text-xl mt-1">▹</span>
              <div>
                <h4 className="text-lg font-semibold text-purple-300 mb-1">User Authentication</h4>
                <p className="text-gray-300">Secure user accounts with email and password authentication to protect your recordings.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-3">1. Account Setup</h4>
            <p className="text-gray-300 mb-3">Start by creating an account:</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
              <li>Navigate to the Sign Up page</li>
              <li>Enter your email and create a secure password</li>
              <li>Click "Sign Up" to create your account</li>
              <li>If you already have an account, use the Sign In page</li>
            </ol>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-3">2. Starting a Recording</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
              <li>From the Home dashboard, click "Create a New Video"</li>
              <li>Grant camera permissions when prompted</li>
              <li>The application will start detecting your emotions in real-time</li>
              <li>Backgrounds will automatically change based on your emotional state</li>
            </ol>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-3">3. Using the Controls</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li><strong>Start/Stop Recording:</strong> Control when to record your session</li>
              <li><strong>Emotion Sensitivity:</strong> Adjust how sensitive the emotion detection is</li>
              <li><strong>Background Preview:</strong> See which background is currently active</li>
              <li><strong>Status Panel:</strong> Monitor your connection status and emotion scores</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'how-it-works',
      title: 'How It Works',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-2">Emotion Detection Pipeline</h4>
            <p className="text-gray-300 leading-relaxed mb-3">
              VisuMorph uses advanced machine learning models to analyze facial expressions:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
              <li><strong>Face Detection:</strong> Detects faces in the webcam feed using Tiny Face Detector</li>
              <li><strong>Landmark Detection:</strong> Identifies 68 facial landmarks for precise analysis</li>
              <li><strong>Emotion Recognition:</strong> Analyzes facial expressions to determine emotional state</li>
              <li><strong>Score Calculation:</strong> Converts emotions to a numerical score (-5 to +5)</li>
              <li><strong>Background Selection:</strong> Chooses appropriate background based on emotion score</li>
            </ol>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-2">Background System</h4>
            <p className="text-gray-300 leading-relaxed">
              Backgrounds are organized by emotion categories (happy, sad, neutral) and scores. Each score has multiple image sets that alternate to provide variety. The system automatically selects the most appropriate background based on your current emotion score.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-2">Real-Time Processing</h4>
            <p className="text-gray-300 leading-relaxed">
              All processing happens in real-time using WebSocket connections for low-latency communication between the frontend and backend. Emotion data is streamed continuously, ensuring smooth and responsive background transitions.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'technical',
      title: 'Technical Architecture',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-2">Frontend</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
              <li><strong>Framework:</strong> React with Vite</li>
              <li><strong>Styling:</strong> Tailwind CSS with custom purple/blue gradient theme</li>
              <li><strong>Animations:</strong> Framer Motion for smooth transitions</li>
              <li><strong>Emotion Detection:</strong> Face-api.js for client-side face detection</li>
              <li><strong>Routing:</strong> React Router for navigation</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-2">Backend</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
              <li><strong>Framework:</strong> FastAPI (Python)</li>
              <li><strong>Database:</strong> PostgreSQL for user data and session management</li>
              <li><strong>Message Queue:</strong> Apache Kafka (local or Confluent Cloud)</li>
              <li><strong>WebSocket:</strong> Real-time bidirectional communication</li>
              <li><strong>Authentication:</strong> Secure password hashing with bcrypt</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-2">Data Flow</h4>
            <p className="text-gray-300 leading-relaxed mb-2">
              The application follows an event-driven architecture:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-gray-300 ml-4">
              <li>Frontend captures webcam feed and detects emotions</li>
              <li>Emotion data is sent via WebSocket to the backend</li>
              <li>Backend publishes emotion events to Kafka</li>
              <li>Kafka consumer processes events and manages background state</li>
              <li>Background updates are sent back to frontend via WebSocket</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: 'api',
      title: 'API Endpoints',
      content: (
        <div className="space-y-4">
          <div className="glass rounded-lg p-4 border border-purple-400/20">
            <h4 className="text-lg font-semibold text-purple-300 mb-2">Authentication</h4>
            <div className="space-y-2 text-sm font-mono text-gray-300">
              <div><span className="text-blue-400">POST</span> /api/auth/signup - Create new account</div>
              <div><span className="text-blue-400">POST</span> /api/auth/signin - Sign in to account</div>
            </div>
          </div>
          <div className="glass rounded-lg p-4 border border-purple-400/20">
            <h4 className="text-lg font-semibold text-purple-300 mb-2">Sessions</h4>
            <div className="space-y-2 text-sm font-mono text-gray-300">
              <div><span className="text-green-400">GET</span> /api/sessions/{'{session_id}'} - Get session details</div>
              <div><span className="text-blue-400">POST</span> /api/sessions - Create new session</div>
              <div><span className="text-yellow-400">PATCH</span> /api/sessions/{'{session_id}'} - Update session status</div>
            </div>
          </div>
          <div className="glass rounded-lg p-4 border border-purple-400/20">
            <h4 className="text-lg font-semibold text-purple-300 mb-2">WebSocket</h4>
            <div className="space-y-2 text-sm font-mono text-gray-300">
              <div><span className="text-purple-400">WS</span> /ws/{'{session_id}'} - Real-time emotion data streaming</div>
            </div>
          </div>
          <p className="text-gray-300 text-sm mt-4">
            For detailed API documentation, visit <span className="text-purple-400">http://localhost:8000/docs</span> when the backend is running.
          </p>
        </div>
      ),
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-2">Camera Not Working</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
              <li>Ensure you've granted camera permissions in your browser</li>
              <li>Check that no other application is using your camera</li>
              <li>Try refreshing the page and granting permissions again</li>
              <li>Verify your camera is properly connected and functioning</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-2">Emotion Detection Not Working</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
              <li>Ensure good lighting conditions for better face detection</li>
              <li>Position yourself directly in front of the camera</li>
              <li>Make sure your face is clearly visible and not obscured</li>
              <li>Check the browser console for any error messages</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-2">Connection Issues</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
              <li>Verify the backend server is running on port 8000</li>
              <li>Check your internet connection</li>
              <li>Review the status panel for connection status</li>
              <li>Try refreshing the page or restarting the backend</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-2">Background Not Changing</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
              <li>Ensure emotion detection is working properly</li>
              <li>Check that background images are properly loaded</li>
              <li>Verify WebSocket connection is established</li>
              <li>Check browser console for any errors</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'requirements',
      title: 'System Requirements',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-2">Browser Requirements</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
              <li>Modern browser with WebRTC support (Chrome, Firefox, Edge, Safari)</li>
              <li>Camera access permissions</li>
              <li>JavaScript enabled</li>
              <li>Recommended: Latest version of Chrome or Firefox</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-2">Hardware Requirements</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
              <li>Webcam for emotion detection</li>
              <li>Stable internet connection for real-time processing</li>
              <li>Minimum 4GB RAM recommended</li>
              <li>Modern CPU for smooth performance</li>
            </ul>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-purple-blue opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
        style={{
          backgroundSize: '200% 200%',
        }}
      />

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
        variants={orbVariants}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        variants={orbVariants}
        animate="animate"
        transition={{
          duration: 10,
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-400/15 rounded-full blur-3xl"
        variants={orbVariants}
        animate="animate"
        transition={{
          duration: 12,
          delay: 2,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="mb-8 flex items-center justify-between flex-wrap gap-4"
          >
            <div className="flex items-center gap-4">
              <motion.img
                src={logo}
                alt="VisuMorph"
                className="h-12 md:h-16 w-auto"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  ease: [0.6, -0.05, 0.01, 0.99],
                }}
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(107, 33, 168, 0.5)) drop-shadow(0 0 40px rgba(59, 130, 246, 0.3))',
                }}
                whileHover={{ scale: 1.05 }}
              />
              <motion.h1
                variants={itemVariants}
                className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400"
                style={{
                  backgroundSize: '200% auto',
                }}
                animate={{
                  backgroundPosition: ['0% center', '200% center'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'linear',
                }}
              >
                Documentation
              </motion.h1>
            </div>
            <motion.button
              onClick={() => navigate('/home')}
              className="px-6 py-3 glass rounded-full font-semibold border-2 border-purple-400/50 hover:border-purple-400/80 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Home
            </motion.button>
          </motion.div>

          {/* Documentation Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                variants={itemVariants}
                className="glass rounded-2xl p-6 md:p-8 glow-purple hover:glow-gradient transition-all"
              >
                <h2
                  id={section.id}
                  className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400"
                >
                  {section.title}
                </h2>
                <div className="text-gray-300">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className="mt-12 text-center text-gray-400 text-sm"
          >
            <p>VisuMorph - Emotion-Aware Background Intelligence</p>
            <p className="mt-2">For support, please refer to the troubleshooting section above.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Documentation

