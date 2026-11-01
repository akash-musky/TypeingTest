import {
  BarChart3,
  Command,
  Keyboard,
  Moon,
  Settings2,
  Sparkles,
  Sun,
  Terminal,
} from "lucide-react";

const items = [
  { id: "test", label: "Test", icon: Keyboard },
  { id: "results", label: "Results", icon: BarChart3 },
  { id: "practice", label: "Practice", icon: Sparkles },
  { id: "settings", label: "Settings", icon: Settings2 },
];

export default function Navigation({ page, onNavigate, theme, toggleTheme }) {
  return (
    <header className="site-header">
      <div className="nav-inner">
        <a
          href="#test"
          className="brand"
          aria-label="TypingTest home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("test");
          }}
        >
          <span className="brand-icon">
            <Terminal size={22} strokeWidth={2.7} />
          </span>
          <span>
            Typing<span className="brand-light">Test</span>
            <span className="brand-dot">.</span>
          </span>
        </a>
        <nav aria-label="Main navigation" className="nav-links">
          {items.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`nav-link ${page === id ? "active" : ""}`}
              aria-current={page === id ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(id);
              }}
            >
              <Icon size={16} />
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <div className="nav-right">
          <span className="flow-label">
            <span /> Find your flow
          </span>
          <button
            className="icon-button theme-button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <span>
        <Command size={14} /> A little better, one keystroke at a time.
      </span>
      <span>
        Made for focus.
        <i />
        Built for you.
      </span>
    </footer>
  );
}
