import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import VisualFlow from '../components/VisualFlow'
import FinalCTA from '../components/FinalCTA'

function Landing() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <VisualFlow />
      <FinalCTA />
    </div>
  )
}

export default Landing

