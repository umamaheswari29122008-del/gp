interface Props {
  className?: string;
  style?: React.CSSProperties;
}

export default function ProductImage({ className, style }: Props) {
  return (
    <img
      src="/uploads/gel-pack-new.jpg"
      alt="Dove Ice Gel Pack"
      className={`product-img ${className ?? ''}`}
      style={style}
      draggable={false}
    />
  );
}
