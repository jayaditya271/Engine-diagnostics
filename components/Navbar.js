"use client";

import { useState, useEffect } from "react";

/**
 * Floating Minimalistic Navigation Bar
 * Features:
 * - Smart hide-on-scroll-down and reveal-on-scroll-up behavior
 * - Glassmorphic backdrop blur and responsive layout
 * - Explicit accessibility title attributes and cursor-pointer states
 */
export default function Navbar({ onReset }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // When user scrolls down more than 40px, hide navbar
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        // When user scrolls up, reveal navbar smoothly
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-4 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-300 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0 pointer-events-none"
      }`}
    >
      <nav
        aria-label="Main Navigation"
        className="flex items-center justify-between gap-6 px-6 py-3 rounded-full bg-slate-900/85 dark:bg-slate-950/85 backdrop-blur-md border border-slate-800 shadow-xl shadow-black/20 w-full max-w-5xl"
      >
        {/* Brand Logo & System Identifier */}
        <a
          href="#"
          title="Engine Diagnostics Home"
          className="cursor-pointer flex items-center gap-2.5 text-white transition-opacity hover:opacity-90"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 text-slate-950 font-black text-xs">
            ED
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-wider uppercase text-slate-100">
              Engine <span className="text-cyan-400">Diagnostics</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 -mt-0.5">
              Fuzzy Logic System
            </span>
          </div>
        </a>

        {/* Navigation Anchors */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
          <a
            href="#telemetry"
            title="Navigate to Engine Telemetry Inputs"
            className="cursor-pointer hover:text-cyan-400 transition-colors"
          >
            Telemetry
          </a>
          <a
            href="#diagnosis"
            title="Navigate to Real-time Diagnostic Results"
            className="cursor-pointer hover:text-cyan-400 transition-colors"
          >
            Diagnostics
          </a>
          <a
            href="#fuzzy-pipeline"
            title="Inspect Soft Computing Fuzzy Inference System"
            className="cursor-pointer hover:text-cyan-400 transition-colors"
          >
            Fuzzy Logic
          </a>
          <a
            href="#presets"
            title="Browse Simulation Profiles"
            className="cursor-pointer hover:text-cyan-400 transition-colors"
          >
            Presets
          </a>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            title="Reset telemetry values to factory baseline"
            className="cursor-pointer rounded-full bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 text-xs font-medium text-slate-200 transition-all border border-slate-700 hover:border-slate-600 hover:text-white"
          >
            Reset
          </button>
          <a
            href="#telemetry"
            title="Execute Fuzzy Inference Assessment"
            className="cursor-pointer rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-md shadow-cyan-500/20 transition-all"
          >
            Diagnose
          </a>
        </div>
      </nav>
    </header>
  );
}

