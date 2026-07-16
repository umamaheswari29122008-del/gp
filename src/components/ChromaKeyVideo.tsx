import { useEffect, useRef, useState } from 'react';

interface ChromaKeyVideoProps {
  webmSrc: string;
  mp4Src: string;
  poster: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Plays a video with the background color removed via canvas chroma keying.
 * Only alpha is modified — product RGB colors are preserved exactly.
 * Background color is auto-detected from edge samples with per-channel tolerance.
 */
export default function ChromaKeyVideo({ webmSrc, mp4Src, poster, className, style }: ChromaKeyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<{ r: number; g: number; b: number } | null>(null);
  const rafRef = useRef<number>(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const processFrame = () => {
      if (video.readyState >= 2 && video.videoWidth > 0) {
        const w = video.videoWidth;
        const h = video.videoHeight;

        if (canvas.width !== w) canvas.width = w;
        if (canvas.height !== h) canvas.height = h;

        ctx.drawImage(video, 0, 0, w, h);

        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        // Auto-detect background from extensive edge samples on first frame
        if (!bgRef.current) {
          const samples: [number, number][] = [];
          // All four corners + edges
          for (let x = 0; x < 8; x++) {
            samples.push([x + 1, 1]);
            samples.push([w - x - 2, 1]);
            samples.push([x + 1, h - 2]);
            samples.push([w - x - 2, h - 2]);
          }
          for (let y = 0; y < 8; y++) {
            samples.push([1, y + 1]);
            samples.push([w - 2, y + 1]);
            samples.push([1, h - y - 2]);
            samples.push([w - 2, h - y - 2]);
          }

          let r = 0, g = 0, b = 0, count = 0;
          for (const [x, y] of samples) {
            const i = (y * w + x) * 4;
            r += data[i]; g += data[i + 1]; b += data[i + 2];
            count++;
          }
          bgRef.current = { r: r / count, g: g / count, b: b / count };
          setReady(true);
        }

        const bg = bgRef.current;

        // Per-channel tolerance — generous to catch gradient backgrounds
        // but we only touch alpha, never RGB, so product colors stay pristine
        const tolerance = 48;
        const feather = 28;

        for (let i = 0; i < data.length; i += 4) {
          const dr = data[i] - bg.r;
          const dg = data[i + 1] - bg.g;
          const db = data[i + 2] - bg.b;
          const dist = Math.sqrt(dr * dr + dg * dg + db * db);

          if (dist < tolerance) {
            data[i + 3] = 0;
          } else if (dist < tolerance + feather) {
            const alpha = (dist - tolerance) / feather;
            data[i + 3] = Math.min(255, Math.floor(alpha * 255));
          }
          // Product pixels (dist >= tolerance + feather) keep original RGB and full alpha
        }

        ctx.putImageData(imageData, 0, 0);
      }
      rafRef.current = requestAnimationFrame(processFrame);
    };

    const onPlay = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(processFrame);
    };

    video.addEventListener('play', onPlay);
    video.addEventListener('loadeddata', onPlay);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('loadeddata', onPlay);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        crossOrigin="anonymous"
        style={{ display: 'none' }}
      >
        <source src={webmSrc} type="video/webm" />
        <source src={mp4Src} type="video/mp4" />
      </video>
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          ...style,
          opacity: ready ? 1 : 0,
          transition: 'opacity 1s ease',
        }}
      />
    </>
  );
}
