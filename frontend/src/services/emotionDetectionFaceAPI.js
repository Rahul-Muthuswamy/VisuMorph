/**
 * Emotion Detection Service using face-api.js
 * Uses pretrained models for accurate emotion classification
 * Detects 7 emotions: happy, sad, angry, fearful, surprised, disgusted, neutral
 */

import * as faceapi from 'face-api.js'

export class EmotionDetectionServiceFaceAPI {
  constructor() {
    this.isDetecting = false
    this.isInitialized = false
    this.detectionInterval = null
    this.callback = null
    this.videoElement = null
    
    // Emotion buffer: stores { timestamp, emotion } for last 8 seconds
    this.emotionBuffer = []
    this.bufferDuration = 8000 // 8 seconds in milliseconds
    
    // Background change interval
    this.backgroundChangeInterval = null
    this.backgroundChangeCallback = null
    this.backgroundChangeDuration = 8000 // 8 seconds
    
    // Models path (will be loaded from public folder)
    // Use absolute path to ensure it bypasses React Router
    this.modelsPath = window.location.origin + '/models'
  }

  /**
   * Load face-api.js models
   */
  async loadModels() {
    if (this.isInitialized) {
      return
    }

    try {
      console.log('📦 Loading face-api.js models from:', this.modelsPath)
      console.log('   Full path should be: http://localhost:3000/models/')
      
      // Load all required models with error handling for each
      console.log('   Loading tinyFaceDetector...')
      await faceapi.nets.tinyFaceDetector.loadFromUri(this.modelsPath)
      console.log('   ✅ tinyFaceDetector loaded')
      
      console.log('   Loading faceLandmark68Net...')
      await faceapi.nets.faceLandmark68Net.loadFromUri(this.modelsPath)
      console.log('   ✅ faceLandmark68Net loaded')
      
      // NOTE: faceRecognitionNet is NOT needed for emotion detection
      // It's only for face recognition (identifying who someone is)
      // Removing it fixes the tensor shape mismatch error
      // console.log('   Loading faceRecognitionNet...')
      // await faceapi.nets.faceRecognitionNet.loadFromUri(this.modelsPath)
      // console.log('   ✅ faceRecognitionNet loaded')
      
      console.log('   Loading faceExpressionNet...')
      await faceapi.nets.faceExpressionNet.loadFromUri(this.modelsPath)
      console.log('   ✅ faceExpressionNet loaded')
      
      this.isInitialized = true
      console.log('✅✅✅ All face-api.js models loaded successfully! ✅✅✅')
    } catch (err) {
      console.error('❌ Error loading face-api.js models:', err)
      console.error('   Error details:', err.message)
      console.error('   Models path:', this.modelsPath)
      console.error('   Make sure:')
      console.error('   1. Models are in frontend/public/models/ folder')
      console.error('   2. Dev server is running (npm run dev)')
      console.error('   3. Browser cache is cleared (Ctrl+Shift+R or Ctrl+F5)')
      console.error('   4. Models are accessible at http://localhost:3000/models/')
      throw new Error('Failed to load face-api.js models. Check console for details.')
    }
  }

  /**
   * Convert face-api.js emotion to our score system (-5 to +5)
   * face-api.js returns: { happy, sad, angry, fearful, surprised, disgusted, neutral }
   */
  emotionToScore(expressions) {
    if (!expressions) {
      return 0 // Neutral if no expressions detected
    }

    // Get the emotion with highest confidence
    const emotions = {
      happy: expressions.happy || 0,
      sad: expressions.sad || 0,
      angry: expressions.angry || 0,
      fearful: expressions.fearful || 0,
      surprised: expressions.surprised || 0,
      disgusted: expressions.disgusted || 0,
      neutral: expressions.neutral || 0
    }

    // Find dominant emotion
    const dominantEmotion = Object.entries(emotions).reduce((a, b) => 
      emotions[a[0]] > emotions[b[0]] ? a : b
    )

    const [emotionName, confidence] = dominantEmotion

    // Map to our -5 to +5 scale
    // Positive emotions (happy, surprised) → positive scores
    // Negative emotions (sad, angry, fearful, disgusted) → negative scores
    // Neutral → 0
    
    let score = 0
    const confidenceMultiplier = confidence // Use confidence as multiplier (0-1)

    switch (emotionName) {
      case 'happy':
        // Happy: +1 to +5 based on confidence
        score = Math.round(1 + (confidence * 4)) // 1 to 5
        break
      case 'surprised':
        // Surprised (positive): +1 to +3
        score = Math.round(1 + (confidence * 2)) // 1 to 3
        break
      case 'sad':
        // Sad: -1 to -5 based on confidence
        score = Math.round(-1 - (confidence * 4)) // -1 to -5
        break
      case 'angry':
        // Angry: -2 to -5
        score = Math.round(-2 - (confidence * 3)) // -2 to -5
        break
      case 'fearful':
        // Fearful: -2 to -4
        score = Math.round(-2 - (confidence * 2)) // -2 to -4
        break
      case 'disgusted':
        // Disgusted: -1 to -3
        score = Math.round(-1 - (confidence * 2)) // -1 to -3
        break
      case 'neutral':
      default:
        score = 0
        break
    }

    // Clamp to -5 to +5 range
    return Math.max(-5, Math.min(5, score))
  }

  /**
   * Get emotion name from face-api.js expressions
   * Returns the dominant emotion name
   */
  getEmotionName(expressions) {
    if (!expressions) {
      return 'Neutral'
    }

    const emotions = {
      happy: expressions.happy || 0,
      sad: expressions.sad || 0,
      angry: expressions.angry || 0,
      fearful: expressions.fearful || 0,
      surprised: expressions.surprised || 0,
      disgusted: expressions.disgusted || 0,
      neutral: expressions.neutral || 0
    }

    // Find dominant emotion
    const dominantEmotion = Object.entries(emotions).reduce((a, b) => 
      emotions[a[0]] > emotions[b[0]] ? a : b
    )

    const [emotionName] = dominantEmotion

    // Capitalize first letter
    return emotionName.charAt(0).toUpperCase() + emotionName.slice(1)
  }

  /**
   * Start emotion detection from video stream
   * @param {HTMLVideoElement} videoElement - Video element with camera stream
   * @param {Function} onEmotionDetected - Callback with emotion value (-5 to +5)
   * @param {Function} onBackgroundChange - Callback when background should change (every 8 seconds)
   * @param {number} interval - Detection interval in ms (default: 1000ms = 1 second)
   */
  async start(videoElement, onEmotionDetected, onBackgroundChange, interval = 1000) {
    console.log('🎬 EmotionDetectionService.start() called')
    console.log('   videoElement:', videoElement)
    console.log('   onEmotionDetected:', onEmotionDetected)
    console.log('   onBackgroundChange:', onBackgroundChange)
    console.log('   interval:', interval)
    console.log('   isDetecting (before):', this.isDetecting)
    
    if (this.isDetecting) {
      console.warn('⚠️ Emotion detection already running - stopping previous instance')
      this.stop()
    }

    // Load models if not already loaded
    if (!this.isInitialized) {
      console.log('📦 Models not loaded yet, loading now...')
      try {
        await this.loadModels()
        console.log('✅ Models loaded successfully')
      } catch (err) {
        console.error('❌ CRITICAL: Failed to load models:', err)
        throw err
      }
    } else {
      console.log('✅ Models already loaded')
    }

    if (!videoElement) {
      console.error('❌ CRITICAL: videoElement is null!')
      throw new Error('Video element is required for emotion detection')
    }
    
    if (!onEmotionDetected) {
      console.error('❌ CRITICAL: onEmotionDetected callback is null!')
      throw new Error('Emotion detected callback is required')
    }

    this.videoElement = videoElement
    this.callback = onEmotionDetected
    this.backgroundChangeCallback = onBackgroundChange
    this.isDetecting = true
    
    console.log('✅ Service configured, starting detection interval...')
    console.log(`   Will detect emotions every ${interval}ms (${1000/interval} times per second)`)

    // Process video frames
    console.log('🔄 Creating setInterval for continuous detection...')
    this.detectionCount = 0 // Initialize counter
    this.detectionInterval = setInterval(async () => {
      this.detectionCount++
      
      // Log first 3 detections, then every 10th to show it's running
      if (this.detectionCount <= 3 || this.detectionCount % 10 === 0) {
        console.log(`⏰ Detection tick #${this.detectionCount} - processing frame...`)
      }
      
      if (!videoElement) {
        console.error('❌ Video element is null in emotion detection')
        return
      }
      
      if (videoElement.readyState < videoElement.HAVE_ENOUGH_DATA) {
        if (this.detectionCount <= 3) {
          console.warn(`⚠️ Video not ready yet. ReadyState: ${videoElement.readyState} (need ${videoElement.HAVE_ENOUGH_DATA})`)
        }
        return
      }
      
      try {
        // Log video element state for debugging (first time and every 10 detections)
        if (this.detectionCount === undefined) {
          this.detectionCount = 0
          console.log(`🎬 Starting continuous emotion detection... Video: ${videoElement.videoWidth}x${videoElement.videoHeight}`)
        }
        this.detectionCount++
        
        // Detect faces and expressions - THIS RUNS EVERY SECOND
        const detections = await faceapi
          .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()

        if (detections && detections.length > 0) {
          // Use the first detected face
          const face = detections[0]
          const expressions = face.expressions
          const emotionScore = this.emotionToScore(expressions)
          const emotionName = this.getEmotionName(expressions)
          const timestamp = Date.now()
          
          // Log detection details every time (for debugging)
          console.log(`🎭 [${this.detectionCount}] Detected emotion: ${emotionName} (score: ${emotionScore})`)
          console.log(`   Expressions:`, {
            happy: expressions.happy?.toFixed(2),
            sad: expressions.sad?.toFixed(2),
            angry: expressions.angry?.toFixed(2),
            neutral: expressions.neutral?.toFixed(2),
            surprised: expressions.surprised?.toFixed(2)
          })
          
          // Add to buffer
          this.emotionBuffer.push({ timestamp, emotion: emotionScore, emotionName })
          
          // Remove old entries (older than 8 seconds)
          const cutoff = timestamp - this.bufferDuration
          this.emotionBuffer = this.emotionBuffer.filter(entry => entry.timestamp > cutoff)
          
          // Call callback with current emotion (score and name) - THIS UPDATES THE TAG
          if (this.callback) {
            this.callback(emotionScore, emotionName)
          } else {
            console.error('❌ Emotion callback is null! Cannot update emotion tag!')
          }
        } else {
          // No face detected - default to neutral
          if (this.detectionCount % 5 === 0) { // Log every 5th "no face" to avoid spam
            console.log(`👤 [${this.detectionCount}] No face detected - using Neutral`)
          }
          if (this.callback) {
            this.callback(0, 'Neutral')
          }
        }
      } catch (err) {
        console.error('❌ Error processing frame in emotion detection:', err)
        console.error('Error details:', err.message, err.stack)
        // Continue detection even if one frame fails
      }
    }, interval)
    
    console.log('✅ Detection interval created:', this.detectionInterval)
    console.log('   Interval ID:', this.detectionInterval)

    // Start background change timer (every 8 seconds)
    this.startBackgroundChangeTimer()

    console.log('🎭 ✅✅✅ Emotion detection STARTED successfully with face-api.js ✅✅✅')
    console.log('   Detection will run every', interval, 'ms')
    console.log('   First detection should happen in', interval, 'ms')
    console.log('   ⏰ Watch for detection logs starting in 1 second...')
    
    // Force first detection after a short delay to verify it's working
    setTimeout(() => {
      console.log('🔍 First detection check - interval should be running now')
      if (this.detectionInterval) {
        console.log('✅ Detection interval is active and running!')
      } else {
        console.error('❌ Detection interval is NULL - something went wrong!')
      }
    }, 1500)
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

