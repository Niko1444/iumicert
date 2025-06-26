"use client";

import { useState, useEffect } from "react";

interface Particle {
  id: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  animationType: "float" | "drift";
}

interface AnimatedBackgroundProps {
  gradient?: string;
  className?: string;
}

export default function AnimatedBackground({
  gradient = "from-blue-900 via-purple-900 to-indigo-900",
  className = "",
}: AnimatedBackgroundProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Initialize particles on client side only
  useEffect(() => {
    setIsClient(true);
    const generateParticles = () => {
      const animationTypes: ("float" | "drift")[] = ["float", "drift"];
      return [...Array(30)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 3,
        size: 2 + Math.random() * 3,
        opacity: 0.1 + Math.random() * 0.4,
        animationType:
          animationTypes[Math.floor(Math.random() * animationTypes.length)],
      }));
    };

    setParticles(generateParticles());

    // Reduced refresh frequency from every few seconds to every 30 seconds
    const refreshInterval = setInterval(() => {
      setParticles(generateParticles());
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br ${gradient} ${className}`}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      {/* Floating particles */}
      <div className="absolute inset-0">
        {isClient &&
          particles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute rounded-full animate-pulse ${
                particle.animationType === "float"
                  ? "bg-white/30"
                  : "bg-blue-300/40"
              }`}
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                animation: `${particle.animationType} ${
                  particle.duration
                }s ease-in-out infinite, glow-pulse ${
                  particle.duration * 0.8
                }s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`,
              }}
            ></div>
          ))}
      </div>
    </div>
  );
}
