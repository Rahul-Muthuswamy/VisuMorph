/**
 * Emotion Detection Service using MediaPipe Face Detection
 * Analyzes facial expressions and returns emotion scores from -5 (sad) to +5 (happy)
 */

import { FaceDetection } from '@mediapipe/face_detection'
import { FaceMesh } from '@mediapipe/face_mesh'

export class EmotionDetectionService {
  constructor() {
    this.isDetecting = false
    this.detectionInterval = null
    this.callback = null
    this.videoElement = null
    this.faceDetection = null
    this.faceMesh = null
    
    // Emotion buffer: stores { timestamp, emotion } for last 8 seconds
    this.emotionBuffer = []
    this.bufferDuration = 8000 // 8 seconds in milliseconds
    
    // Background change interval
    this.backgroundChangeInterval = null
    this.backgroundChangeCallback = null
    this.backgroundChangeDuration = 8000 // 8 seconds
  }

  /**
   * Initialize MediaPipe Face Detection and Face Mesh
   */
  async initialize() {
    try {
      // Initialize Face Detection
      this.faceDetection = new FaceDetection({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`
        }
      })

      this.faceDetection.setOptions({
        modelSelection: 0, // 0 for short-range, 1 for full-range
        minDetectionConfidence: 0.5
      })

      // Initialize Face Mesh for more detailed analysis
      this.faceMesh = new FaceMesh({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
        }
      })

      this.faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      })

      console.log('✅ MediaPipe Face Detection initialized')
    } catch (err) {
      console.error('Error initializing MediaPipe:', err)
      throw err
    }
  }

  /**
   * Start emotion detection from video stream
   * @param {HTMLVideoElement} videoElement - Video element with camera stream
   * @param {Function} onEmotionDetected - Callback with emotion value (-5 to +5)
   * @param {Function} onBackgroundChange - Callback when background should change (every 8 seconds)
   * @param {number} interval - Detection interval in ms (default: 1000ms = 1 second)
   */
  async start(videoElement, onEmotionDetected, onBackgroundChange, interval = 1000) {
    if (this.isDetecting) {
      console.warn('Emotion detection already running')
      return
    }

    // Initialize MediaPipe if not already done
    if (!this.faceDetection || !this.faceMesh) {
      await this.initialize()
    }

    this.videoElement = videoElement
    this.callback = onEmotionDetected
    this.backgroundChangeCallback = onBackgroundChange
    this.isDetecting = true

    // Set up Face Mesh callback
    this.faceMesh.onResults((results) => {
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const emotion = this.analyzeFacialExpression(results.multiFaceLandmarks[0])
        const timestamp = Date.now()
        
        // Add to buffer
        this.emotionBuffer.push({ timestamp, emotion })
        
        // Remove old entries (older than 8 seconds)
        const cutoff = timestamp - this.bufferDuration
        this.emotionBuffer = this.emotionBuffer.filter(entry => entry.timestamp > cutoff)
        
        // Call callback with current emotion
        if (this.callback) {
          this.callback(emotion)
        }
      } else {
        // No face detected - default to neutral
        if (this.callback) {
          this.callback(0)
        }
      }
    })

    // Process video frames
    this.detectionInterval = setInterval(async () => {
      if (videoElement && videoElement.readyState >= videoElement.HAVE_ENOUGH_DATA) {
        try {
          await this.faceMesh.send({ image: videoElement })
        } catch (err) {
          console.error('Error processing frame:', err)
        }
      }
    }, interval)

    // Start background change timer (every 8 seconds)
    this.startBackgroundChangeTimer()

    console.log('🎭 Emotion detection started with MediaPipe')
  }

  /**
   * Start background change timer (every 8 seconds)
   */
  startBackgroundChangeTimer() {
    // Clear existing timer
    if (this.backgroundChangeInterval) {
      clearInterval(this.backgroundChangeInterval)
    }

    // Change background immediately on start (neutral)
    if (this.backgroundChangeCallback) {
      console.log('🎨 Setting initial neutral background')
      this.backgroundChangeCallback(0) // Start with neutral
    }

    // Then change every 8 seconds
    this.backgroundChangeInterval = setInterval(() => {
      const calculatedScore = this.calculateWeightedScore()
      console.log(`🎨 8-second timer: calculated score = ${calculatedScore}, buffer size = ${this.emotionBuffer.length}`)
      if (this.backgroundChangeCallback) {
        this.backgroundChangeCallback(calculatedScore)
      } else {
        console.warn('⚠️ Background change callback not set!')
      }
    }, this.backgroundChangeDuration)
  }

  /**
   * Calculate weighted score from last 3 seconds of the 8-second window
   * More recent seconds have more weight
   */
  calculateWeightedScore() {
    if (this.emotionBuffer.length === 0) {
      return 0 // Neutral if no data
    }

    const now = Date.now()
    const threeSecondsAgo = now - 3000 // Last 3 seconds
    const eightSecondsAgo = now - 8000 // Last 8 seconds

    // Filter to last 3 seconds (within the 8-second window)
    const lastThreeSeconds = this.emotionBuffer.filter(
      entry => entry.timestamp >= threeSecondsAgo && entry.timestamp >= eightSecondsAgo
    )

    if (lastThreeSeconds.length === 0) {
      // If no data in last 3 seconds, use all data from last 8 seconds
      const allData = this.emotionBuffer.filter(entry => entry.timestamp >= eightSecondsAgo)
      if (allData.length === 0) return 0
      
      // Simple average if no recent data
      const sum = allData.reduce((acc, entry) => acc + entry.emotion, 0)
      return Math.round(sum / allData.length)
    }

    // Weighted calculation: more recent = more weight
    // 8th second (most recent) = weight 3
    // 7th second = weight 2
    // 6th second = weight 1
    let weightedSum = 0
    let totalWeight = 0

    // Sort by timestamp (newest first)
    lastThreeSeconds.sort((a, b) => b.timestamp - a.timestamp)

    lastThreeSeconds.forEach((entry, index) => {
      const weight = 3 - index // 3, 2, 1 for most recent to oldest
      weightedSum += entry.emotion * weight
      totalWeight += weight
    })

    const calculatedScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0
    
    // Clamp to -5 to +5 range
    return Math.max(-5, Math.min(5, calculatedScore))
  }

  /**
   * Analyze facial expression from face landmarks
   * Returns emotion score from -5 (sad) to +5 (happy)
   */
  analyzeFacialExpression(landmarks) {
    if (!landmarks || landmarks.length < 468) {
      return 0 // Neutral if insufficient landmarks
    }

    // Key landmark indices for emotion analysis
    // Based on MediaPipe Face Mesh 468-point model
    const leftEyeTop = landmarks[159]
    const leftEyeBottom = landmarks[145]
    const rightEyeTop = landmarks[386]
    const rightEyeBottom = landmarks[374]
    const mouthLeft = landmarks[61]
    const mouthRight = landmarks[291]
    const mouthTop = landmarks[13]
    const mouthBottom = landmarks[14]
    const leftEyebrow = landmarks[107]
    const rightEyebrow = landmarks[336]
    const noseTip = landmarks[4]

    // Calculate eye opening (happy = more open, sad = less open)
    const leftEyeOpen = Math.abs(leftEyeTop.y - leftEyeBottom.y)
    const rightEyeOpen = Math.abs(rightEyeTop.y - rightEyeBottom.y)
    const avgEyeOpen = (leftEyeOpen + rightEyeOpen) / 2

    // Calculate mouth opening and position
    const mouthWidth = Math.abs(mouthRight.x - mouthLeft.x)
    const mouthHeight = Math.abs(mouthTop.y - mouthBottom.y)
    const mouthOpenRatio = mouthHeight / mouthWidth

    // Calculate eyebrow position (raised = happy, lowered = sad)
    const leftEyebrowHeight = leftEyebrow.y
    const rightEyebrowHeight = rightEyebrow.y
    const noseHeight = noseTip.y
    const avgEyebrowHeight = (leftEyebrowHeight + rightEyebrowHeight) / 2
    const eyebrowPosition = avgEyebrowHeight - noseHeight

    // Calculate mouth corners position (upturned = happy, downturned = sad)
    const mouthCenterY = (mouthTop.y + mouthBottom.y) / 2
    const leftMouthCornerY = landmarks[61].y
    const rightMouthCornerY = landmarks[291].y
    const avgMouthCornerY = (leftMouthCornerY + rightMouthCornerY) / 2
    const mouthCurve = mouthCenterY - avgMouthCornerY

    // Combine features to determine emotion
    // Positive values indicate happiness, negative indicate sadness
    let emotionScore = 0

    // Eye opening contributes to happiness
    if (avgEyeOpen > 0.02) emotionScore += 1
    else if (avgEyeOpen < 0.01) emotionScore -= 1

    // Mouth opening (smile = wider)
    if (mouthOpenRatio > 0.3) emotionScore += 2 // Big smile
    else if (mouthOpenRatio > 0.15) emotionScore += 1 // Small smile
    else if (mouthOpenRatio < 0.1) emotionScore -= 1 // Closed/frown

    // Mouth curve (upturned = happy, downturned = sad)
    if (mouthCurve > 0.01) emotionScore += 2 // Upturned corners
    else if (mouthCurve < -0.01) emotionScore -= 2 // Downturned corners

    // Eyebrow position
    if (eyebrowPosition < -0.02) emotionScore += 1 // Raised (surprise/happy)
    else if (eyebrowPosition > 0.02) emotionScore -= 1 // Lowered (sad/angry)

    // Clamp to -5 to +5 range
    emotionScore = Math.max(-5, Math.min(5, emotionScore))

    return emotionScore
  }

  /**
   * Stop emotion detection
   */
  stop() {
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval)
      this.detectionInterval = null
    }

    if (this.backgroundChangeInterval) {
      clearInterval(this.backgroundChangeInterval)
      this.backgroundChangeInterval = null
    }

    this.isDetecting = false
    this.videoElement = null
    this.callback = null
    this.backgroundChangeCallback = null
    this.emotionBuffer = []

    if (this.faceMesh) {
      try {
        this.faceMesh.close()
      } catch (err) {
        console.error('Error closing Face Mesh:', err)
      }
    }

    if (this.faceDetection) {
      try {
        this.faceDetection.close()
      } catch (err) {
        console.error('Error closing Face Detection:', err)
      }
    }

    console.log('🎭 Emotion detection stopped')
  }

  /**
   * Get current emotion buffer (for debugging)
   */
  getEmotionBuffer() {
    return this.emotionBuffer
  }

  /**
   * Get calculated score (for debugging)
   */
  getCalculatedScore() {
    return this.calculateWeightedScore()
  }
}
