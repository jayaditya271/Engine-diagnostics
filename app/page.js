"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  diagnoseEngine,
  DIAGNOSTIC_PRESETS,
} from "@/lib/fuzzyLogic";

/**
 * Default nominal telemetry state for a healthy internal combustion engine.
 */
const DEFAULT_TELEMETRY = {
  temperature: 88,  // 88 °C (Nominal operating temp)
  vibration: 2.1,   // 2.1 mm/s RMS (Smooth idle/cruise)
  oilPressure: 48,  // 48 PSI (Healthy pump pressure)
  noise: 68,        // 68 dB (Normal engine acoustics)
};

export default function DiagnosticsPage() {
  const [telemetry, setTelemetry] = useState(DEFAULT_TELEMETRY);
  const [activeTab, setActiveTab] = useState("fuzzification"); // "fuzzification" | "rules" | "defuzzification"

  // Evaluate fuzzy inference diagnostics whenever telemetry changes
  const diagnosticResult = useMemo(() => {
    return diagnoseEngine(telemetry);
  }, [telemetry]);

  // Telemetry update handlers
  const handleInputChange = (field, value) => {
    setTelemetry((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  };

  const handleReset = () => {
    setTelemetry(DEFAULT_TELEMETRY);
  };

  const handleApplyPreset = (preset) => {
    setTelemetry(preset.inputs);
  };

  // Severity color mapping helper
  const getSeverityAccent = (score) => {
    if (score >= 80) return "text-rose-400 border-rose-500/40 bg-rose-500/10";
    if (score >= 55) return "text-amber-400 border-amber-500/40 bg-amber-500/10";
    if (score >= 35) return "text-yellow-400 border-yellow-500/40 bg-yellow-500/10";
    if (score >= 20) return "text-blue-400 border-blue-500/40 bg-blue-500/10";
    return "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
  };

  const getGaugeStrokeColor = (score) => {
    if (score >= 80) return "#f43f5e"; // rose-500
    if (score >= 55) return "#f97316"; // orange-500
    if (score >= 35) return "#eab308"; // yellow-500
    if (score >= 20) return "#38bdf8"; // sky-400
    return "#10b981"; // emerald-500
  };

  const {
    severityScore,
    riskLevel,
    primaryFault,
    actionAdvice,
    fuzzified,
    evaluatedRules,
    activeRules,
  } = diagnosticResult;

  // SVG Gauge computation
  const gaugeRadius = 72;
  const circumference = 2 * Math.PI * gaugeRadius;
  const strokeDashoffset = circumference - (severityScore / 100) * circumference;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Floating Smart Navbar */}
      <Navbar onReset={handleReset} />

      {/* Hero Section */}
      <section className="relative pt-28 pb-12 px-4 sm:px-6 max-w-5xl mx-auto w-full text-center">
        {/* Subtle background ambient glows */}
        <div
          aria-hidden="true"
          className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-purple-500/10 blur-3xl pointer-events-none -z-10"
        />

        <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3.5 py-1 text-xs font-mono text-cyan-400 mb-4 backdrop-blur-sm shadow-xs">
          <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>SOFT COMPUTING // MAMDANI FUZZY INFERENCE SYSTEM</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto">
          Engine Diagnostics
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Real-time diagnostic assessment powered by fuzzy linguistic logic, multi-rule implication,
          and centroid defuzzification for predictive vehicle health monitoring.
        </p>

        {/* Diagnostic Presets Strip */}
        <div id="presets" className="mt-8 flex flex-wrap justify-center gap-2">
          <span className="text-xs uppercase font-mono tracking-wider text-slate-500 self-center mr-1">
            Presets:
          </span>
          {DIAGNOSTIC_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              title={`Load simulation profile: ${preset.name} - ${preset.description}`}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-700 px-3 py-1 text-xs text-slate-300 hover:text-white transition-all shadow-xs"
            >
              <span className="font-medium">{preset.name}</span>
              <span className="text-[10px] uppercase font-bold text-cyan-400/90 font-mono">
                [{preset.badge}]
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Diagnostic Workspace */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 pb-16 space-y-8">
        
        {/* Row 1: Telemetry Controls & Live Diagnosis Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Telemetry Input Sliders (7 cols) */}
          <div
            id="telemetry"
            className="lg:col-span-7 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-md shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  Engine Telemetry Inputs
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calibrate real-time sensor parameters for fuzzy classification
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                title="Restore default nominal telemetry"
                className="cursor-pointer text-xs font-mono text-slate-400 hover:text-cyan-400 underline underline-offset-4 transition-colors"
              >
                Reset to Default
              </button>
            </div>

            <div className="space-y-6">
              {/* Parameter 1: Temperature */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label
                    htmlFor="temperature-slider"
                    title="Engine Coolant Temperature in Degrees Celsius"
                    className="font-medium text-slate-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Coolant Temperature</span>
                    <span className="text-slate-500 text-[11px] font-mono">(40°C - 140°C)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-cyan-400">
                      {telemetry.temperature}°C
                    </span>
                  </div>
                </div>

                <input
                  id="temperature-slider"
                  type="range"
                  min="40"
                  max="140"
                  step="1"
                  value={telemetry.temperature}
                  onChange={(e) => handleInputChange("temperature", e.target.value)}
                  title={`Adjust Coolant Temperature (Current: ${telemetry.temperature}°C)`}
                  className="cursor-pointer w-full h-2 bg-slate-800 rounded-lg appearance-none accent-cyan-400 focus:outline-hidden"
                />

                {/* Linguistic Membership Badges */}
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono pt-0.5">
                  {Object.entries(fuzzified.temp).map(([term, mu]) => (
                    <span
                      key={term}
                      title={`Fuzzy Degree of ${term}: ${mu.toFixed(2)}`}
                      className={`cursor-pointer px-2 py-0.5 rounded border transition-colors ${
                        mu > 0
                          ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-semibold"
                          : "bg-slate-900 border-slate-800 text-slate-600"
                      }`}
                    >
                      {term}: {mu.toFixed(2)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Parameter 2: Vibration */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label
                    htmlFor="vibration-slider"
                    title="Mechanical Vibration Velocity RMS in mm/s"
                    className="font-medium text-slate-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Vibration Velocity</span>
                    <span className="text-slate-500 text-[11px] font-mono">(0 - 15 mm/s)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-cyan-400">
                      {telemetry.vibration.toFixed(1)} mm/s
                    </span>
                  </div>
                </div>

                <input
                  id="vibration-slider"
                  type="range"
                  min="0"
                  max="15"
                  step="0.1"
                  value={telemetry.vibration}
                  onChange={(e) => handleInputChange("vibration", e.target.value)}
                  title={`Adjust Mechanical Vibration (Current: ${telemetry.vibration} mm/s)`}
                  className="cursor-pointer w-full h-2 bg-slate-800 rounded-lg appearance-none accent-cyan-400 focus:outline-hidden"
                />

                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono pt-0.5">
                  {Object.entries(fuzzified.vib).map(([term, mu]) => (
                    <span
                      key={term}
                      title={`Fuzzy Degree of ${term}: ${mu.toFixed(2)}`}
                      className={`cursor-pointer px-2 py-0.5 rounded border transition-colors ${
                        mu > 0
                          ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-semibold"
                          : "bg-slate-900 border-slate-800 text-slate-600"
                      }`}
                    >
                      {term}: {mu.toFixed(2)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Parameter 3: Oil Pressure */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label
                    htmlFor="oil-slider"
                    title="Lubrication Oil Pressure in PSI"
                    className="font-medium text-slate-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Oil Pressure</span>
                    <span className="text-slate-500 text-[11px] font-mono">(0 - 80 PSI)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-cyan-400">
                      {telemetry.oilPressure} PSI
                    </span>
                  </div>
                </div>

                <input
                  id="oil-slider"
                  type="range"
                  min="0"
                  max="80"
                  step="1"
                  value={telemetry.oilPressure}
                  onChange={(e) => handleInputChange("oilPressure", e.target.value)}
                  title={`Adjust Lubrication Pressure (Current: ${telemetry.oilPressure} PSI)`}
                  className="cursor-pointer w-full h-2 bg-slate-800 rounded-lg appearance-none accent-cyan-400 focus:outline-hidden"
                />

                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono pt-0.5">
                  {Object.entries(fuzzified.oil).map(([term, mu]) => (
                    <span
                      key={term}
                      title={`Fuzzy Degree of ${term}: ${mu.toFixed(2)}`}
                      className={`cursor-pointer px-2 py-0.5 rounded border transition-colors ${
                        mu > 0
                          ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-semibold"
                          : "bg-slate-900 border-slate-800 text-slate-600"
                      }`}
                    >
                      {term}: {mu.toFixed(2)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Parameter 4: Noise Level */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label
                    htmlFor="noise-slider"
                    title="Acoustic Noise / Knocking Intensity in Decibels"
                    className="font-medium text-slate-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Acoustic Noise</span>
                    <span className="text-slate-500 text-[11px] font-mono">(40 - 110 dB)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-cyan-400">
                      {telemetry.noise} dB
                    </span>
                  </div>
                </div>

                <input
                  id="noise-slider"
                  type="range"
                  min="40"
                  max="110"
                  step="1"
                  value={telemetry.noise}
                  onChange={(e) => handleInputChange("noise", e.target.value)}
                  title={`Adjust Acoustic Noise (Current: ${telemetry.noise} dB)`}
                  className="cursor-pointer w-full h-2 bg-slate-800 rounded-lg appearance-none accent-cyan-400 focus:outline-hidden"
                />

                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono pt-0.5">
                  {Object.entries(fuzzified.noise).map(([term, mu]) => (
                    <span
                      key={term}
                      title={`Fuzzy Degree of ${term}: ${mu.toFixed(2)}`}
                      className={`cursor-pointer px-2 py-0.5 rounded border transition-colors ${
                        mu > 0
                          ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-semibold"
                          : "bg-slate-900 border-slate-800 text-slate-600"
                      }`}
                    >
                      {term}: {mu.toFixed(2)}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Live Diagnostic Monitor (5 cols) */}
          <div
            id="diagnosis"
            className="lg:col-span-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-md shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Diagnostics Synthesis
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Defuzzified output and actionable assessment
                  </p>
                </div>
                <div
                  title={`Active Firing Rules: ${activeRules.length}`}
                  className="cursor-pointer px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300"
                >
                  {activeRules.length} Active Rules
                </div>
              </div>

              {/* Centroid Defuzzification Radial Gauge */}
              <div className="relative flex flex-col items-center justify-center py-4">
                <svg
                  className="w-44 h-44 -rotate-90 transform"
                  viewBox="0 0 160 160"
                  aria-label={`Fault Severity Score: ${severityScore}%`}
                >
                  {/* Background track circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r={gaugeRadius}
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    className="text-slate-800/80"
                  />
                  {/* Animated dynamic progress circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r={gaugeRadius}
                    stroke={getGaugeStrokeColor(severityScore)}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-500 ease-out"
                  />
                </svg>

                {/* Central Readout */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black font-mono tracking-tight text-white">
                    {severityScore}%
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                    Fault Severity
                  </span>
                </div>
              </div>

              {/* Status Classification Pill */}
              <div className="text-center mt-3">
                <span
                  title={`Risk Level: ${riskLevel}`}
                  className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${getSeverityAccent(
                    severityScore
                  )}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                  {riskLevel}
                </span>
              </div>

              {/* Diagnosed Fault Classification */}
              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Primary Diagnosis:
                </span>
                <p className="text-sm font-semibold text-slate-100 mt-0.5">
                  {primaryFault}
                </p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {actionAdvice}
                </p>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
              <div
                title="Implication method applied across rule sets"
                className="cursor-pointer bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60"
              >
                <div className="text-slate-500 text-[10px] uppercase font-mono">Inference</div>
                <div className="text-slate-200 font-semibold mt-0.5">Mamdani (Min-Max)</div>
              </div>
              <div
                title="Defuzzification mathematical technique"
                className="cursor-pointer bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60"
              >
                <div className="text-slate-500 text-[10px] uppercase font-mono">Defuzzifier</div>
                <div className="text-slate-200 font-semibold mt-0.5">Centroid (COG)</div>
              </div>
            </div>
          </div>

        </div>

        {/* Row 2: Deep-Dive Soft Computing Fuzzy Logic Inspector */}
        <section
          id="fuzzy-pipeline"
          className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-md shadow-lg"
        >
          {/* Header & Inspector Navigation Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 mb-6 gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-400" />
                Soft Computing Fuzzy Inference Engine Inspector
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect how crisp inputs are fuzzified, evaluated through knowledge rules, and defuzzified
              </p>
            </div>

            {/* Tab Selectors */}
            <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab("fuzzification")}
                title="Inspect Step 1: Input Membership Functions"
                className={`cursor-pointer px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === "fuzzification"
                    ? "bg-slate-800 text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                1. Fuzzification
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("rules")}
                title="Inspect Step 2: Mamdani Rule Base Evaluation"
                className={`cursor-pointer px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === "rules"
                    ? "bg-slate-800 text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                2. Rules & Implication
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("defuzzification")}
                title="Inspect Step 3: Centroid Defuzzification Formula"
                className={`cursor-pointer px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === "defuzzification"
                    ? "bg-slate-800 text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                3. Defuzzification
              </button>
            </div>
          </div>

          {/* TAB 1: FUZZIFICATION BREAKDOWN */}
          {activeTab === "fuzzification" && (
            <div className="space-y-6">
              <p className="text-xs text-slate-400">
                Each crisp sensor reading is mapped onto continuous linguistic terms via triangular and
                trapezoidal membership functions: <code className="text-cyan-300">μ(x) ∈ [0, 1]</code>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Temp */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-semibold text-slate-200">Coolant Temp</span>
                    <span className="font-mono text-cyan-400 font-bold">{telemetry.temperature}°C</span>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(fuzzified.temp).map(([term, val]) => (
                      <div key={term} className="text-xs">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                          <span className="capitalize">{term}</span>
                          <span>{val.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${val * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vibration */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-semibold text-slate-200">Vibration</span>
                    <span className="font-mono text-cyan-400 font-bold">{telemetry.vibration} mm/s</span>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(fuzzified.vib).map(([term, val]) => (
                      <div key={term} className="text-xs">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                          <span className="capitalize">{term}</span>
                          <span>{val.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${val * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Oil */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-semibold text-slate-200">Oil Pressure</span>
                    <span className="font-mono text-cyan-400 font-bold">{telemetry.oilPressure} PSI</span>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(fuzzified.oil).map(([term, val]) => (
                      <div key={term} className="text-xs">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                          <span className="capitalize">{term}</span>
                          <span>{val.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${val * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Noise */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-semibold text-slate-200">Acoustic Noise</span>
                    <span className="font-mono text-cyan-400 font-bold">{telemetry.noise} dB</span>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(fuzzified.noise).map(([term, val]) => (
                      <div key={term} className="text-xs">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                          <span className="capitalize">{term}</span>
                          <span>{val.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${val * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RULES & MAMDANI IMPLICATION */}
          {activeTab === "rules" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                The Mamdani Fuzzy Rule Base evaluates antecedent propositions using the min T-norm (AND)
                and max S-norm (OR). Active rules trigger implication weights (α-cuts).
              </p>

              <div className="divide-y divide-slate-800/80 rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
                {evaluatedRules.map((rule) => (
                  <div
                    key={rule.id}
                    title={`Rule ${rule.id}: ${rule.category} - Weight: ${rule.weight}`}
                    className={`cursor-pointer p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-colors ${
                      rule.isFired
                        ? "bg-slate-900/80 text-slate-100"
                        : "opacity-45 text-slate-500 hover:opacity-70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-400 text-[11px] w-6">
                        #{rule.id}
                      </span>
                      <div>
                        <div className="font-mono text-[11px] text-slate-300">
                          {rule.description}
                        </div>
                        <span className="text-[10px] text-cyan-400 font-sans">
                          &rarr; {rule.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded border border-slate-800 bg-slate-950">
                        {rule.consequent}
                      </span>
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                          rule.isFired
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        α = {rule.weight.toFixed(3)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DEFUZZIFICATION */}
          {activeTab === "defuzzification" && (
            <div className="space-y-4 text-xs text-slate-300">
              <p className="text-slate-400">
                The combined fuzzy output surface is converted into a single crisp fault severity percentage
                using the <strong className="text-white">Centroid (Center of Gravity / Center of Area)</strong> defuzzification method.
              </p>

              {/* Mathematical Equation Card */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 font-mono text-center space-y-2">
                <div className="text-sm font-bold text-cyan-300">
                  Z* = ∫ [ z · μ_agg(z) dz ] / ∫ [ μ_agg(z) dz ]
                </div>
                <div className="text-[11px] text-slate-400">
                  Calculated discrete sum across universe of discourse z ∈ [0, 100%]
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Active Rules Fired</span>
                  <p className="text-base font-bold text-white mt-1">{activeRules.length} / 10</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Dominant Implication</span>
                  <p className="text-base font-bold text-cyan-400 mt-1 capitalize">
                    {activeRules[0]?.consequent || "Optimal"}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Crisp Severity Output</span>
                  <p className="text-base font-bold text-emerald-400 mt-1">{severityScore}%</p>
                </div>
              </div>
            </div>
          )}
        </section>

      </main>

      {/* Minimal Footer */}
      <Footer />
    </div>
  );
}
