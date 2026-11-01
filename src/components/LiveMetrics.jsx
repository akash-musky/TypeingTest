import { Activity, Clock3, Crosshair, Sparkles, X, Zap } from "lucide-react";

export default function LiveMetrics({ session, stats }) {
  const { elapsed, config, samples, status } = session;
  const remaining = Math.max(0, Math.ceil(config.duration - elapsed));
  const progress = Math.min(1, elapsed / config.duration);
  const circumference = 2 * Math.PI * 56;
  const points = [...samples.slice(-19), { wpm: stats.wpm }];
  const ceiling = Math.max(40, ...points.map((point) => point.wpm));
  const path = points.map((point, index) => `${(index / Math.max(1, points.length - 1)) * 180},${38 - (point.wpm / ceiling) * 32}`).join(" ");

  return (
    <aside className="metrics-sidebar" aria-label="Live test statistics">
      <div className="sidebar-heading"><Activity size={14} /><span>LIVE INSIGHTS</span><i className={status === "running" ? "is-live" : ""} /></div>
      <div className="live-metric timer-card panel metric-violet">
        <span className="metric-label"><Clock3 size={14} /> TIME LEFT</span>
        <div className="countdown-dial">
          <svg viewBox="0 0 140 140" aria-hidden="true">
            <circle className="dial-guide" cx="70" cy="70" r="67" />
            <circle className="dial-track" cx="70" cy="70" r="56" />
            <circle className="dial-progress" cx="70" cy="70" r="56" strokeDasharray={circumference} strokeDashoffset={circumference * progress} transform="rotate(-90 70 70)" />
          </svg>
          <div className="dial-value"><strong>{String(remaining).padStart(2, "0")}</strong><span>SECONDS</span></div>
        </div>
        <span className="timer-caption">{status === "running" ? "Make every second count" : "Your next moment of focus"}</span>
        <div className="timer-card-footer"><span>{config.duration}s session</span><span>{Math.round(progress * 100)}% complete</span></div>
      </div>
      <div className="live-metric sidebar-stat speed-card panel metric-cyan">
        <div className="sidebar-stat-top"><span className="metric-label"><Zap size={14} /> LIVE SPEED</span><span className="stat-symbol"><Zap size={15} /></span></div>
        <div className="sidebar-stat-value"><strong>{String(stats.wpm).padStart(2, "0")}</strong><span className="metric-unit">wpm</span></div>
        <svg className="speed-sparkline" viewBox="0 0 180 42" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="liveSpeedFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="currentColor" stopOpacity=".2" /><stop offset="100%" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs><polygon points={`0,42 ${path} 180,42`} fill="url(#liveSpeedFill)" /><polyline points={path} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" /></svg>
        <p className="stat-caption">Your rhythm, in real time</p>
      </div>
      <div className="live-metric sidebar-stat panel metric-green">
        <div className="sidebar-stat-top"><span className="metric-label"><Crosshair size={14} /> ACCURACY</span><span className="stat-symbol"><Crosshair size={15} /></span></div>
        <div className="sidebar-stat-value"><strong>{stats.accuracy}</strong><span className="metric-unit">%</span></div>
        <div className="accuracy-meter" aria-hidden="true"><span style={{ width: `${stats.accuracy}%` }} /></div>
        <p className="stat-caption">{session.attempts ? `${stats.correct} correct characters` : "Precision is your superpower"}</p>
      </div>
      <div className="live-metric sidebar-stat panel metric-pink">
        <div className="sidebar-stat-top"><span className="metric-label"><X size={14} /> ERRORS</span><span className="stat-symbol"><X size={15} /></span></div>
        <div className="sidebar-stat-value"><strong>{String(stats.errors).padStart(2, "0")}</strong><span className="metric-unit">misses</span></div>
        <p className="stat-caption">{stats.errors ? "Breathe. Reset. Keep going." : "A clean slate. Keep it going."}</p>
      </div>
      <div className="sidebar-note"><Sparkles size={14} /><span>Progress over perfection.<br />You’re right where you need to be.</span></div>
    </aside>
  );
}
