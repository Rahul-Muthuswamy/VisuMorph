import React from 'react'

const CreateVideoIcon = ({ className = "w-20 h-20" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Camera body */}
      <rect
        x="20"
        y="30"
        width="60"
        height="45"
        rx="5"
        fill="url(#createGradient)"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.9"
      />
      {/* Lens */}
      <circle
        cx="50"
        cy="52.5"
        r="15"
        fill="url(#createGradient)"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.8"
      />
      <circle
        cx="50"
        cy="52.5"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.6"
      />
      {/* Viewfinder */}
      <rect
        x="35"
        y="20"
        width="30"
        height="15"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.7"
      />
      {/* Record indicator */}
      <circle
        cx="70"
        cy="35"
        r="5"
        fill="#ef4444"
        opacity="0.9"
      >
        <animate
          attributeName="opacity"
          values="0.9;0.3;0.9"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      {/* Plus icon for "new" */}
      <path
        d="M 50 45 L 50 60 M 42.5 52.5 L 57.5 52.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.8"
      />
      <defs>
        <linearGradient id="createGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default CreateVideoIcon



