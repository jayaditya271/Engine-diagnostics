# 📘 Soft Computing: Fuzzy Inference System (FIS) Study Guide

A complete, self-study reference for **Mamdani Fuzzy Logic** applied to **Vehicle Engine Fault Diagnostics**.

---

## 1. Classical Logic vs. Soft Computing (Fuzzy Logic)

| Characteristic | Classical (Crisp / Boolean) Logic | Fuzzy Logic (Soft Computing) |
| :--- | :--- | :--- |
| **Truth Value Range** | Binary: $\{0, 1\}$ (False or True) | Continuous: $[0.0, 1.0]$ (Degree of truth) |
| **Boundary** | Sharp, rigid cutoff threshold | Smooth, continuous transition zone |
| **Handling Vagueness**| Fails on ambiguous real-world data | Naturally models uncertainty & partial truth |
| **Mathematical Base** | Boolean Algebra & Set Theory | Fuzzy Set Theory (Lotfi A. Zadeh, 1965) |
| **Automotive Fit** | "Engine is either broken or not broken" | "Engine is running slightly hot with minor vibration" |

---

## 2. The 5-Phase Mamdani Inference Pipeline

```
           [ Crisp Sensor Telemetry ]
                       │
                       ▼
 ┌───────────────────────────────────────────┐
 │ 1. FUZZIFICATION                          │  Convert crisp numbers to linguistic
 │    μ_triangle(x) and μ_trapezoid(x)       │  membership values: μ(x) ∈ [0, 1]
 └─────────────────────┬─────────────────────┘
                       │
                       ▼
 ┌───────────────────────────────────────────┐
 │ 2. RULE EVALUATION (KNOWLEDGE BASE)       │  Evaluate antecedents using T-Norm:
 │    IF (A AND B) THEN C                    │  Firing strength α = min(μ_A, μ_B)
 └─────────────────────┬─────────────────────┘
                       │
                       ▼
 ┌───────────────────────────────────────────┐
 │ 3. IMPLICATION                            │  Clip output fuzzy set by α-cut:
 │    Mamdani Min Implication                │  μ_clipped(z) = min(α, μ_consequent(z))
 └─────────────────────┬─────────────────────┘
                       │
                       ▼
 ┌───────────────────────────────────────────┐
 │ 4. AGGREGATION                            │  Combine clipped fuzzy sets via Max:
 │    Max S-Norm Union                       │  μ_agg(z) = max_k [ μ_clipped_k(z) ]
 └─────────────────────┬─────────────────────┘
                       │
                       ▼
 ┌───────────────────────────────────────────┐
 │ 5. DEFUZZIFICATION                        │  Find Center of Gravity (Centroid):
 │    Centroid / Center of Gravity (COG)     │  Z* = Σ [ z · μ_agg(z) ] / Σ [ μ_agg(z) ]
 └─────────────────────┬─────────────────────┘
                       │
                       ▼
   [ Crisp Fault Severity Score: 0% to 100% ]
```

---

## 3. Mathematical Foundations of Membership Functions

### 3.1 Triangular Membership Function: $\mu(x; a, b, c)$

```
        μ(x) ^
         1.0 |           /\
             |          /  \
             |         /    \
         0.0 +-------a----b---c-------> x (Crisp Input)
```

$$\mu_{\text{triangle}}(x; a, b, c) = \begin{cases} 
0, & x \le a \text{ or } x \ge c \\
\frac{x - a}{b - a}, & a < x < b \\
\frac{c - x}{c - b}, & b \le x < c 
\end{cases}$$

### 3.2 Trapezoidal Membership Function: $\mu(x; a, b, c, d)$

```
        μ(x) ^
         1.0 |         /--------\
             |        /          \
             |       /            \
         0.0 +-----a---b--------c---d---> x (Crisp Input)
```

$$\mu_{\text{trapezoid}}(x; a, b, c, d) = \begin{cases}
0, & x \le a \text{ or } x \ge d \\
\frac{x - a}{b - a}, & a < x < b \\
1, & b \le x \le c \\
\frac{d - x}{d - c}, & c < x < d 
\end{cases}$$

---

## 4. Input Linguistic Variables & Ranges

| Variable | Sensor Range | Linguistic Terms | Function Parameters |
| :--- | :--- | :--- | :--- |
| **Coolant Temp ($T$)** | 30°C – 150°C | `Cold` <br> `Normal` <br> `High` <br> `Overheating` | Trap [30, 30, 65, 75] <br> Tri [70, 90, 105] <br> Tri [98, 112, 122] <br> Trap [115, 125, 150, 150] |
| **Vibration ($V$)** | 0 – 16 mm/s | `Low` <br> `Moderate` <br> `High` <br> `Severe` | Trap [0, 0, 2.5, 4.0] <br> Tri [3.0, 5.5, 8.0] <br> Tri [7.0, 9.5, 12.0] <br> Trap [11.0, 13.0, 16, 16] |
| **Oil Pressure ($P$)**| 0 – 90 PSI | `DangerouslyLow` <br> `Low` <br> `Normal` <br> `High` | Trap [0, 0, 12, 22] <br> Tri [18, 28, 38] <br> Tri [32, 50, 68] <br> Trap [62, 72, 90, 90] |
| **Acoustic Noise ($N$)**| 30 – 120 dB | `Quiet` <br> `Normal` <br> `Elevated` <br> `Loud` | Trap [30, 30, 55, 65] <br> Tri [60, 72, 82] <br> Tri [78, 88, 96] <br> Trap [92, 100, 120, 120] |

---

## 5. Output Variable: Fault Severity Spectrum ($Z \in [0, 100\%]$)

- **Optimal**: `Tri(-5, 0, 22)` $\rightarrow$ Healthy engine baseline.
- **Minor**: `Tri(15, 30, 48)` $\rightarrow$ Preventative check advised.
- **Moderate**: `Tri(40, 56, 72)` $\rightarrow$ Schedule workshop maintenance.
- **Severe**: `Tri(65, 80, 92)` $\rightarrow$ High mechanical/thermal stress.
- **Critical**: `Trap(85, 95, 105, 105)` $\rightarrow$ Emergency engine shutdown immediately.

---

## 6. Centroid Defuzzification Formula

The Centroid (Center of Gravity / Center of Area) method computes the center of mass of the aggregated fuzzy set:

$$Z^* = \frac{\int_{0}^{100} z \cdot \mu_{\text{agg}}(z) \, dz}{\int_{0}^{100} \mu_{\text{agg}}(z) \, dz} \approx \frac{\sum_{i=0}^{100} z_i \cdot \mu_{\text{agg}}(z_i)}{\sum_{i=0}^{100} \mu_{\text{agg}}(z_i)}$$

---

## 7. CLI Demonstration

You can run the fuzzy logic engine directly from your terminal:

```bash
npm run demo
```
or:
```bash
node lib/fuzzyLogicEngine.js
```

---

## 8. Common Soft Computing Viva / Exam Questions

**Q1: Why choose Mamdani over Takagi-Sugeno for diagnostics?**  
*Answer:* Mamdani uses fuzzy sets for consequents, producing human-readable linguistic explanations (e.g., "Fault is Severe"). Sugeno uses polynomial/crisp equations suitable for mathematical control surfaces.

**Q2: What is the purpose of defuzzification?**  
*Answer:* Actuators, display gauges, and human operators require crisp numerical values (e.g., "78.9% fault severity") rather than abstract fuzzy membership functions.

**Q3: What are T-Norm and S-Norm?**  
*Answer:* T-Norm models fuzzy intersection (AND), typically $\min(a, b)$. S-Norm models fuzzy union (OR), typically $\max(a, b)$.

