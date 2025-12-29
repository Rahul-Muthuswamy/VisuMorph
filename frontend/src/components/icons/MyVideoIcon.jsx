import React from 'react'

const MyVideoIcon = ({ className = "w-20 h-20" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Video frame */}
      <rect
        x="15"
        y="20"
        width="70"
        height="50"
        rx="4"
        fill="url(#myVideoGradient)"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.9"
      />
      {/* Play button */}
      <path
        d="M 38 32 L 38 58 L 58 45 Z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* Waveform lines (representing audio/video) */}
      <path
        d="M 20 75 Q 25 70, 30 75 T 40 75"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M 45 75 Q 50 65, 55 75 T 65 75"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M 70 75 Q 75 70, 80 75"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      {/* Time indicator */}
      <circle
        cx="75"
        cy="25"
        r="4"
        fill="#3b82f6"
        opacity="0.8"
      />
      <defs>
        <linearGradient id="myVideoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default MyVideoIcon




