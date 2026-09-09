'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { Blocks, Block } from './Primitives';
import { usePortfolio } from '@/stores/portfolio-store';

// Intersecting ellipsoids, voxelized into solid columns, create thick scalloped
// cloud silhouettes rather than a continuous tiled plane. They stay below roofs.
// Three staggered cloud belts cross the complete simulation. The center stays
// slightly thinner so the main towers remain readable, while the foreground,
// sides, and horizon still feel connected by one continuous weather layer.
const puffs = [
  [-48, -10.7, 26, 14, 4.2, 10], [-34, -11.4, 22, 15, 4.6, 11],
  [-18, -10.9, 27, 13, 4.2, 9], [-3, -12.1, 23, 14, 3.8, 10],
  [13, -11.2, 27, 14, 4.5, 10], [29, -10.8, 22, 15, 4.1, 11],
  [46, -11.7, 26, 14, 4.5, 10],

  [-52, -13.4, 2, 13, 3.8, 9], [-38, -12.5, -2, 14, 4.2, 10],
  [-24, -13.6, 5, 12, 4.0, 9], [-14, -14.2, -4, 9, 3.2, 7],
  [14, -14.0, 3, 9, 3.3, 7], [25, -13.1, -4, 13, 4.1, 9],
  [39, -12.6, 4, 14, 4.4, 10], [52, -13.7, -1, 13, 3.8, 9],

  [-47, -15.1, -24, 15, 3.7, 10], [-30, -14.4, -28, 15, 4.1, 11],
  [-13, -15.3, -23, 14, 3.5, 10], [3, -14.8, -28, 15, 4.0, 11],
  [20, -15.4, -23, 14, 3.6, 10], [36, -14.5, -28, 15, 4.2, 11],
  [51, -15.2, -22, 14, 3.7, 10],
] as const;

export default function PixelCloudBank() {
  const low = usePortfolio(s => s.quality === 'low');
  const bank = useRef<Group>(null);
  const reduced = useRef(false);
  useEffect(() => { reduced.current = matchMedia('(prefers-reduced-motion: reduce)').matches; }, []);
  const blocks = useMemo(() => {
    const result: Block[] = [];
    const step = low ? 2.8 : 1.8;
    for (let x = -62; x <= 62; x += step) {
      for (let z = -42; z <= 42; z += step) {
        let top = -Infinity, bottom = Infinity;
        for (const [cx, cy, cz, rx, ry, rz] of puffs) {
          const distance = ((x - cx) / (rx * .78)) ** 2 + ((z - cz) / (rz * .82)) ** 2;
          if (distance > .88) continue;
          const thickness = ry * Math.sqrt(1 - distance);
          top = Math.max(top, Math.round((cy - 1.8 + thickness) / .7) * .7);
          bottom = Math.min(bottom, Math.round((cy - 1.8 - thickness) / .7) * .7);
        }
        if (!Number.isFinite(top) || top <= bottom) continue;
        const cap = Math.min(.8, top - bottom);
        const shade = z > 10 ? '#c6aebe' : z < -12 ? '#9c8fa9' : '#b5a2b5';
        result.push({ p: [x, (top + bottom - cap) / 2, z], s: [step + .04, top - bottom - cap + .04, step + .04], c: shade });
        result.push({ p: [x, top - cap / 2, z], s: [step + .05, cap, step + .05], c: z > 8 ? '#f0c9c0' : '#d9b9c0' });
      }
    }
    return result;
  }, [low]);
  useFrame(({ clock }) => {
    if (bank.current && !reduced.current) bank.current.position.x = Math.sin(clock.elapsedTime * .035) * .5;
  });
  return <group ref={bank}><Blocks blocks={blocks} /></group>;
}
