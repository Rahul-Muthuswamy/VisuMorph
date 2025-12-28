import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../../../assets/logo-modified.png'
import CreateVideoIcon from '../components/icons/CreateVideoIcon'
import MyVideoIcon from '../components/icons/MyVideoIcon'
import HistoryIcon from '../components/icons/HistoryIcon'

const Home = () => {
  const navigate = useNavigate()
  const [hasActiveVideo, setHasActiveVideo] = useState(false)
  const [videoCount, setVideoCount] = useState(12) // Mock data

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
    // Navigate to video creation/recording page
    navigate('/recording')
  }

  const handleMyVideo = () => {
    // Navigate to current video page
    console.log('Navigate to my video')
    // navigate('/my-video')
  }

  const handleHistory = () => {
    // Navigate to video history page
    console.log('Navigate to history')
    // navigate('/history')
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
              Dashboard
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
            className="glass rounded-2xl shadow-lg p-6 md:p-10 lg:p-12 glow-gradient border-2 border-white/10"
          >
            <div className="space-y-6 md:space-y-8">
              {/* Top Row - Two Equal Cards Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Left Card - Create a New Video */}
                <motion.div
                  variants={itemVariants}
                  onClick={handleCreateVideo}
                  className="relative rounded-xl cursor-pointer flex flex-col items-center justify-center py-12 md:py-16 lg:py-20 min-h-[250px] md:min-h-[300px] overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(167, 139, 250, 0.1) 100%)',
                    border: '2px solid rgba(139, 92, 246, 0.3)',
                    boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)',
                  }}
                  whileHover={{
                    ...cardHover,
                    boxShadow: '0 0 40px rgba(139, 92, 246, 0.4), 0 0 80px rgba(167, 139, 250, 0.3)',
                    borderColor: 'rgba(139, 92, 246, 0.5)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-violet-500/10 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="relative z-10 flex flex-col items-center justify-center"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="text-purple-400 mb-4 md:mb-6"
                    >
                      <CreateVideoIcon className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28" />
                    </motion.div>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-300 mb-2 text-center">
                      Create a New Video
                    </h2>
                    <p className="text-sm md:text-base text-purple-200/70 text-center max-w-xs">
                      Start recording with emotion-aware background intelligence
                    </p>
                  </motion.div>
                </motion.div>

                {/* Right Card - My Video */}
                <motion.div
                  variants={itemVariants}
                  onClick={handleMyVideo}
                  className="relative rounded-xl cursor-pointer flex flex-col items-center justify-center py-12 md:py-16 lg:py-20 min-h-[250px] md:min-h-[300px] overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(167, 139, 250, 0.1) 100%)',
                    border: '2px solid rgba(139, 92, 246, 0.3)',
                    boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)',
                  }}
                  whileHover={{
                    ...cardHover,
                    boxShadow: '0 0 40px rgba(139, 92, 246, 0.4), 0 0 80px rgba(167, 139, 250, 0.3)',
                    borderColor: 'rgba(139, 92, 246, 0.5)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-violet-500/10 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="relative z-10 flex flex-col items-center justify-center"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.5,
                      }}
                      className="text-purple-400 mb-4 md:mb-6"
                    >
                      <MyVideoIcon className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28" />
                    </motion.div>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-300 mb-2 text-center">
                      My Video
                    </h2>
                    <p className="text-sm md:text-base text-purple-200/70 text-center max-w-xs">
                      {hasActiveVideo ? 'Continue your current recording' : 'No active video'}
                    </p>
                    {hasActiveVideo && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-3 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30"
                      >
                        <span className="text-xs text-purple-300 font-medium">Active</span>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              </div>

              {/* Bottom Row - Full Width History Card */}
              <motion.div
                variants={itemVariants}
                onClick={handleHistory}
                className="relative rounded-xl cursor-pointer flex flex-col items-center justify-center py-12 md:py-16 lg:py-20 min-h-[180px] md:min-h-[220px] overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(167, 139, 250, 0.1) 100%)',
                  border: '2px solid rgba(139, 92, 246, 0.3)',
                  boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)',
                }}
                whileHover={{
                  ...cardHover,
                  boxShadow: '0 0 40px rgba(139, 92, 246, 0.4), 0 0 80px rgba(167, 139, 250, 0.3)',
                  borderColor: 'rgba(139, 92, 246, 0.5)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-violet-500/10 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="relative z-10 flex flex-col items-center justify-center"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0.6,
                    }}
                    className="text-purple-400 mb-4 md:mb-6"
                  >
                    <HistoryIcon className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32" />
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-purple-300 mb-2 text-center">
                    History of Videos
                  </h2>
                  <p className="text-base md:text-lg text-purple-200/70 text-center mb-3">
                    Browse your past recordings with emotion data
                  </p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="px-6 py-2 rounded-full bg-purple-500/20 border border-purple-400/30"
                  >
                    <span className="text-sm md:text-base text-purple-300 font-semibold">
                      {videoCount} videos saved
                    </span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home
