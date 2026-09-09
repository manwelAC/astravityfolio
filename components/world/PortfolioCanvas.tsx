'use client';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { Blocks, GlowBlocks, Sign } from './Primitives';
import { generateWorld } from '@/three/generateWorld';
import { roofDimensions, rooftops } from '@/three/cameraPositions';
import { Section, usePortfolio } from '@/stores/portfolio-store';
import CameraController from './CameraController';
import PixelCloudBank from './PixelCloudBank';
import ProjectsRooftop from './ProjectsRooftop';
import AboutRooftop from './AboutRooftop';
import { DisplayRoofContext } from './WorldDisplay';
import LeadsRooftop from './LeadsRooftop';
import SocialsRooftop from './SocialsRooftop';

function World() {
    const compact = useThree(state => state.size.width < 700);
    const section = usePortfolio(s => s.section);
    const quality = usePortfolio(s => s.quality);
    const { blocks, lights } = useMemo(() => generateWorld(quality === 'low'), [quality]);
    const visit = (section: Section) => {
        if (!usePortfolio.getState().transitioning)
            usePortfolio.getState().navigate(section);
    };
    useEffect(() => () => { document.body.style.cursor = 'auto'; }, []);
    return (
        <>
            <fog attach="fog" args={['#765477', 38, 112]} />
            <ambientLight intensity={0.72} color="#9da0d8" />
            <hemisphereLight args={['#ffb29a', '#332d4e', 1.9]} />
            <directionalLight
                position={[4, 18, 8]}
                color="#ffc078"
                intensity={4.1}
                castShadow={quality === 'high'}
                shadow-mapSize={[1024, 1024]}
                shadow-camera-left={-18}
                shadow-camera-right={18}
                shadow-camera-top={18}
                shadow-camera-bottom={-18}
                shadow-camera-far={65}
                shadow-bias={-0.001}
            />
            <pointLight position={[-5, 5, 0]} color="#ff9b45" intensity={12} distance={11} />
            <pointLight position={[5, 4, 0]} color="#ff9b45" intensity={10} distance={10} />
            <Blocks blocks={blocks} />
            <PixelCloudBank />
            <GlowBlocks blocks={lights} />

            {Object.entries(rooftops).map(([id, p]) => {
                const dimensions = roofDimensions[id as keyof typeof roofDimensions];
                return (
                    <group key={id} position={[...p]}>
                        <Sign
                            text={id === 'leads' ? 'LOUNGE' : id.toUpperCase()}
                            subtitle={
                                {
                                    projects: 'IDEAS INTO THINGS',
                                    about: 'SAME HUMAN. MORE IDEAS.',
                                    leads: 'ROOFTOP LOUNGE / CHILL & CONNECT',
                                    socials: 'FIND ME AROUND'
                                }[id]
                            }
                            width={compact ? 5.6 : dimensions.width - 1.25}
                            height={compact ? 1.15 : 2.15}
                            position={[0, compact ? 8.8 : 4.6, -dimensions.depth / 2 + 0.58]}
                            onClick={section === 'overview' ? () => visit(id as Section) : undefined}
                        />
                        <mesh
                            position={[0, -0.15, 0]}
                            onClick={e => {
                                e.stopPropagation();
                                if (section === 'overview') visit(id as Section);
                            }}
                        >
                            <boxGeometry args={[dimensions.width, 0.3, dimensions.depth]} />
                            <meshStandardMaterial color="#a2846a" />
                        </mesh>
                    </group>
                );
            })}
            <Sign text="MANUEL'S ROOFIES" width={2.75} height={1.05} position={[0, 8.25, -4.32]} />
            {Object.entries(rooftops).map(([id, p]) => {
                const isRoofActive = section === id;
                const showInOverview = section === 'overview';
                return (
                    <DisplayRoofContext.Provider key={id} value={id as Section}>
                        <group position={[...p]}>
                            {id === 'projects' && (isRoofActive || showInOverview) && <ProjectsRooftop />}
                            {id === 'about' && isRoofActive && <AboutRooftop />}
                            {id === 'leads' && (isRoofActive || showInOverview) && <LeadsRooftop />}
                            {id === 'socials' && (isRoofActive || showInOverview) && <SocialsRooftop />}
                        </group>
                    </DisplayRoofContext.Provider>
                );
            })}
            <mesh position={[25, 8, -48]}>
                <circleGeometry args={[4.3, 12]} />
                <meshBasicMaterial color="#ffd592" fog={false} />
            </mesh>
            <CameraController />
            <PerformanceMonitor onDecline={() => usePortfolio.getState().setQuality('low')} />
        </>
    );
}

export default function PortfolioCanvas({
    onReady,
    onFailure
}: {
    onReady: () => void;
    onFailure: () => void;
}) {
    const quality = usePortfolio(s => s.quality);
    const stage = useRef<HTMLDivElement>(null!);
    return (
        <div ref={stage} style={{ width: '100%', height: '100%' }}>
            <Canvas
                eventSource={stage}
                eventPrefix="client"
                shadows={quality === 'high'}
                camera={{ position: [25, 24, 42], fov: 46, near: 0.1, far: 180 }}
                dpr={quality === 'low' ? 1 : [1, 1.5]}
                gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
                onCreated={onReady}
                fallback={<div className="world-fallback">Explore the block using the navigation below.</div>}
            >
                <Suspense fallback={null}>
                    <ContextMonitor onFailure={onFailure} />
                    <World />
                </Suspense>
            </Canvas>
        </div>
    );
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
