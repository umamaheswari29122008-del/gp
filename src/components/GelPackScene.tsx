import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Environment, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Canvas texture helpers ─── */

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function buildGelTexture(): THREE.CanvasTexture {
  const W = 1024, H = 640;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Background
  const bg = ctx.createRadialGradient(W * 0.45, H * 0.45, 0, W * 0.5, H * 0.5, W * 0.7);
  bg.addColorStop(0, '#0e6aaa');
  bg.addColorStop(0.4, '#0c5590');
  bg.addColorStop(0.8, '#083870');
  bg.addColorStop(1, '#052550');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Inner shimmer
  const shimmer = ctx.createRadialGradient(W * 0.3, H * 0.3, 0, W * 0.5, H * 0.5, W * 0.5);
  shimmer.addColorStop(0, 'rgba(120,220,255,0.14)');
  shimmer.addColorStop(1, 'transparent');
  ctx.fillStyle = shimmer;
  ctx.fillRect(0, 0, W, H);

  // Grid channel cells
  const cols = 8, rows = 5;
  const padX = 52, padY = 52;
  const cellW = (W - padX * 2) / cols;
  const cellH = (H - padY * 2) / rows;
  const gap = 12;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = padX + c * cellW + gap / 2;
      const y = padY + r * cellH + gap / 2;
      const w = cellW - gap;
      const h = cellH - gap;

      // Shadow
      ctx.fillStyle = 'rgba(3,18,42,0.65)';
      roundRectPath(ctx, x + 2, y + 2, w, h, 9);
      ctx.fill();

      // Cell base gradient
      const cellBg = ctx.createLinearGradient(x, y, x + w, y + h);
      cellBg.addColorStop(0, 'rgba(40,160,240,0.22)');
      cellBg.addColorStop(0.5, 'rgba(20,120,200,0.18)');
      cellBg.addColorStop(1, 'rgba(10,80,150,0.12)');
      ctx.fillStyle = cellBg;
      roundRectPath(ctx, x, y, w, h, 9);
      ctx.fill();

      // Top highlight
      const hi = ctx.createLinearGradient(x, y, x, y + h * 0.35);
      hi.addColorStop(0, 'rgba(180,240,255,0.18)');
      hi.addColorStop(1, 'transparent');
      ctx.fillStyle = hi;
      roundRectPath(ctx, x, y, w, h * 0.35, 9);
      ctx.fill();
    }
  }

  // Channel seam lines
  ctx.strokeStyle = 'rgba(5,28,60,0.8)';
  ctx.lineWidth = gap;
  for (let r = 0; r <= rows; r++) {
    const y = padY + r * cellH;
    ctx.beginPath(); ctx.moveTo(padX, y); ctx.lineTo(W - padX, y); ctx.stroke();
  }
  for (let c = 0; c <= cols; c++) {
    const x = padX + c * cellW;
    ctx.beginPath(); ctx.moveTo(x, padY); ctx.lineTo(x, H - padY); ctx.stroke();
  }

  // Outer heat-seal border (triple lines)
  [{ inset: 8, w: 3.5, alpha: 0.7 }, { inset: 14, w: 2, alpha: 0.55 }, { inset: 20, w: 3.5, alpha: 0.7 }].forEach(({ inset, w, alpha }) => {
    ctx.strokeStyle = `rgba(140,220,255,${alpha})`;
    ctx.lineWidth = w;
    roundRectPath(ctx, inset, inset, W - inset * 2, H - inset * 2, 20 - inset);
    ctx.stroke();
  });

  // Brand text
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,180,255,0.5)';
  ctx.shadowBlur = 10;
  ctx.fillStyle = 'rgba(210,248,255,0.78)';
  ctx.font = 'bold 70px Arial';
  ctx.fillText('DOVE', W / 2, H / 2 - 6);
  ctx.font = '600 30px Arial';
  ctx.fillStyle = 'rgba(170,230,255,0.62)';
  ctx.fillText('ICE GEL PACK', W / 2, H / 2 + 38);
  ctx.shadowBlur = 0;

  // Corner grommets
  const corners: [number, number][] = [[32,32],[W-32,32],[32,H-32],[W-32,H-32]];
  corners.forEach(([cx, cy]) => {
    ctx.fillStyle = 'rgba(20,90,160,0.9)';
    ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(120,210,255,0.6)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(140,230,255,0.4)';
    ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
  });

  return new THREE.CanvasTexture(canvas);
}

function buildNormalMap(): THREE.CanvasTexture {
  const W = 1024, H = 640;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgb(128,128,255)';
  ctx.fillRect(0, 0, W, H);

  const cols = 8, rows = 5;
  const padX = 52, padY = 52;
  const cellW = (W - padX * 2) / cols;
  const cellH = (H - padY * 2) / rows;
  const gap = 12;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = padX + c * cellW + gap / 2;
      const y = padY + r * cellH + gap / 2;
      const w = cellW - gap;
      const h = cellH - gap;
      const grad = ctx.createRadialGradient(
        x + w / 2, y + h / 2, 0,
        x + w / 2, y + h / 2, Math.max(w, h) * 0.5,
      );
      grad.addColorStop(0, 'rgba(165,165,255,0.9)');
      grad.addColorStop(0.7, 'rgba(128,128,255,0.0)');
      ctx.fillStyle = grad;
      roundRectPath(ctx, x, y, w, h, 9);
      ctx.fill();
    }
  }

  return new THREE.CanvasTexture(canvas);
}

/* ─── Gel Pack mesh ─── */

interface GelPackProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  floatIntensity?: number;
  floatSpeed?: number;
  wobble?: boolean;
}

function GelPack({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  floatIntensity = 0.3,
  floatSpeed = 1.6,
  wobble = true,
}: GelPackProps) {
  const innerRef = useRef<THREE.Mesh>(null);
  const colorMap = useMemo(buildGelTexture, []);
  const normalMap = useMemo(buildNormalMap, []);

  useFrame(({ clock }) => {
    if (!wobble || !innerRef.current) return;
    const t = clock.elapsedTime;
    innerRef.current.scale.x = 1 + Math.sin(t * 1.8) * 0.012;
    innerRef.current.scale.y = 1 + Math.sin(t * 1.8 + 1.1) * 0.010;
    innerRef.current.scale.z = 1 + Math.sin(t * 2.6) * 0.008;
  });

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <Float speed={floatSpeed} rotationIntensity={0.07} floatIntensity={floatIntensity}>
        {/* Outer shell */}
        <RoundedBox ref={innerRef} args={[3.9, 2.45, 0.46]} radius={0.11} smoothness={8} castShadow>
          <meshPhysicalMaterial
            map={colorMap}
            normalMap={normalMap}
            normalScale={new THREE.Vector2(0.55, 0.55)}
            color="#3ad8ff"
            transparent
            opacity={0.93}
            roughness={0.05}
            metalness={0.0}
            clearcoat={1.0}
            clearcoatRoughness={0.02}
            envMapIntensity={2.0}
            reflectivity={0.7}
          />
        </RoundedBox>

        {/* Inner gel glow */}
        <RoundedBox args={[3.68, 2.26, 0.28]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color="#00b8e8"
            emissive="#003858"
            emissiveIntensity={0.55}
            transparent
            opacity={0.16}
          />
        </RoundedBox>

        {/* Front specular sheen */}
        <mesh position={[0, 0.05, 0.24]}>
          <planeGeometry args={[1.8, 0.55]} />
          <meshBasicMaterial color="#d0f8ff" transparent opacity={0.06} />
        </mesh>
      </Float>
    </group>
  );
}

/* ─── Particle systems ─── */

function FrostParticles({ count = 180 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { geo, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      speeds[i] = 0.003 + Math.random() * 0.005;
      offsets[i] = Math.random() * Math.PI * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { geo, speeds, offsets };
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i];
      pos[i * 3] += Math.sin(t * 0.4 + offsets[i]) * 0.001;
      if (pos[i * 3 + 1] > 6) pos[i * 3 + 1] = -6;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.04} color="#c8f4ff" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function ColdVapor() {
  const count = 40;
  const ref = useRef<THREE.Points>(null);
  const { geo, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = -3 + Math.random() * 1.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4 + 1;
      speeds[i] = 0.004 + Math.random() * 0.005;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { geo, speeds };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i];
      if (pos[i * 3 + 1] > 2) {
        pos[i * 3 + 1] = -3;
        pos[i * 3] = (Math.random() - 0.5) * 8;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.12} color="#a0e8ff" transparent opacity={0.22} sizeAttenuation />
    </points>
  );
}

function OrbitalRings() {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (r1.current) r1.current.rotation.z = t * 0.10;
    if (r2.current) { r2.current.rotation.z = -t * 0.07; r2.current.rotation.x = t * 0.03; }
    if (r3.current) r3.current.rotation.y = t * 0.05;
  });

  return (
    <>
      <mesh ref={r1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.4, 0.006, 8, 120]} />
        <meshBasicMaterial color="#38c9f7" transparent opacity={0.2} />
      </mesh>
      <mesh ref={r2} rotation={[Math.PI / 2.2, 0.4, 0]}>
        <torusGeometry args={[4.5, 0.004, 8, 120]} />
        <meshBasicMaterial color="#38c9f7" transparent opacity={0.12} />
      </mesh>
      <mesh ref={r3} rotation={[Math.PI / 1.8, 0.8, 0]}>
        <torusGeometry args={[5.8, 0.003, 8, 120]} />
        <meshBasicMaterial color="#60d8ff" transparent opacity={0.08} />
      </mesh>
    </>
  );
}

/* ─── Scene inner (mouse tracking) ─── */

interface SceneInnerProps {
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
  compact: boolean;
}

function SceneInner({ mousePos, compact }: SceneInnerProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y, mousePos.current.x * 0.45, 0.035,
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, -mousePos.current.y * 0.2, 0.035,
    );
  });

  return (
    <group ref={groupRef}>
      {/* Hero pack */}
      <GelPack
        position={compact ? [0, 0, 0] : [0.8, 0, 0]}
        rotation={[0.08, -0.22, 0.04]}
        scale={compact ? 0.75 : 1}
        floatIntensity={0.32}
        floatSpeed={1.6}
        wobble
      />

      {!compact && (
        <>
          <GelPack position={[-5.5, 1.2, -3]} rotation={[0.2, -0.6, 0.15]} scale={0.5} floatIntensity={0.4} floatSpeed={1.2} wobble={false} />
          <GelPack position={[5.2, -1.0, -4]} rotation={[-0.1, 0.8, -0.1]} scale={0.42} floatIntensity={0.5} floatSpeed={2.0} wobble={false} />
          <GelPack position={[2.8, 3.2, -5]} rotation={[0.3, 0.3, 0.2]} scale={0.3} floatIntensity={0.6} floatSpeed={2.4} wobble={false} />
        </>
      )}

      <OrbitalRings />
    </group>
  );
}

/* ─── Public export ─── */

export interface GelPackSceneProps {
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
  compact?: boolean;
}

export function GelPackScene({ mousePos, compact = false }: GelPackSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, compact ? 5.5 : 6.2], fov: compact ? 42 : 46 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.55} color="#b8e8ff" />
      <directionalLight position={[8, 10, 8]} intensity={1.6} color="#ffffff" castShadow />
      <directionalLight position={[-6, -4, 4]} intensity={0.7} color="#40a8d8" />
      <pointLight position={[0, 0, 4.5]} intensity={1.2} color="#38d8ff" />
      <pointLight position={[4, 3, 2]} intensity={0.5} color="#80f0ff" />
      <pointLight position={[-3, -2, 3]} intensity={0.4} color="#2090d0" />

      <Suspense fallback={null}>
        <SceneInner mousePos={mousePos} compact={compact} />
        <Environment preset="studio" />
      </Suspense>

      <FrostParticles count={compact ? 80 : 180} />
      {!compact && <ColdVapor />}
      <Stars radius={70} depth={50} count={compact ? 400 : 1000} factor={2.2} saturation={0.4} fade speed={0.6} />
    </Canvas>
  );
}
