'use client';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { Blocks, GlowBlocks, Sign } from './Primitives';
import { generateWorld } from '@/three/generateWorld';
import { rooftops } from '@/three/cameraPositions';
import { projects } from '@/data/projects';
import { socials } from '@/data/socials';
import { Section, usePortfolio } from '@/stores/portfolio-store';
import CameraController from './CameraController';
import PixelCloudBank from './PixelCloudBank';
import ProjectsRooftop from './ProjectsRooftop';
import AboutRooftop from './AboutRooftop';
import LeadsRooftop from './LeadsRooftop';
import SocialsRooftop from './SocialsRooftop';
import SocialBillboardScreen from './SocialBillboardScreen';
function ProjectScreen({ url, position, id }: {
    url: string;
    position: [
        number,
        number,
        number
    ];
    id: string;
}) {
    const [texture, setTexture] = useState<THREE.Texture | null>(null);
    useEffect(() => { let alive = true; let loaded: THREE.Texture | undefined; new THREE.TextureLoader().load(url, t => { loaded = t; t.colorSpace = THREE.SRGBColorSpace; if (alive)
        setTexture(t);
    else
        t.dispose(); }, undefined, () => { }); return () => { alive = false; loaded?.dispose(); }; }, [url]);
    return <group position={position}><mesh position={[0, 0, -.12]}><boxGeometry args={[2.42, 1.6, .16]}/><meshStandardMaterial color="#292833"/></mesh><mesh onClick={e => { e.stopPropagation(); const s = usePortfolio.getState(); if (s.transitioning || s.section !== 'overview')
        return; s.navigate('projects'); s.selectProject(id); }} onPointerOver={() => { if (usePortfolio.getState().section === 'overview') document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'auto'; }}><planeGeometry args={[2.25, 1.4]}/><meshBasicMaterial key={texture?.uuid ?? 'empty'} map={texture} color={texture ? 'white' : '#bc986e'} toneMapped={false}/></mesh></group>;
}
function Beacon() { const ref = useRef<THREE.Mesh>(null); const reduced = useRef(false); useEffect(() => { reduced.current = matchMedia('(prefers-reduced-motion: reduce)').matches; }, []); useFrame(({ clock }) => { if (ref.current && !reduced.current)
    ref.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 1.6) * .12); }); return <mesh ref={ref} position={[-7.4, 4.9, 3.2]}><boxGeometry args={[.22, .22, .22]}/><meshBasicMaterial color="#ff8862"/></mesh>; }
function World() {
    const compact = useThree(state => state.size.width < 700);
    const section = usePortfolio(s => s.section);
    const transitioning = usePortfolio(s => s.transitioning);
    const active = transitioning ? 'overview' : section;
    const quality = usePortfolio(s => s.quality);
    const { blocks, lights } = useMemo(() => generateWorld(quality === 'low'), [quality]);
    const visit = (section: Section) => { if (!usePortfolio.getState().transitioning)
        usePortfolio.getState().navigate(section); };
    useEffect(() => () => { document.body.style.cursor = 'auto'; }, []);
    return <><fog attach="fog" args={['#886d92', 32, 100]}/><ambientLight intensity={.65} color="#aaa7d9"/><hemisphereLight args={['#e3b4c4', '#4b3a56', 1.6]}/><directionalLight position={[4, 18, 8]} color="#ffbd83" intensity={3.2} castShadow={quality === 'high'} shadow-mapSize={[1024, 1024]} shadow-camera-left={-18} shadow-camera-right={18} shadow-camera-top={18} shadow-camera-bottom={-18} shadow-camera-far={65} shadow-bias={-.001}/><pointLight position={[-5, 5, 0]} color="#ffa85c" intensity={9} distance={9}/><pointLight position={[5, 4, 0]} color="#ffa85c" intensity={7} distance={8}/><Blocks blocks={blocks}/><PixelCloudBank/><GlowBlocks blocks={lights}/><Beacon />
 {Object.entries(rooftops).map(([id, p]) => <group key={id} position={[...p]}><Sign text={id.toUpperCase()} subtitle={{ projects: 'IDEAS INTO THINGS', about: 'SAME HUMAN. MORE IDEAS.', leads: 'GOT A PROJECT? LET’S TALK.', socials: 'FIND ME AROUND' }[id]} width={id === 'projects' && !(compact && active === id) ? 7.9 : 6.2} position={[0, compact && active === id ? 5.45 : 4, -1.88]} onClick={active === 'overview' ? () => visit(id as Section) : undefined}/><mesh position={[0, -.15, 0]} onClick={e => { e.stopPropagation(); if (active === 'overview') visit(id as Section); }}><boxGeometry args={[id === 'projects' ? 8.7 : 6.8, .3, 5.4]}/><meshStandardMaterial color="#a2846a"/></mesh></group>)}
 {active === 'overview' && projects.slice(0, 3).map((p, i) => <ProjectScreen key={p.id} url={p.cover} id={p.id} position={[-8.05 + i * 2.65, 4.85, -4.58]}/>)}
 <Sign text="INDIE BLOCK" width={1.55} height={.8} position={[-9.1, 8, -4.32]}/>
 <Sign text="BUILD / EXPLORE / REPEAT" width={3.2} height={.72} position={[-5.4, 1.5, .35]}/>
 {active === 'overview' && <Sign text="PROFILE   /   STACK   /   JOURNEY" width={5.5} height={1.35} position={[5.2, 4, -5.1]} onClick={() => visit('about')}/>}
 {active === 'overview' && <Sign text="SEND A LITTLE HELLO →" width={4.8} height={1.35} position={[5.5, 1.05, 2.4]} onClick={() => visit('leads')}/>}
 {active === 'overview' && socials.map((s, i) => (
   <SocialBillboardScreen
     key={s.name}
     social={s}
     width={compact ? 5.9 : 1.82}
     height={compact ? 1.08 : 2.05}
     position={[
       compact ? -5 : -7.08 + i * 2.08,
       compact ? 3.05 - i * 1.25 : 1.65,
       3.25
     ]}
     onClick={() => visit('socials')}
   />
 ))}
 {active === 'overview' && <mesh position={[-5, .35, 3.2]}><boxGeometry args={[5.9, .05, .05]} /><meshStandardMaterial color="#353a36" /></mesh>}
 <mesh position={[-6.4, 1.3, 4.7]} rotation={[-.65, 0, -.4]}><cylinderGeometry args={[.8, .25, .25, 8]}/><meshStandardMaterial color="#a99daf" side={THREE.DoubleSide}/></mesh>
 <mesh position={[25, 8, -48]}><circleGeometry args={[4.3, 12]}/><meshBasicMaterial color="#ffd592" fog={false}/></mesh>
  {active !== 'overview' && <group key={active} position={[...rooftops[active]]}>
   <pointLight position={[0, 3, 1]} color="#ffd397" intensity={8} distance={9}/>
   {active === 'projects' && <ProjectsRooftop />}
   {active === 'about' && <AboutRooftop />}
   {active === 'leads' && <LeadsRooftop />}
   {active === 'socials' && <SocialsRooftop />}
 </group>}
 <CameraController /><PerformanceMonitor onDecline={() => usePortfolio.getState().setQuality('low')}/></>;
}
export default function PortfolioCanvas({ onReady, onFailure }: {
    onReady: () => void;
    onFailure: () => void;
}) {
    const quality = usePortfolio(s => s.quality);
    return <Canvas shadows={quality === 'high'} camera={{ position: [19, 18, 30], fov: 43, near: .1, far: 160 }} dpr={quality === 'low' ? 1 : [1, 1.5]} gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }} onCreated={onReady} fallback={<div className="world-fallback">Explore the block using the navigation below.</div>}><Suspense fallback={null}><ContextMonitor onFailure={onFailure}/><World /></Suspense></Canvas>;
}

function ContextMonitor({ onFailure }: { onFailure: () => void }) {
  const gl = useThree(state => state.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', onFailure);
    return () => canvas.removeEventListener('webglcontextlost', onFailure);
  }, [gl, onFailure]);
  return null;
}




