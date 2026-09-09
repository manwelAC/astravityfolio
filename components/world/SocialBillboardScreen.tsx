'use client';
import { useLayoutEffect, useMemo, useState } from 'react';
import * as THREE from 'three';

interface SocialBillboardScreenProps {
  social: {
    name: string;
    label: string;
    url: string;
  };
  position: [number, number, number];
  width?: number;
  height?: number;
  onClick?: () => void;
}

function safeRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
}

export default function SocialBillboardScreen({
  social,
  position,
  width = 1.82,
  height = 2.05,
  onClick,
}: SocialBillboardScreenProps) {
  const [hovered, setHovered] = useState(false);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 576;
    const ctx = canvas.getContext('2d')!;

    // 1. Poster background: sleek dark emerald-slate aesthetic matching Indie Block
    ctx.fillStyle = '#1c2825';
    ctx.fillRect(0, 0, 512, 576);

    // Outer subtle border
    ctx.strokeStyle = '#354841';
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 500, 564);

    // 2. Top LED indicator
    ctx.textAlign = 'center';
    ctx.fillStyle = '#9fd398';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('● SIGNAL OPEN', 256, 54);

    // 3. App Logo Icon Box (160 x 160, centered at x=256, y=195)
    const iconX = 176;
    const iconY = 115;
    const iconSize = 160;
    const radius = 38;
    const key = social.name.toLowerCase();

    if (key.includes('instagram')) {
      // Instagram Squircle background
      ctx.save();
      ctx.beginPath();
      safeRoundRect(ctx, iconX, iconY, iconSize, iconSize, radius);
      ctx.clip();

      const grad = ctx.createRadialGradient(
        iconX + 30,
        iconY + iconSize + 20,
        20,
        iconX + iconSize / 2,
        iconY + iconSize / 2,
        iconSize * 1.1
      );
      grad.addColorStop(0, '#ffd521');
      grad.addColorStop(0.12, '#ffd521');
      grad.addColorStop(0.45, '#f50000');
      grad.addColorStop(0.68, '#c13584');
      grad.addColorStop(1, '#405de6');
      ctx.fillStyle = grad;
      ctx.fillRect(iconX, iconY, iconSize, iconSize);
      ctx.restore();

      // Camera outline
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 11;
      ctx.beginPath();
      safeRoundRect(ctx, iconX + 32, iconY + 32, 96, 96, 26);
      ctx.stroke();

      // Camera lens circle
      ctx.beginPath();
      ctx.arc(iconX + 80, iconY + 80, 24, 0, Math.PI * 2);
      ctx.stroke();

      // Flash dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(iconX + 106, iconY + 54, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (key.includes('tiktok')) {
      // Dark squircle
      ctx.save();
      ctx.beginPath();
      safeRoundRect(ctx, iconX, iconY, iconSize, iconSize, radius);
      ctx.fillStyle = '#050508';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      // TikTok musical note with 3D chromatic aberration
      const notePathStr =
        'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z';
      const p = new Path2D(notePathStr);
      const scale = 4.2;

      ctx.save();
      // Layer 1: Cyan (offset left & down)
      ctx.save();
      ctx.translate(iconX + 38 - 3.5, iconY + 34 + 3.5);
      ctx.scale(scale, scale);
      ctx.fillStyle = '#25F4EE';
      ctx.fill(p);
      ctx.restore();

      // Layer 2: Red / Magenta (offset right & up)
      ctx.save();
      ctx.translate(iconX + 38 + 3.5, iconY + 34 - 3.5);
      ctx.scale(scale, scale);
      ctx.fillStyle = '#FE2C55';
      ctx.fill(p);
      ctx.restore();

      // Layer 3: Pure White
      ctx.save();
      ctx.translate(iconX + 38, iconY + 34);
      ctx.scale(scale, scale);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill(p);
      ctx.restore();

      ctx.restore();
    } else if (key.includes('linkedin')) {
      // LinkedIn Blue squircle
      ctx.save();
      ctx.beginPath();
      safeRoundRect(ctx, iconX, iconY, iconSize, iconSize, radius);
      const grad = ctx.createLinearGradient(iconX, iconY, iconX, iconY + iconSize);
      grad.addColorStop(0, '#0d84f2');
      grad.addColorStop(1, '#0a66c2');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      // LinkedIn 'in'
      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      // 'i' dot
      ctx.beginPath();
      ctx.arc(iconX + 46, iconY + 45, 12, 0, Math.PI * 2);
      ctx.fill();

      // 'i' stem
      ctx.beginPath();
      safeRoundRect(ctx, iconX + 36, iconY + 66, 20, 58, 3);
      ctx.fill();

      // 'n'
      const nPath = new Path2D(
        'M8.2 7.6 h3.1 v1.4 h0.1 c0.5-0.9 1.7-1.8 3.5-1.8 3.7 0 4.4 2.4 4.4 5.6 v6.4 h-3.3 v-5.1 c0-1.2-0.1-2.8-1.7-2.8-1.7 0-2 1.3-2 2.7 v5.2 H 8.2 Z'
      );
      ctx.translate(iconX + 22, iconY + 28);
      ctx.scale(5.0, 5.0);
      ctx.fill(nPath);
      ctx.restore();
    } else {
      // Generic fallback
      ctx.save();
      ctx.beginPath();
      safeRoundRect(ctx, iconX, iconY, iconSize, iconSize, radius);
      ctx.fillStyle = '#2d3e38';
      ctx.fill();
      ctx.fillStyle = '#ffd599';
      ctx.font = 'bold 50px monospace';
      ctx.fillText(social.name.slice(0, 2).toUpperCase(), 256, 210);
      ctx.restore();
    }

    // 4. App Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(social.name, 256, 345);

    // 5. Handle / Label
    ctx.fillStyle = '#ffd599';
    ctx.font = 'bold 27px monospace';
    ctx.fillText(social.label, 256, 395);

    // 6. Action Button / Pill
    ctx.strokeStyle = 'rgba(255, 213, 153, 0.5)';
    ctx.lineWidth = 2.5;
    ctx.fillStyle = 'rgba(255, 213, 153, 0.14)';
    ctx.beginPath();
    safeRoundRect(ctx, 146, 442, 220, 52, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffe2b3';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('CONNECT ↗', 256, 475);

    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.needsUpdate = true;
    return t;
  }, [social.name, social.label]);

  useLayoutEffect(() => () => texture.dispose(), [texture]);

  return (
    <group position={position} scale={hovered ? 1.03 : 1}>
      {/* Cabinet backing frame matching the WorldDisplay cabinet */}
      <mesh position={[0, 0, -0.09]} castShadow>
        <boxGeometry args={[width + 0.16, height + 0.16, 0.18]} />
        <meshStandardMaterial color="#212a26" roughness={0.8} />
      </mesh>
      {/* Border rim */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[width + 0.05, height + 0.05, 0.03]} />
        <meshStandardMaterial color="#141f24" />
      </mesh>
      {/* Screen with authentic logo and details */}
      <mesh
        position={[0, 0, .035]}
        onClick={e => {
          e.stopPropagation();
          onClick?.();
        }}
        onPointerOver={e => {
          if (onClick) {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}
