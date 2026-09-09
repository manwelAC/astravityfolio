'use client';
import { useThree } from '@react-three/fiber';
import { socials } from '@/data/socials';
import WorldDisplay from './WorldDisplay';
import SocialAppLogo from './SocialAppLogo';

export default function SocialsRooftop() {
  const compact = useThree(state => state.size.width < 700);
  return <>
    {(compact ? [0] : [-3.5, 0, 3.5]).map(x => <mesh key={x} position={[x, compact ? 3.8 : 2.1, -2.7]} castShadow><boxGeometry args={[.18, compact ? 7.6 : 4.2, .2]} /><meshStandardMaterial color="#765638" roughness={1} /></mesh>)}
    {socials.map((social, i) => <WorldDisplay key={social.name} surface="plaque" hoverLift position={[compact ? 0 : (i - (socials.length - 1) / 2) * 3.5, compact ? 6.4 - i * 2.3 : 2.8, -2.35]} width={compact ? 5.4 : 3.1} height={compact ? 1.85 : 3.7} pixels={compact ? 360 : 290} label={`${social.name} signal tile`}>
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
    <mesh position={[0, .62, -2.4]}><boxGeometry args={[11.1, .05, .05]} /><meshStandardMaterial color="#353a36" /></mesh>
  </>;
}


