/**
 * =========================================================================================
 * 📘 SOFT COMPUTING: MAMDANI FUZZY INFERENCE SYSTEM (FIS) FOR ENGINE FAULT DIAGNOSTICS
 * =========================================================================================
 * File: lib/fuzzyLogicEngine.js
 * 
 * PURPOSE:
 * This file contains the complete, standalone mathematical and algorithmic implementation
 * of a Mamdani Fuzzy Inference System (FIS). It is organized with exhaustive documentation
 * and ASCII diagrams so that you can easily study, understand, and explain every stage of
 * the Soft Computing pipeline.
 *
 * -----------------------------------------------------------------------------------------
 * 🧠 WHAT IS SOFT COMPUTING & WHY FUZZY LOGIC FOR ENGINE DIAGNOSTICS?
 * -----------------------------------------------------------------------------------------
 * 1. Hard Computing (Classical Boolean Logic):
 *    - In classical logic, a statement is either strictly TRUE (1) or FALSE (0).
 *    - Example: If Temp > 100°C -> "Overheating", but at 99.9°C -> "Not Overheating".
 *    - Problem: Real-world physical systems (like car engines) do not transition abruptly
 *      between healthy and broken. Components degrade continuously and smoothly.
 *
 * 2. Soft Computing (Fuzzy Logic - Lotfi A. Zadeh, 1965):
 *    - Fuzzy logic models uncertainty, vagueness, and partial truth.
 *    - A variable has a "Degree of Membership" μ(x) in the continuous range [0.0, 1.0].
 *    - Example: At 98°C, the coolant temperature is partially "Normal" (μ = 0.35)
 *      and partially "High" (μ = 0.65) simultaneously!
 *    - This mirrors human mechanical expert intuition: "The engine is running a bit warm."
 *
 * -----------------------------------------------------------------------------------------
 * 🔄 THE 5-STAGE MAMDANI FUZZY INFERENCE PIPELINE:
 * -----------------------------------------------------------------------------------------
 *
 *   [Crisp Sensor Readings]
 *              │
 *              ▼
 *   ┌───────────────────────────────────────────────────────────────┐
 *   │ STAGE 1: FUZZIFICATION                                        │
 *   │ Convert crisp numbers into fuzzy linguistic membership [0, 1] │
 *   │ using Triangular and Trapezoidal Membership Functions (MFs).  │
 *   └───────────────────────────────┬───────────────────────────────┘
 *                                   │
 *                                   ▼
 *   ┌───────────────────────────────────────────────────────────────┐
 *   │ STAGE 2: RULE EVALUATION (T-NORM & S-NORM)                    │
 *   │ Evaluate 10 expert IF-THEN rules:                             │
 *   │  • Fuzzy AND (T-Norm) = Math.min(μA, μB)                      │
 *   │  • Fuzzy OR  (S-Norm) = Math.max(μA, μB)                      │
 *   │ Output: Rule firing strength / weight (α-cut)                 │
 *   └───────────────────────────────┬───────────────────────────────┘
 *                                   │
 *                                   ▼
 *   ┌───────────────────────────────────────────────────────────────┐
 *   │ STAGE 3: IMPLICATION                                          │
 *   │ Mamdani Min-Implication clips the output fuzzy set shape at   │
 *   │ the rule's firing strength α: μ_clipped(z) = min(α, μ_out(z)) │
 *   └───────────────────────────────┬───────────────────────────────┘
 *                                   │
 *                                   ▼
 *   ┌───────────────────────────────────────────────────────────────┐
 *   │ STAGE 4: AGGREGATION                                          │
 *   │ Combine the clipped output fuzzy sets from all fired rules    │
 *   │ using the Max union operator: μ_agg(z) = max(clipped_1, ...)  │
 *   └───────────────────────────────┬───────────────────────────────┘
 *                                   │
 *                                   ▼
 *   ┌───────────────────────────────────────────────────────────────┐
 *   │ STAGE 5: DEFUZZIFICATION (CENTROID / COG METHOD)              │
 *   │ Compute the balance point / center of gravity of the combined │
 *   │ fuzzy area to produce a single crisp output:                  │
 *   │             Z* = Σ [ z · μ_agg(z) ] / Σ [ μ_agg(z) ]          │
 *   └───────────────────────────────┬───────────────────────────────┘
 *                                   │
 *                                   ▼
 *        [Crisp Fault Severity Score: 0% to 100%]
 *        [Diagnostic Classification & Maintenance Advice]
 * =========================================================================================
 */

// =========================================================================================
// 1. MEMBERSHIP FUNCTION PRIMITIVES (FUZZIFICATION FOUNDATIONS)
// =========================================================================================

/**
 * 📐 Triangular Membership Function: μ(x; a, b, c)
 * 
 * Visual Representation:
 *           μ(x) ^
 *            1.0 |           /\
 *                |          /  \
 *                |         /    \
 *                |        /      \
 *            0.0 +-------a----b---c-------> x (Crisp Input)
 * 
 * Mathematical Definition:
 *                     ⎧ 0,                 if x <= a or x >= c
 *   μ_triangle(x)  =  ⎨ (x - a) / (b - a), if a < x < b
 *                     ⎩ (c - x) / (c - b), if b <= x < c
 * 
 * @param {number} x - Crisp input scalar value
 * @param {number} a - Left zero-membership anchor
 * @param {number} b - Peak modal value where μ(x) = 1.0
 * @param {number} c - Right zero-membership anchor
 * @returns {number} Membership value in the closed interval [0.0, 1.0]
 */
export function triangularMF(x, a, b, c) {
  if (x <= a || x >= c) return 0;
  if (x === b) return 1;
  if (x < b) return (x - a) / (b - a);
  return (c - x) / (c - b);
}

/**
 * ⏢ Trapezoidal Membership Function: μ(x; a, b, c, d)
 * 
 * Visual Representation:
 *           μ(x) ^
 *            1.0 |         /--------\
 *                |        /          \
 *                |       /            \
 *                |      /              \
 *            0.0 +-----a---b--------c---d---> x (Crisp Input)
 * 
 * Mathematical Definition:
 *                      ⎧ 0,                 if x <= a or x >= d
 *                      ⎪ (x - a) / (b - a), if a < x < b
 *   μ_trapezoid(x)  =  ⎨ 1,                 if b <= x <= c
 *                      ⎪ (d - x) / (d - c), if c < x < d
 *                      ⎩ 0,                 otherwise
 * 
 * @param {number} x - Crisp input scalar value
 * @param {number} a - Left slope base (starts rising from 0)
 * @param {number} b - Plateau left start (reaches 1.0)
 * @param {number} c - Plateau right end (remains 1.0)
 * @param {number} d - Right slope base (drops back to 0)
 * @returns {number} Membership value in the closed interval [0.0, 1.0]
 */
export function trapezoidalMF(x, a, b, c, d) {
  if (x <= a || x >= d) return 0;
  if (x >= b && x <= c) return 1;
  if (x < b) return (x - a) / (b - a);
  return (d - x) / (d - c);
}

// =========================================================================================
// 2. UNIVERSE OF DISCOURSE & INPUT FUZZIFIERS
// =========================================================================================

/**
 * Variable 1: Engine Coolant Temperature (°C)
 * Universe of Discourse: X_temp = [30°C, 150°C]
 * 
 * Linguistic Terms:
 *  - Cold:        Trapezoid [30, 30, 65, 75]
 *  - Normal:      Triangle  [70, 90, 105]      (Ideal operating temperature ~90°C)
 *  - High:        Triangle  [98, 112, 122]     (Approaching boiling threshold)
 *  - Overheating: Trapezoid [115, 125, 150, 150] (Head gasket / boiling risk)
 */
export function fuzzifyTemperature(temp) {
  return {
    cold: trapezoidalMF(temp, 30, 30, 65, 75),
    normal: triangularMF(temp, 70, 90, 105),
    high: triangularMF(temp, 98, 112, 122),
    overheating: trapezoidalMF(temp, 115, 125, 150, 150),
  };
}

/**
 * Variable 2: Mechanical Vibration Velocity (mm/s RMS)
 * Universe of Discourse: X_vib = [0, 16 mm/s]
 * 
 * Measured per ISO 10816 automotive vibration standards:
 *  - Low:      Trapezoid [0, 0, 2.5, 4.0]     (Smooth balanced operation)
 *  - Moderate: Triangle  [3.0, 5.5, 8.0]      (Noticeable rumble / minor imbalance)
 *  - High:     Triangle  [7.0, 9.5, 12.0]     (Damaged mounts / rod wear)
 *  - Severe:   Trapezoid [11.0, 13.0, 16, 16] (Catastrophic rotating unbalance)
 */
export function fuzzifyVibration(vib) {
  return {
    low: trapezoidalMF(vib, 0, 0, 2.5, 4.0),
    moderate: triangularMF(vib, 3.0, 5.5, 8.0),
    high: triangularMF(vib, 7.0, 9.5, 12.0),
    severe: trapezoidalMF(vib, 11.0, 13.0, 16.0, 16.0),
  };
}

/**
 * Variable 3: Lubrication Oil Pressure (PSI)
 * Universe of Discourse: X_oil = [0, 90 PSI]
 * 
 * Critical hydrodynamic oil film indicator:
 *  - DangerouslyLow: Trapezoid [0, 0, 12, 22]   (Metal-on-metal friction imminent)
 *  - Low:            Triangle  [18, 28, 38]     (Worn pump / low fluid level)
 *  - Normal:         Triangle  [32, 50, 68]     (Optimal lubrication pressure)
 *  - High:           Trapezoid [62, 72, 90, 90] (Clogged gallery / stuck relief valve)
 */
export function fuzzifyOilPressure(psi) {
  return {
    dangerouslyLow: trapezoidalMF(psi, 0, 0, 12, 22),
    low: triangularMF(psi, 18, 28, 38),
    normal: triangularMF(psi, 32, 50, 68),
    high: trapezoidalMF(psi, 62, 72, 90, 90),
  };
}

/**
 * Variable 4: Acoustic Noise Level (dB)
 * Universe of Discourse: X_noise = [30, 120 dB]
 * 
 * Acoustic microphone / knock sensor reading:
 *  - Quiet:    Trapezoid [30, 30, 55, 65]
 *  - Normal:   Triangle  [60, 72, 82]      (Standard combustion engine hum)
 *  - Elevated: Triangle  [78, 88, 96]      (Exhaust leak or mild valvetrain chatter)
 *  - Loud:     Trapezoid [92, 100, 120, 120] (Heavy rod knock / piston slap)
 */
export function fuzzifyNoise(db) {
  return {
    quiet: trapezoidalMF(db, 30, 30, 55, 65),
    normal: triangularMF(db, 60, 72, 82),
    elevated: triangularMF(db, 78, 88, 96),
    loud: trapezoidalMF(db, 92, 100, 120, 120),
  };
}

// =========================================================================================
// 3. OUTPUT VARIABLE: FAULT SEVERITY SPECTRUM (Z ∈ [0, 100%])
// =========================================================================================
// Linguistic Consequents:
//  - optimal:  Triangle  [-5, 0, 22]    (Engine is fully healthy)
//  - minor:    Triangle  [15, 30, 48]   (Preventative advisory)
//  - moderate: Triangle  [40, 56, 72]   (Schedule maintenance soon)
//  - severe:   Triangle  [65, 80, 92]   (Immediate mechanical inspection required)
//  - critical: Trapezoid [85, 95, 105, 105] (Emergency engine shutdown)

export const OUTPUT_MEMBERSHIP_SETS = {
  optimal: (z) => triangularMF(z, -5, 0, 22),
  minor: (z) => triangularMF(z, 15, 30, 48),
  moderate: (z) => triangularMF(z, 40, 56, 72),
  severe: (z) => triangularMF(z, 65, 80, 92),
  critical: (z) => trapezoidalMF(z, 85, 95, 105, 105),
};

// =========================================================================================
// 4. MAMDANI FUZZY RULE BASE (KNOWLEDGE BASE)
// =========================================================================================
/**
 * In Mamdani Fuzzy Inference:
 *  - An IF-THEN rule connects antecedent propositions with a consequent.
 *  - T-Norm operator for AND:  Math.min(μ1, μ2)
 *  - S-Norm operator for OR:   Math.max(μ1, μ2)
 *  - The result is the rule's firing strength (weight / α-cut).
 */
export const EXPERT_RULES = [
  {
    id: 1,
    description: "IF Temp is Normal AND Vibration is Low AND Oil is Normal AND Noise is Normal THEN Fault is Optimal",
    evaluate: (f) => Math.min(f.temp.normal, f.vib.low, f.oil.normal, f.noise.normal),
    consequent: "optimal",
    category: "Healthy Operation",
  },
  {
    id: 2,
    description: "IF Temp is Overheating AND Oil is Normal THEN Fault is Severe",
    evaluate: (f) => Math.min(f.temp.overheating, f.oil.normal),
    consequent: "severe",
    category: "Cooling System Failure (Radiator / Water Pump)",
  },
  {
    id: 3,
    description: "IF Vibration is Severe AND Noise is Loud THEN Fault is Severe",
    evaluate: (f) => Math.min(f.vib.severe, f.noise.loud),
    consequent: "severe",
    category: "Rotating Assembly / Main Bearing Wear",
  },
  {
    id: 4,
    description: "IF Oil is DangerouslyLow AND (Temp is High OR Temp is Overheating) THEN Fault is Critical",
    evaluate: (f) => Math.min(f.oil.dangerouslyLow, Math.max(f.temp.high, f.temp.overheating)),
    consequent: "critical",
    category: "Oil Starvation & Severe Friction Seizure Risk",
  },
  {
    id: 5,
    description: "IF Temp is Overheating AND Vibration is Severe AND Oil is DangerouslyLow THEN Fault is Critical",
    evaluate: (f) => Math.min(f.temp.overheating, f.vib.severe, f.oil.dangerouslyLow),
    consequent: "critical",
    category: "Catastrophic Engine Breakdown Imminent",
  },
  {
    id: 6,
    description: "IF Noise is Loud AND Temp is High THEN Fault is Moderate",
    evaluate: (f) => Math.min(f.noise.loud, f.temp.high),
    consequent: "moderate",
    category: "Combustion Knocking / Pre-ignition",
  },
  {
    id: 7,
    description: "IF Vibration is High AND Noise is Elevated THEN Fault is Moderate",
    evaluate: (f) => Math.min(f.vib.high, f.noise.elevated),
    consequent: "moderate",
    category: "Shaft Misalignment / Damaged Engine Mounts",
  },
  {
    id: 8,
    description: "IF Oil is Low AND Temp is Normal THEN Fault is Minor",
    evaluate: (f) => Math.min(f.oil.low, f.temp.normal),
    consequent: "minor",
    category: "Low Sump Oil Level / Minor Leak",
  },
  {
    id: 9,
    description: "IF Temp is Cold AND Vibration is Low THEN Fault is Minor",
    evaluate: (f) => Math.min(f.temp.cold, f.vib.low),
    consequent: "minor",
    category: "Sub-Optimal Warmup Phase",
  },
  {
    id: 10,
    description: "IF Oil is High AND Temp is Normal THEN Fault is Minor",
    evaluate: (f) => Math.min(f.oil.high, f.temp.normal),
    consequent: "minor",
    category: "Pressure Relief Valve Restriction",
  },
];

// =========================================================================================
// 5. STAGE 3, 4 & 5: IMPLICATION, AGGREGATION & CENTROID DEFUZZIFICATION
// =========================================================================================

/**
 * 🎯 Centroid / Center of Gravity (COG) Defuzzification:
 * 
 * Continuous Formula:
 *                  ∫ z · μ_agg(z) dz
 *             Z* = ─────────────────
 *                    ∫ μ_agg(z) dz
 * 
 * Discrete Implementation:
 *                  Σ [ z_i · μ_agg(z_i) ]
 *             Z* = ──────────────────────
 *                     Σ [ μ_agg(z_i) ]
 * 
 * Where:
 *  - z_i is sampled at uniform steps across [0%, 100%]
 *  - Mamdani Min-Implication: μ_clipped(z) = min(α_k, μ_consequent(z))
 *  - Max Aggregation:         μ_agg(z) = max_k [ μ_clipped(z) ]
 * 
 * @param {Array<{ consequent: string, weight: number }>} activeRules
 * @returns {number} Crisp fault severity score in [0.0, 100.0]
 */
export function calculateCentroidDefuzzification(activeRules) {
  const STEP = 1.0; // 101 sample evaluation points across [0, 100]
  let weightedNumerator = 0;
  let totalAreaDenominator = 0;

  for (let z = 0; z <= 100; z += STEP) {
    let aggregatedMuAtZ = 0;

    // Evaluate all fired rules at sample point z
    for (const rule of activeRules) {
      if (rule.weight <= 0) continue;

      const consequentFunction = OUTPUT_MEMBERSHIP_SETS[rule.consequent];
      if (consequentFunction) {
        // Stage 3: Mamdani Implication (clipping at rule firing weight α)
        const clippedValue = Math.min(rule.weight, consequentFunction(z));

        // Stage 4: Aggregation (Max union over all active rules)
        if (clippedValue > aggregatedMuAtZ) {
          aggregatedMuAtZ = clippedValue;
        }
      }
    }

    weightedNumerator += z * aggregatedMuAtZ;
    totalAreaDenominator += aggregatedMuAtZ;
  }

  // Safety fallback if no rules fired with positive weight
  if (totalAreaDenominator === 0) return 8.0;

  const centroid = weightedNumerator / totalAreaDenominator;
  return Math.max(0, Math.min(100, centroid));
}

// =========================================================================================
// 6. MAIN ENGINE DIAGNOSTIC EXECUTOR
// =========================================================================================

/**
 * Runs full Fuzzy Inference System evaluation on crisp telemetry data.
 * 
 * @param {Object} inputs
 * @param {number} inputs.temperature - Coolant temperature in °C (40 - 140)
 * @param {number} inputs.vibration   - Vibration level in mm/s (0 - 15)
 * @param {number} inputs.oilPressure - Oil pressure in PSI (0 - 80)
 * @param {number} inputs.noise       - Noise level in dB (40 - 110)
 * 
 * @returns {Object} Comprehensive diagnostic report with full intermediate fuzzy values
 */
export function executeFuzzyDiagnostics(inputs) {
  const { temperature, vibration, oilPressure, noise } = inputs;

  // STAGE 1: Fuzzification
  const fuzzified = {
    temp: fuzzifyTemperature(temperature),
    vib: fuzzifyVibration(vibration),
    oil: fuzzifyOilPressure(oilPressure),
    noise: fuzzifyNoise(noise),
  };

  // STAGE 2: Rule Base Evaluation (T-Norm min AND, S-Norm max OR)
  const evaluatedRules = EXPERT_RULES.map((rule) => {
    const rawWeight = rule.evaluate(fuzzified);
    const weight = Number(rawWeight.toFixed(3));
    return {
      id: rule.id,
      description: rule.description,
      category: rule.category,
      consequent: rule.consequent,
      weight,
      isFired: weight > 0.001,
    };
  });

  const activeRules = evaluatedRules.filter((r) => r.isFired);

  // STAGE 3, 4 & 5: Implication, Aggregation & Defuzzification
  const crispSeverity = calculateCentroidDefuzzification(activeRules);
  const severityScore = Number(crispSeverity.toFixed(1));

  // Determine dominant diagnosed fault based on the highest fired rule strength
  let primaryFault = "Nominal Healthy Operation";
  let highestWeight = 0;

  activeRules.forEach((rule) => {
    if (rule.consequent !== "optimal" && rule.weight > highestWeight) {
      highestWeight = rule.weight;
      primaryFault = rule.category;
    }
  });

  if (highestWeight === 0 && activeRules.some((r) => r.consequent === "optimal")) {
    primaryFault = "Optimal Engine Health";
  }

  // Diagnostic Risk Assessment & Action Advice
  let riskLevel = "Optimal";
  let actionAdvice = "All engine systems operating within factory safety parameters.";

  if (severityScore >= 80) {
    riskLevel = "Critical Emergency";
    actionAdvice = "Imminent mechanical seizure or blowout risk. Shut down engine immediately and tow for teardown.";
  } else if (severityScore >= 55) {
    riskLevel = "Severe Warning";
    actionAdvice = "Elevated mechanical stress or cooling degradation detected. Limit RPM and inspect cooling & lubrication lines.";
  } else if (severityScore >= 35) {
    riskLevel = "Moderate Attention";
    actionAdvice = "Anomalies detected in telemetry. Schedule workshop diagnostic inspection and check fluid levels.";
  } else if (severityScore >= 20) {
    riskLevel = "Minor Advisory";
    actionAdvice = "Slight variance from standard nominal range. Monitor sensor telemetry during high-load intervals.";
  }

  return {
    inputs: { temperature, vibration, oilPressure, noise },
    fuzzified,
    evaluatedRules,
    activeRules,
    severityScore,
    riskLevel,
    primaryFault,
    actionAdvice,
  };
}

// =========================================================================================
// 7. CLI / TERMINAL DEMONSTRATION RUNNER FOR LEARNING & VERIFICATION
// =========================================================================================
/**
 * You can run this file directly in terminal to test and inspect the calculations:
 *    node lib/fuzzyLogicEngine.js
 */
export function runEducationalWalkthrough() {
  console.log("\n==================================================================");
  console.log("📘 SOFT COMPUTING: ENGINE FAULT DIAGNOSTICS DEMO RUNNER");
  console.log("==================================================================");

  const sampleTelemetry = {
    temperature: 126, // Overheating
    vibration: 3.2,   // Moderate
    oilPressure: 45,  // Normal
    noise: 75,        // Normal
  };

  console.log("\n1️⃣ CRISP INPUT TELEMETRY:");
  console.log(` • Coolant Temperature : ${sampleTelemetry.temperature} °C`);
  console.log(` • Vibration Velocity  : ${sampleTelemetry.vibration} mm/s`);
  console.log(` • Oil Pressure        : ${sampleTelemetry.oilPressure} PSI`);
  console.log(` • Acoustic Noise      : ${sampleTelemetry.noise} dB`);

  const report = executeFuzzyDiagnostics(sampleTelemetry);

  console.log("\n2️⃣ FUZZIFICATION RESULTS (Degrees of Truth μ ∈ [0, 1]):");
  console.log(" • Temp Membership :", report.fuzzified.temp);
  console.log(" • Vib Membership  :", report.fuzzified.vib);
  console.log(" • Oil Membership  :", report.fuzzified.oil);
  console.log(" • Noise Membership:", report.fuzzified.noise);

  console.log("\n3️⃣ ACTIVE FIRED RULES (Mamdani Implication):");
  report.activeRules.forEach((r) => {
    console.log(` • [Rule #${r.id}] α-weight = ${r.weight.toFixed(3)} -> Consequent: ${r.consequent} (${r.category})`);
  });

  console.log("\n4️⃣ CENTROID DEFUZZIFICATION OUTPUT:");
  console.log(` • Crisp Severity Index : ${report.severityScore}%`);
  console.log(` • Risk Level           : ${report.riskLevel}`);
  console.log(` • Primary Diagnosis    : ${report.primaryFault}`);
  console.log(` • Maintenance Action   : ${report.actionAdvice}`);
  console.log("==================================================================\n");
}

// Allow direct execution via Node CLI for learning
if (typeof process !== "undefined" && process.argv && process.argv[1] && process.argv[1].includes("fuzzyLogicEngine.js")) {
  runEducationalWalkthrough();
}

