"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AnimatedBackground from "./components/AnimatedBackground";
import {
  ChevronUp,
  ChevronDown,
  Shield,
  Zap,
  Users,
  Award,
  Eye,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

interface GridFeature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cta?: string;
  theme: string;
  features?: string[];
  gridFeatures?: GridFeature[];
}

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<
    "idle" | "exit" | "enter"
  >("idle");

  const slides = [
    {
      id: "hero",
      title: "IU-MiCert",
      subtitle: "Blockchain Certificate Verification",
      description:
        "Revolutionary micro-credential provenance tracking using Verkle trees for enhanced educational verification",
      cta: "Start Verification",
      theme: "from-blue-900 via-purple-900 to-indigo-900",
    },
    {
      id: "problem",
      title: "The Challenge",
      subtitle: "Current Limitations",
      description:
        "Traditional systems only verify complete degrees, missing granular learning achievements and creating opportunities for credential forgery",
      features: [
        "Limited granular tracking",
        "Vulnerable to timeline manipulation",
        "Inefficient storage systems",
        "Lack of provenance",
      ],
      theme: "from-red-900 via-pink-900 to-purple-900",
    },
    {
      id: "solution",
      title: "Our Solution",
      subtitle: "Verkle Tree Architecture",
      description:
        "IU-MiCert leverages advanced Verkle trees to provide efficient micro-credential tracking with verifiable academic provenance",
      features: [
        "Enhanced storage efficiency",
        "Temporal verification",
        "Anti-forgery mechanisms",
        "Seamless integration",
      ],
      theme: "from-green-900 via-teal-900 to-blue-900",
    },
    {
      id: "features",
      title: "Key Features",
      subtitle: "Advanced Capabilities",
      description:
        "Comprehensive blockchain solution for modern educational credentialing",
      gridFeatures: [
        {
          icon: Shield,
          title: "Anti-Forgery",
          desc: "Timeline verification prevents credential manipulation",
        },
        {
          icon: Zap,
          title: "Efficient Storage",
          desc: "Verkle trees optimize micro-credential management",
        },
        {
          icon: Users,
          title: "Multi-Stakeholder",
          desc: "Students, employers, and institutions unified",
        },
        {
          icon: Award,
          title: "Comprehensive",
          desc: "Track entire learning journey, not just degrees",
        },
      ],
      theme: "from-purple-900 via-blue-900 to-indigo-900",
    },
    {
      id: "cta",
      title: "Ready to Verify?",
      subtitle: "Join the Future of Education",
      description:
        "Experience the next generation of credential verification with IU-MiCert",
      cta: "Start Verification Now",
      theme: "from-indigo-900 via-purple-900 to-pink-900",
    },
  ];

  const nextSlide = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true);
      setAnimationPhase("exit");

      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setAnimationPhase("enter");
      }, 300);

      setTimeout(() => {
        setAnimationPhase("idle");
        setIsAnimating(false);
      }, 900);
    }
  }, [isAnimating, slides.length]);

  const prevSlide = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true);
      setAnimationPhase("exit");

      setTimeout(() => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setAnimationPhase("enter");
      }, 300);

      setTimeout(() => {
        setAnimationPhase("idle");
        setIsAnimating(false);
      }, 900);
    }
  }, [isAnimating, slides.length]);

  const goToSlide = useCallback(
    (index: number) => {
      if (!isAnimating && index !== currentSlide) {
        setIsAnimating(true);
        setAnimationPhase("exit");

        setTimeout(() => {
          setCurrentSlide(index);
          setAnimationPhase("enter");
        }, 300);

        setTimeout(() => {
          setAnimationPhase("idle");
          setIsAnimating(false);
        }, 900);
      }
    },
    [isAnimating, currentSlide]
  );

  // Auto-advance slides (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [isAnimating, nextSlide]);

  // Get animation class based on current state
  const getAnimationClass = () => {
    if (animationPhase === "idle") return "";

    // Use zoom animation for all slides (same as "Our Solution" slide)
    if (animationPhase === "exit") {
      return "slide-exit-zoom";
    } else if (animationPhase === "enter") {
      return "slide-enter-zoom";
    }

    return "";
  };

  const renderSlideContent = (slide: Slide) => {
    switch (slide.id) {
      case "hero":
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold bg-gradient-to-r text-white bg-clip-text font-space-grotesk">
                {slide.title}
              </h1>
              <p className="text-xl text-blue-200 font-medium font-inter">
                {slide.subtitle}
              </p>
            </div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-inter">
              {slide.description}
            </p>
            <div className="flex justify-center">
              <Link href="/verify" passHref>
                <button className="bg-gradient-to-r hover:cursor-pointer from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 font-inter">
                  {slide.cta}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        );

      case "problem":
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold text-white font-space-grotesk">
                {slide.title}
              </h2>
              <p className="text-xl text-red-200 font-medium font-inter">
                {slide.subtitle}
              </p>
            </div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-inter">
              {slide.description}
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              {slide.features?.map((feature, index) => (
                <div
                  key={index}
                  className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-200 font-medium font-inter">
                      {feature}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "solution":
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold text-white font-space-grotesk">
                {slide.title}
              </h2>
              <p className="text-xl text-green-200 font-medium font-inter">
                {slide.subtitle}
              </p>
            </div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-inter">
              {slide.description}
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              {slide.features?.map((feature, index) => (
                <div
                  key={index}
                  className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm hover:bg-green-800/40 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-200 font-medium font-inter">
                      {feature}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "features":
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold text-white font-space-grotesk">
                {slide.title}
              </h2>
              <p className="text-xl text-purple-200 font-medium font-inter">
                {slide.subtitle}
              </p>
            </div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-inter">
              {slide.description}
            </p>
            <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
              {slide.gridFeatures?.map((feature, index) => (
                <div
                  key={index}
                  className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm hover:bg-purple-800/40 transition-all duration-300 hover:scale-105"
                >
                  <feature.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2 font-space-grotesk">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-sm font-inter">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case "cta":
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent font-space-grotesk">
                {slide.title}
              </h2>
              <p className="text-xl text-pink-200 font-medium font-inter">
                {slide.subtitle}
              </p>
            </div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-inter">
              {slide.description}
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link href="/verify" passHref>
                <button className="bg-gradient-to-r hover:cursor-pointer from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-10 py-4 rounded-full font-bold text-white text-lg transition-all duration-300 hover:scale-110 hover:shadow-xl flex items-center gap-3 font-inter">
                  <Eye className="w-6 h-6" />
                  {slide.cta}
                  <ArrowRight className="w-6 h-6" />
                </button>
              </Link>
              <p className="text-sm text-gray-400 font-inter">
                No registration required • Instant verification
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground
        gradient={slides[currentSlide].theme}
        className="transition-all duration-1000"
      />

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-4 md:px-8 md:pr-20">
        <div className={`${getAnimationClass()}`}>
          {renderSlideContent(slides[currentSlide])}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 hidden md:flex">
        <div className="flex flex-col items-center gap-6 bg-black/30 backdrop-blur-md rounded-full px-3 py-6">
          {/* Arrow Controls */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 hover:scale-110"
            >
              <ChevronUp className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 hover:scale-110"
            >
              <ChevronDown className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="flex flex-col gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white shadow-lg"
                    : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-black/20 z-20">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default LandingPage;
