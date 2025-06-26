import Image from "next/image";
import { Link } from "next-view-transitions";

export default function Header() {
  return (
    <header className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-4xl">
      <div className="relative bg-white/10 ring-1 ring-white/30 backdrop-blur-sm rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.05)] px-6 py-4 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-3xl ring-1 ring-white/20 blur-md opacity-30 pointer-events-none mix-blend-overlay"></div>

        <div className="relative flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-4">
            <div className="flex hover:cursor-pointer items-center space-x-4">
              <Image
                src="/logo.svg"
                alt="IU-MiCert Logo"
                width={80}
                height={80}
                className="object-contain transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-3"
                style={{ viewTransitionName: "logo" }}
              />

              <div className="flex gap-6 justify-center align-middle items-center">
                <h1
                  className="text-4xl font-bold text-white font-crimson"
                  style={{
                    fontFamily: "var(--font-crimson), serif",
                    viewTransitionName: "main-title",
                  }}
                >
                  IU-MiCert
                </h1>
              </div>
            </div>
          </Link>

          {/* Navigation links */}

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/verify"
              className="text-white/80 hover:text-white font-medium transition duration-300 text-sm font-inter"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                viewTransitionName: "nav-verify",
              }}
            >
              Verify
            </Link>
            <Link
              href="/revoke"
              className="text-white/80 hover:text-white font-medium transition duration-300 text-sm font-inter"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                viewTransitionName: "nav-revoke",
              }}
            >
              Revoke
            </Link>
            <Link
              href="/about"
              className="text-white/80 hover:text-white font-medium transition duration-300 text-sm font-inter"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                viewTransitionName: "nav-about",
              }}
            >
              About
            </Link>
            <Link
              href="/help"
              className="text-white/80 hover:text-white font-medium transition duration-300 text-sm font-inter"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                viewTransitionName: "nav-help",
              }}
            >
              Help
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden text-white/80 hover:text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
