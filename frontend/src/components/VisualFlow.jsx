import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'

const VisualFlow = () => {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-200px" })

  const waveVariants = {
    animate: {
      x: ['0%', '100%'],
      transition: {
        x: {
          duration: 20,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        },
      },
    },
  }

  return (
    <section ref={ref} className="relative py-32 px-4 overflow-hidden">
      {/* Animated Gradient Waves */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-20"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(107, 33, 168, 0.3), transparent)',
            width: '200%',
          }}
          variants={waveVariants}
          animate="animate"
        />
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-15"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
            width: '200%',
          }}
          variants={waveVariants}
          animate="animate"
          transition={{
            x: {
              duration: 25,
              delay: 2,
            },
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{
            duration: 1,
            ease: [0.6, -0.05, 0.01, 0.99],
          }}
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400"
            style={{
              backgroundSize: '200% auto',
            }}
            animate={{
              backgroundPosition: ['0% center', '200% center'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          >
            Designed for human perception,
          </motion.h2>
          <motion.p
            className="text-2xl md:text-3xl text-gray-300 font-light"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            not abrupt transitions.
          </motion.p>
        </motion.div>

        {/* Parallax Effect Elements */}
        <motion.div
          className="mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-32 glass rounded-lg"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default VisualFlow

