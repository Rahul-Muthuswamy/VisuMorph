import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import logo from '../../../assets/logo-modified.png'

const Hero = () => {
  const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }

  const orbVariants = {
    animate: {
      y: [0, -30, 0],
      x: [0, 20, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  }

  const buttonHover = {
    scale: 1.05,
    boxShadow: "0 0 30px rgba(107, 33, 168, 0.6), 0 0 60px rgba(59, 130, 246, 0.4)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-purple-blue opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
        style={{
          backgroundSize: '200% 200%',
        }}
      />

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl"
        variants={orbVariants}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        variants={orbVariants}
        animate="animate"
        transition={{
          duration: 10,
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"
        variants={orbVariants}
        animate="animate"
        transition={{
          duration: 12,
          delay: 2,
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Logo */}
        <motion.div
          variants={logoVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 flex justify-center"
        >
          <motion.img
            src={logo}
            alt="VisuMorph"
            className="h-24 md:h-32 lg:h-40 xl:h-48 w-auto"
            style={{
              filter: 'drop-shadow(0 0 25px rgba(107, 33, 168, 0.4)) drop-shadow(0 0 50px rgba(59, 130, 246, 0.25))',
            }}
          />
        </motion.div>

        {/* Subheading */}
        <motion.h2
          variants={itemVariants}
          className="text-2xl md:text-4xl font-semibold mb-4 text-gray-200"
        >
          Emotion-Aware Background Intelligence
        </motion.h2>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
        >
          Real-time visuals that respond to how you feel.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            className="px-8 py-4 bg-gradient-purple-blue rounded-full font-semibold text-lg glow-gradient"
            whileHover={buttonHover}
            whileTap={{ scale: 0.95 }}
          >
            Watch Demo
          </motion.button>
          <motion.button
            className="px-8 py-4 glass rounded-full font-semibold text-lg border-2 border-purple-400/50"
            whileHover={buttonHover}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/signin')}
          >
            Get Started
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            className="w-1.5 h-1.5 bg-white/50 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </section>
  )
}

export default Hero

