import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'

const FeatureCard = ({ title, description, delay = 0 }) => {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.6, -0.05, 0.01, 0.99],
      }}
      whileHover={{
        y: -10,
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
      className="glass rounded-2xl p-8 h-full glow-purple hover:glow-gradient"
    >
      <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
        {title}
      </h3>
      <p className="text-gray-300 leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}

const Features = () => {
  const features = [
    {
      title: 'Emotion-Aware',
      description: 'Advanced emotion detection that understands your feelings in real-time, creating a seamless connection between your inner state and your visual environment.',
    },
    {
      title: 'Real-Time & Smooth',
      description: 'Lightning-fast transitions with zero lag. Experience buttery-smooth background changes that feel natural and reduce eye strain.',
    },
    {
      title: 'AI-Generated Visuals',
      description: 'Powered by cutting-edge AI that generates stunning, personalized backgrounds tailored to your emotional state and preferences.',
    },
  ]

  return (
    <section className="py-32 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400"
        >
          Powerful Features
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              delay={index * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features




