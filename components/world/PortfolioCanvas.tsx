'use client';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { Blocks, GlowBlocks, Sign } from './Primitives';
import { generateWorld } from '@/three/generateWorld';
import { roofDimensions, rooftops } from '@/three/cameraPositions';
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
    return <><fog attach="fog" args={['#765477', 38, 112]}/><ambientLight intensity={.72} color="#9da0d8"/><hemisphereLight args={['#ffb29a', '#332d4e', 1.9]}/><directionalLight position={[4, 18, 8]} color="#ffc078" intensity={4.1} castShadow={quality === 'high'} shadow-mapSize={[1024, 1024]} shadow-camera-left={-18} shadow-camera-right={18} shadow-camera-top={18} shadow-camera-bottom={-18} shadow-camera-far={65} shadow-bias={-.001}/><pointLight position={[-5, 5, 0]} color="#ff9b45" intensity={12} distance={11}/><pointLight position={[5, 4, 0]} color="#ff9b45" intensity={10} distance={10}/><Blocks blocks={blocks}/><PixelCloudBank/><GlowBlocks blocks={lights}/><Beacon />
 {Object.entries(rooftops).map(([id, p]) => { const dimensions = roofDimensions[id as keyof typeof roofDimensions]; return <group key={id} position={[...p]}><Sign text={id.toUpperCase()} subtitle={{ projects: 'IDEAS INTO THINGS', about: 'SAME HUMAN. MORE IDEAS.', leads: 'GOT A PROJECT? LET’S TALK.', socials: 'FIND ME AROUND' }[id]} width={active === id && compact ? 5.6 : dimensions.width - 1.25} height={active === id ? (compact ? 1.15 : 1.45) : 2.15} position={[0, active === id ? (compact ? 8.8 : 6.35) : 4.35, -dimensions.depth / 2 + .58]} onClick={active === 'overview' ? () => visit(id as Section) : undefined}/><mesh position={[0, -.15, 0]} onClick={e => { e.stopPropagation(); if (active === 'overview') visit(id as Section); }}><boxGeometry args={[dimensions.width, .3, dimensions.depth]}/><meshStandardMaterial color="#a2846a"/></mesh></group>; })}
 {active === 'overview' && <group position={[...rooftops.projects]}>{projects.slice(0, 3).map((p, i) => <group key={p.id} position={[-3.5 + i * 3.5, 0, 0]}><ProjectScreen url={p.cover} id={p.id} position={[0, 2.05, -3.25]}/><Sign text={p.title.toUpperCase()} width={3.05} height={.48} position={[0, 1, -3.2]} onClick={() => visit('projects')}/></group>)}</group>}
 <Sign text="INDIE BLOCK" width={2.1} height={1.05} position={[0, 8.25, -4.32]}/>
 {active === 'overview' && <group position={[...rooftops.about]}>
   <Sign text="JOHN MANUEL" subtitle="FULL-STACK DEVELOPER" width={5.2} height={1.4} position={[-2.45, 2.05, -3.2]} onClick={() => visit('about')}/>
   <Sign text="PROFILE / STACK" width={4.2} height={.85} position={[2.65, 2.55, -3.2]} onClick={() => visit('about')}/>
   <Sign text="EDUCATION / JOURNEY" width={4.2} height={.85} position={[2.65, 1.45, -3.2]} onClick={() => visit('about')}/>
 </group>}
 {active === 'overview' && <group position={[...rooftops.leads]}><Sign text="LET'S TALK" subtitle="PROJECTS / COLLABORATIONS / SAY HI" width={8.8} height={2.25} position={[0, 1.95, -3]} onClick={() => visit('leads')}/></group>}
 {active === 'overview' && <group position={[...rooftops.socials]}>{socials.map((s, i) => (
   <SocialBillboardScreen
     key={s.name}
     social={s}
     width={2.6}
     height={2.5}
     position={[-3.1 + i * 3.1, 1.95, -3]}
     onClick={() => visit('socials')}
   />
 ))}</group>}
 <mesh position={[-6.4, 1.3, 4.7]} rotation={[-.65, 0, -.4]}><cylinderGeometry args={[.8, .25, .25, 8]}/><meshStandardMaterial color="#a99daf" side={THREE.DoubleSide}/></mesh>
 <mesh position={[25, 8, -48]}><circleGeometry args={[4.3, 12]}/><meshBasicMaterial color="#ffd592" fog={false}/></mesh>
  {active !== 'overview' && <group key={active} position={[...rooftops[active]]}>
   {[-1, 1].map(side => <mesh key={side} position={[side * (roofDimensions[active].width / 2 - 1.5), 4.15, -roofDimensions[active].depth / 2 + .35]}><boxGeometry args={[.18, compact ? 3.7 : 2.7, .22]}/><meshStandardMaterial color="#42343a"/></mesh>)}
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
    return <Canvas shadows={quality === 'high'} camera={{ position: [25, 24, 42], fov: 46, near: .1, far: 180 }} dpr={quality === 'low' ? 1 : [1, 1.5]} gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }} onCreated={onReady} fallback={<div className="world-fallback">Explore the block using the navigation below.</div>}><Suspense fallback={null}><ContextMonitor onFailure={onFailure}/><World /></Suspense></Canvas>;
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




