interface Props {
  className?: string;
  style?: React.CSSProperties;
}

export default function ProductImage({ className, style }: Props) {
  return (
    <img
      src="/uploads/PHOTO-2026-07-16-20-33-03-removebg-preview_imgupscaler.ai_General_2K-Photoroom.png"
      alt="Dove Ice Gel Pack"
      className={className}
      style={style}
      draggable={false}
    />
  );
}
