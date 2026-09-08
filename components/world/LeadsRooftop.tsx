'use client';
import { useState } from 'react';
import { useThree } from '@react-three/fiber';
import ContactForm from '@/components/sections/ContactForm';
import WorldDisplay from './WorldDisplay';

export default function LeadsRooftop() {
  const compact = useThree(state => state.size.width < 700);
  const [delivered, setDelivered] = useState(false);
  return <>
    <group position={[0, compact ? 2.1 : 1.6, -1.65]}>
      <mesh position={[0, 0, -.3]} castShadow><boxGeometry args={[5.9, compact ? 4.7 : 3.25, .85]} /><meshStandardMaterial color="#748075" roughness={.85} /></mesh>
      <mesh position={[0, -1.52, .17]}><boxGeometry args={[4.8, .1, .24]} /><meshStandardMaterial color="#354440" /></mesh>
      <mesh position={[2.65, -1.46, .2]}><boxGeometry args={[.14, .09, .08]} /><meshBasicMaterial color={delivered ? '#b1e1a0' : '#e6b477'} /></mesh>
    </group>
    <WorldDisplay position={[0, compact ? 2.1 : 1.65, -1.1]} width={5.5} height={compact ? 4.3 : 2.88} pixels={compact ? 500 : 760} label="Contact terminal" tone="terminal">
      <div className="terminal-bar"><span>INDIE BLOCK / MESSAGE STATION</span><span>{delivered ? '● MESSAGE ACCEPTED' : '● READY TO WRITE'}</span></div>
      <div className="terminal-content"><ContactForm onDelivered={() => setDelivered(true)} /></div>
    </WorldDisplay>
    {delivered && <mesh position={[-2, 1.85, .3]}><boxGeometry args={[.12, .7, .12]} /><meshBasicMaterial color="#c3da95" /></mesh>}
  </>;
}


