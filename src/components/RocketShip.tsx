"use client";
import React from "react";
import { motion } from "framer-motion";

const Spaceship = () => {
  const [isMobile, setIsMobile] = React.useState(true);

  React.useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) return null;

  return (
    <motion.div
      className="fixed w-48 h-96 right-24 z-50 pointer-events-none"
      initial={{ bottom: "-20vh", x: "10vw" }}
      animate={{
        bottom: ["0vh", "70vh"],
        x: ["10vw", "0vw", "-5vw", "0vw"],
        rotate: [0, -2, 2, 0],
      }}
      transition={{
        bottom: {
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        },
        x: {
          duration: 12,
          repeat: Infinity,
          times: [0, 0.3, 0.7, 1],
          ease: "easeInOut",
        },
        rotate: {
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        },
      }}
    >
      <svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#e2e8f0", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#94a3b8", stopOpacity: 1 }}
            />
          </linearGradient>
          <linearGradient
            id="windowGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#7dd3fc", stopOpacity: 0.9 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#0ea5e9", stopOpacity: 0.9 }}
            />
          </linearGradient>
          <linearGradient id="engineGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#f97316", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#f59e0b", stopOpacity: 0.6 }}
            />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d="M100,50 C150,50 180,100 180,150 L180,300 C180,350 150,380 100,380 C50,380 20,350 20,300 L20,150 C20,100 50,50 100,50"
          fill="url(#bodyGradient)"
          stroke="#64748b"
          strokeWidth="2"
        />

        <path
          d="M100,50 C130,50 150,30 150,0 L100,0 L50,0 C50,30 70,50 100,50"
          fill="#dc2626"
          stroke="#64748b"
          strokeWidth="2"
        />

        <circle
          cx="100"
          cy="120"
          r="25"
          fill="url(#windowGradient)"
          stroke="#0284c7"
          strokeWidth="2"
        />
        <circle
          cx="100"
          cy="200"
          r="15"
          fill="url(#windowGradient)"
          stroke="#0284c7"
          strokeWidth="2"
        />
        <circle
          cx="100"
          cy="260"
          r="15"
          fill="url(#windowGradient)"
          stroke="#0284c7"
          strokeWidth="2"
        />

        <path
          d="M20,200 L0,220 L0,280 L20,300"
          fill="#dc2626"
          stroke="#64748b"
          strokeWidth="2"
        />
        <path
          d="M180,200 L200,220 L200,280 L180,300"
          fill="#dc2626"
          stroke="#64748b"
          strokeWidth="2"
        />

        <g filter="url(#glow)">
          <path
            d="M60,380 C60,420 100,440 100,440 C100,440 140,420 140,380"
            fill="url(#engineGlow)"
          >
            <animate
              attributeName="d"
              dur="0.5s"
              repeatCount="indefinite"
              values="
                       M60,380 C60,420 100,440 100,440 C100,440 140,420 140,380;
                       M60,380 C60,410 100,430 100,430 C100,430 140,410 140,380;
                       M60,380 C60,420 100,440 100,440 C100,440 140,420 140,380"
            />
          </path>
        </g>

        <path
          d="M40,150 L160,150"
          stroke="#64748b"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M40,220 L160,220"
          stroke="#64748b"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M40,290 L160,290"
          stroke="#64748b"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </motion.div>
  );
};

export default Spaceship;
