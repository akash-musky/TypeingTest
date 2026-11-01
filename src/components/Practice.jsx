import {
  ArrowRight,
  Crosshair,
  Hash,
  Keyboard,
  Sparkles,
  Timer,
  TrendingUp,
} from "lucide-react";
import { drills } from "../data/passages";

export default function Practice({ onChoose }) {
  const icons = [Keyboard, TrendingUp, Crosshair, Hash];
  return (
    <div className="animate-in">
      <div className="practice-intro panel">
        <span className="practice-intro-icon">
          <Sparkles size={25} />
        </span>
        <div>
          <h2>Small sessions. Lasting progress.</h2>
          <p>
            Pick a focus, settle into your rhythm, and give yourself a few
            minutes to improve.
          </p>
        </div>
        <span className="practice-tag">YOUR DAILY DOSE OF FOCUS</span>
      </div>
      <div className="practice-grid">
        {drills.map((drill, index) => {
          const Icon = icons[index];
          return (
            <article
              key={drill.id}
              className={`practice-card panel practice-${index}`}
            >
              <div className="practice-card-top">
                <span className="drill-icon">
                  <Icon size={24} />
                </span>
                <span>
                  <Timer size={13} /> {drill.duration}s
                </span>
              </div>
              <span className="eyebrow">{drill.category}</span>
              <h2>{drill.title}</h2>
              <p>{drill.description}</p>
              <div className="drill-keys">{drill.keys}</div>
              <button
                className="practice-start"
                onClick={() => onChoose(drill)}
              >
                Start practice <ArrowRight size={17} />
              </button>
            </article>
          );
        })}
      </div>
      <p className="practice-note">
        <Crosshair size={15} /> Aim for accuracy first. Speed grows naturally
        with consistency.
      </p>
    </div>
  );
}
