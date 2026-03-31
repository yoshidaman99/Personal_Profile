"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type AvatarState = "idle" | "thinking" | "speaking";

interface AvatarProps {
  state: AvatarState;
}

export default function Avatar({ state }: AvatarProps) {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (state === "thinking") return;
    const interval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [state]);

  const eyeScaleY = blinking || state === "thinking" ? 0.1 : 1;
  const mouthPath =
    state === "speaking"
      ? "M88 112 Q100 122 112 112"
      : state === "thinking"
        ? "M92 114 Q100 114 108 114"
        : "M88 110 Q100 120 112 110";
  const headTilt =
    state === "thinking" ? "rotate(-3deg)" : "rotate(0deg)";

  return (
    <div className="avatar-container">
      <div className="avatar-glow" />
      <motion.div
        className="avatar-frame"
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transform: headTilt }}
      >
        <svg
          viewBox="0 0 200 220"
          xmlns="http://www.w3.org/2000/svg"
          className="avatar-svg"
        >
          <defs>
            <radialGradient id="skinGrad" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#F5D0A9" />
              <stop offset="100%" stopColor="#E8B88A" />
            </radialGradient>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00c4d6" />
              <stop offset="100%" stopColor="#0092a3" />
            </linearGradient>
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3D2314" />
              <stop offset="100%" stopColor="#1A0F08" />
            </linearGradient>
            <filter id="softShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>

          <circle cx="100" cy="110" r="95" fill="url(#bgGlow)" />

          <motion.g
            animate={{
              y: state === "idle" ? [0, -1.5, 0] : 0,
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.g
              animate={{ rotate: state === "thinking" ? [-1, 1, -1] : 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "100px 95px" }}
            >
              <ellipse
                cx="100"
                cy="162"
                rx="55"
                ry="12"
                fill="#000"
                opacity="0.15"
              />

              <path
                d="M45 165 Q45 140 70 138 Q85 136 100 137 Q115 136 130 138 Q155 140 155 165 Q155 200 155 210 L45 210 Q45 200 45 165Z"
                fill="url(#shirtGrad)"
                filter="url(#softShadow)"
              />
              <path
                d="M75 142 Q78 148 80 142"
                stroke="#0092a3"
                strokeWidth="0.5"
                fill="none"
                opacity="0.5"
              />

              <ellipse
                cx="100"
                cy="100"
                rx="58"
                ry="62"
                fill="url(#skinGrad)"
                filter="url(#softShadow)"
              />

              <ellipse
                cx="50"
                cy="105"
                rx="8"
                ry="15"
                fill="#F5D0A9"
                opacity="0.4"
              />
              <ellipse
                cx="150"
                cy="105"
                rx="8"
                ry="15"
                fill="#F5D0A9"
                opacity="0.4"
              />

              <path
                d="M42 90 Q45 45 100 35 Q155 45 158 90 Q155 65 100 58 Q45 65 42 90Z"
                fill="url(#hairGrad)"
              />
              <path
                d="M42 90 Q40 75 50 60 Q55 55 60 58"
                fill="url(#hairGrad)"
              />

              <motion.g
                animate={{ scaleY: eyeScaleY }}
                transition={{ duration: 0.08 }}
                style={{ transformOrigin: "80px 93px" }}
              >
                <ellipse cx="80" cy="93" rx="7" ry="8" fill="#FFFFFF" />
                <ellipse cx="81" cy="94" rx="5" ry="6" fill="#1A0F08" />
                <circle cx="83" cy="91" r="2" fill="#FFFFFF" opacity="0.9" />
                <circle cx="78" cy="95" r="1" fill="#FFFFFF" opacity="0.5" />
              </motion.g>

              <motion.g
                animate={{ scaleY: eyeScaleY }}
                transition={{ duration: 0.08 }}
                style={{ transformOrigin: "120px 93px" }}
              >
                <ellipse cx="120" cy="93" rx="7" ry="8" fill="#FFFFFF" />
                <ellipse cx="119" cy="94" rx="5" ry="6" fill="#1A0F08" />
                <circle cx="121" cy="91" r="2" fill="#FFFFFF" opacity="0.9" />
                <circle cx="117" cy="95" r="1" fill="#FFFFFF" opacity="0.5" />
              </motion.g>

              <motion.g
                animate={{
                  y: state === "thinking" ? [-2, -1, -2] : 0,
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <line
                  x1="70"
                  y1="80"
                  x2="88"
                  y2="82"
                  stroke="#3D2314"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="130"
                  y1="80"
                  x2="112"
                  y2="82"
                  stroke="#3D2314"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </motion.g>

              <path
                d="M97 102 Q100 107 103 102"
                fill="none"
                stroke="#D4A574"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              <motion.path
                d={mouthPath}
                animate={{
                  d:
                    state === "speaking"
                      ? [
                          "M88 112 Q100 122 112 112",
                          "M88 112 Q100 118 112 112",
                          "M88 112 Q100 124 112 112",
                          "M88 112 Q100 118 112 112",
                        ]
                      : mouthPath,
                }}
                transition={{
                  duration: 0.4,
                  repeat: state === "speaking" ? Infinity : 0,
                  ease: "easeInOut",
                }}
                fill="none"
                stroke="#C0756B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {state === "speaking" && (
                <motion.ellipse
                  cx="100"
                  cy="116"
                  rx="8"
                  ry="4"
                  fill="#A0524A"
                  opacity="0.4"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                />
              )}

              <ellipse cx="65" cy="105" rx="6" ry="4" fill="#E8A07A" opacity="0.3" />
              <ellipse cx="135" cy="105" rx="6" ry="4" fill="#E8A07A" opacity="0.3" />
            </motion.g>
          </motion.g>

          <AnimatePresence>
            {state === "thinking" && (
              <motion.g
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <circle cx="78" cy="55" r="3" fill="#00e5ff" opacity="0.6">
                  <animate
                    attributeName="opacity"
                    values="0.3;0.8;0.3"
                    dur="1.2s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx="100" cy="48" r="3" fill="#00e5ff" opacity="0.6">
                  <animate
                    attributeName="opacity"
                    values="0.3;0.8;0.3"
                    dur="1.2s"
                    begin="0.3s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx="122" cy="55" r="3" fill="#00e5ff" opacity="0.6">
                  <animate
                    attributeName="opacity"
                    values="0.3;0.8;0.3"
                    dur="1.2s"
                    begin="0.6s"
                    repeatCount="indefinite"
                  />
                </circle>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </motion.div>

      {state === "thinking" && (
        <motion.div
          className="thinking-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Thinking<span className="thinking-dots"><span>.</span><span>.</span><span>.</span></span>
        </motion.div>
      )}
    </div>
  );
}
