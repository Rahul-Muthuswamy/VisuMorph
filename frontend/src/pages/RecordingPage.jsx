import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../../../assets/logo-modified.png'
import { createSession, startSession, sendEmotion } from '../services/api'
import { WebSocketService } from '../services/websocket'
import { EmotionDetectionServiceFaceAPI } from '../services/emotionDetectionFaceAPI'
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation'
import { Camera } from '@mediapipe/camera_utils'

const RecordingPage = () => {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const wsServiceRef = useRef(null)
  const emotionDetectionRef = useRef(null)
  const backgroundImageRef = useRef(null)
  const selfieSegmentationRef = useRef(null)
  const maskCanvasRef = useRef(null)
  const currentBackgroundRef = useRef(null)
  const currentEmotionNameRef = useRef('Neutral')

  const [mediaStream, setMediaStream] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null)
  const [error, setError] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)
  
  const [sessionId, setSessionId] = useState(null)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [currentBackground, setCurrentBackground] = useState(null)
  const [backgroundImageIndex, setBackgroundImageIndex] = useState(0)
  const [backgroundImages, setBackgroundImages] = useState([])
  const backgroundImageRefs = useRef([]) // Store image refs for quick access
  
  // List of background image paths to cycle through
  const backgroundImagePaths = useMemo(() => [
    '/images/ai-generated-wooden-table-on-a-glittering-background-from-green-lights-free-photo.jpg',
    '/images/Free-Images-Wallpaper-HD-Background.jpg',
    '/images/R.jpg',
    '/images/wp2568544.jpg',
    '/images/wp2599594.jpg',
    '/images/wp3709137.jpg'
  ], []) // Empty dependency array - this array never changes

  // Load all background images on component mount
  useEffect(() => {
    console.log('🖼️ useEffect triggered - starting image loading process...')
    console.log('🖼️ Image paths:', backgroundImagePaths)
    
    const loadImages = async () => {
      const loadedImages = []
      console.log('🖼️ Starting to load background images...')
      
      for (let i = 0; i < backgroundImagePaths.length; i++) {
        const imagePath = backgroundImagePaths[i]
        console.log(`🖼️ Loading image ${i + 1}/${backgroundImagePaths.length}: ${imagePath}`)
        
        try {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error(`Timeout loading image: ${imagePath}`))
            }, 10000) // 10 second timeout
            
            img.onload = () => {
              clearTimeout(timeout)
              loadedImages.push(img)
              console.log(`✅ Successfully loaded: ${imagePath}`)
              resolve()
            }
            img.onerror = (err) => {
              clearTimeout(timeout)
              console.error(`❌ Failed to load image: ${imagePath}`, err)
              // Continue loading other images even if one fails
              resolve() // Resolve instead of reject to continue
            }
            img.src = imagePath
          })
        } catch (err) {
          console.error(`❌ Error loading image ${imagePath}:`, err)
          // Continue with next image
        }
      }
      
      if (loadedImages.length > 0) {
        setBackgroundImages(loadedImages)
        backgroundImageRefs.current = loadedImages
        console.log(`✅ Successfully loaded ${loadedImages.length}/${backgroundImagePaths.length} background images`)
        
        // Set initial background to first image
        currentBackgroundRef.current = loadedImages[0]
        setCurrentBackground(loadedImages[0])
        setBackgroundImageIndex(0)
      } else {
        console.error('❌ No background images were loaded! Check if images exist in frontend/public/images/')
      }
    }
    
    loadImages().catch(err => {
      console.error('❌ Fatal error loading background images:', err)
    })
  }, [backgroundImagePaths])

  // Function to change background image (called by button click)
  const changeBackgroundColor = useCallback(() => {
    if (backgroundImages.length === 0) {
      console.warn('⚠️ No background images loaded yet')
      return
    }
    
    console.log('🖼️🖼️🖼️ BUTTON CLICKED! Current index:', backgroundImageIndex)
    
    // Move to next image (wrap around)
    const nextIndex = (backgroundImageIndex + 1) % backgroundImages.length
    const newImage = backgroundImages[nextIndex]
    
    console.log(`🖼️ Moving to next image: ${backgroundImagePaths[nextIndex]} (index ${nextIndex})`)
    
    // Update ref IMMEDIATELY (this is what MediaPipe reads on every frame)
    currentBackgroundRef.current = newImage
    console.log(`🖼️ Ref updated: currentBackgroundRef.current = image object`)
    
    // Update state (this triggers re-render but ref is already updated)
    setCurrentBackground(newImage)
    setBackgroundImageIndex(nextIndex)
    
    console.log(`🖼️✅ Button clicked! Background image changed to: ${backgroundImagePaths[nextIndex]} (index ${nextIndex}/${backgroundImages.length - 1})`)
    console.log(`   Next click will change to: ${backgroundImagePaths[(nextIndex + 1) % backgroundImages.length]}`)
  }, [backgroundImageIndex, backgroundImages, backgroundImagePaths])
  
  // Keep ref in sync with state (but we update ref directly first, so this is just a backup)
  useEffect(() => {
    if (currentBackground) {
      currentBackgroundRef.current = currentBackground
    }
  }, [currentBackground])
  const [emotionData, setEmotionData] = useState({
    current: 0,
    final: 0,
    bucket: 'neutral',
    buffer: [0, 0, 0]
  })
  const [currentEmotionName, setCurrentEmotionName] = useState('Neutral') // Track current emotion name for display
  const [isConnecting, setIsConnecting] = useState(false)

  // Video setup state (context and dress color)
  const [showSetupModal, setShowSetupModal] = useState(true)
  const [videoContext, setVideoContext] = useState('')
  const [dressColor, setDressColor] = useState('')

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

  // Cleanup on unmount only (not when mediaStream changes)
  useEffect(() => {
    return () => {
      console.log('🧹 Component unmounting - cleaning up...')
      // Stop camera
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop())
      }
      
      // Cleanup video URL
      if (recordedVideoUrl) {
        URL.revokeObjectURL(recordedVideoUrl)
      }
      
      // Disconnect WebSocket
      if (wsServiceRef.current) {
        wsServiceRef.current.disconnect()
      }
      
      // Stop emotion detection (only on unmount)
      if (emotionDetectionRef.current) {
        console.log('🛑 Stopping emotion detection on unmount')
        emotionDetectionRef.current.stop()
      }
    }
  }, []) // Empty deps - only run cleanup on unmount, not when mediaStream changes

  // Initialize emotion detection service (face-api.js)
  useEffect(() => {
    console.log('🔧 Initializing emotion detection service...')
    try {
      emotionDetectionRef.current = new EmotionDetectionServiceFaceAPI()
      console.log('✅ Emotion detection service initialized (face-api.js)')
      console.log('   Service object:', emotionDetectionRef.current)
      if (emotionDetectionRef.current) {
        console.log('   Service methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(emotionDetectionRef.current)))
      }
    } catch (err) {
      console.error('❌ CRITICAL ERROR initializing emotion detection:', err)
      console.error('   Error name:', err.name)
      console.error('   Error message:', err.message)
      console.error('   Error stack:', err.stack)
      // Continue without emotion detection
    }
    return () => {
      if (emotionDetectionRef.current) {
        try {
          emotionDetectionRef.current.stop()
        } catch (err) {
          console.error('Error stopping emotion detection:', err)
        }
      }
    }
  }, [])

  // Convert emotion score to emotion name for display
  const getEmotionName = useCallback((score) => {
    if (score >= 4) return 'Very Happy'
    if (score >= 2) return 'Happy'
    if (score >= 1) return 'Slightly Happy'
    if (score === 0) return 'Neutral'
    if (score >= -1) return 'Slightly Sad'
    if (score >= -3) return 'Sad'
    return 'Very Sad'
  }, [])

  // Draw emotion label on canvas (above user's head)
  const drawEmotionLabel = useCallback((ctx, canvasWidth, canvasHeight) => {
    // ALWAYS use ref to get the latest emotion name (refs are always current)
    const emotionName = currentEmotionNameRef.current 
      ? (currentEmotionNameRef.current.charAt(0).toUpperCase() + currentEmotionNameRef.current.slice(1).toLowerCase())
      : 'Neutral'
    
    // Position: Top center, above where head would be (about 15% from top)
    const x = canvasWidth / 2
    const y = canvasHeight * 0.15
    
    // Font settings - responsive to canvas size
    const fontSize = Math.max(24, canvasWidth / 30)
    ctx.font = `bold ${fontSize}px Arial, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // Measure text for background rectangle
    const textMetrics = ctx.measureText(emotionName)
    const textWidth = textMetrics.width
    const padding = 20
    const rectWidth = textWidth + (padding * 2)
    const rectHeight = fontSize + (padding * 2)
    const rectX = x - (rectWidth / 2)
    const rectY = y - (rectHeight / 2)
    
    // Draw semi-transparent background with rounded corners
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.beginPath()
    if (ctx.roundRect) {
      ctx.roundRect(rectX, rectY, rectWidth, rectHeight, 15)
    } else {
      // Fallback for browsers without roundRect
      const radius = 15
      ctx.moveTo(rectX + radius, rectY)
      ctx.lineTo(rectX + rectWidth - radius, rectY)
      ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + radius)
      ctx.lineTo(rectX + rectWidth, rectY + rectHeight - radius)
      ctx.quadraticCurveTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - radius, rectY + rectHeight)
      ctx.lineTo(rectX + radius, rectY + rectHeight)
      ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - radius)
      ctx.lineTo(rectX, rectY + radius)
      ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY)
      ctx.closePath()
    }
    ctx.fill()
    
    // Draw border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Draw text
    ctx.fillStyle = '#ffffff'
    ctx.fillText(emotionName, x, y)
  }, []) // No dependencies - uses ref which is always current

  // MediaPipe Selfie Segmentation for background removal with smooth background changes
  useEffect(() => {
    if (!isCameraActive || !videoRef.current || !canvasRef.current) return
    
    // Add roundRect polyfill for older browsers
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        this.beginPath()
        this.moveTo(x + radius, y)
        this.lineTo(x + width - radius, y)
        this.quadraticCurveTo(x + width, y, x + width, y + radius)
        this.lineTo(x + width, y + height - radius)
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
        this.lineTo(x + radius, y + height)
        this.quadraticCurveTo(x, y + height, x, y + height - radius)
        this.lineTo(x, y + radius)
        this.quadraticCurveTo(x, y, x + radius, y)
        this.closePath()
      }
    }

    // Don't initialize here - let the scheduler handle it
    // The scheduler will set the initial color when camera starts

    // Create temporary canvas for mask if it doesn't exist
    if (!maskCanvasRef.current) {
      maskCanvasRef.current = document.createElement('canvas')
    }

    let camera = null
    let selfieSegmentation = null

    const initializeSegmentation = async () => {
      try {
        selfieSegmentation = new SelfieSegmentation({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
          }
        })

        selfieSegmentation.setOptions({
          modelSelection: 1, // 1 for landscape (better for video)
          minDetectionConfidence: 0.5
        })

        selfieSegmentation.onResults((results) => {
          if (!canvasRef.current || !videoRef.current || !maskCanvasRef.current) return

          const canvas = canvasRef.current
          const video = videoRef.current
          const ctx = canvas.getContext('2d')

          // Set canvas internal resolution to match video (for processing)
          if (video.videoWidth && video.videoHeight) {
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            maskCanvasRef.current.width = video.videoWidth
            maskCanvasRef.current.height = video.videoHeight
          }

          // Clear canvas first
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          // ALWAYS read the latest background from ref (refs are always current)
          // Can be an Image object or a color string
          const bg = currentBackgroundRef.current
          
          // Draw the full background FIRST (image or color)
          // This will be visible in areas where there's no person
          if (bg instanceof Image && bg.complete && bg.naturalWidth > 0) {
            // Draw background image (scale to fit canvas)
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
          } else if (typeof bg === 'string') {
            // Fallback to color if image not loaded
            ctx.fillStyle = bg
            ctx.fillRect(0, 0, canvas.width, canvas.height)
          } else {
            // Default fallback color
            ctx.fillStyle = '#8b5cf6'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
          }
          
          // Now draw the person on top using the segmentation mask
          if (results.segmentationMask) {
            // Use the maskCanvas to apply the mask to the video first
            const maskCtx = maskCanvasRef.current.getContext('2d')
            
            // Clear mask canvas
            maskCtx.clearRect(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height)
            
            // Draw the video on the mask canvas
            maskCtx.drawImage(video, 0, 0, canvas.width, canvas.height)
            
            // Apply the mask to keep only the person (where mask is opaque)
            // destination-in: keeps the video only where mask is opaque, makes rest transparent
            maskCtx.globalCompositeOperation = 'destination-in'
            maskCtx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height)
            
          // Now draw the masked person on top of the background
          // The transparent areas in the masked person will show the background we drew first
          ctx.globalCompositeOperation = 'source-over'
          ctx.drawImage(maskCanvasRef.current, 0, 0, canvas.width, canvas.height)
          
          // Draw emotion label above user's head
          drawEmotionLabel(ctx, canvas.width, canvas.height)
          } else {
            // Fallback: if no mask, just draw video (background won't show, but at least video works)
            console.warn('⚠️ No segmentation mask - drawing video without background replacement')
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            
            // Draw emotion label even without mask
            drawEmotionLabel(ctx, canvas.width, canvas.height)
          }
        })

        selfieSegmentationRef.current = selfieSegmentation

        // Start processing video frames
        camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
              await selfieSegmentation.send({ image: videoRef.current })
            }
          },
          width: 1280,
          height: 720
        })

        camera.start()
        console.log('✅ MediaPipe background removal started')
      } catch (err) {
        console.error('Error initializing MediaPipe Selfie Segmentation:', err)
        // Fall back to simple overlay if MediaPipe fails
      }
    }

    initializeSegmentation()

    return () => {
      if (camera) {
        camera.stop()
      }
      if (selfieSegmentation) {
        try {
          selfieSegmentation.close()
        } catch (err) {
          console.error('Error closing MediaPipe:', err)
        }
      }
      selfieSegmentationRef.current = null
    }
  }, [isCameraActive, drawEmotionLabel]) // Include drawEmotionLabel in dependencies

  // Draw background on canvas - fallback method (when MediaPipe is not available)
  const drawBackground = useCallback(() => {
    if (!canvasRef.current || !videoRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext('2d')

    // Set canvas size to match video
    if (video.videoWidth && video.videoHeight) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
    } else {
      // Fallback dimensions
      canvas.width = 640
      canvas.height = 480
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background if available
    if (backgroundImageRef.current) {
      ctx.drawImage(backgroundImageRef.current, 0, 0, canvas.width, canvas.height)
    } else if (currentBackground && currentBackground.startsWith('gradient_')) {
      // Draw gradient fallback
      const bucket = currentBackground.split('_')[1] || 'neutral'
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      
      if (bucket === 'happy') {
        gradient.addColorStop(0, '#fbbf24')
        gradient.addColorStop(1, '#f59e0b')
      } else if (bucket === 'sad') {
        gradient.addColorStop(0, '#6366f1')
        gradient.addColorStop(1, '#4f46e5')
      } else {
        gradient.addColorStop(0, '#8b5cf6')
        gradient.addColorStop(1, '#7c3aed')
      }
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Draw video on top
    if (video.readyState >= 2) {
      ctx.globalCompositeOperation = 'source-over'
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    }
  }, [currentBackground])

  // Continuously draw background when video is playing (fallback if MediaPipe fails)
  useEffect(() => {
    // Only use fallback if MediaPipe is not available
    if (!isCameraActive || !currentBackground || !videoRef.current || !canvasRef.current) return
    if (selfieSegmentationRef.current) return // MediaPipe is handling it

    const interval = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        drawBackground()
      }
    }, 100) // Draw every 100ms for smooth updates

    return () => clearInterval(interval)
  }, [isCameraActive, currentBackground, drawBackground])

  // Get video constraints based on settings
  const getVideoConstraints = useCallback(() => {
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
  }, [selectedCameraId, resolution, fps])

  // Get audio constraints based on settings
  const getAudioConstraints = useCallback(() => {
    if (!selectedMicId) {
      return true // Use default microphone
    }
    return { deviceId: { exact: selectedMicId } }
  }, [selectedMicId])

  // Update background image based on emotion data from WebSocket
  // Map emotion score (-5 to +5) to background image
  // Scores: -5 (very sad), -4, -3, -2, -1, 0 (neutral), +1, +2, +3, +4, +5 (very happy)
  // Each score has 2 sets of images (set1 and set2), we alternate between them
  const backgroundSetRef = useRef(1) // Track which set we're using (1 or 2)

  // Function to change background IMAGE based on emotion score
  // Uses static images from local pool
  const updateBackgroundFromScore = useCallback((emotionScore) => {
    // Clamp score to -5 to +5 range
    const score = Math.max(-5, Math.min(5, Math.round(emotionScore)))
    
    // Use static images
    if (backgroundImages.length === 0) {
      console.warn('⚠️ No background images loaded yet')
      return
    }
    
    // Map emotion score to image index
    // Score range: -5 (very sad) to +5 (very happy)
    // We have 6 images, so we'll map scores to images:
    // -5 to -3: Image 0 (sad/blue tones)
    // -2 to -1: Image 1 (slightly sad)
    // 0: Image 2 (neutral)
    // 1 to 2: Image 3 (slightly happy)
    // 3 to 5: Image 4-5 (happy/warm tones)
    
    let imageIndex
    if (score <= -3) {
      imageIndex = 0 // Very sad
    } else if (score <= -1) {
      imageIndex = 1 // Sad
    } else if (score === 0) {
      imageIndex = 2 // Neutral
    } else if (score <= 2) {
      imageIndex = 3 // Happy
    } else {
      // For very happy (3-5), randomly pick between last 2 images
      imageIndex = score >= 4 ? 5 : 4
    }
    
    // Ensure index is within bounds
    imageIndex = Math.max(0, Math.min(backgroundImages.length - 1, imageIndex))
    
    const selectedImage = backgroundImages[imageIndex]
    
    // Update ref IMMEDIATELY so MediaPipe gets the new image right away
    currentBackgroundRef.current = selectedImage
    setCurrentBackground(selectedImage)
    setBackgroundImageIndex(imageIndex)
    
    console.log(`🎭🎨 Background IMAGE changed based on emotion: score=${score}, image=${backgroundImagePaths[imageIndex]} (index ${imageIndex})`)
  }, [backgroundImages, backgroundImagePaths])

  // Legacy function for backward compatibility (called from WebSocket)
  const updateBackground = useCallback((backgroundId, bucket) => {
    // If called with bucket, map to score
    if (bucket === 'happy') {
      updateBackgroundFromScore(3) // Default happy score
    } else if (bucket === 'sad') {
      updateBackgroundFromScore(-3) // Default sad score
    } else {
      updateBackgroundFromScore(0) // Neutral
    }
  }, [updateBackgroundFromScore])

  // Create session and connect WebSocket
  const initializeSession = useCallback(async () => {
    try {
      setIsConnecting(true)
      setError(null)

      // Create session with user-provided context and dress color
      const sessionData = await createSession(videoContext || 'general', dressColor || 'none')
      const newSessionId = sessionData.session_id
      setSessionId(newSessionId)

      // Start session
      await startSession(newSessionId)
      setIsSessionActive(true)

      // Connect WebSocket
      wsServiceRef.current = new WebSocketService(newSessionId)
      
      // Set up WebSocket listeners
      wsServiceRef.current.on('connected', () => {
        console.log('✅ WebSocket connected for session:', newSessionId)
        setIsConnecting(false)
      })

      wsServiceRef.current.on('backgroundUpdate', (data) => {
        console.log('📡 Background update received from Kafka stream:', data)
        setEmotionData({
          current: data.emotion_value || 0,
          final: data.final_emotion || 0,
          bucket: data.bucket || 'neutral',
          buffer: data.buffer || [0, 0, 0]
        })
        
        // Update background from Kafka stream
        if (data.background) {
          updateBackground(data.background, data.bucket)
        }
      })

      wsServiceRef.current.on('error', (error) => {
        console.error('WebSocket error:', error)
        setError('WebSocket connection error. The page will still work, but background updates may not be received.')
        setIsConnecting(false)
      })

      wsServiceRef.current.on('disconnected', () => {
        console.log('WebSocket disconnected')
        setIsConnecting(false)
      })

      // Connect WebSocket
      wsServiceRef.current.connect()

      return newSessionId
    } catch (err) {
      console.warn('⚠️ Backend not available - continuing without backend connection')
      console.warn('   Emotion detection and background changes will still work locally')
      console.warn('   Error details:', err.message || err)
      
      // If session creation fails, don't block the app but also don't set session as active
      setIsSessionActive(false)
      setSessionId(null)
      
      // Don't show error to user - app works fine without backend
      // Backend is optional for emotion detection and background changes
      setIsConnecting(false)
      // Don't throw - allow page to work without backend
      return null
    }
  }, [updateBackground, videoContext, dressColor])

  // Handle detected emotion - called every second
  const handleEmotionDetected = useCallback(async (emotionValue, emotionName = null) => {
    // Always update emotion name for display on canvas
    const displayName = emotionName || getEmotionName(emotionValue)
    
    // Update ref IMMEDIATELY (this is what canvas reads on every frame)
    const prevName = currentEmotionNameRef.current
    currentEmotionNameRef.current = displayName
    
    // Update state for React components (if needed elsewhere)
    setCurrentEmotionName(displayName)
    
    // Log emotion change
    if (prevName !== displayName) {
      console.log(`😊 Emotion changed: ${prevName} → ${displayName} (score: ${emotionValue})`)
    } else {
      console.log(`😊 Emotion detected: ${displayName} (score: ${emotionValue})`)
    }
    
    // Update local emotion state
    setEmotionData(prev => ({
      ...prev,
      current: emotionValue
    }))

    // Send emotion to backend/Kafka stream (REQUIRED for Confluent challenge)
    if (sessionId && isSessionActive) {
      try {
        await sendEmotion(sessionId, emotionValue)
        console.log('📤 Sent emotion to Kafka stream via backend:', emotionValue, `(${displayName})`)
      } catch (err) {
        // Only log error if it's not a 401 (authentication) error - those are expected if user is not logged in
        if (err.message && !err.message.includes('401')) {
          console.error('❌ Failed to send emotion to Kafka stream:', err)
          console.error('   Make sure backend and Kafka are running for full functionality')
        }
        // Continue emotion detection but background won't update via Kafka
      }
    }
    // Removed warning message - session might not be active if backend is unavailable, which is OK
  }, [sessionId, isSessionActive, getEmotionName])

  // Track if we've initialized the background (use ref to persist across renders)
  const isBackgroundInitializedRef = useRef(false)
  
  // Initialize background image when camera starts (emotion detection will handle changes)
  useEffect(() => {
    // Only initialize if camera is active AND images are loaded AND we haven't initialized yet
    if (!isCameraActive || backgroundImages.length === 0 || isBackgroundInitializedRef.current) {
      return
    }

    // Set initial image immediately (neutral - index 2, which maps to score 0)
    console.log('⏰⏰⏰ INITIALIZING BACKGROUND IMAGE (first time only)')
    const initialIndex = 2 // Neutral image (score 0)
    const initialImage = backgroundImages[initialIndex] || backgroundImages[0]
    currentBackgroundRef.current = initialImage
    setCurrentBackground(initialImage)
    setBackgroundImageIndex(initialIndex)
    isBackgroundInitializedRef.current = true
    console.log(`🖼️ Initial background image set: ${backgroundImagePaths[initialIndex]} (neutral, index ${initialIndex})`)
    console.log(`   Emotion detection will change background every 8 seconds based on facial reactions`)
  }, [isCameraActive, backgroundImages, backgroundImagePaths]) // backgroundImages and paths are memoized

  // Handle background change - called every 8 seconds (from emotion detection)
  // NOTE: This is a fallback. Primary background updates come from Kafka stream via WebSocket
  const handleBackgroundChange = useCallback((calculatedScore) => {
    console.log(`🎨 Local background change triggered (fallback) with emotion score: ${calculatedScore}`)
    // Only use local update if WebSocket/Kafka is not active
    if (!isSessionActive || !wsServiceRef.current) {
      console.log('   Using local background update (Kafka stream not active)')
      updateBackgroundFromScore(calculatedScore)
    } else {
      console.log('   Background will be updated via Kafka stream (WebSocket)')
    }
  }, [updateBackgroundFromScore, isSessionActive])

  // Start camera and microphone
  const startCamera = useCallback(async (useCurrentSettings = true) => {
    try {
      setError(null)
      
      // Initialize session first (non-blocking if backend is unavailable)
      // Backend is optional - emotion detection works independently
      if (!sessionId) {
        const newSessionId = await initializeSession()
        if (!newSessionId) {
          // Backend unavailable, but continue with camera anyway
          console.log('ℹ️ Backend unavailable - emotion detection will work locally without backend')
        }
      }
      
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
      
      // Wait for video to be ready before starting emotion detection
      // This ensures the video element has loaded metadata and is playing
      const waitForVideoReady = () => {
        return new Promise((resolve) => {
          if (videoRef.current && videoRef.current.readyState >= 2) {
            resolve()
          } else {
            const checkReady = () => {
              if (videoRef.current && videoRef.current.readyState >= 2) {
                videoRef.current.removeEventListener('loadedmetadata', checkReady)
                videoRef.current.removeEventListener('canplay', checkReady)
                resolve()
              }
            }
            if (videoRef.current) {
              videoRef.current.addEventListener('loadedmetadata', checkReady)
              videoRef.current.addEventListener('canplay', checkReady)
            }
            // Timeout after 3 seconds
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.removeEventListener('loadedmetadata', checkReady)
                videoRef.current.removeEventListener('canplay', checkReady)
              }
              resolve() // Resolve anyway to not block
            }, 3000)
          }
        })
      }
      
      // Start emotion detection with background change callback
      console.log('🔍 DEBUG: Checking emotion detection setup...')
      console.log('🔍 emotionDetectionRef.current:', emotionDetectionRef.current)
      console.log('🔍 videoRef.current:', videoRef.current)
      console.log('🔍 handleEmotionDetected:', handleEmotionDetected)
      console.log('🔍 handleBackgroundChange:', handleBackgroundChange)
      
      if (!emotionDetectionRef.current) {
        console.error('❌ ERROR: emotionDetectionRef.current is NULL!')
        console.error('   Emotion detection service was not initialized!')
        console.error('   Check if EmotionDetectionServiceFaceAPI is imported correctly')
      }
      
      if (!videoRef.current) {
        console.error('❌ ERROR: videoRef.current is NULL!')
        console.error('   Video element is not available!')
      }
      
      if (emotionDetectionRef.current && videoRef.current) {
        console.log('✅ Both emotionDetectionRef and videoRef are available')
        console.log('🎭 Starting emotion detection service...')
        console.log('📹 Video element state:', {
          readyState: videoRef.current.readyState,
          videoWidth: videoRef.current.videoWidth,
          videoHeight: videoRef.current.videoHeight,
          paused: videoRef.current.paused,
          srcObject: videoRef.current.srcObject ? 'has stream' : 'no stream'
        })
        
        // Wait for video to be ready
        console.log('⏳ Waiting for video to be ready...')
        await waitForVideoReady()
        console.log('✅ Video ready check complete')
        
        try {
          console.log('🚀 Calling emotionDetectionRef.current.start()...')
          await emotionDetectionRef.current.start(
            videoRef.current,
            handleEmotionDetected,
            handleBackgroundChange,
            1000 // Detect every second
          )
          console.log('✅ Emotion detection started successfully - analyzing facial reactions every second, changing background every 8 seconds')
          console.log('📹 Video is ready for emotion detection:', {
            readyState: videoRef.current.readyState,
            videoWidth: videoRef.current.videoWidth,
            videoHeight: videoRef.current.videoHeight
          })
          console.log('🎬 Emotion detection interval should be running now - check for detection logs every second')
        } catch (err) {
          console.error('❌ CRITICAL ERROR starting emotion detection:', err)
          console.error('Error name:', err.name)
          console.error('Error message:', err.message)
          console.error('Error stack:', err.stack)
          console.error('Full error object:', err)
          // Continue without emotion detection
        }
      } else {
        console.error('❌ ERROR: Cannot start emotion detection!')
        console.error('   emotionDetectionRef.current:', emotionDetectionRef.current)
        console.error('   videoRef.current:', videoRef.current)
        console.error('   One or both are null!')
      }
      
      // Re-enumerate devices to get labels after permission granted
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
  }, [sessionId, initializeSession, getVideoConstraints, getAudioConstraints, mirrorPreview, enumerateDevices, handleEmotionDetected, mediaStream])

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
    // Stop emotion detection
    if (emotionDetectionRef.current) {
      emotionDetectionRef.current.stop()
    }

    // Stop camera stream
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop())
      setMediaStream(null)
      setIsCameraActive(false)
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }

    // Stop recording if active
    if (isRecording) {
      stopRecording()
    }

    // Disconnect WebSocket
    if (wsServiceRef.current) {
      wsServiceRef.current.disconnect()
      wsServiceRef.current = null
    }

    // Reset session state
    setIsSessionActive(false)
    setCurrentBackground(null)
    setEmotionData({ current: 0, final: 0, bucket: 'neutral', buffer: [0, 0, 0] })
    
    // Reset background initialization flag
    isBackgroundInitializedRef.current = false
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 opacity-20"
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
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-transparent mb-6">
              {/* Hidden video element for MediaPipe processing */}
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: 0, pointerEvents: 'none', zIndex: -1 }}
              />
              {/* Canvas for background removal and overlay - this is what the user sees */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ 
                  display: isCameraActive ? 'block' : 'none', 
                  zIndex: 10,
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%'
                }}
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
                  disabled={isConnecting}
                  className={`px-6 py-3 rounded-xl font-semibold ${
                    isConnecting
                      ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white glow-gradient'
                  }`}
                  whileHover={!isConnecting ? { scale: 1.05 } : {}}
                  whileTap={!isConnecting ? { scale: 0.95 } : {}}
                >
                  {isConnecting ? '⏳ Connecting...' : '🎥 Start Camera'}
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

              {/* Change Background Color Button */}
              {isCameraActive && (
                <motion.button
                  onClick={changeBackgroundColor}
                  className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-purple-500 text-white glow-gradient"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Click to change background color"
                >
                  🎨 Change Background
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

      {/* Video Setup Modal - Ask for context and dress color */}
      {showSetupModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            // Don't close on backdrop click - require form submission
            if (e.target === e.currentTarget) return
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass rounded-2xl p-8 md:p-10 max-w-md w-full mx-4 glow-gradient border-2 border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400">
              Setup Your Video
            </h2>
            <p className="text-gray-300 mb-6 text-sm md:text-base">
              Please provide some details to personalize your recording experience
            </p>

            <div className="space-y-6">
              {/* Video Context Input */}
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Video Context <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={videoContext}
                  onChange={(e) => setVideoContext(e.target.value)}
                  placeholder="e.g., gaming, presentation, interview, vlog"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && videoContext.trim()) {
                      setShowSetupModal(false)
                    }
                  }}
                  autoFocus
                />
                <p className="mt-1 text-xs text-gray-400">
                  What is this video for?
                </p>
              </div>

              {/* Dress Color Input */}
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Dress Color
                </label>
                <input
                  type="text"
                  value={dressColor}
                  onChange={(e) => setDressColor(e.target.value)}
                  placeholder="e.g., red, blue, black, white, none"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && videoContext.trim()) {
                      setShowSetupModal(false)
                    }
                  }}
                />
                <p className="mt-1 text-xs text-gray-400">
                  What color are you wearing? (optional)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <motion.button
                  onClick={() => {
                    if (videoContext.trim()) {
                      setShowSetupModal(false)
                      setError(null)
                    } else {
                      setError('Please enter a video context')
                    }
                  }}
                  disabled={!videoContext.trim()}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: videoContext.trim() ? 1.05 : 1 }}
                  whileTap={{ scale: videoContext.trim() ? 0.95 : 1 }}
                >
                  Start Recording
                </motion.button>
                <motion.button
                  onClick={() => navigate('/home')}
                  className="px-6 py-3 rounded-xl font-semibold bg-white/10 text-white border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default RecordingPage

