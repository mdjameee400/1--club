import { useId, type CSSProperties } from "react";
import type { Flavor } from "@/data/flavors";

/** Outline shared by clip-path, glass and stroke. */
const BODY =
  "M52 44 H108 V70 C108 86 142 88 142 116 V398 C142 414 130 426 114 426 H46 C30 426 18 414 18 398 V116 C18 88 52 86 52 70 Z";

const serif: CSSProperties = { fontFamily: "var(--font-serif)" };
const sans: CSSProperties = { fontFamily: "var(--font-sans)" };

const ICE = [
  { x: 30, y: 384, r: -10 },
  { x: 58, y: 396, r: 8 },
  { x: 90, y: 380, r: -6 },
  { x: 112, y: 398, r: 12 },
  { x: 74, y: 366, r: 14 },
];

const BUBBLES = [
  { cx: 44, cy: 400, r: 2.2, d: "0s", t: "6.5s" },
  { cx: 108, cy: 410, r: 1.6, d: "1.8s", t: "5.5s" },
  { cx: 70, cy: 416, r: 2.6, d: "3.2s", t: "7s" },
  { cx: 124, cy: 380, r: 1.8, d: "4.4s", t: "6s" },
];

function Glyph({ f }: { f: Flavor }) {
  const a = f.accent;
  switch (f.icon) {
    case "cane":
      return (
        <g stroke={a} strokeWidth="1.5" strokeLinecap="round" fill="none">
          <path d="M72 304V282M80 306V278M88 304V282" />
          <path d="M70 291h4M78 295h4M86 289h4" />
        </g>
      );
    case "coconut":
      return (
        <g stroke={a} strokeWidth="1.4" strokeLinecap="round" fill="none">
          <path d="M68 289h24a12 12 0 0 1-24 0z" fill="#fff" />
          <path d="M83 289l8-11" />
        </g>
      );
    case "bean":
      return (
        <g>
          <ellipse
            cx="80"
            cy="292"
            rx="7"
            ry="10.5"
            transform="rotate(32 80 292)"
            fill={a}
          />
          <path
            d="M75.5 297c3-1 4-5 8-8"
            stroke="#F9F6F0"
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      );
    case "banana":
      return (
        <g strokeLinecap="round" fill="none">
          <path d="M67 288q13 17 26 0" stroke="#E2C54A" strokeWidth="3.4" />
          <circle cx="75" cy="283" r="1" fill={a} />
          <circle cx="85" cy="283" r="1" fill={a} />
        </g>
      );
    case "mango":
    default:
      return (
        <g>
          <circle cx="80" cy="294" r="9.5" fill="#EC982B" stroke="#1E4D3A" strokeWidth="1.1" />
          <path d="M80 285q-1-7-8-6 1 6 8 6z" fill="#3E7A58" />
        </g>
      );
  }
}

type Props = {
  flavor: Flavor;
  className?: string;
  /** Show the arched label */
  label?: boolean;
  /** Animate liquid + bubbles */
  animate?: boolean;
};

/**
 * Pure-SVG bottle: zero image weight, crisp at any size, themed per flavor.
 */
export default function Bottle({
  flavor: f,
  className,
  label = true,
  animate = true,
}: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const top = 426 - f.level * 306;
  const [l1, l2] = f.name.toUpperCase().split(" ");

  return (
    <svg
      viewBox="0 0 160 440"
      className={className}
      aria-hidden="true"
      focusable="false"
      overflow="visible"
    >
      <defs>
        <linearGradient id={`${uid}l`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={f.liquid} />
          <stop offset="1" stopColor={f.liquid2} />
        </linearGradient>
        <linearGradient id={`${uid}g`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity=".5" />
          <stop offset=".2" stopColor="#fff" stopOpacity=".1" />
          <stop offset=".8" stopColor="#fff" stopOpacity=".05" />
          <stop offset="1" stopColor="#fff" stopOpacity=".38" />
        </linearGradient>
        <clipPath id={`${uid}c`}>
          <path d={BODY} />
        </clipPath>
      </defs>

      {/* cap or stopper */}
      {f.slim ? (
        <g>
          <rect x="54" y="12" width="52" height="34" rx="7" fill="#EAF0F1" stroke="#B9C7CC" strokeWidth="1.6" />
          <path d="M54 22h52M54 30h52M54 38h52" stroke="#B9C7CC" strokeWidth="1.2" />
        </g>
      ) : (
        <g>
          <rect x="44" y="6" width="72" height="40" rx="6" fill="#1C1917" />
          <path
            d="M54 10v32M62 10v32M70 10v32M78 10v32M86 10v32M94 10v32M102 10v32"
            stroke="#fff"
            strokeOpacity=".07"
            strokeWidth="2"
          />
          <rect x="44" y="6" width="72" height="8" rx="4" fill="#fff" fillOpacity=".08" />
        </g>
      )}

      {/* liquid */}
      <g clipPath={`url(#${uid}c)`}>
        <rect x="0" y={top} width="160" height={440 - top} fill={`url(#${uid}l)`} />
        <g
          className={animate ? "slosh" : undefined}
          style={{ transformOrigin: `80px ${top}px` }}
        >
          <ellipse cx="80" cy={top} rx="66" ry="5" fill="#fff" fillOpacity=".28" />
          <ellipse cx="80" cy={top + 1} rx="66" ry="4" fill={f.liquid} fillOpacity=".5" />
        </g>

        {f.ice &&
          ICE.map((c, i) => (
            <rect
              key={i}
              x={c.x}
              y={c.y}
              width="17"
              height="17"
              rx="4.5"
              transform={`rotate(${c.r} ${c.x + 8} ${c.y + 8})`}
              fill="#fff"
              fillOpacity=".3"
              stroke="#fff"
              strokeOpacity=".55"
              strokeWidth="1"
            />
          ))}

        {BUBBLES.map((b, i) => (
          <circle
            key={i}
            cx={b.cx}
            cy={b.cy}
            r={b.r}
            fill="#fff"
            fillOpacity=".7"
            className={animate ? "bubble" : undefined}
            style={{ animationDelay: b.d, animationDuration: b.t }}
          />
        ))}
      </g>

      {/* glass */}
      <path d={BODY} fill={`url(#${uid}g)`} stroke="#8FA3AB" strokeOpacity=".6" strokeWidth="2" />
      <path d="M27 124V380" stroke="#fff" strokeOpacity=".55" strokeWidth="4" strokeLinecap="round" />
      <path d="M134 150V300" stroke="#fff" strokeOpacity=".3" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="80" cy="418" rx="52" ry="5" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="1.2" />

      {/* arched label */}
      {label && (
        <g>
          <path
            d="M38 352V214A42 42 0 0 1 122 214V352Z"
            fill="#F7F2E6"
            stroke="#DCD3BF"
            strokeWidth="1"
          />
          <text x="80" y="204" textAnchor="middle" fontSize="5.2" letterSpacing="1.5" fill="#1F1A17" style={sans}>
            THE 1% CLUB
          </text>
          <text x="80" y="221" textAnchor="middle" fontSize="12" fill="#1F1A17" style={serif}>
            {f.no}
          </text>
          <path d="M72 226h16" stroke="#1F1A17" strokeOpacity=".3" strokeWidth=".6" />
          <text x="80" y="241" textAnchor="middle" fontSize="10" fontWeight="600" letterSpacing=".5" fill="#1E4D3A" style={serif}>
            {l1}
          </text>
          <text x="80" y="253" textAnchor="middle" fontSize="10" fontWeight="600" letterSpacing=".5" fill="#1E4D3A" style={serif}>
            {l2}
          </text>
          <text x="80" y="264" textAnchor="middle" fontSize="4.2" letterSpacing="1.2" fill="#1F1A17" fillOpacity=".7" style={sans}>
            {f.type.toUpperCase()}
          </text>
          <circle cx="80" cy="292" r="18" fill={f.soft} />
          <Glyph f={f} />
          <text x="80" y="325" textAnchor="middle" fontSize="7.2" fontStyle="italic" fill="#1F1A17" fillOpacity=".8" style={serif}>
            {f.tagline.length > 26 ? f.tagline.slice(0, 26) : f.tagline}
          </text>
          <path d="M50 340h60" stroke="#1F1A17" strokeOpacity=".2" strokeWidth=".5" />
          <text x="80" y="347" textAnchor="middle" fontSize="3.6" letterSpacing="1" fill="#1F1A17" fillOpacity=".6" style={sans}>
            LENS-E UTHSOB 2.0
          </text>
        </g>
      )}
    </svg>
  );
}
