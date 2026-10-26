import { useId, type CSSProperties } from "react";
import type { Flavor } from "@/data/flavors";

/** Classic 1% Club square-shoulder glass bottle (02, 03, 04, 05) */
const CLASSIC_BODY =
  "M56 42 H104 V62 C104 80 138 88 138 114 V398 C138 414 126 426 110 426 H50 C34 426 22 414 22 398 V114 C22 88 56 80 56 62 Z";

/** Slender vintage syrup / apothecary bottle for 01 Sugarcane Splash */
const SLIM_BODY =
  "M68 40 H92 V72 C92 78 95 82 95 86 C95 90 92 94 92 100 C92 120 120 135 120 165 C120 190 114 210 114 235 C114 260 118 280 118 395 C118 412 108 424 94 424 H66 C52 424 42 412 42 395 C42 280 46 260 46 235 C46 210 40 190 40 165 C40 135 68 120 68 100 C68 94 65 90 65 86 C65 82 68 78 68 72 Z";

const serif: CSSProperties = { fontFamily: "var(--font-serif)" };
const sans: CSSProperties = { fontFamily: "var(--font-sans)" };

/** Realistic faceted 3D ice cubes */
const ICE_CUBES = [
  { x: 34, y: 382, s: 19, r: -12, o: 0.8 },
  { x: 62, y: 392, s: 21, r: 8, o: 0.85 },
  { x: 92, y: 376, s: 18, r: -6, o: 0.75 },
  { x: 108, y: 392, s: 20, r: 15, o: 0.85 },
  { x: 48, y: 358, s: 17, r: 18, o: 0.7 },
  { x: 80, y: 362, s: 19, r: -10, o: 0.75 },
];

const BUBBLES = [
  { cx: 48, cy: 395, r: 2.2, d: "0s", t: "5.5s" },
  { cx: 104, cy: 405, r: 1.8, d: "1.4s", t: "4.8s" },
  { cx: 72, cy: 412, r: 2.5, d: "2.6s", t: "6.2s" },
  { cx: 118, cy: 370, r: 1.5, d: "3.8s", t: "5s" },
  { cx: 58, cy: 340, r: 2, d: "1s", t: "5.8s" },
];

function Glyph({ f }: { f: Flavor }) {
  const a = f.accent;
  switch (f.icon) {
    case "cane":
      return (
        <g stroke={a} strokeWidth="1.6" strokeLinecap="round" fill="none">
          <circle cx="80" cy="292" r="15" stroke={a} strokeWidth="1" strokeOpacity="0.4" fill="none" />
          <path d="M72 304V280M80 306V277M88 304V280" />
          <path d="M70 290h4M78 294h4M86 288h4" />
          <path d="M70 298h4M78 301h4M86 296h4" />
        </g>
      );
    case "coconut":
      return (
        <g>
          <circle cx="80" cy="292" r="16" fill="#D2E8E6" />
          {/* Half coconut bowl */}
          <path
            d="M68 291 C68 301, 92 301, 92 291 Z"
            fill="#5E8B88"
            stroke="#3F6F6B"
            strokeWidth="1.2"
          />
          {/* White inner coconut flesh */}
          <path
            d="M70 291 C70 299, 90 299, 90 291 Z"
            fill="#FAF8F5"
          />
          {/* Straw & splash */}
          <path d="M83 291 L92 277" stroke="#3F6F6B" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="95" cy="275" r="1.2" fill="#5E8B88" />
          <circle cx="73" cy="285" r="1" fill="#5E8B88" />
        </g>
      );
    case "bean":
      return (
        <g>
          <ellipse
            cx="80"
            cy="292"
            rx="7.5"
            ry="11"
            transform="rotate(32 80 292)"
            fill="#2B1A13"
          />
          <path
            d="M75.5 297c3-1 4-5 8-8"
            stroke="#D8C6B6"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
          {/* Sparkle star next to coffee bean */}
          <path
            d="M93 286 c.3 1.8 1.6 3.1 3.4 3.4 c-1.8.3 -3.1 1.6 -3.4 3.4 c-.3-1.8 -1.6-3.1 -3.4-3.4 c1.8-.3 3.1-1.6 3.4-3.4 Z"
            fill="#D9922E"
          />
        </g>
      );
    case "banana":
      return (
        <g strokeLinecap="round">
          {/* Cute banana smile & eyes */}
          <path d="M68 288 q12 16 24 0" stroke="#D89E1E" strokeWidth="3.6" fill="none" />
          <circle cx="74" cy="283" r="1.3" fill="#2B1A13" />
          <circle cx="86" cy="283" r="1.3" fill="#2B1A13" />
        </g>
      );
    case "mango":
    default:
      return (
        <g>
          {/* Plump mango fruit */}
          <ellipse
            cx="80"
            cy="293"
            rx="9.5"
            ry="11.5"
            fill="#ED8A19"
            stroke="#B55B09"
            strokeWidth="1.1"
          />
          {/* Highlight on fruit */}
          <ellipse
            cx="77"
            cy="290"
            rx="4.5"
            ry="7"
            fill="#FFAA33"
            opacity="0.6"
          />
          {/* Stem & leaf */}
          <path d="M80 282 Q78 277 82 275" stroke="#2D5A43" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M81 278 Q88 274 88 281 Q83 282 81 278 Z" fill="#2D5A43" />
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
 * Pixel-faithful SVG bottle mirroring the brand UI design.
 */
export default function Bottle({
  flavor: f,
  className,
  label = true,
  animate = true,
}: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const isSlim = f.slim || f.id === "sugarcane-splash";
  const bodyPath = isSlim ? SLIM_BODY : CLASSIC_BODY;

  // Liquid fill height calculation
  const liquidTop = isSlim ? 424 - f.level * 250 : 426 - f.level * 306;
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
        {/* Rich liquid vertical gradient */}
        <linearGradient id={`${uid}l`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={f.liquid} />
          <stop offset="70%" stopColor={f.liquid2} />
          <stop offset="100%" stopColor={f.liquid2} stopOpacity="0.95" />
        </linearGradient>

        {/* Realistic curved glass reflections */}
        <linearGradient id={`${uid}g`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="15%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="85%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.38" />
        </linearGradient>

        {/* Clip path matching bottle silhouette */}
        <clipPath id={`${uid}c`}>
          <path d={bodyPath} />
        </clipPath>

        {/* Ice cube gradient */}
        <linearGradient id={`${uid}ice`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="50%" stopColor="#dbeafe" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      {/* Cap or Glass Stopper */}
      {isSlim ? (
        <g>
          {/* Glass stopper collar */}
          <rect x="66" y="22" width="28" height="12" rx="4" fill="#E8EEF0" stroke="#A7BDC5" strokeWidth="1.4" />
          <line x1="66" y1="26" x2="94" y2="26" stroke="#9AB3BD" strokeWidth="1.2" />
          <line x1="66" y1="30" x2="94" y2="30" stroke="#9AB3BD" strokeWidth="1.2" />
          {/* Stopper top bulb */}
          <rect x="70" y="8" width="20" height="16" rx="5" fill="#EEF4F5" stroke="#A7BDC5" strokeWidth="1.4" />
          <ellipse cx="80" cy="12" rx="7" ry="2" fill="#fff" opacity="0.8" />
        </g>
      ) : (
        <g>
          {/* Matte Black Ribbed Screw Cap */}
          <rect x="44" y="6" width="72" height="38" rx="6" fill="#1C1816" stroke="#2B2522" strokeWidth="1" />
          {/* Subtle knurling ribs */}
          <path
            d="M52 10v30 M60 10v30 M68 10v30 M76 10v30 M84 10v30 M92 10v30 M100 10v30 M108 10v30"
            stroke="#ffffff"
            strokeOpacity="0.1"
            strokeWidth="1.8"
          />
          {/* Top rim highlight */}
          <rect x="44" y="6" width="72" height="6" rx="3" fill="#ffffff" fillOpacity="0.1" />
          <line x1="45" y1="12" x2="115" y2="12" stroke="#000000" strokeWidth="1" strokeOpacity="0.4" />
        </g>
      )}

      {/* Liquid Fill Inside Clip Path */}
      <g clipPath={`url(#${uid}c)`}>
        {/* Main liquid body */}
        <rect x="0" y={liquidTop} width="160" height={440 - liquidTop} fill={`url(#${uid}l)`} />

        {/* Liquid meniscus / surface wave */}
        <g
          className={animate ? "slosh" : undefined}
          style={{ transformOrigin: `80px ${liquidTop}px` }}
        >
          <ellipse
            cx="80"
            cy={liquidTop}
            rx={isSlim ? 38 : 58}
            ry="4.5"
            fill="#ffffff"
            fillOpacity="0.32"
          />
          <ellipse
            cx="80"
            cy={liquidTop + 1}
            rx={isSlim ? 38 : 58}
            ry="3.5"
            fill={f.liquid}
            fillOpacity="0.6"
          />
        </g>

        {/* Floating Faceted Ice Cubes for Coco Blast (03) and Coconut Milkshake (02) */}
        {f.ice &&
          ICE_CUBES.map((c, i) => (
            <g
              key={i}
              transform={`translate(${c.x}, ${c.y}) rotate(${c.r})`}
              opacity={c.o}
            >
              <rect
                x="0"
                y="0"
                width={c.s}
                height={c.s}
                rx="4"
                fill={`url(#${uid}ice)`}
                stroke="#ffffff"
                strokeOpacity="0.75"
                strokeWidth="1.2"
              />
              {/* Inner bevel/facet highlight */}
              <line
                x1="2"
                y1="2"
                x2={c.s - 2}
                y2="2"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeOpacity="0.8"
              />
              <line
                x1="2"
                y1="2"
                x2="2"
                y2={c.s - 2}
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeOpacity="0.8"
              />
            </g>
          ))}

        {/* Carbonation Bubbles Rising */}
        {BUBBLES.map((b, i) => (
          <circle
            key={i}
            cx={isSlim ? 60 + (i % 3) * 18 : b.cx}
            cy={b.cy}
            r={b.r}
            fill="#ffffff"
            fillOpacity="0.75"
            className={animate ? "bubble" : undefined}
            style={{ animationDelay: b.d, animationDuration: b.t }}
          />
        ))}

        {/* Thick Glass Punt (Base Floor Reflection) */}
        <rect x="0" y="416" width="160" height="24" fill="#ffffff" fillOpacity="0.12" />
        <ellipse cx="80" cy="416" rx={isSlim ? 38 : 52} ry="4" fill="#ffffff" fillOpacity="0.2" />
      </g>

      {/* Glass Bottle Highlights & Outlines */}
      <path
        d={bodyPath}
        fill={`url(#${uid}g)`}
        stroke="#849DA6"
        strokeOpacity="0.55"
        strokeWidth="1.8"
      />

      {/* Left Specular Glare Streak */}
      <path
        d={isSlim ? "M50 140 V380" : "M29 110 V390"}
        stroke="#ffffff"
        strokeOpacity="0.6"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Right Soft Glow Line */}
      <path
        d={isSlim ? "M110 160 V360" : "M131 130 V370"}
        stroke="#ffffff"
        strokeOpacity="0.28"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Glass Base Floor Curve */}
      <ellipse
        cx="80"
        cy={isSlim ? 418 : 420}
        rx={isSlim ? 36 : 52}
        ry="4.5"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.45"
        strokeWidth="1.4"
      />

      {/* Arched Luxury Brand Label */}
      {label && (
        <g>
          {isSlim ? (
            /* Slim Pill Label for Sugarcane Splash */
            <>
              <rect
                x="48"
                y="200"
                width="64"
                height="176"
                rx="30"
                fill="#F7F3E9"
                stroke="#D8CFBD"
                strokeWidth="1"
              />
              <rect
                x="51"
                y="203"
                width="58"
                height="170"
                rx="27"
                fill="none"
                stroke="#E5DEC9"
                strokeWidth="0.8"
              />
              {/* Dot decoration */}
              <circle cx="80" cy="216" r="1.5" fill="#1F1A17" />
              <text x="80" y="228" textAnchor="middle" fontSize="4.6" letterSpacing="1.2" fill="#1F1A17" style={sans}>
                THE 1% CLUB
              </text>
              <text x="80" y="244" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1F1A17" style={serif}>
                {f.no}
              </text>
              <text x="80" y="258" textAnchor="middle" fontSize="7.2" fontWeight="600" letterSpacing="0.8" fill="#2E4A3B" style={serif}>
                {l1}
              </text>
              <text x="80" y="267" textAnchor="middle" fontSize="7.2" fontWeight="600" letterSpacing="0.8" fill="#2E4A3B" style={serif}>
                {l2}
              </text>
              <text x="80" y="277" textAnchor="middle" fontSize="3.8" letterSpacing="1" fill="#1F1A17" fillOpacity="0.7" style={sans}>
                {f.type.toUpperCase()}
              </text>
              <Glyph f={f} />
              <text x="80" y="324" textAnchor="middle" fontSize="6.2" fontStyle="italic" fill="#1F1A17" fillOpacity="0.8" style={serif}>
                {f.tagline}
              </text>
              <line x1="60" y1="334" x2="100" y2="334" stroke="#1F1A17" strokeOpacity="0.25" strokeWidth="0.5" />
              <text x="80" y="344" textAnchor="middle" fontSize="3.4" letterSpacing="0.8" fill="#1F1A17" fillOpacity="0.6" style={sans}>
                LENS-E UTHSOB 2.0
              </text>
            </>
          ) : (
            /* Classic Arched Top Label for 02, 03, 04, 05 */
            <>
              {/* Main label shape */}
              <path
                d="M36 360 V210 A44 44 0 0 1 124 210 V360 Z"
                fill="#F8F3E8"
                stroke="#DBD2BF"
                strokeWidth="1"
              />
              {/* Thin Inner Inset Border */}
              <path
                d="M39 357 V212 A41 41 0 0 1 121 212 V357 Z"
                fill="none"
                stroke="#E7DEC9"
                strokeWidth="0.8"
              />
              {/* Top diamond / dot */}
              <text x="80" y="196" textAnchor="middle" fontSize="5.5" fill="#C8963E">
                ◆
              </text>
              <text x="80" y="206" textAnchor="middle" fontSize="5.2" letterSpacing="1.6" fill="#1F1A17" style={sans}>
                THE 1% CLUB
              </text>
              <text x="80" y="222" textAnchor="middle" fontSize="13" fontWeight="500" fill="#1F1A17" style={serif}>
                {f.no}
              </text>
              <line x1="72" y1="227" x2="88" y2="227" stroke="#1F1A17" strokeOpacity="0.3" strokeWidth="0.6" />
              <text x="80" y="242" textAnchor="middle" fontSize="10.5" fontWeight="600" letterSpacing="0.8" fill="#1E4D3A" style={serif}>
                {l1}
              </text>
              <text x="80" y="254" textAnchor="middle" fontSize="10.5" fontWeight="600" letterSpacing="0.8" fill="#1E4D3A" style={serif}>
                {l2}
              </text>
              <text x="80" y="265" textAnchor="middle" fontSize="4.4" letterSpacing="1.2" fill="#1F1A17" fillOpacity="0.75" style={sans}>
                {f.type.toUpperCase()}
              </text>

              {/* Graphic Icon Circle */}
              <circle cx="80" cy="292" r="17" fill={f.soft} />
              <Glyph f={f} />

              {/* Tagline */}
              <text x="80" y="326" textAnchor="middle" fontSize="7.4" fontStyle="italic" fill="#1F1A17" fillOpacity="0.85" style={serif}>
                {f.tagline}
              </text>

              {/* Ingredients list */}
              <text x="80" y="337" textAnchor="middle" fontSize="3.6" fill="#1F1A17" fillOpacity="0.55" style={sans}>
                {f.ingredients.slice(0, 3).join(" • ")}
              </text>

              <line x1="48" y1="344" x2="112" y2="344" stroke="#1F1A17" strokeOpacity="0.25" strokeWidth="0.5" />
              <text x="80" y="352" textAnchor="middle" fontSize="3.6" letterSpacing="1.1" fill="#1F1A17" fillOpacity="0.6" style={sans}>
                1% • LENS-E UTHSOB 2.0
              </text>
            </>
          )}
        </g>
      )}
    </svg>
  );
}
