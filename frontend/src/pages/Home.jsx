import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../../../assets/logo-modified.png'

const Home = () => {
  const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  const cardHover = {
    scale: 1.02,
    y: -5,
    boxShadow: '0 0 30px rgba(107, 33, 168, 0.4), 0 0 60px rgba(59, 130, 246, 0.3)',
    borderColor: 'rgba(168, 85, 247, 0.5)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
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
        ease: 'easeInOut',
      },
    },
  }

  const handleCreateVideo = () => {
    // UI only - no real functionality
    console.log('Create a New Video clicked')
  }

  const handleMyVideo = () => {
    // UI only - no real functionality
    console.log('My Video clicked')
  }

  const handleHistory = () => {
    // UI only - no real functionality
    console.log('History of Videos clicked')
  }

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-purple-blue opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
        style={{
          backgroundSize: '200% 200%',
        }}
      />

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
        variants={orbVariants}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        variants={orbVariants}
        animate="animate"
        transition={{
          duration: 10,
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-400/15 rounded-full blur-3xl"
        variants={orbVariants}
        animate="animate"
        transition={{
          duration: 12,
          delay: 2,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 p-6 md:p-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Logo and Title Section */}
          <motion.div
            variants={itemVariants}
            className="mb-8 flex items-center gap-4"
          >
            <motion.img
              src={logo}
              alt="VisuMorph"
              className="h-12 md:h-16 w-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.6, -0.05, 0.01, 0.99],
              }}
              style={{
                filter: 'drop-shadow(0 0 20px rgba(107, 33, 168, 0.5)) drop-shadow(0 0 40px rgba(59, 130, 246, 0.3))',
              }}
              whileHover={{ scale: 1.05 }}
            />
            <motion.h1
              variants={itemVariants}
              className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400"
              style={{
                backgroundSize: '200% auto',
              }}
              animate={{
                backgroundPosition: ['0% center', '200% center'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'linear',
              }}
            >
              Home Page
            </motion.h1>
          </motion.div>

          {/* Main Container */}
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.6, -0.05, 0.01, 0.99],
            }}
            className="glass rounded-2xl shadow-lg p-6 md:p-8 glow-gradient"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[500px]">
              {/* Large Left Card - Create a New Video */}
              <motion.div
                variants={itemVariants}
                onClick={handleCreateVideo}
                className="lg:col-span-2 glass rounded-xl border border-white/20 cursor-pointer flex flex-col items-center justify-center relative overflow-hidden"
                whileHover={cardHover}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated background gradient on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="relative z-10 flex flex-col items-center justify-center"
                >
                  <motion.div
                    className="w-12 h-12 md:w-16 md:h-16 border-2 border-purple-400/50 rounded mb-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  <p className="text-lg md:text-xl font-medium text-gray-200">
                    Create a New Video
                  </p>
                </motion.div>
              </motion.div>

              {/* Right Column - Two Stacked Cards */}
              <div className="flex flex-col gap-6">
                {/* Top Card - My Video */}
                <motion.div
                  variants={itemVariants}
                  onClick={handleMyVideo}
                  className="glass rounded-xl border border-white/20 cursor-pointer flex flex-col items-center justify-center py-8 relative overflow-hidden"
                  whileHover={cardHover}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Animated background gradient on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="relative z-10 flex flex-col items-center justify-center"
                  >
                    <motion.div
                      className="w-10 h-10 md:w-12 md:h-12 border-2 border-purple-400/50 rounded mb-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.5,
                      }}
                    />
                    <p className="text-base md:text-lg font-medium text-gray-200">
                      My Video
                    </p>
                  </motion.div>
                </motion.div>

                {/* Bottom Card - History of Videos */}
                <motion.div
                  variants={itemVariants}
                  onClick={handleHistory}
                  className="glass rounded-xl border border-white/20 cursor-pointer flex flex-col items-center justify-center flex-1 relative overflow-hidden"
                  whileHover={cardHover}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Animated background gradient on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-base md:text-lg font-medium text-gray-200 relative z-10"
                  >
                    History of Videos
                  </motion.p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home
