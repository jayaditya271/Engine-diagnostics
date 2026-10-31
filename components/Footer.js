/**
 * Minimalistic Footer Component
 * Displays system status badge and concise copyright attribution.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono text-slate-400">
            Mamdani Fuzzy Inference Engine • Zero-Latency Client Inference
          </span>
        </div>

        <p className="text-slate-400 text-xs">
          &copy; {currentYear} Engine Diagnostics. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

