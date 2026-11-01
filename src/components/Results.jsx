import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownToLine,
  ArrowRight,
  BarChart3,
  Check,
  Clock3,
  Crosshair,
  RotateCcw,
  Trophy,
  X,
  Zap,
} from "lucide-react";

const dateFormat = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function ResultDetail({ result, history, onRetry, onViewHistory }) {
  const best = Math.max(
    0,
    ...history.filter((r) => !r.practice).map((r) => r.wpm),
  );
  const isBest = !result.practice && result.wpm > 0 && result.wpm >= best;
  return (
    <div className="result-detail animate-in">
      <div className="result-banner">
        <div className="result-badge">
          <Trophy size={23} />
        </div>
        <div>
          <h2>
            {isBest
              ? "A new personal best. Nicely done!"
              : "One step closer to your best."}
          </h2>
          <p>
            {result.practice ? `${result.practice} · ` : ""}
            {result.configuredDuration}s test <span>·</span> {result.difficulty}{" "}
            <span>·</span> {result.mode}
          </p>
        </div>
        <span className="complete-badge">
          <Check size={12} /> Test complete
        </span>
      </div>
      <div className="result-stats">
        <ResultStat
          label="TYPING SPEED"
          value={result.wpm}
          unit="wpm"
          icon={Zap}
          color="violet"
        />
        <ResultStat
          label="ACCURACY"
          value={result.accuracy}
          unit="%"
          icon={Crosshair}
          color="cyan"
        />
        <ResultStat
          label="TOTAL ERRORS"
          value={result.errors}
          icon={X}
          color="pink"
        />
        <ResultStat
          label="CORRECT CHARS"
          value={result.correct}
          icon={Check}
          color="green"
        />
        <ResultStat
          label="TIME TYPED"
          value={result.duration}
          unit="s"
          icon={Clock3}
          color="violet"
        />
      </div>
      <div className="performance-panel panel">
        <div className="section-title">
          <div>
            <h3>Your rhythm, visualized</h3>
            <p>Typing speed throughout your test</p>
          </div>
          <span className="chart-legend">
            <i /> Words per minute
          </span>
        </div>
        <div
          className="chart-container"
          role="img"
          aria-label={`Speed over ${result.duration} seconds, finishing at ${result.wpm} words per minute`}
        >
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart
              data={result.samples}
              margin={{ top: 10, right: 12, left: -22, bottom: 0 }}
            >
              <defs>
                <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9b78fa" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#9b78fa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="var(--chart-grid)"
                strokeDasharray="4 5"
              />
              <XAxis
                dataKey="second"
                type="number"
                domain={[0, Math.max(1, result.duration)]}
                tickFormatter={(value) => `${value}s`}
                axisLine={false}
                tickLine={false}
                minTickGap={28}
                tick={{ fill: "var(--muted)", fontSize: 11 }}
              />
              <YAxis
                domain={[0, "auto"]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted)", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--surface-solid)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  color: "var(--text)",
                }}
                labelFormatter={(value) => `${value} seconds`}
                formatter={(value) => [`${value} wpm`, "Speed"]}
              />
              <Area
                type="monotone"
                dataKey="wpm"
                stroke="#a78bfa"
                strokeWidth={2.5}
                fill="url(#speedGradient)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="result-bottom">
        <div className="personal-best">
          <Trophy size={20} />
          <div>
            <span>YOUR PERSONAL BEST</span>
            <strong>
              {best} <small>wpm</small>
            </strong>
          </div>
          <p>
            Keep showing up.
            <br />
            The speed will follow.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {onViewHistory && (
            <button className="secondary-button" onClick={onViewHistory}>
              View history <BarChart3 size={16} />
            </button>
          )}
          <button className="primary-button" onClick={onRetry}>
            Try Again <RotateCcw size={16} />
          </button>
        </div>
      </div>
      <p className="calculation-note">
        WPM = correct characters ÷ 5 ÷ minutes. Accuracy counts all character
        attempts, including corrected mistakes. Personal best includes completed
        tests across modes; practice is excluded.
      </p>
    </div>
  );
}

function ResultStat({ label, value, unit, icon: Icon, color }) {
  return (
    <div className={`result-stat panel metric-${color}`}>
      <span className="metric-label">
        <Icon size={14} />
        {label}
      </span>
      <div>
        <strong>{value}</strong>
        {unit && <span>{unit}</span>}
      </div>
    </div>
  );
}

export default function Results({ history, onRetry }) {
  const [selectedId, setSelectedId] = useState(null);
  const selected = history.find((r) => r.id === selectedId) || history[0];
  const [filter, setFilter] = useState("all");
  const filtered = history.filter(
    (r) =>
      filter === "all" || (filter === "practice" ? r.practice : !r.practice),
  );
  function exportResults() {
    const blob = new Blob([JSON.stringify(history, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "typeorbit-results.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  if (!history.length)
    return (
      <div className="empty-state panel animate-in">
        <span className="empty-icon">
          <BarChart3 size={34} />
        </span>
        <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
        <h2>A blank slate. So much potential.</h2>
        <p>
          Complete your first test to see your speed, discover your rhythm,
          <br className="hidden sm:block" /> and start building a little
          momentum.
        </p>
        <button className="primary-button" onClick={onRetry}>
          Take your first test <ArrowRight size={17} />
        </button>
      </div>
    );
  return (
    <div className="animate-in">
      <ResultDetail result={selected} history={history} onRetry={onRetry} />
      <section className="history-panel panel">
        <div className="section-title">
          <div>
            <h3>
              Your typing journey{" "}
              <span className="count-badge">{history.length}</span>
            </h3>
            <p>Your latest 100 sessions, saved on this device.</p>
          </div>
          <button
            className="secondary-button compact-button"
            onClick={exportResults}
          >
            <ArrowDownToLine size={15} />
            Export
          </button>
        </div>
        <div
          className="history-filter"
          role="group"
          aria-label="Filter history"
        >
          {["all", "tests", "practice"].map((value) => (
            <button
              key={value}
              className={filter === value ? "selected" : ""}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {value === "all" ? "All sessions" : value}
            </button>
          ))}
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>SESSION</th>
                <th>SPEED</th>
                <th>ACCURACY</th>
                <th>ERRORS</th>
                <th>MODE</th>
                <th>DURATION</th>
                <th>
                  <span className="sr-only">View result</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((result) => (
                <tr
                  key={result.id}
                  className={selected.id === result.id ? "selected-row" : ""}
                >
                  <td>
                    {dateFormat.format(new Date(result.date))}
                    {result.practice && (
                      <small className="table-practice">Practice</small>
                    )}
                  </td>
                  <td className="table-speed">
                    {result.wpm} <small>wpm</small>
                  </td>
                  <td>{result.accuracy}%</td>
                  <td>{result.errors}</td>
                  <td className="capitalize">{result.mode}</td>
                  <td>{result.duration}s</td>
                  <td>
                    <button
                      className="icon-button"
                      aria-label={`View result from ${dateFormat.format(new Date(result.date))}`}
                      onClick={() => {
                        setSelectedId(result.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <ArrowRight size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <p className="empty-filter">
              No {filter} yet. Your next session will appear here.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
