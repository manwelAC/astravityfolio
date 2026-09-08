'use client';
import { ReactNode, useEffect, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Group } from 'three';
import gsap from 'gsap';

/** A real cabinet, bezel and feet with DOM mapped to its glass surface.
 * 400 CSS pixels at distanceFactor=1 occupy one world unit.
 * This never uses fullscreen, sprite, or viewport positioning. */
export default function WorldDisplay({ children, position, width, height, pixels = 900, label, tone = 'archive', animateKey = '', hoverLift = false }: {
  children: ReactNode; position: [number, number, number]; width: number; height: number;
  pixels?: number; label: string; tone?: 'archive' | 'terminal' | 'gallery'; animateKey?: string; hoverLift?: boolean;
}) {
  const cabinet = useRef<Group>(null);
  const compact = useThree(state => state.size.width < 700);
  const z = position[2];
  useEffect(() => {
    if (!cabinet.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tween = gsap.fromTo(cabinet.current.position, { z: z - .24 }, { z, duration: .38, ease: 'power2.out' });
    return () => { tween.kill(); };
  }, [animateKey, z]);
  const pixelHeight = pixels * height / width;
  const hover = (active: boolean) => { if (hoverLift && cabinet.current) gsap.to(cabinet.current.position, { z: z + (active ? .12 : 0), duration: .2, overwrite: true }); };
  return <group ref={cabinet} position={position}>
    <mesh position={[0, 0, -.19]} castShadow><boxGeometry args={[width + .3, height + .3, .38]} /><meshStandardMaterial color={tone === 'terminal' ? '#67766c' : '#493d38'} roughness={.8} /></mesh>
    <mesh position={[0, 0, .015]}><boxGeometry args={[width + .09, height + .09, .05]} /><meshStandardMaterial color="#141f24" /></mesh>
    {[-1, 1].map(side => <mesh key={side} position={[side * (width / 2 + .09), height / 2 + .085, .02]}><boxGeometry args={[.06, .06, .06]} /><meshBasicMaterial color="#ffc782" /></mesh>)}
    <Html transform position={[0, 0, .06]} distanceFactor={width * 400 / pixels} zIndexRange={[100, 10]} pointerEvents="auto">
      <section
        onPointerDown={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
        onMouseEnter={() => hover(true)}
        onMouseLeave={() => hover(false)}
        onFocusCapture={() => hover(true)}
        onBlurCapture={() => hover(false)}
        className={`world-display ${tone} ${compact ? 'compact-display' : ''}`}
        aria-label={label}
        style={{ width: pixels, height: pixelHeight }}
      >
        {children}
      </section>
    </Html>
  </group>;
}


