const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Create a new video recording session
 */
export const createSession = async (videoContext = 'general', dressColor = 'none') => {
  try {
    const response = await fetch(`${API_BASE_URL}/session/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_context: videoContext,
        dress_color: dressColor,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to create session')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating session:', error)
    throw error
  }
}

/**
 * Start a recording session
 */
export const startSession = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/session/${sessionId}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to start session')
    }

    return await response.json()
  } catch (error) {
    console.error('Error starting session:', error)
    throw error
  }
}

/**
 * Send emotion event to backend (Kafka)
 */
export const sendEmotion = async (sessionId, emotionValue) => {
  try {
    const response = await fetch(`${API_BASE_URL}/session/${sessionId}/emotion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emotion_value: emotionValue,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to send emotion')
    }

    return await response.json()
  } catch (error) {
    console.error('Error sending emotion:', error)
    throw error
  }
}

/**
 * Health check
 */
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`)
    return await response.json()
  } catch (error) {
    console.error('Error checking health:', error)
    throw error
  }
}


