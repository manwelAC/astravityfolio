'use client';
import { useState } from 'react';
import { useThree } from '@react-three/fiber';
import ContactForm from '@/components/sections/ContactForm';
import WorldDisplay from './WorldDisplay';

export default function LeadsRooftop() {
  const compact = useThree(state => state.size.width < 700);
  const [delivered, setDelivered] = useState(false);
  return <>
    {[-1, 1].map(side => <mesh key={side} position={[side * (compact ? 2.35 : 4.6), compact ? 3.8 : 2.4, -1.95]} castShadow><boxGeometry args={[.18, compact ? 7.6 : 4.8, .25]} /><meshStandardMaterial color="#765638" roughness={1} /></mesh>)}
    <WorldDisplay position={[0, compact ? 4.2 : 2.85, -1.65]} width={compact ? 5.4 : 10.4} height={compact ? 7.2 : 4.7} pixels={compact ? 360 : 760} label="Contact terminal" tone="terminal" surface="plaque">
      <div className="terminal-bar"><span>A LETTER TO JOHN</span><span>{delivered ? '● MESSAGE ACCEPTED' : 'LET’S BUILD SOMETHING'}</span></div>
      <div className="terminal-content"><ContactForm onDelivered={() => setDelivered(true)} /></div>
    </WorldDisplay>
    {delivered && <mesh position={[-2, 1.85, .3]}><boxGeometry args={[.12, .7, .12]} /><meshBasicMaterial color="#c3da95" /></mesh>}
  </>;
}


