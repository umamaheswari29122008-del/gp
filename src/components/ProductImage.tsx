interface Props {
  className?: string;
  style?: React.CSSProperties;
}

export default function ProductImage({ className, style }: Props) {
  return (
    <div className={`product-3d-wrap ${className ?? ''}`} style={style}>
      <div className="product-3d-floor" />
      <div className="product-3d-scene">
        <div className="product-3d-card">
          <div className="product-3d-gloss" />
          <div className="product-3d-rim" />
          <img
            src="/uploads/PHOTO-2026-07-16-20-33-03-removebg-preview_imgupscaler.ai_General_2K.jpg"
            alt="Dove Ice Gel Pack"
            className="product-3d-img"
            draggable={false}
          />
          <div className="product-3d-shadow" />
        </div>
      </div>
    </div>
  );
}
