'use client';
import { useThree } from '@react-three/fiber';
import { socials } from '@/data/socials';
import WorldDisplay from './WorldDisplay';
import SocialAppLogo from './SocialAppLogo';

export default function SocialsRooftop() {
  const compact = useThree(state => state.size.width < 700);
  return <>
    {socials.map((social, i) => <WorldDisplay key={social.name} hoverLift position={[compact ? 0 : -2.08 + i * 2.08, compact ? 3.25 - i * 1.25 : 1.85, -1.75]} width={compact ? 5.9 : 1.82} height={compact ? 1.08 : 2.05} pixels={compact ? 500 : 300} label={`${social.name} signal tile`}>
      <a className={`signal-tile signal-tile-${social.name.toLowerCase()}`} href={social.url} target="_blank" rel="noopener noreferrer">
        <span className="signal-led">● SIGNAL OPEN</span>
        <div className="signal-app-icon">
          <SocialAppLogo name={social.name} />
        </div>
        <h2>{social.name}</h2>
        <p>{social.label}</p>
        <span className="signal-link">CONNECT ↗</span>
      </a>
    </WorldDisplay>)}
    <mesh position={[0, .55, -1.8]}><boxGeometry args={[5.9, .05, .05]} /><meshStandardMaterial color="#353a36" /></mesh>
  </>;
}


