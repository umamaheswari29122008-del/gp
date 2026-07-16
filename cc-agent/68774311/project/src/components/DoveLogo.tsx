export function DoveLogo({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="url(#logoGrad)"/>
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e7ec8"/>
          <stop offset="100%" stopColor="#0d5ba0"/>
        </linearGradient>
      </defs>
      {/* Dove body */}
      <path
        d="M40 11 C36 10, 30 13, 27 18 L13 31 C10 34, 10 40, 14 42 C18 44, 23 42, 25 38 L30 32 L32 39 C33 42, 37 44, 41 43 C45 41, 46 37, 44 34 L42 28 L47 25 C50 23, 51 19, 49 16 C47 13, 43 12, 40 11 Z"
        fill="white"
        opacity="0.95"
      />
      {/* Tail feathers */}
      <path d="M14 42 C12 46, 10 48, 8 50 C12 49, 16 47, 18 44 Z" fill="white" opacity="0.85"/>
      <path d="M16 43 C15 47, 14 50, 13 52 C16 50, 19 47, 20 44 Z" fill="white" opacity="0.7"/>
      {/* Wing line */}
      <path d="M33 17 C31 20, 30 24, 32 28" stroke="#1a56a0" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
      {/* Eye */}
      <circle cx="44" cy="17" r="2" fill="#1a56a0" opacity="0.8"/>
      <circle cx="44.5" cy="16.5" r="0.7" fill="white"/>
    </svg>
  );
}
