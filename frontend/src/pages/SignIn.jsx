import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AuthCard from '../components/auth/AuthCard'
import Input from '../components/auth/Input'
import GradientButton from '../components/auth/GradientButton'
import { login } from '../services/auth'

const SignIn = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('') // Clear error on input change
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(formData.email, formData.password)
      // Navigate to home page on success
      navigate('/home')
    } catch (err) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to continue your experience"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div>
          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mt-2 text-right"
          >
            <Link
              to="#"
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              onClick={(e) => {
                e.preventDefault()
                console.log('Forgot password clicked')
              }}
            >
              Forgot password?
            </Link>
          </motion.div>
        </div>

        <GradientButton type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </GradientButton>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-6"
        >
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </form>
    </AuthCard>
  )
}

export default SignIn

