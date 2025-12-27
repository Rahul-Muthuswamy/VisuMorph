import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AuthCard from '../components/auth/AuthCard'
import Input from '../components/auth/Input'
import GradientButton from '../components/auth/GradientButton'

const SignUp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // UI only - no real authentication
    console.log('Sign up attempt:', formData)
    // Navigate to home page
    navigate('/home')
  }

  return (
    <AuthCard
      title="Create Your Account"
      subtitle="Start your emotion-aware experience"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="text"
          name="name"
          label="Name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Input
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <GradientButton type="submit">
          Create Account
        </GradientButton>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-6"
        >
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </form>
    </AuthCard>
  )
}

export default SignUp

