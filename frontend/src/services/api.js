const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  }
  
  const userId = localStorage.getItem('user_id')
  if (userId) {
    headers['X-USER-ID'] = userId
  }
  
  return headers
}

export const createSession = async (videoContext = 'general', dressColor = 'none') => {
  try {
    const response = await fetch(`${API_BASE_URL}/session/create`, {
      method: 'POST',
      headers: getHeaders(),
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

export const startSession = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/session/${sessionId}/start`, {
      method: 'POST',
      headers: getHeaders(),
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

export const sendEmotion = async (sessionId, emotionValue) => {
  try {
    const response = await fetch(`${API_BASE_URL}/session/${sessionId}/emotion`, {
      method: 'POST',
      headers: getHeaders(),
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

export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`)
    return await response.json()
  } catch (error) {
    console.error('Error checking health:', error)
    throw error
  }
}


