import React from 'react'
import { motion } from 'framer-motion'

const PreviewCard = ({ emotionValue }) => {
  // Determine gradient based on emotion value
  const getGradient = () => {
    if (emotionValue > 0) {
      return 'from-yellow-400 via-green-400 to-emerald-400'
    } else if (emotionValue < 0) {
      return 'from-blue-400 via-purple-400 to-indigo-400'
    } else {
      return 'from-gray-400 via-gray-500 to-gray-600'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass rounded-2xl p-6 md:p-8 glow-gradient overflow-hidden"
    >
      <h3 className="text-xl md:text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
        Live Emotion Preview (Demo)
      </h3>

      {/* Preview Area */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm">
        {/* Animated Background Gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-30`}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        />

        {/* Silhouette Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/20"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Webcam Placeholder Text */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm md:text-base">
          Webcam Preview (Demo Mode)
        </div>
      </div>

      {/* Emotion Value Display */}
      <motion.div
        className="mt-4 text-center"
        key={emotionValue}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-gray-400 text-sm">Current Emotion: </span>
        <span className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          {emotionValue > 0 ? '+' : ''}{emotionValue}
        </span>
      </motion.div>
    </motion.div>
  )
}

export default PreviewCard



