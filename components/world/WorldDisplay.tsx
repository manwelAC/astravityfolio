'use client';
import { ReactNode, useEffect, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Group } from 'three';
import gsap from 'gsap';

/** A real cabinet, bezel and feet with DOM mapped to its glass surface.
 * 400 CSS pixels at distanceFactor=1 occupy one world unit.
 * This never uses fullscreen, sprite, or viewport positioning. */
export default function WorldDisplay({ children, position, width, height, pixels = 900, label, tone = 'archive', animateKey = '', hoverLift = false, presentation = false, surface = 'cabinet' }: {
  children: ReactNode; position: [number, number, number]; width: number; height: number;
  pixels?: number; label: string; tone?: 'archive' | 'terminal' | 'gallery'; animateKey?: string; hoverLift?: boolean; presentation?: boolean; surface?: 'cabinet' | 'plaque';
}) {
  const cabinet = useRef<Group>(null);
  const compact = useThree(state => state.size.width < 700);
  const z = position[2];
  useEffect(() => {
    if (!cabinet.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const group = cabinet.current;
    const timeline = gsap.timeline();
    timeline.fromTo(group.position, { z: z - (presentation ? .9 : .24) }, { z, duration: presentation ? .75 : .38, ease: 'power3.out' }, 0);
    if (presentation) {
      timeline.fromTo(group.scale, { x: .94, y: .82, z: 1 }, { x: 1, y: 1, z: 1, duration: .7, ease: 'back.out(1.15)' }, 0);
      timeline.fromTo(group.rotation, { x: -.045 }, { x: 0, duration: .7, ease: 'power3.out' }, 0);
    }
    return () => { timeline.kill(); group.scale.set(1, 1, 1); group.rotation.x = 0; };
  }, [animateKey, z, presentation]);
  const pixelHeight = pixels * height / width;
  const architectural = height > 1 && surface === 'cabinet';
  const stone = tone === 'terminal' ? '#7d8471' : '#b08263';
  const hover = (active: boolean) => { if (hoverLift && cabinet.current) gsap.to(cabinet.current.position, { z: z + (active ? .12 : 0), duration: .2, overwrite: true }); };
  return <group ref={cabinet} position={position}>
    {architectural && <group>
      {/* Coursed piers and projecting cornices use the rooftop's block language. */}
      {[-1, 1].map(side => <group key={side}>
        {Array.from({ length: Math.ceil(height / .48) }, (_, row) => {
          const course = height / Math.ceil(height / .48);
          return <mesh key={row} position={[side * (width / 2 + .24), -height / 2 + course * (row + .5), -.06]} castShadow receiveShadow>
            <boxGeometry args={[row % 2 ? .4 : .48, course - .025, .62]} />
            <meshStandardMaterial color={row % 3 === 0 ? '#99765e' : stone} roughness={1} />
          </mesh>;
        })}
        <mesh position={[0, side * (height / 2 + .17), -.025]} castShadow receiveShadow><boxGeometry args={[width + 1, .22, .72]} /><meshStandardMaterial color={stone} roughness={1} /></mesh>
        <mesh position={[0, side * (height / 2 + .3), .015]} castShadow><boxGeometry args={[width + 1.2, .1, .88]} /><meshStandardMaterial color="#493b3b" roughness={1} /></mesh>
      </group>)}
      <mesh position={[0, height / 2 + .045, .19]}><boxGeometry args={[width, .045, .07]} /><meshBasicMaterial color="#ffd08a" /></mesh>
    </group>}
    <mesh position={[0, 0, -.19]} castShadow><boxGeometry args={[width + .3, height + .3, .38]} /><meshStandardMaterial color={tone === 'terminal' ? '#67766c' : '#493d38'} roughness={.8} /></mesh>
    <mesh position={[0, 0, .015]}><boxGeometry args={[width + .09, height + .09, .05]} /><meshStandardMaterial color="#141f24" /></mesh>
    {presentation && <group>
      {[-1, 1].map(side => <group key={side}>
        <mesh position={[0, side * (height / 2 + .12), .025]}><boxGeometry args={[width + .35, .09, .14]}/><meshStandardMaterial color="#bd9260" metalness={.55} roughness={.38}/></mesh>
        {[-1, 1].map(edge => <group key={edge} position={[edge * (width / 2 + .1), side * (height / 2 + .08), .12]}>
          <mesh><boxGeometry args={[.38, .25, .16]}/><meshStandardMaterial color="#d2af7a" metalness={.45}/></mesh>
          <mesh position={[0, 0, .09]}><boxGeometry args={[.17, .055, .02]}/><meshBasicMaterial color="#ffe5a5"/></mesh>
        </group>)}
      </group>)}
    </group>}
    {[-1, 1].map(side => <mesh key={side} position={[side * (width / 2 + .09), height / 2 + .085, .02]}><boxGeometry args={[.06, .06, .06]} /><meshBasicMaterial color="#ffc782" /></mesh>)}
    <Html transform position={[0, 0, .06]} distanceFactor={width * 400 / pixels} zIndexRange={[100, 10]} pointerEvents="auto">
      <section
        onPointerDown={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
        onMouseEnter={() => hover(true)}
        onMouseLeave={() => hover(false)}
        onFocusCapture={() => hover(true)}
        onBlurCapture={() => hover(false)}
        className={`world-display ${tone} ${compact ? 'compact-display' : ''} ${presentation ? 'about-presentation' : ''} surface-${surface}`}
        aria-label={label}
        style={{ width: pixels, height: pixelHeight }}
      >
        {children}
      </section>
    </Html>
  </group>;
}


