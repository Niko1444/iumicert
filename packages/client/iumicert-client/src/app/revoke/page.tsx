"use client";

import { useState, useEffect } from "react";

// Animated Background Component
const AnimatedBackground = () => {
  const [particles, setParticles] = useState<
    Array<{
      left: number;
      top: number;
      animationDelay: number;
      animationDuration: number;
    }>
  >([]);

  useEffect(() => {
    // Generate particles only on client side to avoid hydration mismatch
    const generatedParticles = Array.from({ length: 50 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 2,
      animationDuration: 2 + Math.random() * 3,
    }));
    setParticles(generatedParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Floating particles */}
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
          }}
        />
      ))}

      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
    </div>
  );
};

export default function RevokeCredential() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatedBackground />

      {/* Mobile/Small Screen Warning */}
      <div className="md:hidden flex items-center justify-center h-screen relative z-20">
        <div className="bg-white/10 ring-1 ring-white/30 backdrop-blur-sm rounded-3xl p-8 mx-4 text-center max-w-md">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Desktop or Tablet Required
          </h2>
          <p className="text-blue-200 mb-4">
            This credential revocation interface is optimized for desktop and
            tablet devices (iPad Air 5 and larger).
          </p>
          <p className="text-blue-300 text-sm">
            Please access this page from a device with a larger screen for the
            best experience.
          </p>
          <div className="mt-6 text-blue-400 text-sm">
            Minimum resolution: 898 x 1144
          </div>
        </div>
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* Main Content - Centered */}
        <div className="flex-1 px-8 pb-36 pt-50 min-h-0">
          <div className="h-full lg:max-w-[80%] mx-auto flex items-center justify-center">
            {/* Coming Soon Section */}
            <div className="max-w-2xl mx-auto bg-white/10 ring-1 ring-white/30 backdrop-blur-sm rounded-3xl p-12 text-center">
              {/* Icon */}
              <div className="text-8xl mb-6">🚧</div>

              {/* Title */}
              <h1
                className="text-4xl font-bold text-white mb-4"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                }}
              >
                Revoke Academic Credentials
              </h1>

              {/* Subtitle */}
              <p className="text-blue-200 text-lg mb-8">
                Securely revoke issued micro-credentials using Verkle Trees
              </p>

              {/* Coming Soon Notification */}
              <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-center mb-3">
                  <div className="text-3xl mr-3">⚠️</div>
                  <div className="text-yellow-100 font-semibold text-xl">
                    Feature Coming Soon
                  </div>
                </div>
                <p className="text-yellow-200">
                  The credential revocation functionality is currently under
                  development. This feature will allow authorized personnel to
                  revoke previously issued academic credentials with
                  cryptographic proof of revocation.
                </p>
              </div>

              {/* Contact Info */}
              <div className="mt-8 bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-blue-300 text-sm">
                  For questions about credential revocation, please contact your
                  institutional administrator.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
