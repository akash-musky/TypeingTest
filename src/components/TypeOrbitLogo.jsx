import { useId } from "react";

/** Vector brand mark: a forward-leaning T crossing a violet/cyan orbital ring. */
export default function TypeOrbitLogo({ className = "", size = 48 }) {
  const id = `typeorbit-${useId().replace(/:/g, "")}`;
  return (
    <svg
      className={`typeorbit-logo ${className}`}
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`${id}-letter`}
          x1="25"
          y1="20"
          x2="48"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C084FC" />
          <stop offset=".5" stopColor="#A855F7" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
        <linearGradient
          id={`${id}-ring`}
          x1="10"
          y1="60"
          x2="69"
          y2="19"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A855F7" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <ellipse
        cx="40"
        cy="40"
        rx="35"
        ry="15"
        transform="rotate(-32 40 40)"
        stroke={`url(#${id}-ring)`}
        strokeWidth="2"
        opacity=".45"
      />
      <path
        d="M24 19H59L56 28H44L35 61H24L33 28H21L24 19Z"
        fill={`url(#${id}-letter)`}
      />
      <path
        d="M10.3 58.5C15.1 66.1 43.1 55.4 60.1 39.3C67.5 32.3 71.8 25.4 69.7 21.5"
        stroke={`url(#${id}-ring)`}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="69.7" cy="21.5" r="3.2" fill="#22D3EE" />
      <circle cx="13" cy="54" r="1.6" fill="#C084FC" />
    </svg>
  );
}
