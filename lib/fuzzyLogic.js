/**
 * ==============================================================================
 * ENGINE FAULT DIAGNOSTICS - FUZZY INFERENCE SYSTEM (MAMDANI FIS)
 * ==============================================================================
 * A self-contained, educational Soft Computing engine fault diagnosis module.
 * 
 * Pipeline:
 *  1. Crisp Inputs (Temperature, Vibration, Oil Pressure, Acoustic Noise)
 *  2. Fuzzification (Triangular & Trapezoidal Membership Functions)
 *  3. Rule Evaluation & Inference (Mamdani Min Implication, T-norm AND / S-norm OR)
 *  4. Aggregation (Max S-norm composition)
 *  5. Defuzzification (Centroid / Center of Gravity Method)
 *  6. Crisp Fault Severity Index (0 - 100%) & Diagnostic Classification
 * ==============================================================================
 */

// -----------------------------------------------------------------------------
// 1. MEMBERSHIP FUNCTION PRIMITIVES (FUZZIFICATION HELPERS)
// -----------------------------------------------------------------------------

/**
 * Triangular Membership Function μ(x; a, b, c)
 * @param {number} x - Crisp input value
 * @param {number} a - Left vertex where membership starts rising from 0
 * @param {number} b - Peak vertex where membership equals 1
 * @param {number} c - Right vertex where membership drops to 0
 * @returns {number} Membership degree in range [0, 1]
 */
export function triangularMF(x, a, b, c) {
  if (x <= a || x >= c) return 0;
  if (x === b) return 1;
  if (x < b) return (x - a) / (b - a);
  return (c - x) / (c - b);
}

/**
 * Trapezoidal Membership Function μ(x; a, b, c, d)
 * @param {number} x - Crisp input value
 * @param {number} a - Left slope base (0)
 * @param {number} b - Left plateau start (1)
 * @param {number} c - Right plateau end (1)
 * @param {number} d - Right slope base (0)
 * @returns {number} Membership degree in range [0, 1]
 */
export function trapezoidalMF(x, a, b, c, d) {
  if (x <= a || x >= d) return 0;
  if (x >= b && x <= c) return 1;
  if (x < b) return (x - a) / (b - a);
  return (d - x) / (d - c);
}

// -----------------------------------------------------------------------------
// 2. INPUT VARIABLE FUZZIFIERS
// -----------------------------------------------------------------------------

/**
 * Fuzzify Engine Coolant Temperature (°C, valid range: ~40 - 140°C)
 * Linguistic Terms: Cold, Normal, High, Overheating
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
 * Fuzzify Mechanical Vibration Velocity (mm/s RMS, valid range: 0 - 15 mm/s)
 * Linguistic Terms: Low, Moderate, High, Severe
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
 * Fuzzify Engine Lubrication Oil Pressure (PSI, valid range: 0 - 80 PSI)
 * Linguistic Terms: DangerouslyLow, Low, Normal, High
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
 * Fuzzify Engine Acoustic Noise (dB, valid range: 40 - 110 dB)
 * Linguistic Terms: Quiet, Normal, Elevated, Loud
 */
export function fuzzifyNoise(db) {
  return {
    quiet: trapezoidalMF(db, 30, 30, 55, 65),
    normal: triangularMF(db, 60, 72, 82),
    elevated: triangularMF(db, 78, 88, 96),
    loud: trapezoidalMF(db, 92, 100, 120, 120),
  };
}

// -----------------------------------------------------------------------------
// 3. OUTPUT LINGUISTIC SETS (FAULT SEVERITY 0% - 100%)
// -----------------------------------------------------------------------------
// Severity Scale:
// 0% - 20%:   Optimal (No fault)
// 15% - 45%:  Minor (Preventative check)
// 40% - 70%:  Moderate (Maintenance required soon)
// 65% - 90%:  Severe (Immediate inspection required)
// 85% - 100%: Critical (Emergency engine shutdown)

const OUTPUT_SETS = {
  optimal: (z) => triangularMF(z, -5, 0, 22),
  minor: (z) => triangularMF(z, 15, 30, 48),
  moderate: (z) => triangularMF(z, 40, 56, 72),
  severe: (z) => triangularMF(z, 65, 80, 92),
  critical: (z) => trapezoidalMF(z, 85, 95, 105, 105),
};

// -----------------------------------------------------------------------------
// 4. EXPERT FUZZY RULE BASE (KNOWLEDGE BASE)
// -----------------------------------------------------------------------------
// Each rule evaluates input linguistic terms using T-norm (Math.min for AND)
// and triggers an output linguistic consequence.

export const RULE_DEFINITIONS = [
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
    category: "Cooling System Failure",
  },
  {
    id: 3,
    description: "IF Vibration is Severe AND Noise is Loud THEN Fault is Severe",
    evaluate: (f) => Math.min(f.vib.severe, f.noise.loud),
    consequent: "severe",
    category: "Bearing / Rotating Assembly Wear",
  },
  {
    id: 4,
    description: "IF Oil is DangerouslyLow AND (Temp is High OR Temp is Overheating) THEN Fault is Critical",
    evaluate: (f) => Math.min(f.oil.dangerouslyLow, Math.max(f.temp.high, f.temp.overheating)),
    consequent: "critical",
    category: "Oil Starvation & Thermal Seizure Risk",
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
    category: "Shaft Misalignment / Damaged Mounts",
  },
  {
    id: 8,
    description: "IF Oil is Low AND Temp is Normal THEN Fault is Minor",
    evaluate: (f) => Math.min(f.oil.low, f.temp.normal),
    consequent: "minor",
    category: "Low Oil Level / Sump Depletion",
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

// -----------------------------------------------------------------------------
// 5. INFERENCE, AGGREGATION & DEFUZZIFICATION (CENTROID METHOD)
// -----------------------------------------------------------------------------

/**
 * Centroid Defuzzification over the universe of discourse [0, 100]
 * Formula: Z* = Sum(z * mu(z)) / Sum(mu(z))
 * 
 * @param {Array<{ consequent: string, weight: number }>} activeRules 
 * @returns {number} Crisp fault severity percentage [0, 100]
 */
function defuzzifyCentroid(activeRules) {
  const STEP = 1.0; // Discretization step (101 points from 0 to 100)
  let numerator = 0;
  let denominator = 0;

  for (let z = 0; z <= 100; z += STEP) {
    // Mamdani implication (min clipping) aggregated with Max operator
    let aggregatedMu = 0;

    for (const rule of activeRules) {
      if (rule.weight <= 0) continue;
      const membershipFunc = OUTPUT_SETS[rule.consequent];
      if (membershipFunc) {
        // Implication: clip output membership by rule weight (alpha-cut)
        const clippedMu = Math.min(rule.weight, membershipFunc(z));
        // Aggregation: maximum across all fired rules
        if (clippedMu > aggregatedMu) {
          aggregatedMu = clippedMu;
        }
      }
    }

    numerator += z * aggregatedMu;
    denominator += aggregatedMu;
  }

  // If no rules fired with weight > 0, fallback to safe baseline
  if (denominator === 0) return 10.0;

  return Math.max(0, Math.min(100, numerator / denominator));
}

// -----------------------------------------------------------------------------
// 6. MAIN DIAGNOSIS RUNNER
// -----------------------------------------------------------------------------

/**
 * Executes full Fuzzy Inference System diagnostics on crisp engine telemetry.
 * 
 * @param {Object} inputs
 * @param {number} inputs.temperature - Coolant temperature in °C (40 - 140)
 * @param {number} inputs.vibration - Vibration level in mm/s (0 - 15)
 * @param {number} inputs.oilPressure - Oil pressure in PSI (0 - 80)
 * @param {number} inputs.noise - Noise level in dB (40 - 110)
 * 
 * @returns {Object} Complete diagnostic result with fuzzy breakdown
 */
export function diagnoseEngine(inputs) {
  const { temperature, vibration, oilPressure, noise } = inputs;

  // Step 1: Fuzzification
  const fuzzified = {
    temp: fuzzifyTemperature(temperature),
    vib: fuzzifyVibration(vibration),
    oil: fuzzifyOilPressure(oilPressure),
    noise: fuzzifyNoise(noise),
  };

  // Step 2 & 3: Rule Evaluation & Mamdani Implication
  const evaluatedRules = RULE_DEFINITIONS.map((def) => {
    const weight = Number(def.evaluate(fuzzified).toFixed(3));
    return {
      id: def.id,
      description: def.description,
      category: def.category,
      consequent: def.consequent,
      weight,
      isFired: weight > 0.001,
    };
  });

  const activeRules = evaluatedRules.filter((r) => r.isFired);

  // Step 4 & 5: Aggregation and Centroid Defuzzification
  const rawSeverity = defuzzifyCentroid(activeRules);
  const severityScore = Number(rawSeverity.toFixed(1));

  // Determine dominant fault category based on highest fired rule weight
  let primaryFault = "Normal Nominal State";
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

  // Qualitative Risk Assessment & Mechanical Recommendations
  let riskLevel = "Optimal";
  let riskColor = "emerald";
  let actionAdvice = "All engine systems operating within factory safety parameters.";

  if (severityScore >= 80) {
    riskLevel = "Critical Emergency";
    riskColor = "rose";
    actionAdvice = "Imminent mechanical seizure or blowout risk. Shut down engine immediately and tow for teardown.";
  } else if (severityScore >= 55) {
    riskLevel = "Severe Warning";
    riskColor = "orange";
    actionAdvice = "Elevated mechanical stress or cooling degradation detected. Limit RPM and inspect cooling & lubrication lines.";
  } else if (severityScore >= 35) {
    riskLevel = "Moderate Attention";
    riskColor = "amber";
    actionAdvice = "Anomalies detected in telemetry. Schedule workshop diagnostic inspection and check fluid levels.";
  } else if (severityScore >= 20) {
    riskLevel = "Minor Advisory";
    riskColor = "blue";
    actionAdvice = "Slight variance from standard nominal range. Monitor sensor telemetry during high-load intervals.";
  }

  return {
    inputs: {
      temperature,
      vibration,
      oilPressure,
      noise,
    },
    fuzzified,
    evaluatedRules,
    activeRules,
    severityScore,
    riskLevel,
    riskColor,
    primaryFault,
    actionAdvice,
  };
}

// -----------------------------------------------------------------------------
// 7. PRESET TELEMETRY PROFILES FOR QUICK TESTING & DEMONSTRATION
// -----------------------------------------------------------------------------
export const DIAGNOSTIC_PRESETS = [
  {
    name: "Nominal Highway Cruise",
    badge: "Healthy",
    description: "Standard operating envelope with balanced temperature and lubrication.",
    inputs: { temperature: 88, vibration: 1.8, oilPressure: 48, noise: 68 },
  },
  {
    name: "Radiator / Coolant Failure",
    badge: "Overheat",
    description: "High coolant temp with normal oil pressure, testing cooling system failure.",
    inputs: { temperature: 126, vibration: 3.2, oilPressure: 45, noise: 75 },
  },
  {
    name: "Worn Rod Bearing Damage",
    badge: "Mechanical",
    description: "Severe vibration signature paired with high-frequency mechanical knocking noise.",
    inputs: { temperature: 96, vibration: 13.5, oilPressure: 38, noise: 104 },
  },
  {
    name: "Oil Pump Starvation",
    badge: "Danger",
    description: "Critical loss of lubrication pressure causing rapid friction and heat buildup.",
    inputs: { temperature: 118, vibration: 6.8, oilPressure: 10, noise: 89 },
  },
  {
    name: "Catastrophic Seizure Warning",
    badge: "Critical",
    description: "Combined severe overheating, heavy vibration, and zero oil pressure.",
    inputs: { temperature: 135, vibration: 14.2, oilPressure: 6, noise: 108 },
  },
];

