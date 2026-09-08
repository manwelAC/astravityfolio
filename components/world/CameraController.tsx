'use client';
import { ComponentRef, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { PerspectiveCamera, Vector3 } from 'three';
import gsap from 'gsap';
import { usePortfolio } from '@/stores/portfolio-store';
import { cameraPositions, mobileCameraPositions } from '@/three/cameraPositions';

export default function CameraController() {
  const { camera, size } = useThree();
  const section = usePortfolio(s => s.section);
  const transitioning = usePortfolio(s => s.transitioning);
  const revision = usePortfolio(s => s.viewRevision);
  const target = useRef(new Vector3(0, 1.5, 0));
  const orbit = useRef<ComponentRef<typeof OrbitControls>>(null);
  useEffect(() => {
    const shot = (size.width < 700 ? mobileCameraPositions : cameraPositions)[section];
    const perspective = camera as PerspectiveCamera;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    usePortfolio.getState().setTransitioning(true);
    const timeline = gsap.timeline({
      onUpdate: () => {
        orbit.current?.target.copy(target.current);
        camera.lookAt(target.current);
        perspective.updateProjectionMatrix();
      },
      onComplete: () => usePortfolio.getState().setTransitioning(false),
    });
    const duration = reduced ? 0 : 1.25;
    timeline.to(camera.position, { x: shot.position[0], y: shot.position[1], z: shot.position[2], duration, ease: 'power2.inOut' }, 0);
    timeline.to(target.current, { x: shot.target[0], y: shot.target[1], z: shot.target[2], duration, ease: 'power2.inOut' }, 0);
    timeline.to(perspective, { fov: shot.fov, duration, ease: 'power2.inOut' }, 0);
    return () => { timeline.kill(); };
  }, [camera, section, size.width, revision]);
  return <OrbitControls ref={orbit} makeDefault enabled={!transitioning} enablePan={false} enableZoom={false}
    enableDamping={false} rotateSpeed={.48} minPolarAngle={.55} maxPolarAngle={1.42}
    minAzimuthAngle={section === 'overview' || transitioning ? -Infinity : -.42}
    maxAzimuthAngle={section === 'overview' || transitioning ? Infinity : .42} />;
}
