import "./globals.css";

export const metadata = {
  title: "Engine Diagnostics",
  description:
    "Intelligent engine diagnostics platform powered by Mamdani Fuzzy Inference System (Soft Computing) with real-time telemetry analysis.",
  keywords: [
    "fuzzy logic",
    "soft computing",
    "engine diagnostics",
    "mamdani inference",
    "automotive telemetry",
    "defuzzification",
  ],
  authors: [{ name: "TorqPulse Dynamics" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen antialiased bg-slate-950 text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
