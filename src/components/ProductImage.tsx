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

      // Draw full image first to sample colours accurately
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const full = ctx.getImageData(0, 0, img.width, img.height);
      const fd = full.data;
      const fw = img.width;
      const fh = img.height;

      // ── 1. Find the first row from top that is NOT white/near-white ──
      // The white text banner sits at the very top; skip it completely.
      let firstProductRow = 0;
      for (let y = 0; y < fh; y++) {
        let nonWhiteCount = 0;
        for (let x = 0; x < fw; x++) {
          const i = (y * fw + x) * 4;
          const r = fd[i], g = fd[i + 1], b = fd[i + 2];
          // white/near-white: all channels > 200
          if (r < 200 || g < 200 || b < 200) nonWhiteCount++;
        }
        // once > 5% of the row is non-white we've hit the real product area
        if (nonWhiteCount > fw * 0.05) { firstProductRow = y; break; }
      }

      // Also crop a small strip from each side to remove edge compression artifacts
      const cropSide = Math.floor(fw * 0.03);
      const srcX = cropSide;
      const srcY = firstProductRow;
      const srcW = fw - cropSide * 2;
      const srcH = fh - srcY;

      canvas.width = srcW;
      canvas.height = srcH;
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);

      const imageData = ctx.getImageData(0, 0, srcW, srcH);
      const d = imageData.data;
      const w = srcW;
      const h = srcH;

      // ── 2. Sample background colour from all four corners ──
      const pad = 30;
      let sr = 0, sg = 0, sb = 0, sc = 0;
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

      // ── 3. Build alpha mask — colour-distance keying ──
      const alpha = new Uint8Array(w * h);
      // High tolerance to capture all the carpet-grey and border fringe
      const tolerance = 90;
      const feather = 30;

      for (let idx = 0, i = 0; idx < w * h; idx++, i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];

        // Also erase near-white border pixels (leftover from white title bar)
        const isNearWhite = r > 210 && g > 210 && b > 210;
        if (isNearWhite) { alpha[idx] = 0; continue; }

        const dr = r - bgR, dg = g - bgG, db = b - bgB;
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);
        if (dist < tolerance) {
          alpha[idx] = 0;
        } else if (dist < tolerance + feather) {
          alpha[idx] = Math.round(((dist - tolerance) / feather) * 255);
        } else {
          alpha[idx] = 255;
        }
      }

      // ── 4. Multi-pass erosion — kill isolated dust specks ──
      // Run twice with increasing neighbourhood thresholds
      const erode = (src: Uint8Array, radius: number, threshold: number): Uint8Array => {
        const out = new Uint8Array(src);
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = y * w + x;
            if (src[idx] === 0) continue;
            let sum = 0, cnt = 0;
            for (let dy = -radius; dy <= radius; dy++) {
              for (let dx = -radius; dx <= radius; dx++) {
                const nx = x + dx, ny = y + dy;
                if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
                sum += src[ny * w + nx]; cnt++;
              }
            }
            if (sum / cnt < threshold) out[idx] = 0;
          }
        }
        return out;
      };

      let mask = erode(alpha, 2, 80);   // first pass: tight radius
      mask    = erode(mask,  3, 50);    // second pass: wider, cleans lingering dots

      // ── 5. Apply mask ──
      for (let idx = 0, i = 0; idx < w * h; idx++, i += 4) {
        d[i + 3] = mask[idx];
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
