import { useMemo } from 'react';

const SNOW_COUNT = 14;
const SPARKLE_COUNT = 10;
const BUBBLE_COUNT = 6;

export function FrozenHeroFX() {
  const snow = useMemo(
    () =>
      Array.from({ length: SNOW_COUNT }).map((_, i) => ({
        left: `${(i * 97) % 100}%`,
        size: 2 + ((i * 7) % 4),
        delay: `${(i * 1.3) % 8}s`,
        dur: `${7 + ((i * 5) % 6)}s`,
      })),
    []
  );

  const sparkles = useMemo(
    () =>
      Array.from({ length: SPARKLE_COUNT }).map((_, i) => ({
        left: `${10 + ((i * 83) % 80)}%`,
        top: `${15 + ((i * 61) % 70)}%`,
        size: 4 + ((i * 9) % 6),
        delay: `${(i * 0.7) % 4}s`,
        dur: `${2.5 + ((i * 3) % 3)}s`,
      })),
    []
  );

  const bubbles = useMemo(
    () =>
      Array.from({ length: BUBBLE_COUNT }).map((_, i) => ({
        left: `${8 + ((i * 29) % 84)}%`,
        bottom: '0',
        size: 6 + ((i * 11) % 14),
        delay: `${(i * 1.1) % 5}s`,
        dur: `${5 + ((i * 4) % 5)}s`,
      })),
    []
  );

  return (
    <>
      <div className="snow-container" aria-hidden>
        {snow.map((f, i) => (
          <span
            key={`s${i}`}
            className="snowflake"
            style={{
              left: f.left,
              width: f.size,
              height: f.size,
              animationDelay: f.delay,
              animationDuration: f.dur,
            }}
          />
        ))}
      </div>

      <div className="hero-sparkles" aria-hidden>
        {sparkles.map((p, i) => (
          <span
            key={`sp${i}`}
            className="hero-sparkle"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.dur,
            }}
          />
        ))}
      </div>

      <div className="hero-bubbles" aria-hidden>
        {bubbles.map((b, i) => (
          <span
            key={`b${i}`}
            className="bubble"
            style={
              {
                left: b.left,
                bottom: b.bottom,
                width: b.size,
                height: b.size,
                '--dur': b.dur,
                '--delay': b.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="hero-wave" aria-hidden>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path
            className="hero-wave-path"
            d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"
          />
        </svg>
      </div>
    </>
  );
}
