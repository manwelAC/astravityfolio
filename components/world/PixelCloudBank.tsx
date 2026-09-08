'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { Blocks, Block } from './Primitives';
import { usePortfolio } from '@/stores/portfolio-store';

// Intersecting ellipsoids, voxelized into solid columns, create thick scalloped
// cloud silhouettes rather than a continuous tiled plane. They stay below roofs.
const puffs = [
  [-17, -11.8, 10, 10, 3.1, 7], [-10, -10.8, 17, 8, 3.4, 7],
  [0, -12.1, 20, 11, 3.2, 8], [10, -11.2, 17, 9, 3.6, 7],
  [19, -12, 8, 10, 3.1, 7], [26, -13.4, -5, 9, 2.8, 6],
  [-26, -13.2, -5, 9, 3, 7], [-19, -14, -17, 8, 2.6, 6],
  [11, -15, -18, 12, 3.1, 6], [-5, -14, -15, 9, 2.5, 5],
  [-24, -13, 23, 9, 3.2, 8], [24, -13.2, 24, 10, 3.4, 9],
] as const;

export default function PixelCloudBank() {
  const low = usePortfolio(s => s.quality === 'low');
  const bank = useRef<Group>(null);
  const reduced = useRef(false);
  useEffect(() => { reduced.current = matchMedia('(prefers-reduced-motion: reduce)').matches; }, []);
  const blocks = useMemo(() => {
    const result: Block[] = [];
    const step = low ? 2 : 1.4;
    for (let x = -36; x <= 36; x += step) {
      for (let z = -26; z <= 34; z += step) {
        let top = -Infinity, bottom = Infinity;
        for (const [cx, cy, cz, rx, ry, rz] of puffs) {
          const distance = ((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2;
          if (distance > .97) continue;
          const thickness = ry * Math.sqrt(1 - distance);
          top = Math.max(top, Math.round((cy + thickness) / .7) * .7);
          bottom = Math.min(bottom, Math.round((cy - thickness) / .7) * .7);
        }
        if (!Number.isFinite(top) || top <= bottom) continue;
        const cap = Math.min(.7, top - bottom);
        result.push({ p: [x, (top + bottom - cap) / 2, z], s: [step + .02, top - bottom - cap + .04, step + .02], c: '#b8a6ba' });
        result.push({ p: [x, top - cap / 2, z], s: [step + .025, cap, step + .025], c: '#e2c5c3' });
      }
    }
    return result;
  }, [low]);
  useFrame(({ clock }) => {
    if (bank.current && !reduced.current) bank.current.position.x = Math.sin(clock.elapsedTime * .035) * .5;
  });
  return <group ref={bank}><Blocks blocks={blocks} /></group>;
}
