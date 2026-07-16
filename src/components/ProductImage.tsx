import { useEffect, useRef, useState } from 'react';
import rawSrc from '../assets/images/PHOTO-2026-07-16-20-33-03.jpg';

interface Props {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Loads the product photo, crops the title text at the top,
 * then removes the dark-gray carpet background via canvas color-distance keying.
 * Only alpha is modified — product RGB stays exactly as shot.
 */
export default function ProductImage({ className, style }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = rawSrc;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // Crop the top ~20% which contains the white title text on gray bg
      const cropTop = Math.floor(img.height * 0.20);
      const srcH = img.height - cropTop;

      canvas.width = img.width;
      canvas.height = srcH;

      ctx.drawImage(img, 0, cropTop, img.width, srcH, 0, 0, img.width, srcH);

      const imageData = ctx.getImageData(0, 0, img.width, srcH);
      const d = imageData.data;
      const w = img.width;
      const h = srcH;

      // Sample background color from all four corner patches
      let sr = 0, sg = 0, sb = 0, sc = 0;
      for (let px = 0; px < 16; px++) {
        for (let py = 0; py < 16; py++) {
          for (const [x, y] of [
            [px, py],
            [w - 1 - px, py],
            [px, h - 1 - py],
            [w - 1 - px, h - 1 - py],
          ] as [number, number][]) {
            const i = (y * w + x) * 4;
            sr += d[i]; sg += d[i + 1]; sb += d[i + 2]; sc++;
          }
        }
      }
      const bgR = sr / sc, bgG = sg / sc, bgB = sb / sc;

      // Per-pixel: compute distance to background, erase or feather
      const tolerance = 52;
      const feather = 32;

      for (let i = 0; i < d.length; i += 4) {
        const dr = d[i] - bgR;
        const dg = d[i + 1] - bgG;
        const db = d[i + 2] - bgB;
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);

        if (dist < tolerance) {
          d[i + 3] = 0;
        } else if (dist < tolerance + feather) {
          d[i + 3] = Math.round(((dist - tolerance) / feather) * 255);
        }
        // product pixels: untouched
      }

      ctx.putImageData(imageData, 0, 0);
      setReady(true);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ ...style, opacity: ready ? 1 : 0, transition: 'opacity 0.9s ease' }}
    />
  );
}
