import {
  AlignLeft,
  Clock3,
  Hash,
  Quote,
  SlidersHorizontal,
  Type,
} from "lucide-react";

function Group({ label, icon: Icon, value, options, onChange, disabled }) {
  return (
    <fieldset className="control-group" disabled={disabled}>
      <legend>
        <Icon size={13} />
        {label}
      </legend>
      <div className="segment-group">
        {options.map((option) => (
          <button
            type="button"
            key={option.value}
            className={`segment ${value === option.value ? "selected" : ""}`}
            aria-pressed={value === option.value}
            aria-label={`${label}: ${option.label}`}
            onClick={() => onChange(option.value)}
          >
            {option.icon && <option.icon size={13} />}
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function TestControls({ preferences, update, disabled }) {
  return (
    <div className="test-controls panel">
      <Group
        label="DURATION"
        icon={Clock3}
        value={preferences.duration}
        disabled={disabled}
        onChange={(duration) => update({ duration })}
        options={[15, 30, 60, 120].map((n) => ({ value: n, label: `${n}s` }))}
      />
      <div className="control-divider" />
      <Group
        label="DIFFICULTY"
        icon={SlidersHorizontal}
        value={preferences.difficulty}
        disabled={disabled}
        onChange={(difficulty) => update({ difficulty })}
        options={["Easy", "Medium", "Hard"].map((n) => ({
          value: n.toLowerCase(),
          label: n,
        }))}
      />
      <div className="control-divider" />
      <Group
        label="TEXT MODE"
        icon={Type}
        value={preferences.mode}
        disabled={disabled}
        onChange={(mode) => update({ mode })}
        options={[
          { value: "words", label: "Words", icon: Type },
          { value: "sentences", label: "Sentences", icon: AlignLeft },
          { value: "numbers", label: "Numbers", icon: Hash },
          { value: "punctuation", label: "Punctuation", icon: Quote },
        ]}
      />
    </div>
  );
}
