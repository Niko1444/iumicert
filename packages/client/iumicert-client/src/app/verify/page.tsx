"use client";

import { useState } from "react";
import AnimatedBackground from "../components/AnimatedBackground";

export default function VerifyCredential() {
  const [credentialData, setCredentialData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    message: string;
    details?: {
      studentName: string;
      institution: string;
      program: string;
      graduationDate: string;
      certificateId: string;
    };
  } | null>(null);

  const handleVerify = async () => {
    if (!credentialData.trim()) return;

    setIsLoading(true);
    try {
      // Mock verification with realistic data
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate successful verification with mock data
      setVerificationResult({
        isValid: true,
        message: "Certificate verified successfully on blockchain",
        details: {
          studentName: "Alex Johnson",
          institution: "Indiana University",
          program: "Master of Computer Science",
          graduationDate: "May 15, 2024",
          certificateId: "IU-CS-2024-0547",
        },
      });
    } catch {
      setVerificationResult({
        isValid: false,
        message:
          "Certificate verification failed - Invalid or tampered credential",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCredentialData("");
    setVerificationResult(null);
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated background */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Verify Certificate
            </h1>
            <p className="text-blue-200 text-lg font-space-grotesk">
              Authenticate academic credentials on the blockchain
            </p>
          </div>

          {/* Main verification card */}
          <div className="relative bg-white/10 ring-1 ring-white/30 backdrop-blur-sm rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.05)] p-8 overflow-hidden">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-white/20 blur-md opacity-30 pointer-events-none mix-blend-overlay"></div>

            <div className="relative space-y-6">
              {/* Input section */}
              <div>
                <label
                  htmlFor="credential"
                  className="block text-sm font-medium text-white/90 mb-3 font-space-grotesk"
                >
                  Certificate Data or Hash
                </label>
                <textarea
                  id="credential"
                  rows={5}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl 
                           text-white placeholder-white/50 backdrop-blur-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent 
                           transition duration-300 font-inter resize-none"
                  placeholder="Paste your certificate hash, QR code data, or verification link here..."
                  value={credentialData}
                  onChange={(e) => setCredentialData(e.target.value)}
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleVerify}
                  disabled={!credentialData.trim() || isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                           disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                           text-white font-medium py-3 px-6 rounded-xl transition duration-300 
                           font-space-grotesk transform hover:scale-[1.02] active:scale-[0.98]
                           shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Verifying on Blockchain...
                    </div>
                  ) : (
                    "🔍 Verify Certificate"
                  )}
                </button>

                {verificationResult && (
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 
                             rounded-xl transition duration-300 font-space-grotesk"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Verification result */}
              {verificationResult && (
                <div
                  className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-500 ${
                    verificationResult.isValid
                      ? "bg-green-500/20 border-green-400/50 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                      : "bg-red-500/20 border-red-400/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                  }`}
                >
                  <div className="flex items-start">
                    <div
                      className={`text-2xl mr-3 ${
                        verificationResult.isValid
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {verificationResult.isValid ? "✅" : "❌"}
                    </div>
                    <div className="flex-1">
                      <div
                        className={`text-lg font-semibold mb-2 font-space-grotesk ${
                          verificationResult.isValid
                            ? "text-green-100"
                            : "text-red-100"
                        }`}
                      >
                        {verificationResult.message}
                      </div>

                      {/* Certificate details for successful verification */}
                      {verificationResult.isValid &&
                        verificationResult.details && (
                          <div className="mt-4 space-y-3 bg-white/10 rounded-xl p-4 border border-white/20">
                            <h4 className="text-white font-semibold font-space-grotesk mb-3">
                              📜 Certificate Details
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-blue-200 font-medium">
                                  Student:
                                </span>
                                <p className="text-white font-inter">
                                  {verificationResult.details.studentName}
                                </p>
                              </div>
                              <div>
                                <span className="text-blue-200 font-medium">
                                  Institution:
                                </span>
                                <p className="text-white font-inter">
                                  {verificationResult.details.institution}
                                </p>
                              </div>
                              <div>
                                <span className="text-blue-200 font-medium">
                                  Program:
                                </span>
                                <p className="text-white font-inter">
                                  {verificationResult.details.program}
                                </p>
                              </div>
                              <div>
                                <span className="text-blue-200 font-medium">
                                  Graduation:
                                </span>
                                <p className="text-white font-inter">
                                  {verificationResult.details.graduationDate}
                                </p>
                              </div>
                              <div className="md:col-span-2">
                                <span className="text-blue-200 font-medium">
                                  Certificate ID:
                                </span>
                                <p className="text-white font-mono text-xs bg-black/20 p-2 rounded mt-1">
                                  {verificationResult.details.certificateId}
                                </p>
                              </div>
                            </div>

                            {/* Blockchain info */}
                            <div className="mt-4 pt-3 border-t border-white/20">
                              <div className="flex items-center text-xs text-blue-200">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                                Verified on Ethereum Blockchain • Block
                                #18,456,789 • Gas Used: 21,000
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}

              {/* Help section */}
              <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-white font-semibold font-space-grotesk mb-2">
                  💡 How to verify your certificate
                </h4>
                <ul className="text-sm text-blue-200 space-y-1 font-inter">
                  <li>• Scan the QR code on your physical certificate</li>
                  <li>
                    • Copy the verification hash from your digital certificate
                  </li>
                  <li>• Paste the verification link from your institution</li>
                  <li>• Enter your certificate ID for manual lookup</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
