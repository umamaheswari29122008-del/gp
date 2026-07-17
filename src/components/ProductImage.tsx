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

      canvas.width  = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const full = ctx.getImageData(0, 0, img.width, img.height);
      const fd = full.data;
      const fw = img.width;
      const fh = img.height;

      // ── 1. Detect top white-banner boundary ──
      // Walk down until >5% of the row is non-white
      let firstProductRow = 0;
      for (let y = 0; y < fh; y++) {
        let nonWhite = 0;
        for (let x = 0; x < fw; x++) {
          const i = (y * fw + x) * 4;
          if (fd[i] < 210 || fd[i + 1] < 210 || fd[i + 2] < 210) nonWhite++;
        }
        if (nonWhite > fw * 0.05) { firstProductRow = y; break; }
      }

      // Crop a small strip from each side too
      const cropSide = Math.floor(fw * 0.03);
      const srcX = cropSide;
      const srcY = firstProductRow;
      const srcW = fw - cropSide * 2;
      const srcH = fh - srcY;

      canvas.width  = srcW;
      canvas.height = srcH;
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);

      const imageData = ctx.getImageData(0, 0, srcW, srcH);
      const d = imageData.data;
      const w = srcW;
      const h = srcH;

      // ── 2. Sample background colour from corner patches ──
      const pad = 28;
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

      // ── 3. Flood-fill from all edges ──
      // Only pixels REACHABLE from the border that also match the background
      // colour are marked transparent.  Interior product pixels are untouched
      // even if they happen to share a similar hue.
      const BG_TOLERANCE = 80; // how close a pixel must be to bg colour to be erased
      const visited = new Uint8Array(w * h); // 0=unvisited, 1=bg, 2=product

      const colorDist = (i: number): number => {
        const dr = d[i] - bgR, dg = d[i + 1] - bgG, db = d[i + 2] - bgB;
        return Math.sqrt(dr * dr + dg * dg + db * db);
      };

      // BFS queue (flat index)
      const queue: number[] = [];

      // Seed: push every edge pixel that matches background
      const seed = (x: number, y: number) => {
        const idx = y * w + x;
        if (visited[idx]) return;
        if (colorDist(idx * 4) < BG_TOLERANCE) {
          visited[idx] = 1; // background
          queue.push(idx);
        } else {
          visited[idx] = 2; // product edge hit
        }
      };

      for (let x = 0; x < w; x++) { seed(x, 0); seed(x, h - 1); }
      for (let y = 0; y < h; y++) { seed(0, y); seed(w - 1, y); }

      // BFS expand
      let qi = 0;
      while (qi < queue.length) {
        const idx = queue[qi++];
        const x = idx % w;
        const y = (idx - x) / w;
        const neighbors: [number, number][] = [
          [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
        ];
        for (const [nx, ny] of neighbors) {
          if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
          const nidx = ny * w + nx;
          if (visited[nidx]) continue;
          if (colorDist(nidx * 4) < BG_TOLERANCE) {
            visited[nidx] = 1;
            queue.push(nidx);
          } else {
            visited[nidx] = 2;
          }
        }
      }

      // ── 4. Build alpha mask ──
      // Background pixels → 0. Unvisited interior pixels → 255 (fully opaque).
      // Apply soft feathering at the transition edge (1-pixel neighbours of bg).
      const alpha = new Uint8Array(w * h);
      for (let idx = 0; idx < w * h; idx++) {
        alpha[idx] = visited[idx] === 1 ? 0 : 255;
      }

      // Feather: any product pixel adjacent to a bg pixel gets 160 alpha
      // to avoid a hard cut-out edge
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = y * w + x;
          if (visited[idx] !== 2) continue;
          const hasAdjacentBg =
            visited[(y - 1) * w + x] === 1 ||
            visited[(y + 1) * w + x] === 1 ||
            visited[y * w + (x - 1)] === 1 ||
            visited[y * w + (x + 1)] === 1;
          if (hasAdjacentBg) alpha[idx] = 200;
        }
      }

      // ── 5. Apply alpha — colours untouched ──
      for (let idx = 0, i = 0; idx < w * h; idx++, i += 4) {
        d[i + 3] = alpha[idx];
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
