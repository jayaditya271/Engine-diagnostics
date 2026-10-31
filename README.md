# Engine Diagnostics

An intelligent, minimalistic automotive diagnostic platform built with **Next.js (App Router)**, **Tailwind CSS v4**, and a pure **Soft Computing Mamdani Fuzzy Inference System (FIS)**.

---

## Highlights & Features

- **Soft Computing Architecture**: 100% self-contained Mamdani Fuzzy Logic System with triangular & trapezoidal membership functions, min-max inference, and centroid defuzzification.
- **Single-File Fuzzy Engine (`lib/fuzzyLogic.js`)**: All fuzzification, linguistic terms, rule base, implication, and defuzzification are structured in one file with thorough comments for learning and academic presentation.
- **Smart Floating Navbar (`components/Navbar.js`)**: Modern floating glassmorphic navigation bar that intelligently hides on scroll down and smoothly reappears on scroll up.
- **Real-Time Interactive Telemetry**: Four calibrated engine parameters (Coolant Temperature, Mechanical Vibration, Oil Pressure, Acoustic Noise) with live sliders, direct value displays, and preset simulation profiles.
- **Full Transparency & Inspection**: Interactive visual breakdowns of:
  1. Input linguistic membership degrees ($\mu(x) \in [0, 1]$).
  2. Active rule firing strengths ($\alpha$-cuts).
  3. Continuous Centroid / Center of Gravity (COG) defuzzification.
- **Micro-Interactions**: Explicit `title="..."` tooltips and `cursor-pointer` indicators across all controls, sliders, badges, and preset buttons.
- **Minimalist Branding**: Premium dark automotive engineering UI, zero heavy 3rd-party dependencies, instant client-side computation, and minimal bundle footprint.
- **Clean Footer**: Minimalist status indicator with a simple copyright line.

---

## Soft Computing: Fuzzy Inference Pipeline

```
Crisp Inputs                 Fuzzification                    Rule Inference & Implication                Defuzzification
┌─────────────────────┐      ┌─────────────────────────┐      ┌───────────────────────────────────┐       ┌──────────────────────┐
│ • Temperature (°C)  │ ───► │ Triangular &            │ ───► │ 10 Mamdani Expert Rules           │ ───►  │ Centroid Method      │ ───► Crisp Fault Severity
│ • Vibration (mm/s)  │      │ Trapezoidal Membership  │      │ T-Norm (AND = min)                │       │ Center of Gravity    │      Score (0 - 100%)
│ • Oil Pressure (PSI)│      │ Functions μ(x) ∈ [0, 1] │      │ S-Norm (OR = max)                 │       │ Z* = ∫(z·μ) / ∫μ     │      & Primary Diagnosis
│ • Acoustic Noise(dB)│      └─────────────────────────┘      │ Implication (Clipping α-cut)      │       └──────────────────────┘
└─────────────────────┘                                       └───────────────────────────────────┘
```

### 1. Crisp Inputs & Linguistic Variables

| Variable | Range | Linguistic Terms |
| :--- | :--- | :--- |
| **Coolant Temperature** | 40°C – 140°C | `Cold`, `Normal`, `High`, `Overheating` |
| **Vibration Velocity** | 0 – 15 mm/s | `Low`, `Moderate`, `High`, `Severe` |
| **Lubrication Oil Pressure** | 0 – 80 PSI | `DangerouslyLow`, `Low`, `Normal`, `High` |
| **Acoustic Noise / Knocking**| 40 – 110 dB | `Quiet`, `Normal`, `Elevated`, `Loud` |

### 2. Output Linguistic Terms (Fault Severity $Z \in [0, 100\%]$)

- **Optimal / Healthy** (0% – 20%): Factory operating envelope.
- **Minor Advisory** (15% – 45%): Slight anomaly, preventative check recommended.
- **Moderate Attention** (40% – 70%): Mechanical degradation, schedule maintenance.
- **Severe Warning** (65% – 90%): Dangerous stress, immediate inspection required.
- **Critical Emergency** (85% – 100%): Imminent seizure or blowout risk, emergency shutdown.

### 3. Defuzzification Formula (Centroid / Center of Gravity)

$$Z^* = \frac{\int z \cdot \mu_{\text{agg}}(z) \, dz}{\int \mu_{\text{agg}}(z) \, dz} \approx \frac{\sum_{i=1}^{n} z_i \cdot \mu_{\text{agg}}(z_i)}{\sum_{i=1}^{n} \mu_{\text{agg}}(z_i)}$$

Where:
- $z_i$ represents discretized sample points along the severity spectrum $[0\%, 100\%]$.
- $\mu_{\text{agg}}(z_i) = \max_k \left[ \min(\alpha_k, \mu_{\text{consequent}_k}(z_i)) \right]$ is the aggregated output membership.

---

## Project Structure

```
project/
├── app/
│   ├── globals.css          # Tailwind CSS v4 entrypoint & sleek dark theme styling
│   ├── layout.js            # HTML/Body metadata and system configuration
│   └── page.js              # Interactive diagnostic console & fuzzy inspector
├── components/
│   ├── Navbar.js            # Smart floating hide/reveal navigation bar
│   └── Footer.js            # Minimalist branded footer with copyright line
├── lib/
│   └── fuzzyLogic.js        # Self-contained, fully documented Mamdani FIS Engine
├── jsconfig.json            # Path aliasing configuration (@/*)
├── next.config.mjs          # Next.js configuration
├── package.json             # Project metadata, dependencies, and scripts
├── postcss.config.mjs       # Tailwind CSS v4 PostCSS plugin configuration
└── README.md                # Comprehensive documentation
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## Simulation Presets

Quick-test typical automotive diagnostic scenarios using the presets bar:
- **Nominal Highway Cruise**: Healthy engine telemetry.
- **Radiator / Coolant Failure**: Temperature spike with normal vibration and oil.
- **Worn Rod Bearing Damage**: Extreme mechanical vibration and loud metallic knocking.
- **Oil Pump Starvation**: Critical drop in oil pressure causing rapid friction and heat.
- **Catastrophic Seizure Warning**: Simultaneous overheating, severe vibration, and zero oil pressure.

---

## License

&copy; 2026 TorqPulse Dynamics. All rights reserved.
