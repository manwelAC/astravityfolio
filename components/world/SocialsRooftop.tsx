'use client';
import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { socials } from '@/data/socials';
import WorldDisplay from './WorldDisplay';
import SocialAppLogo from './SocialAppLogo';
import { usePortfolio } from '@/stores/portfolio-store';

const dialogues = [
  {
    kicker: 'ROOFTOP GUIDE · MANUEL',
    text: "Hey! Looking to connect? Here are my socials and where to find me! 👋"
  },
  {
    kicker: 'VISUALS & LIFE · INSTAGRAM',
    text: "Check out my day-to-day life, creative visual work, and stories on Instagram 📸"
  },
  {
    kicker: 'DEV CLIPS · TIKTOK',
    text: "Watch my creative coding demos, experiments, and tech banter on TikTok 🎬"
  },
  {
    kicker: 'PROFESSIONAL · LINKEDIN',
    text: "Connect with me on LinkedIn for collaborations, opportunities, and updates 💼"
  },
  {
    kicker: 'DIRECT LINK',
    text: "Click any screen on the wall to visit my profile directly! 🚀"
  }
];

export default function SocialsRooftop() {
  const compact = useThree(state => state.size.width < 700);
  const activeSection = usePortfolio(s => s.section);
  const isFocused = activeSection === 'socials';

  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isFacingFront, setIsFacingFront] = useState(true);

  const rootRef = useRef<THREE.Group>(null!);
  const normalLocal = useMemo(() => new THREE.Vector3(0, 0, 1), []);
  const worldNormal = useMemo(() => new THREE.Vector3(), []);
  const toCamera = useMemo(() => new THREE.Vector3(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);

  // Auto-advance dialogue every 4.8s
  useEffect(() => {
    if (!isFocused) return;
    const interval = setInterval(() => {
      setDialogueIndex(i => (i + 1) % dialogues.length);
    }, 4800);
    return () => clearInterval(interval);
  }, [isFocused]);

  const nextDialogue = () => {
    setDialogueIndex(i => (i + 1) % dialogues.length);
  };

  // Character animation refs
  const headRef = useRef<THREE.Group>(null!);
  const armRef = useRef<THREE.Group>(null!);

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();
    if (headRef.current) {
      headRef.current.rotation.y = 0.35 + Math.sin(t * 0.9) * 0.08;
      headRef.current.rotation.x = Math.sin(t * 1.5) * 0.03;
    }
    if (armRef.current) {
      armRef.current.rotation.z = -0.65 + Math.sin(t * 1.8) * 0.06;
      armRef.current.rotation.y = -0.3 + Math.cos(t * 1.2) * 0.04;
    }
    if (rootRef.current) {
      rootRef.current.getWorldQuaternion(tempQuat);
      worldNormal.copy(normalLocal).applyQuaternion(tempQuat);
      rootRef.current.getWorldPosition(tempPos);
      toCamera.subVectors(camera.position, tempPos);
      const front = worldNormal.dot(toCamera) > 0.05;
      if (front !== isFacingFront) {
        setIsFacingFront(front);
      }
    }
  });

  const currentDialogue = dialogues[dialogueIndex];
  const charPos: [number, number, number] = compact ? [-2.2, 0, 1.3] : [-3.8, 0, 0.8];
  const bubblePos: [number, number, number] = compact ? [-2.2, 2.75, 1.3] : [-3.8, 2.8, 0.8];

  return (
    <group ref={rootRef}>
      {/* 1. WOODEN SCREEN SUPPORT POSTS */}
      {(compact ? [0] : [-3.5, 0, 3.5]).map(x => (
        <mesh key={x} position={[x, compact ? 3.8 : 1.7, -3.3]} castShadow>
          <boxGeometry args={[0.18, compact ? 7.6 : 4.2, 0.2]} />
          <meshStandardMaterial color="#765638" roughness={1} />
        </mesh>
      ))}

      {/* 2. SOCIAL MEDIA BILLBOARD SCREENS */}
      {socials.map((social, i) => (
        <WorldDisplay
          key={social.name}
          surface="plaque"
          position={[
            compact ? 0 : (i - (socials.length - 1) / 2) * 3.5,
            compact ? 6.4 - i * 2.3 : 1.95,
            -3
          ]}
          width={compact ? 5.4 : 3.1}
          height={compact ? 1.85 : 2.5}
          pixels={compact ? 360 : 260}
          label={`${social.name} signal tile`}
        >
          <a
            className={`signal-tile signal-tile-${social.name.toLowerCase()}`}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="signal-led">● SIGNAL OPEN</span>
            <div className="signal-app-icon">
              <SocialAppLogo name={social.name} />
            </div>
            <h2>{social.name}</h2>
            <p>{social.label}</p>
            <span className="signal-link">CONNECT ↗</span>
          </a>
        </WorldDisplay>
      ))}

      {/* Rear Cable Railing */}
      <mesh position={[0, 0.62, -2.4]}>
        <boxGeometry args={[11.1, 0.05, 0.05]} />
        <meshStandardMaterial color="#353a36" />
      </mesh>

      {/* 3. VOXEL CHARACTER: MANUEL HOST ON THE LEFT SIDE */}
      <group position={charPos} rotation={[0, 0.38, 0]}>
        {/* Ground Rug / Wooden Deck Slat Platform */}
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <boxGeometry args={[1.5, 0.04, 1.3]} />
          <meshStandardMaterial color="#3e3646" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[1.34, 0.02, 1.14]} />
          <meshStandardMaterial color="#6a4c3e" roughness={0.8} />
        </mesh>

        {/* Small Decorative Potted Plant beside him */}
        <group position={[-0.68, 0, 0.15]}>
          <mesh position={[0, 0.18, 0]} castShadow>
            <boxGeometry args={[0.34, 0.36, 0.34]} />
            <meshStandardMaterial color="#965c3e" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.44, 0]}>
            <boxGeometry args={[0.42, 0.22, 0.42]} />
            <meshStandardMaterial color="#4d7039" roughness={0.9} />
          </mesh>
          <mesh position={[0.04, 0.6, -0.02]}>
            <boxGeometry args={[0.3, 0.18, 0.3]} />
            <meshStandardMaterial color="#688a48" roughness={0.9} />
          </mesh>
        </group>

        {/* Shoes / Sneakers */}
        {[-0.16, 0.16].map((lx, i) => (
          <group key={i} position={[lx, 0, 0]}>
            <mesh position={[0, 0.06, 0.04]} castShadow>
              <boxGeometry args={[0.18, 0.12, 0.34]} />
              <meshStandardMaterial color="#212028" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.02, 0.04]}>
              <boxGeometry args={[0.19, 0.04, 0.35]} />
              <meshStandardMaterial color="#f0ece1" roughness={0.5} />
            </mesh>
          </group>
        ))}

        {/* Legs (Denim Trousers) */}
        {[-0.16, 0.16].map((lx, i) => (
          <mesh key={i} position={[lx, 0.44, 0]} castShadow>
            <boxGeometry args={[0.18, 0.64, 0.22]} />
            <meshStandardMaterial color="#2b3848" roughness={0.8} />
          </mesh>
        ))}

        {/* Torso & Stylish Streetwear Jacket */}
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[0.56, 0.66, 0.34]} />
          <meshStandardMaterial color="#bf623d" roughness={0.7} />
        </mesh>
        {/* Jacket Zipper & Collar Accent */}
        <mesh position={[0, 1.05, 0.175]}>
          <boxGeometry args={[0.08, 0.6, 0.02]} />
          <meshStandardMaterial color="#ede2d0" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.74, 0]}>
          <boxGeometry args={[0.54, 0.08, 0.32]} />
          <meshStandardMaterial color="#221e28" roughness={0.8} />
        </mesh>

        {/* Left Arm (Relaxed by side) */}
        <group position={[-0.35, 1.15, 0]}>
          <mesh position={[0, -0.24, 0.02]} rotation={[0.15, 0, 0.12]}>
            <boxGeometry args={[0.15, 0.48, 0.15]} />
            <meshStandardMaterial color="#bf623d" roughness={0.7} />
          </mesh>
          <mesh position={[0.02, -0.48, 0.05]}>
            <boxGeometry args={[0.11, 0.12, 0.11]} />
            <meshStandardMaterial color="#e5b892" />
          </mesh>
        </group>

        {/* Right Arm (Gesturing towards social screens) */}
        <group ref={armRef} position={[0.34, 1.12, 0.06]}>
          <mesh position={[0.18, 0.06, 0.14]} rotation={[0.2, -0.4, -0.65]}>
            <boxGeometry args={[0.15, 0.46, 0.15]} />
            <meshStandardMaterial color="#bf623d" roughness={0.7} />
          </mesh>
          {/* Hand pointing / open palm */}
          <mesh position={[0.38, 0.18, 0.28]} rotation={[0, -0.4, -0.3]}>
            <boxGeometry args={[0.12, 0.09, 0.14]} />
            <meshStandardMaterial color="#e5b892" />
          </mesh>
        </group>

        {/* Head & Face */}
        <group ref={headRef} position={[0, 1.58, 0.02]}>
          {/* Neck */}
          <mesh position={[0, -0.16, 0]}>
            <boxGeometry args={[0.16, 0.14, 0.16]} />
            <meshStandardMaterial color="#e5b892" />
          </mesh>
          {/* Head Base */}
          <mesh castShadow>
            <boxGeometry args={[0.38, 0.4, 0.36]} />
            <meshStandardMaterial color="#e5b892" roughness={0.6} />
          </mesh>
          {/* Dark Streetwear Cap */}
          <mesh position={[0, 0.14, -0.02]}>
            <boxGeometry args={[0.41, 0.2, 0.39]} />
            <meshStandardMaterial color="#1c1924" roughness={0.8} />
          </mesh>
          {/* Cap Visor (Forward angled) */}
          <mesh position={[0, 0.1, 0.24]} rotation={[0.1, 0, 0]}>
            <boxGeometry args={[0.38, 0.05, 0.18]} />
            <meshStandardMaterial color="#1c1924" roughness={0.8} />
          </mesh>
          {/* Pixel Shades / Glasses */}
          <mesh position={[0, 0.02, 0.19]}>
            <boxGeometry args={[0.32, 0.08, 0.04]} />
            <meshStandardMaterial color="#16141c" roughness={0.3} metalness={0.2} />
          </mesh>
        </group>
      </group>

      {/* 4. INTERACTIVE SPEECH BUBBLE ABOVE CHARACTER */}
      {isFocused && isFacingFront && (
        <Html
          position={bubblePos}
          center
          distanceFactor={compact ? 5.2 : 6.8}
          zIndexRange={[100, 20]}
        >
          <div
            className="lounge-speech-bubble speaker-manuel"
            onClick={nextDialogue}
            title="Click to advance"
          >
            <div className="bubble-header">
              <span className="speaker-indicator">●</span>
              <span className="speaker-name">Manuel</span>
              <span className="bubble-hint">tap to next</span>
            </div>
            <p className="bubble-text">{currentDialogue.text}</p>
            <div className="bubble-tail tail-left" />
          </div>
        </Html>
      )}
    </group>
  );
}
