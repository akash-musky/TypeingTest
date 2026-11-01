import { CornerDownLeft, Delete, Keyboard, MoveUp } from "lucide-react";

const rows = [
  [
    ["`", "Backquote"],
    ..."1234567890".split("").map((v) => [v, `Digit${v}`]),
    ["−", "Minus"],
    ["=", "Equal"],
    ["backspace", "Backspace", 1.7],
  ],
  [
    ["tab", "Tab", 1.4],
    ..."qwertyuiop".split("").map((v) => [v, `Key${v.toUpperCase()}`]),
    ["[", "BracketLeft"],
    ["]", "BracketRight"],
    ["\\", "Backslash", 1.3],
  ],
  [
    ["caps", "CapsLock", 1.7],
    ..."asdfghjkl".split("").map((v) => [v, `Key${v.toUpperCase()}`]),
    [";", "Semicolon"],
    ["'", "Quote"],
    ["enter", "Enter", 2],
  ],
  [
    ["shift", "ShiftLeft", 2.1],
    ..."zxcvbnm".split("").map((v) => [v, `Key${v.toUpperCase()}`]),
    [",", "Comma"],
    [".", "Period"],
    ["/", "Slash"],
    ["shift", "ShiftRight", 2.6],
  ],
  [
    ["ctrl", "ControlLeft", 1.2],
    ["alt", "AltLeft", 1.2],
    ["⌘", "MetaLeft", 1.2],
    ["space", "Space", 7],
    ["⌘", "MetaRight", 1.2],
    ["alt", "AltRight", 1.2],
    ["ctrl", "ControlRight", 1.2],
  ],
];

export default function VirtualKeyboard({ pressed }) {
  return (
    <section className="keyboard-section" aria-label="Virtual keyboard">
      <div className="keyboard-heading">
        <span>
          <Keyboard size={14} /> YOUR KEYBOARD, IN SYNC
        </span>
        <span>
          <i /> Let muscle memory do its thing.
        </span>
      </div>
      <div className="virtual-keyboard" aria-hidden="true">
        {rows.map((row, i) => (
          <div className="keyboard-row" key={i}>
            {row.map(([label, code, width = 1]) => (
              <span
                className={`key ${pressed.has(code) ? "pressed" : ""} ${width > 1 ? "key-modifier" : ""} ${["KeyF", "KeyJ"].includes(code) ? "home-key" : ""}`}
                key={code}
                style={{ flex: width }}
              >
                {label === "backspace" ? (
                  <Delete size={15} />
                ) : label === "enter" ? (
                  <>
                    <span>enter</span>
                    <CornerDownLeft size={12} />
                  </>
                ) : label === "shift" ? (
                  <>
                    <MoveUp size={12} />
                    <span>shift</span>
                  </>
                ) : label === "space" ? (
                  <span className="space-mark" />
                ) : (
                  label
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
