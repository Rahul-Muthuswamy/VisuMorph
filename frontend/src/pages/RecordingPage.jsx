import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../../../assets/logo-modified.png'

const RecordingPage = () => {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const [mediaStream, setMediaStream] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null)
  const [error, setError] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)

  // Timer for recording duration
  useEffect(() => {
    let interval = null
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      setRecordingTime(0)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRecording])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop())
      }
      if (recordedVideoUrl) {
        URL.revokeObjectURL(recordedVideoUrl)
      }
    }
  }, [mediaStream, recordedVideoUrl])

  // Start camera and microphone
  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Ensure video plays
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err)
        })
      }

      setMediaStream(stream)
      setIsCameraActive(true)
    } catch (err) {
      console.error('Error accessing camera/microphone:', err)
      setError(
        err.name === 'NotAllowedError'
          ? 'Camera and microphone access denied. Please allow permissions and try again.'
          : err.name === 'NotFoundError'
          ? 'No camera or microphone found. Please connect a device and try again.'
          : 'Failed to access camera or microphone. Please check your device settings.'
      )
      setIsCameraActive(false)
    }
  }

  // Stop camera and microphone
  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop())
      setMediaStream(null)
      setIsCameraActive(false)
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
    if (isRecording) {
      stopRecording()
    }
  }

  // Start recording
  const startRecording = () => {
    if (!mediaStream) {
      setError('Please start camera first')
      return
    }

    try {
      chunksRef.current = []
      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        setRecordedVideoUrl(url)
        setIsRecording(false)
      }

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error)
        setError('Recording error occurred')
        setIsRecording(false)
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
      setError(null)
    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Failed to start recording. Your browser may not support this feature.')
      setIsRecording(false)
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // Download recorded video
  const downloadVideo = () => {
    if (!recordedVideoUrl) return

    const a = document.createElement('a')
    a.href = recordedVideoUrl
    a.download = `visumorph-recording-${Date.now()}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // Format time (seconds to MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

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
    hidden: { opacity: 0, y: 20 },
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

      {/* Main Content */}
      <div className="relative z-10 p-6 md:p-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Logo and Title Section */}
          <motion.div
            variants={itemVariants}
            className="mb-6 md:mb-8 flex items-center gap-4"
          >
            <motion.img
              src={logo}
              alt="VisuMorph"
              className="h-10 md:h-14 w-auto cursor-pointer"
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
              onClick={() => navigate('/home')}
            />
            <motion.h1
              variants={itemVariants}
              className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400"
            >
              Recording Page
            </motion.h1>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 rounded-xl bg-red-500/20 border border-red-400/30 text-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Main Recording Canvas */}
          <motion.div
            variants={itemVariants}
            className="glass rounded-2xl p-6 md:p-8 lg:p-10 glow-gradient border-2 border-white/10 relative overflow-hidden"
          >
            {/* Video Preview Container */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/40 mb-6">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {!isCameraActive && (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/60">
                  <div className="text-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 border-4 border-purple-400/50 rounded-full flex items-center justify-center">
                      <svg
                        className="w-10 h-10 md:w-12 md:h-12 text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm md:text-base">
                      Camera not active
                    </p>
                  </div>
                </div>
              )}

              {/* Recording Indicator */}
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/90 backdrop-blur-sm"
                >
                  <motion.div
                    className="w-3 h-3 bg-white rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  />
                  <span className="text-white text-sm font-semibold">
                    REC {formatTime(recordingTime)}
                  </span>
                </motion.div>
              )}
            </div>

            {/* Control Bar */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* Start Camera Button */}
              {!isCameraActive && (
                <motion.button
                  onClick={startCamera}
                  className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 text-white glow-gradient"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🎥 Start Camera
                </motion.button>
              )}

              {/* Start/Stop Recording Button */}
              {isCameraActive && (
                <motion.button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={!isCameraActive}
                  className={`px-6 py-3 rounded-xl font-semibold text-white ${
                    isRecording
                      ? 'bg-gradient-to-r from-red-500 to-pink-500'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500'
                  } glow-gradient`}
                  style={{
                    boxShadow: isRecording
                      ? '0 0 30px rgba(239, 68, 68, 0.6), 0 0 60px rgba(236, 72, 153, 0.4)'
                      : undefined,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isRecording ? '⏹️ Stop Recording' : '🎬 Start Recording'}
                </motion.button>
              )}

              {/* Stop Camera Button */}
              {isCameraActive && (
                <motion.button
                  onClick={stopCamera}
                  className="px-6 py-3 rounded-xl font-semibold bg-gray-600/50 text-white border border-gray-500/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ⏹️ Stop Camera
                </motion.button>
              )}

              {/* Download Video Button */}
              <motion.button
                onClick={downloadVideo}
                disabled={!recordedVideoUrl}
                className={`px-6 py-3 rounded-xl font-semibold ${
                  recordedVideoUrl
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : 'bg-gray-600/30 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={recordedVideoUrl ? { scale: 1.05 } : {}}
                whileTap={recordedVideoUrl ? { scale: 0.95 } : {}}
              >
                ⬇️ Download Video
              </motion.button>

              {/* Settings Button (UI only) */}
              <motion.button
                className="px-6 py-3 rounded-xl font-semibold bg-gray-600/50 text-white border border-gray-500/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ⚙️ Settings
              </motion.button>
            </div>

            {/* Info Text */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-xs md:text-sm">
                {isCameraActive
                  ? 'Camera and microphone are active. Click "Start Recording" to begin.'
                  : 'Click "Start Camera" to begin recording with your camera and microphone.'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default RecordingPage

