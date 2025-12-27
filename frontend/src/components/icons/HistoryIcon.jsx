import React from 'react'

const HistoryIcon = ({ className = "w-24 h-24" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stack of video frames */}
      <rect
        x="20"
        y="25"
        width="60"
        height="40"
        rx="3"
        fill="url(#historyGradient1)"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.9"
        transform="rotate(-2 50 45)"
      />
      <rect
        x="22"
        y="30"
        width="60"
        height="40"
        rx="3"
        fill="url(#historyGradient2)"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.8"
        transform="rotate(-1 52 50)"
      />
      <rect
        x="24"
        y="35"
        width="60"
        height="40"
        rx="3"
        fill="url(#historyGradient3)"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.7"
      />
      {/* Play icons on frames */}
      <path
        d="M 42 47 L 42 58 L 52 52.5 Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M 44 52 L 44 63 L 54 57.5 Z"
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M 46 57 L 46 68 L 56 62.5 Z"
        fill="currentColor"
        opacity="0.5"
      />
      {/* Clock/time indicator */}
      <circle
        cx="70"
        cy="20"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.7"
      />
      <path
        d="M 70 20 L 70 16 M 70 20 L 74 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <defs>
        <linearGradient id="historyGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="historyGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="historyGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.4" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default HistoryIcon

