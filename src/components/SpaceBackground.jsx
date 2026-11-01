/** Decorative CSS geometry only: no canvas, timers, or network assets. */
export default function SpaceBackground() {
  return (
    <div className="space-background" aria-hidden="true">
      <div className="space-stars" />
      <div className="space-orbit orbit-outer">
        <span className="orbit-moon" />
      </div>
      <div className="space-orbit orbit-inner" />
      <div className="space-orbit orbit-lower" />
    </div>
  );
}
