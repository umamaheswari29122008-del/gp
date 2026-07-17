import { useEffect, useRef, useState } from 'react';
import rawSrc from '../assets/images/PHOTO-2026-07-16-20-33-03.jpg';

interface Props {
  className?: string;
  style?: React.CSSProperties;
}

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

      // Crop top 20% (title text) and a bit from each side
      const cropTop = Math.floor(img.height * 0.20);
      const cropSide = Math.floor(img.width * 0.04);
      const srcW = img.width - cropSide * 2;
      const srcH = img.height - cropTop;

      canvas.width = srcW;
      canvas.height = srcH;

      ctx.drawImage(img, cropSide, cropTop, srcW, srcH, 0, 0, srcW, srcH);

      const imageData = ctx.getImageData(0, 0, srcW, srcH);
      const d = imageData.data;
      const w = srcW;
      const h = srcH;

      // Sample background from corners + edges
      let sr = 0, sg = 0, sb = 0, sc = 0;
      const pad = 24;
      for (let px = 0; px < pad; px++) {
        for (let py = 0; py < pad; py++) {
          for (const [x, y] of [
            [px, py], [w - 1 - px, py],
            [px, h - 1 - py], [w - 1 - px, h - 1 - py],
          ] as [number, number][]) {
            const i = (y * w + x) * 4;
            sr += d[i]; sg += d[i + 1]; sb += d[i + 2]; sc++;
          }
        }
      }
      const bgR = sr / sc, bgG = sg / sc, bgB = sb / sc;

      // Alpha mask array
      const alpha = new Uint8Array(w * h);

      // Pass 1: color-distance keying — aggressive tolerance to kill dust
      const tolerance = 72;
      const feather = 28;
      for (let idx = 0, i = 0; idx < w * h; idx++, i += 4) {
        const dr = d[i] - bgR;
        const dg = d[i + 1] - bgG;
        const db = d[i + 2] - bgB;
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);
        if (dist < tolerance) {
          alpha[idx] = 0;
        } else if (dist < tolerance + feather) {
          alpha[idx] = Math.round(((dist - tolerance) / feather) * 255);
        } else {
          alpha[idx] = 255;
        }
      }

      // Pass 2: morphological erosion — zero out any isolated pixels
      // (pixels fully surrounded by transparent neighbours are dust)
      const eroded = new Uint8Array(alpha);
      const erosionRadius = 2;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = y * w + x;
          if (alpha[idx] === 0) continue;
          // check neighbourhood
          let neighbourSum = 0;
          let neighbourCount = 0;
          for (let dy = -erosionRadius; dy <= erosionRadius; dy++) {
            for (let dx = -erosionRadius; dx <= erosionRadius; dx++) {
              const nx = x + dx, ny = y + dy;
              if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
              neighbourSum += alpha[ny * w + nx];
              neighbourCount++;
            }
          }
          const avg = neighbourSum / neighbourCount;
          // if average neighbour alpha < 60, this is isolated dust — erase
          if (avg < 60) eroded[idx] = 0;
        }
      }

      // Apply final alpha
      for (let idx = 0, i = 0; idx < w * h; idx++, i += 4) {
        d[i + 3] = eroded[idx];
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
