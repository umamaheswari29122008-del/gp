interface Props {
  className?: string;
  style?: React.CSSProperties;
}

export default function ProductImage({ className, style }: Props) {
  return (
    <div
      className={`product-3d-wrap ${className ?? ''}`}
      style={style}
    >
      {/* Reflective floor plate */}
      <div className="product-3d-floor" />

      {/* Rotating package */}
      <div className="product-3d-scene">
        <div className="product-3d-card">
          {/* Glossy top highlight */}
          <div className="product-3d-gloss" />
          {/* Edge rim light */}
          <div className="product-3d-rim" />
          {/* The actual product photo */}
          <img
            src="/uploads/PHOTO-2026-07-16-20-33-03-removebg-preview.png"
            alt="Dove Ice Gel Pack"
            className="product-3d-img"
            draggable={false}
          />
          {/* Inner soft shadow for depth */}
          <div className="product-3d-shadow" />
        </div>
      </div>
    </div>
  );
}
