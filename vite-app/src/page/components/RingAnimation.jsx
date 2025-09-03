import React from 'react';

const RingAnimation = ({ size = 'large', className = '' }) => {
  const rings = [
    {
      size: 'w-96 h-96',
      color: 'border-blue-400',
      glow: 'shadow-blue-400/50',
      animation: 'animate-spin-slow',
      delay: 'animation-delay-0',
    },
    {
      size: 'w-80 h-80',
      color: 'border-purple-400',
      glow: 'shadow-purple-400/50',
      animation: 'animate-spin-reverse',
      delay: 'animation-delay-500',
    },
    {
      size: 'w-64 h-64',
      color: 'border-green-400',
      glow: 'shadow-green-400/50',
      animation: 'animate-spin-slow',
      delay: 'animation-delay-1000',
    },
    {
      size: 'w-48 h-48',
      color: 'border-red-400',
      glow: 'shadow-red-400/50',
      animation: 'animate-spin-reverse',
      delay: 'animation-delay-1500',
    },
    {
      size: 'w-32 h-32',
      color: 'border-yellow-400',
      glow: 'shadow-yellow-400/50',
      animation: 'animate-spin-slow',
      delay: 'animation-delay-2000',
    },
  ];

  return (
    <div className={`relative flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden ${className}`}>
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-gray-800 via-gray-900 to-black"></div>
      
      {/* Ring container with 3D perspective */}
      <div className="relative preserve-3d animate-float">
        {rings.map((ring, index) => (
          <div
            key={index}
            className={`
              absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
              ${ring.size}
              ${ring.color}
              ${ring.glow}
              ${ring.animation}
              ${ring.delay}
              border-4 rounded-full
              shadow-2xl
              animate-pulse-glow
              ring-3d
            `}
            style={{
              transform: `translate(-50%, -50%) rotateX(${60 + index * 10}deg) rotateY(${index * 15}deg)`,
              animationDuration: `${6 + index * 2}s`,
            }}
          >
            {/* Inner glow ring */}
            <div className={`
              absolute inset-2 rounded-full border-2 opacity-60
              ${ring.color} ${ring.glow}
              animate-pulse
            `} style={{
              animationDelay: `${index * 0.5}s`,
              animationDuration: '3s'
            }}></div>
          </div>
        ))}
        
        {/* Central core */}
        <div className="
          absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          w-16 h-16 rounded-full
          bg-gradient-to-r from-cyan-400 to-blue-500
          shadow-2xl shadow-cyan-400/50
          animate-pulse-core
          z-10
        ">
          <div className="absolute inset-2 rounded-full bg-white opacity-30 animate-ping"></div>
        </div>
      </div>
      
      {/* Particle effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-float-particle opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default RingAnimation;
