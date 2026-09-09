'use client';
import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { usePortfolio } from '@/stores/portfolio-store';

const dialogues = [
  {
    speaker: 0,
    name: 'Manuel',
    text: "Welcome to the rooftop lounge! Pull up a chair, coffee's fresh ☕"
  },
  {
    speaker: 1,
    name: 'Guest',
    text: "Thanks! Loving the voxel skyline vibe up here. What are you building lately?"
  },
  {
    speaker: 0,
    name: 'Manuel',
    text: "Focusing on full-stack web apps, interactive 3D, and sleek modern UX!"
  },
  {
    speaker: 1,
    name: 'Guest',
    text: "Awesome! Are you open to new collaborations or full-time roles?"
  },
  {
    speaker: 0,
    name: 'Manuel',
    text: "Always! Best ideas and collaborations start with chill conversations like this."
  },
  {
    speaker: 1,
    name: 'Guest',
    text: "Totally agree. Beautiful night view from this rooftop!"
  },
  {
    speaker: 0,
    name: 'Manuel',
    text: "Indeed! Feel free to hang around, enjoy the music and the city lights ✨"
  },
  {
    speaker: 1,
    name: 'Guest',
    text: "Cheers to that! Keep building awesome stuff 🚀"
  }
];

function LoungeMarqueeSign({ width = 4.4, height = 0.62 }: { width?: number; height?: number }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * 128);
    canvas.height = Math.round(height * 128);
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;

    // Dark neon backing
    ctx.fillStyle = '#1c1524';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Glowing border
    ctx.strokeStyle = '#f5bc76';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

    // Inner gold accent line
    ctx.strokeStyle = '#d48d56';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

    // Top kicker
    ctx.fillStyle = '#f5bc76';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ROOFTOP DISTRICT', canvas.width / 2, 27);

    // Main neon title
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffb366';
    ctx.shadowBlur = 12;
    ctx.font = 'bold 30px monospace';
    ctx.fillText("MANUEL’S LOUNGE", canvas.width / 2, 53);

    // Subtitle
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#eedccf';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('● GOOD VIBES & CONVERSATIONS ●', canvas.width / 2, 70);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [width, height]);

  return (
    <mesh position={[0, 0.95, 0.205]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} side={THREE.FrontSide} toneMapped={false} />
    </mesh>
  );
}

export default function LeadsRooftop() {
  const compact = useThree(state => state.size.width < 700);
  const activeSection = usePortfolio(s => s.section);
  const isFocused = activeSection === 'leads';

  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isFacingFront, setIsFacingFront] = useState(true);

  const rootRef = useRef<THREE.Group>(null!);
  const normalLocal = useMemo(() => new THREE.Vector3(0, 0, 1), []);
  const worldNormal = useMemo(() => new THREE.Vector3(), []);
  const toCamera = useMemo(() => new THREE.Vector3(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);

  // Auto-advance dialogue
  useEffect(() => {
    if (!isFocused) return;
    const interval = setInterval(() => {
      setDialogueIndex(i => (i + 1) % dialogues.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isFocused]);

  const nextDialogue = () => {
    setDialogueIndex(i => (i + 1) % dialogues.length);
  };

  // Animation refs
  const manuelHeadRef = useRef<THREE.Group>(null!);
  const visitorHeadRef = useRef<THREE.Group>(null!);
  const steamRef = useRef<THREE.Mesh>(null!);
  const fireGlowRef = useRef<THREE.PointLight>(null!);

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();
    if (manuelHeadRef.current) {
      manuelHeadRef.current.rotation.y = 0.26 + Math.sin(t * 0.85) * 0.07;
      manuelHeadRef.current.rotation.x = Math.sin(t * 1.6) * 0.025;
    }
    if (visitorHeadRef.current) {
      visitorHeadRef.current.rotation.y = -0.38 + Math.cos(t * 0.75) * 0.08;
      visitorHeadRef.current.rotation.x = Math.sin(t * 1.4) * 0.035;
    }
    if (steamRef.current) {
      steamRef.current.position.y = 0.52 + Math.sin(t * 3.2) * 0.04;
      steamRef.current.scale.setScalar(0.9 + Math.sin(t * 4.1) * 0.14);
    }
    if (fireGlowRef.current) {
      fireGlowRef.current.intensity = 2.4 + Math.sin(t * 3.5) * 0.4;
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

  return (
    <group ref={rootRef} position={[0, 0, 0]}>
      {/* Warm Ambient Lights for the Lounge */}
      <pointLight ref={fireGlowRef} position={[0, 1.2, -0.3]} color="#ffad5a" intensity={2.6} distance={7.5} />
      <pointLight position={[-2.5, 3.4, -2.4]} color="#ffe094" intensity={1.8} distance={6} />
      <pointLight position={[2.5, 3.4, -2.4]} color="#ffe094" intensity={1.8} distance={6} />

      {/* 1. Hardwood Deck & Geometric Outdoor Rug */}
      <mesh position={[0, 0.05, -0.3]} receiveShadow>
        <boxGeometry args={[compact ? 6.2 : 8.8, 0.12, 5.6]} />
        <meshStandardMaterial color="#543c2c" roughness={0.9} />
      </mesh>
      {/* Wood deck border trim */}
      <mesh position={[0, 0.07, -0.3]}>
        <boxGeometry args={[compact ? 6.4 : 9.0, 0.06, 5.8]} />
        <meshStandardMaterial color="#3a271c" roughness={0.95} />
      </mesh>
      {/* Cozy Lounge Rug */}
      <mesh position={[0, 0.12, -0.3]} receiveShadow>
        <boxGeometry args={[4.6, 0.02, 3.8]} />
        <meshStandardMaterial color="#d4c5b3" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.13, -0.3]}>
        <boxGeometry args={[4.2, 0.015, 3.4]} />
        <meshStandardMaterial color="#b99e82" roughness={0.8} />
      </mesh>

      {/* 2. Pergola Structure with Hanging Bistro / String Lights */}
      {[
        [-3.6, -2.6],
        [3.6, -2.6],
        [-3.6, 2.1],
        [3.6, 2.1]
      ].map(([px, pz], i) => (
        <mesh key={i} position={[px, 1.8, pz]} castShadow>
          <boxGeometry args={[0.16, 3.6, 0.16]} />
          <meshStandardMaterial color="#2d2831" roughness={0.7} metalness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, 3.55, -2.6]}>
        <boxGeometry args={[7.4, 0.12, 0.14]} />
        <meshStandardMaterial color="#2d2831" roughness={0.7} />
      </mesh>
      <mesh position={[0, 3.55, 2.1]}>
        <boxGeometry args={[7.4, 0.12, 0.14]} />
        <meshStandardMaterial color="#2d2831" roughness={0.7} />
      </mesh>
      {[-3.6, 3.6].map((bx, i) => (
        <mesh key={i} position={[bx, 3.55, -0.25]}>
          <boxGeometry args={[0.14, 0.12, 4.8]} />
          <meshStandardMaterial color="#2d2831" roughness={0.7} />
        </mesh>
      ))}

      {/* Hanging Festoon Fairy Lights */}
      {[-2.7, -1.8, -0.9, 0, 0.9, 1.8, 2.7].map((lx, i) => {
        const drop = Math.sin((i / 6) * Math.PI) * 0.28;
        return (
          <group key={i} position={[lx, 3.45 - drop, -1.2]}>
            <mesh position={[0, 0.08, 0]}>
              <boxGeometry args={[0.02, 0.16, 0.02]} />
              <meshBasicMaterial color="#1a181e" />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.075, 8, 8]} />
              <meshBasicMaterial color="#ffe59a" toneMapped={false} />
            </mesh>
          </group>
        );
      })}

      {/* 3. Backdrop Wall & Lounge Marquee (at z = -3.2) */}
      <group position={[0, 1.8, -3.2]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[compact ? 5.8 : 7.6, 2.8, 0.14]} />
          <meshStandardMaterial color="#231f29" roughness={0.9} />
        </mesh>
        {[-1.1, -0.7, -0.3, 0.1, 0.5, 0.9].map((sy, idx) => (
          <mesh key={idx} position={[0, sy, 0.08]}>
            <boxGeometry args={[compact ? 5.6 : 7.4, 0.26, 0.04]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#725039' : '#5f412c'} roughness={0.8} />
          </mesh>
        ))}
        <mesh position={[0, 0.95, 0.14]}>
          <boxGeometry args={[compact ? 3.4 : 4.4, 0.62, 0.06]} />
          <meshStandardMaterial color="#191520" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.95, 0.18]}>
          <boxGeometry args={[compact ? 3.3 : 4.3, 0.52, 0.02]} />
          <meshBasicMaterial color="#2a1d2d" />
        </mesh>
        <LoungeMarqueeSign width={compact ? 3.3 : 4.3} height={0.52} />
      </group>

      {/* 4. Side Coffee Station (Right Side) */}
      <group position={[3.3, 0, -1.4]}>
        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[1.2, 1.2, 2.2]} />
          <meshStandardMaterial color="#413028" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.32, 0]} castShadow>
          <boxGeometry args={[1.36, 0.08, 2.36]} />
          <meshStandardMaterial color="#eedbc5" roughness={0.6} />
        </mesh>
        <mesh position={[0.05, 1.58, -0.45]} castShadow>
          <boxGeometry args={[0.55, 0.44, 0.55]} />
          <meshStandardMaterial color="#c23b32" metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0.05, 1.74, -0.45]}>
          <boxGeometry args={[0.35, 0.08, 0.35]} />
          <meshStandardMaterial color="#dedede" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.1, 1.43, 0.2]}>
          <cylinderGeometry args={[0.08, 0.07, 0.14, 8]} />
          <meshStandardMaterial color="#f0ece4" />
        </mesh>
        <mesh position={[0.1, 1.43, 0.5]}>
          <cylinderGeometry args={[0.08, 0.07, 0.14, 8]} />
          <meshStandardMaterial color="#e8a87c" />
        </mesh>
      </group>

      {/* 5. Lush Potted Plants */}
      {[
        [-3.2, -2.2],
        [2.6, 1.8],
        [-3.2, 1.7]
      ].map(([gx, gz], i) => (
        <group key={i} position={[gx, 0, gz]}>
          <mesh position={[0, 0.38, 0]} castShadow>
            <boxGeometry args={[0.62, 0.68, 0.62]} />
            <meshStandardMaterial color="#b26145" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.88, 0]} castShadow>
            <boxGeometry args={[0.48, 0.45, 0.48]} />
            <meshStandardMaterial color="#384f2b" roughness={0.8} />
          </mesh>
          <mesh position={[-0.12, 1.15, 0.08]} castShadow>
            <boxGeometry args={[0.38, 0.5, 0.38]} />
            <meshStandardMaterial color="#4f6e3c" roughness={0.7} />
          </mesh>
          <mesh position={[0.1, 1.35, -0.06]} castShadow>
            <boxGeometry args={[0.26, 0.45, 0.26]} />
            <meshStandardMaterial color="#6f8f4a" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* 6. Sectional L-Shaped Lounge Sofa */}
      <group position={[-1.3, 0, -0.9]}>
        <mesh position={[-0.5, 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.28, 1.3]} />
          <meshStandardMaterial color="#2d221e" roughness={0.8} />
        </mesh>
        <mesh position={[-0.5, 0.44, 0.05]} castShadow>
          <boxGeometry args={[2.7, 0.22, 1.2]} />
          <meshStandardMaterial color="#cf904e" roughness={0.65} />
        </mesh>
        <mesh position={[-0.5, 0.82, -0.48]} castShadow>
          <boxGeometry args={[2.7, 0.62, 0.26]} />
          <meshStandardMaterial color="#bc7e3e" roughness={0.65} />
        </mesh>
        <mesh position={[-1.9, 0.64, 0.05]} castShadow>
          <boxGeometry args={[0.24, 0.58, 1.26]} />
          <meshStandardMaterial color="#2d221e" roughness={0.8} />
        </mesh>
        <mesh position={[-1.6, 0.22, 1.1]} castShadow>
          <boxGeometry args={[0.88, 0.28, 1.2]} />
          <meshStandardMaterial color="#2d221e" roughness={0.8} />
        </mesh>
        <mesh position={[-1.6, 0.44, 1.1]} castShadow>
          <boxGeometry args={[0.82, 0.22, 1.14]} />
          <meshStandardMaterial color="#cf904e" roughness={0.65} />
        </mesh>
        <mesh position={[-1.6, 0.68, 0.4]} rotation={[0.2, 0.3, 0]}>
          <boxGeometry args={[0.34, 0.34, 0.12]} />
          <meshStandardMaterial color="#3b6357" roughness={0.5} />
        </mesh>
        <mesh position={[0.5, 0.68, -0.32]} rotation={[0.1, -0.2, 0]}>
          <boxGeometry args={[0.34, 0.34, 0.12]} />
          <meshStandardMaterial color="#b8563c" roughness={0.5} />
        </mesh>
      </group>

      {/* 7. Mid-Century Lounge Club Chair */}
      <group position={[1.8, 0, -0.2]} rotation={[0, -0.48, 0]}>
        {[
          [-0.45, -0.35],
          [0.45, -0.35],
          [-0.45, 0.35],
          [0.45, 0.35]
        ].map(([cx, cz], i) => (
          <mesh key={i} position={[cx, 0.16, cz]}>
            <cylinderGeometry args={[0.03, 0.02, 0.32, 6]} />
            <meshStandardMaterial color="#3a271c" roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[0, 0.38, 0]} castShadow>
          <boxGeometry args={[1.05, 0.18, 1.05]} />
          <meshStandardMaterial color="#dfcaa8" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.8, -0.42]} rotation={[0.1, 0, 0]} castShadow>
          <boxGeometry args={[1.0, 0.65, 0.18]} />
          <meshStandardMaterial color="#dfcaa8" roughness={0.7} />
        </mesh>
        {[-0.54, 0.54].map((ax, i) => (
          <mesh key={i} position={[ax, 0.62, 0]}>
            <boxGeometry args={[0.08, 0.32, 0.9]} />
            <meshStandardMaterial color="#3a271c" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* 8. Low Coffee Table */}
      <group position={[0.15, 0, -0.3]}>
        {[
          [-0.7, -0.45],
          [0.7, -0.45],
          [-0.7, 0.45],
          [0.7, 0.45]
        ].map(([tx, tz], i) => (
          <mesh key={i} position={[tx, 0.18, tz]}>
            <boxGeometry args={[0.06, 0.36, 0.06]} />
            <meshStandardMaterial color="#221e25" />
          </mesh>
        ))}
        <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.06, 1.1]} />
          <meshStandardMaterial color="#2d231e" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.375, 0]}>
          <boxGeometry args={[1.64, 0.04, 1.14]} />
          <meshStandardMaterial color="#b28e57" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.44, 0]}>
          <cylinderGeometry args={[0.1, 0.08, 0.08, 8]} />
          <meshStandardMaterial color="#c27453" />
        </mesh>
        <mesh position={[0, 0.51, 0]}>
          <sphereGeometry args={[0.09, 6, 6]} />
          <meshStandardMaterial color="#4a6e4d" />
        </mesh>

        {/* Coffee Mug & Steam */}
        <mesh position={[-0.45, 0.46, -0.15]}>
          <cylinderGeometry args={[0.07, 0.06, 0.12, 8]} />
          <meshStandardMaterial color="#eee7da" roughness={0.4} />
        </mesh>
        <mesh position={[-0.45, 0.51, -0.15]}>
          <cylinderGeometry args={[0.058, 0.058, 0.02, 8]} />
          <meshBasicMaterial color="#3a2416" />
        </mesh>
        <mesh ref={steamRef} position={[-0.45, 0.58, -0.15]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.45} />
        </mesh>

        <mesh position={[0.4, 0.42, 0.15]} rotation={[0, -0.2, 0]}>
          <boxGeometry args={[0.34, 0.02, 0.26]} />
          <meshStandardMaterial color="#1a1820" metalness={0.6} />
        </mesh>
        <mesh position={[0.4, 0.435, 0.15]} rotation={[0, -0.2, 0]}>
          <boxGeometry args={[0.3, 0.01, 0.22]} />
          <meshBasicMaterial color="#f0e2b6" />
        </mesh>
      </group>

      {/* 9. CHARACTER 1: MANUEL (HOST) - Seated on Left Sofa */}
      <group position={[-1.2, 0.35, -0.85]} rotation={[0, 0.25, 0]}>
        {[-0.14, 0.14].map((lx, i) => (
          <group key={i} position={[lx, 0, 0]}>
            <mesh position={[0, 0.16, 0.3]} castShadow>
              <boxGeometry args={[0.2, 0.16, 0.52]} />
              <meshStandardMaterial color="#263445" roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.06, 0.54]} castShadow>
              <boxGeometry args={[0.18, 0.38, 0.18]} />
              <meshStandardMaterial color="#263445" roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.24, 0.6]}>
              <boxGeometry args={[0.19, 0.11, 0.28]} />
              <meshStandardMaterial color="#ede7db" roughness={0.5} />
            </mesh>
          </group>
        ))}

        <mesh position={[0, 0.52, 0.02]} castShadow>
          <boxGeometry args={[0.55, 0.64, 0.36]} />
          <meshStandardMaterial color="#273937" roughness={0.7} />
        </mesh>

        <mesh position={[-0.34, 0.62, -0.06]} rotation={[0.4, 0, 0.3]}>
          <boxGeometry args={[0.14, 0.44, 0.14]} />
          <meshStandardMaterial color="#273937" roughness={0.7} />
        </mesh>
        <mesh position={[0.34, 0.5, 0.18]} rotation={[-0.5, 0.2, -0.3]}>
          <boxGeometry args={[0.14, 0.42, 0.14]} />
          <meshStandardMaterial color="#273937" roughness={0.7} />
        </mesh>
        <mesh position={[0.38, 0.42, 0.34]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#e5b892" />
        </mesh>

        <group ref={manuelHeadRef} position={[0, 1.0, 0.04]}>
          <mesh position={[0, -0.16, 0]}>
            <boxGeometry args={[0.16, 0.14, 0.16]} />
            <meshStandardMaterial color="#e5b892" />
          </mesh>
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.42, 0.38]} />
            <meshStandardMaterial color="#e5b892" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.14, -0.02]}>
            <boxGeometry args={[0.43, 0.22, 0.41]} />
            <meshStandardMaterial color="#1f1a1a" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.02, 0.2]}>
            <boxGeometry args={[0.34, 0.09, 0.04]} />
            <meshStandardMaterial color="#201f26" roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* 10. CHARACTER 2: VISITOR (GUEST) - Seated in Club Chair */}
      <group position={[1.8, 0.35, -0.2]} rotation={[0, -0.48, 0]}>
        {[-0.13, 0.13].map((lx, i) => (
          <group key={i} position={[lx, 0, 0]}>
            <mesh position={[0, 0.14, 0.26]} castShadow>
              <boxGeometry args={[0.18, 0.16, 0.48]} />
              <meshStandardMaterial color="#35343d" roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.06, 0.48]} castShadow>
              <boxGeometry args={[0.17, 0.36, 0.17]} />
              <meshStandardMaterial color="#35343d" roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.22, 0.52]}>
              <boxGeometry args={[0.18, 0.1, 0.26]} />
              <meshStandardMaterial color="#543c2c" roughness={0.7} />
            </mesh>
          </group>
        ))}

        <mesh position={[0, 0.48, 0.02]} castShadow>
          <boxGeometry args={[0.5, 0.58, 0.32]} />
          <meshStandardMaterial color="#ba5942" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.48, 0.17]}>
          <boxGeometry args={[0.2, 0.44, 0.03]} />
          <meshStandardMaterial color="#f0ece1" />
        </mesh>

        {[-0.28, 0.28].map((ax, i) => (
          <mesh key={i} position={[ax, 0.42, 0.16]} rotation={[-0.45, i === 0 ? 0.3 : -0.3, 0]}>
            <boxGeometry args={[0.13, 0.36, 0.13]} />
            <meshStandardMaterial color="#ba5942" roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[0, 0.36, 0.32]}>
          <cylinderGeometry args={[0.07, 0.06, 0.12, 8]} />
          <meshStandardMaterial color="#ded1bd" />
        </mesh>

        <group ref={visitorHeadRef} position={[0, 0.94, 0.03]}>
          <mesh position={[0, -0.14, 0]}>
            <boxGeometry args={[0.15, 0.12, 0.15]} />
            <meshStandardMaterial color="#dfa882" />
          </mesh>
          <mesh castShadow>
            <boxGeometry args={[0.38, 0.4, 0.36]} />
            <meshStandardMaterial color="#dfa882" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.14, -0.02]}>
            <boxGeometry args={[0.41, 0.24, 0.39]} />
            <meshStandardMaterial color="#472d24" roughness={0.9} />
          </mesh>
        </group>
      </group>

      {/* 11. DYNAMIC LIVING SPEECH BUBBLES */}
      {isFocused && isFacingFront && currentDialogue.speaker === 0 && (
        <Html
          position={[-1.2, 2.35, -0.7]}
          center
          distanceFactor={compact ? 5.2 : 6.8}
          zIndexRange={[100, 20]}
        >
          <div className="lounge-speech-bubble speaker-manuel" onClick={nextDialogue}>
            <div className="bubble-header">
              <span className="speaker-indicator">●</span>
              <span className="speaker-name">{currentDialogue.name}</span>
              <span className="bubble-hint">tap to advance</span>
            </div>
            <p className="bubble-text">{currentDialogue.text}</p>
            <div className="bubble-tail tail-left" />
          </div>
        </Html>
      )}

      {isFocused && isFacingFront && currentDialogue.speaker === 1 && (
        <Html
          position={[1.8, 2.3, -0.1]}
          center
          distanceFactor={compact ? 5.2 : 6.8}
          zIndexRange={[100, 20]}
        >
          <div className="lounge-speech-bubble speaker-guest" onClick={nextDialogue}>
            <div className="bubble-header">
              <span className="speaker-indicator">●</span>
              <span className="speaker-name">{currentDialogue.name}</span>
              <span className="bubble-hint">tap to advance</span>
            </div>
            <p className="bubble-text">{currentDialogue.text}</p>
            <div className="bubble-tail tail-right" />
          </div>
        </Html>
      )}

    </group>
  );
}


