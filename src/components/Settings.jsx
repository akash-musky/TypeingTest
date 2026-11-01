import { useState } from "react";
import {
  Check,
  Keyboard,
  Monitor,
  Moon,
  RotateCcw,
  ShieldCheck,
  Sun,
  Trash2,
} from "lucide-react";
import { defaults } from "../lib/storage";

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      className={`toggle ${checked ? "on" : ""}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}

function SettingRow({ title, description, children }) {
  return (
    <div className="setting-row">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function Settings({
  preferences,
  update,
  clearHistory,
  historyCount,
}) {
  const [confirmClear, setConfirmClear] = useState(false);
  const [cleared, setCleared] = useState(false);
  return (
    <div className="settings-layout animate-in">
      <div className="settings-main">
        <section className="settings-section panel">
          <h2>
            <Monitor size={18} /> Make yourself at home
          </h2>
          <SettingRow
            title="Appearance"
            description="Find the light that feels right."
          >
            <div className="settings-segments">
              {[
                { key: "dark", label: "Dark", icon: Moon },
                { key: "light", label: "Light", icon: Sun },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  aria-pressed={preferences.theme === key}
                  className={preferences.theme === key ? "selected" : ""}
                  onClick={() => update({ theme: key })}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </SettingRow>
          <SettingRow
            title="Typing text size"
            description="A comfortable size for better focus."
          >
            <div className="settings-segments">
              {["small", "medium", "large"].map((size, i) => (
                <button
                  key={size}
                  className={preferences.fontSize === size ? "selected" : ""}
                  aria-pressed={preferences.fontSize === size}
                  aria-label={`${size} typing text`}
                  onClick={() => update({ fontSize: size })}
                  style={{ fontSize: 12 + i * 3 }}
                >
                  Aa
                </button>
              ))}
            </div>
          </SettingRow>
          <SettingRow
            title="Smooth cursor"
            description="A subtle animated caret and smooth text scrolling."
          >
            <Toggle
              label="Smooth cursor"
              checked={preferences.smoothCaret}
              onChange={(smoothCaret) => update({ smoothCaret })}
            />
          </SettingRow>
        </section>
        <section className="settings-section panel">
          <h2>
            <Keyboard size={18} /> Your typing experience
          </h2>
          <SettingRow
            title="Typing sounds"
            description="A soft click for each key. A lower tone for mistakes."
          >
            <Toggle
              label="Typing sounds"
              checked={preferences.sound}
              onChange={(sound) => update({ sound })}
            />
          </SettingRow>
          <SettingRow
            title="Keyboard shortcuts"
            description="A fresh start is always a keystroke away."
          >
            <span className="settings-shortcut">
              <kbd>ctrl / ⌘</kbd> + <kbd>enter</kbd>
              <small>
                or press <kbd>esc</kbd>
              </small>
            </span>
          </SettingRow>
        </section>
        <section className="settings-section panel">
          <h2>
            <ShieldCheck size={18} /> Your data, your device
          </h2>
          <SettingRow
            title="Clear test history"
            description={`${historyCount} saved ${historyCount === 1 ? "session" : "sessions"}. This permanently removes local results.`}
          >
            {!confirmClear ? (
              <button
                disabled={!historyCount}
                className="danger-button"
                onClick={() => setConfirmClear(true)}
              >
                <Trash2 size={14} />
                Clear history
              </button>
            ) : (
              <div className="clear-confirm">
                <span>Delete all results?</span>
                <button
                  className="danger-button"
                  onClick={() => {
                    clearHistory();
                    setConfirmClear(false);
                    setCleared(true);
                  }}
                >
                  Delete
                </button>
                <button
                  className="secondary-button compact-button"
                  onClick={() => setConfirmClear(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </SettingRow>
          {cleared && (
            <p className="saved-message" role="status">
              <Check size={14} />
              History cleared.
            </p>
          )}
          <SettingRow
            title="Reset preferences"
            description="Return to the default look and feel."
          >
            <button
              className="secondary-button compact-button"
              onClick={() => update({ ...defaults })}
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </SettingRow>
        </section>
      </div>
      <aside className="settings-aside panel">
        <span className="privacy-icon">
          <ShieldCheck size={27} />
        </span>
        <h3>Just you and your progress.</h3>
        <p>
          Your preferences and latest 100 results are stored right here, in this
          browser. No account, no uploads, no distractions.
        </p>
        <div>
          <Check size={14} /> Preferences save automatically
        </div>
        <div>
          <Check size={14} /> No tracking or external requests
        </div>
        <p className="aside-note">
          Clearing browser data will also clear your history. Export your
          sessions from Results to keep a copy.
        </p>
      </aside>
    </div>
  );
}
