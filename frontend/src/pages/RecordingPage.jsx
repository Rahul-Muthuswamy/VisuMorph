import React, { useState, useRef, useEffect, useCallback } from 'react'
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

  // Settings state
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [availableCameras, setAvailableCameras] = useState([])
  const [availableMics, setAvailableMics] = useState([])
  const [selectedCameraId, setSelectedCameraId] = useState('')
  const [selectedMicId, setSelectedMicId] = useState('')
  const [resolution, setResolution] = useState('medium') // low, medium, high
  const [mirrorPreview, setMirrorPreview] = useState(false)
  const [fps, setFps] = useState(30)

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

  // Enumerate available devices
  const enumerateDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const cameras = devices.filter(device => device.kind === 'videoinput')
      const mics = devices.filter(device => device.kind === 'audioinput')
      
      setAvailableCameras(cameras)
      setAvailableMics(mics)
      
      // Set default selections only if not already set
      setSelectedCameraId(prev => {
        if (prev || cameras.length === 0) return prev
        return cameras[0].deviceId
      })
      setSelectedMicId(prev => {
        if (prev || mics.length === 0) return prev
        return mics[0].deviceId
      })
    } catch (err) {
      console.error('Error enumerating devices:', err)
      // Don't set error for initial enumeration failure
    }
  }, [])

  // Initial device enumeration (without requesting permissions)
  useEffect(() => {
    enumerateDevices()
  }, [enumerateDevices])

  // Re-enumerate devices after camera starts (to get labels)
  useEffect(() => {
    if (isCameraActive && mediaStream) {
      // Small delay to ensure stream is fully established
      const timer = setTimeout(() => {
        enumerateDevices()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isCameraActive, mediaStream, enumerateDevices])

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

  // Get video constraints based on settings
  const getVideoConstraints = () => {
    const resolutions = {
      low: { width: 640, height: 480 },
      medium: { width: 1280, height: 720 },
      high: { width: 1920, height: 1080 }
    }

    const constraints = {
      deviceId: selectedCameraId ? { exact: selectedCameraId } : undefined,
      ...resolutions[resolution],
      frameRate: { ideal: fps }
    }

    // Remove undefined values
    Object.keys(constraints).forEach(key => {
      if (constraints[key] === undefined) {
        delete constraints[key]
      }
    })

    return constraints
  }

  // Get audio constraints based on settings
  const getAudioConstraints = () => {
    if (!selectedMicId) {
      return true // Use default microphone
    }
    return { deviceId: { exact: selectedMicId } }
  }

  // Start camera and microphone
  const startCamera = async (useCurrentSettings = true) => {
    try {
      setError(null)
      
      // Stop existing stream if any
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop())
        setMediaStream(null)
      }

      // Use provided settings or current state
      const videoConstraints = useCurrentSettings ? getVideoConstraints() : { video: true }
      const audioConstraints = useCurrentSettings ? getAudioConstraints() : { audio: true }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: audioConstraints
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Apply mirror effect if enabled
        videoRef.current.style.transform = mirrorPreview ? 'scaleX(-1)' : 'none'
        // Ensure video plays
        await videoRef.current.play().catch(err => {
          console.error('Error playing video:', err)
        })
      }

      setMediaStream(stream)
      setIsCameraActive(true)
      
      // Re-enumerate devices to get labels after permission granted
      // Use setTimeout to avoid race conditions
      setTimeout(() => {
        enumerateDevices()
      }, 300)
    } catch (err) {
      console.error('Error accessing camera/microphone:', err)
      setError(
        err.name === 'NotAllowedError'
          ? 'Camera and microphone access denied. Please allow permissions and try again.'
          : err.name === 'NotFoundError'
          ? 'No camera or microphone found. Please connect a device and try again.'
          : err.name === 'OverconstrainedError'
          ? 'Selected device or settings not supported. Try different settings.'
          : 'Failed to access camera or microphone. Please check your device settings.'
      )
      setIsCameraActive(false)
      setMediaStream(null)
    }
  }

  // Restart camera with new settings
  const restartCameraWithSettings = async () => {
    if (isCameraActive && !isRecording) {
      // Small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 50))
      await startCamera(true)
    }
  }

  // Handle camera change
  const handleCameraChange = async (deviceId) => {
    if (isRecording) return
    
    setSelectedCameraId(deviceId)
    if (isCameraActive) {
      await restartCameraWithSettings()
    }
  }

  // Handle microphone change
  const handleMicChange = async (deviceId) => {
    if (isRecording) return
    
    setSelectedMicId(deviceId)
    if (isCameraActive) {
      await restartCameraWithSettings()
    }
  }

  // Handle resolution change
  const handleResolutionChange = async (res) => {
    if (isRecording) return
    
    setResolution(res)
    if (isCameraActive) {
      await restartCameraWithSettings()
    }
  }

  // Handle mirror preview change
  const handleMirrorChange = (mirror) => {
    if (isRecording) return
    
    setMirrorPreview(mirror)
    if (videoRef.current) {
      videoRef.current.style.transform = mirror ? 'scaleX(-1)' : 'none'
    }
  }

  // Handle FPS change
  const handleFpsChange = async (newFps) => {
    if (isRecording) return
    
    setFps(newFps)
    if (isCameraActive) {
      await restartCameraWithSettings()
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

              {/* Settings Button */}
              <motion.button
                onClick={() => setSettingsOpen(true)}
                disabled={isRecording}
                className={`px-6 py-3 rounded-xl font-semibold ${
                  isRecording
                    ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-600/50 text-white border border-gray-500/50'
                }`}
                whileHover={!isRecording ? { scale: 1.05 } : {}}
                whileTap={!isRecording ? { scale: 0.95 } : {}}
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

      {/* Settings Modal */}
      {settingsOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSettingsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="glass rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto glow-gradient border-2 border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                Settings
              </h2>
              <motion.button
                onClick={() => setSettingsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {isRecording && (
              <div className="mb-4 p-3 rounded-lg bg-yellow-500/20 border border-yellow-400/30 text-yellow-200 text-sm">
                Settings are disabled while recording. Stop recording to change settings.
              </div>
            )}

            <div className="space-y-6">
              {/* Camera Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Camera
                </label>
                <select
                  value={selectedCameraId || ''}
                  onChange={(e) => handleCameraChange(e.target.value)}
                  disabled={isRecording || availableCameras.length === 0}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {availableCameras.length === 0 ? (
                    <option value="" className="bg-gray-900">No cameras available</option>
                  ) : (
                    availableCameras.map((camera) => (
                      <option key={camera.deviceId} value={camera.deviceId} className="bg-gray-900">
                        {camera.label || `Camera ${camera.deviceId.slice(0, 8)}`}
                      </option>
                    ))
                  )}
                </select>
                <p className="mt-1 text-xs text-gray-400">
                  Select which camera to use for recording
                </p>
              </div>

              {/* Microphone Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Microphone
                </label>
                <select
                  value={selectedMicId || ''}
                  onChange={(e) => handleMicChange(e.target.value)}
                  disabled={isRecording || availableMics.length === 0}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {availableMics.length === 0 ? (
                    <option value="" className="bg-gray-900">No microphones available</option>
                  ) : (
                    availableMics.map((mic) => (
                      <option key={mic.deviceId} value={mic.deviceId} className="bg-gray-900">
                        {mic.label || `Microphone ${mic.deviceId.slice(0, 8)}`}
                      </option>
                    ))
                  )}
                </select>
                <p className="mt-1 text-xs text-gray-400">
                  Select which microphone to use for recording
                </p>
              </div>

              {/* Video Quality */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Video Quality
                </label>
                <select
                  value={resolution}
                  onChange={(e) => handleResolutionChange(e.target.value)}
                  disabled={isRecording}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="low" className="bg-gray-900">Low (640×480)</option>
                  <option value="medium" className="bg-gray-900">Medium (1280×720)</option>
                  <option value="high" className="bg-gray-900">High (1920×1080)</option>
                </select>
                <p className="mt-1 text-xs text-gray-400">
                  Higher quality uses more bandwidth and storage
                </p>
              </div>

              {/* FPS Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Frame Rate
                </label>
                <select
                  value={fps}
                  onChange={(e) => handleFpsChange(Number(e.target.value))}
                  disabled={isRecording}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value={30} className="bg-gray-900">30 FPS</option>
                  <option value={60} className="bg-gray-900">60 FPS</option>
                </select>
                <p className="mt-1 text-xs text-gray-400">
                  Higher frame rate provides smoother video
                </p>
              </div>

              {/* Mirror Preview Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Mirror Preview
                  </label>
                  <p className="text-xs text-gray-400">
                    Flip preview horizontally (does not affect recording)
                  </p>
                </div>
                <button
                  onClick={() => handleMirrorChange(!mirrorPreview)}
                  disabled={isRecording}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    mirrorPreview ? 'bg-purple-500' : 'bg-gray-600'
                  } ${isRecording ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <motion.div
                    className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full"
                    animate={{
                      x: mirrorPreview ? 28 : 0
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </button>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <motion.button
                onClick={() => setSettingsOpen(false)}
                className="px-6 py-2 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default RecordingPage

