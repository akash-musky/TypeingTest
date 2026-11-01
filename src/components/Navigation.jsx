import {
  BarChart3,
  Keyboard,
  Moon,
  Settings2,
  Sparkles,
  Sun,
} from "lucide-react";
import TypeOrbitLogo from "./TypeOrbitLogo";

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
          aria-label="TypeOrbit home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("test");
          }}
        >
          <TypeOrbitLogo />
          <span className="brand-wordmark">
            Type<span>Orbit</span>
          </span>
        </a>
        <nav aria-label="Main navigation" className="nav-links">
          {items.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              title={label}
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
            <span /> Type Beyond Limits.
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
      <span className="footer-motto">
        <TypeOrbitLogo size={22} /> Type Beyond Limits.
      </span>
      <span className="footer-credit">
        Built by <strong>Akash Kumar</strong>
      </span>
    </footer>
  );
}
