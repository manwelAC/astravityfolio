'use client';
import { createContext, ReactNode, useContext } from 'react';
import { Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Section, usePortfolio } from '@/stores/portfolio-store';

export const DisplayRoofContext = createContext<Section>('overview');

/** A real cabinet, bezel and feet with DOM mapped to its glass surface.
 * 400 CSS pixels at distanceFactor=1 occupy one world unit.
 * This never uses fullscreen, sprite, or viewport positioning. */
export default function WorldDisplay({ children, position, width, height, pixels = 900, label, tone = 'archive', presentation = false, surface = 'cabinet' }: {
  children: ReactNode; position: [number, number, number]; width: number; height: number;
  pixels?: number; label: string; tone?: 'archive' | 'terminal' | 'gallery'; presentation?: boolean; surface?: 'cabinet' | 'plaque';
}) {
  const compact = useThree(state => state.size.width < 700);
  const roof = useContext(DisplayRoofContext);
  const interactive = usePortfolio(state => state.section === roof && !state.transitioning);
  const pixelHeight = pixels * height / width;
  const architectural = height > 1 && surface === 'cabinet';
  const stone = tone === 'terminal' ? '#7d8471' : '#b08263';
  return <group position={position} onClick={e => { if (!interactive && !usePortfolio.getState().transitioning) { e.stopPropagation(); usePortfolio.getState().navigate(roof); } }}>
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
    <Html transform occlude="blending" geometry={<planeGeometry args={[width, height]} />} position={[0, 0, .06]} distanceFactor={width * 400 / pixels} zIndexRange={[100, 10]} pointerEvents={interactive ? 'auto' : 'none'}>
      <section
        inert={!interactive}
        onPointerDown={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
        className={`world-display ${tone} ${compact ? 'compact-display' : ''} ${presentation ? 'about-presentation' : ''} surface-${surface}`}
        aria-label={label}
        style={{ width: pixels, height: pixelHeight }}
      >
        {children}
      </section>
    </Html>
  </group>;
}


