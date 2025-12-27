import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'

const FinalCTA = () => {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const upcomingFeatures = [
    'Real-time emotion detection via webcam',
    'Dynamic background generation with AI',
    'Smooth transition animations',
    'OBS and Streamlabs integration',
    'Custom emotion sensitivity controls',
    'Background library and caching system',
  ]

  const FeatureItem = ({ feature, delay = 0 }) => (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.6, -0.05, 0.01, 0.99],
      }}
      className="flex items-center gap-3 text-gray-300"
    >
      <span className="text-purple-400">▹</span>
      <span>{feature}</span>
    </motion.li>
  )

  return (
    <section ref={ref} className="relative py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{
            duration: 1,
            ease: [0.6, -0.05, 0.01, 0.99],
          }}
          className="glass rounded-3xl p-8 md:p-12 lg:p-16 glow-gradient"
        >
          {/* Upcoming Features Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Upcoming Features
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingFeatures.map((feature, index) => (
                <FeatureItem key={index} feature={feature} delay={0.3 + index * 0.1} />
              ))}
            </ul>
          </motion.div>

          {/* Copyright Information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pt-8 border-t border-white/20 text-center"
          >
            <p className="text-gray-400 text-sm md:text-base mb-2">
              © 2024 VisuMorph. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs md:text-sm">
              Emotion-Aware Background Intelligence Platform
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default FinalCTA

