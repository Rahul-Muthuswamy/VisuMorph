const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const signup = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to sign up')
    }

    const data = await response.json()
    localStorage.setItem('user_id', data.user_id)
    return data
  } catch (error) {
    console.error('Error signing up:', error)
    throw error
  }
}

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to login')
    }

    const data = await response.json()
    localStorage.setItem('user_id', data.user_id)
    return data
  } catch (error) {
    console.error('Error logging in:', error)
    throw error
  }
}

export const getUserId = () => {
  return localStorage.getItem('user_id')
}

export const logout = () => {
  localStorage.removeItem('user_id')
}


