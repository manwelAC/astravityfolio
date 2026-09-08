'use client';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
export type Block = {
    p: [
        number,
        number,
        number
    ];
    s: [
        number,
        number,
        number
    ];
    c: string;
    glow?: boolean;
};
export function Blocks({ blocks }: {
    blocks: Block[];
}) {
    const ref = useRef<THREE.InstancedMesh>(null);
    useLayoutEffect(() => {
        const mesh = ref.current!;
        const dummy = new THREE.Object3D();
        blocks.forEach((b, i) => { dummy.position.set(...b.p); dummy.scale.set(...b.s); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix); mesh.setColorAt(i, new THREE.Color(b.c)); });
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor)
            mesh.instanceColor.needsUpdate = true;
        mesh.computeBoundingSphere();
    }, [blocks]);
    return <instancedMesh ref={ref} args={[undefined, undefined, blocks.length]} castShadow receiveShadow><boxGeometry /><meshStandardMaterial roughness={0.88}/></instancedMesh>;
}
export function GlowBlocks({ blocks }: {
    blocks: Block[];
}) {
    const ref = useRef<THREE.InstancedMesh>(null);
    useLayoutEffect(() => { const mesh = ref.current!; const d = new THREE.Object3D(); blocks.forEach((b, i) => { d.position.set(...b.p); d.scale.set(...b.s); d.updateMatrix(); mesh.setMatrixAt(i, d.matrix); mesh.setColorAt(i, new THREE.Color(b.c)); }); mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor)
        mesh.instanceColor.needsUpdate = true; mesh.computeBoundingSphere(); }, [blocks]);
    return <instancedMesh ref={ref} args={[undefined, undefined, blocks.length]}><boxGeometry /><meshBasicMaterial toneMapped={false}/></instancedMesh>;
}
export function Sign({ text, subtitle = '', width = 6, height = 1.9, position, onClick }: {
    text: string;
    subtitle?: string;
    width?: number;
    height?: number;
    position: [
        number,
        number,
        number
    ];
    onClick?: () => void;
}) {
    const [hovered, setHovered] = useState(false);
    const texture = useMemo(() => { const c = document.createElement('canvas'); c.width = 512; c.height = 160; const x = c.getContext('2d')!; x.fillStyle = '#201e29'; x.fillRect(0, 0, 512, 160); x.strokeStyle = '#796047'; x.lineWidth = 5; x.strokeRect(7, 7, 498, 146); x.textAlign = 'center'; x.fillStyle = '#ffcc80'; x.font = `900 ${text.length > 13 ? 30 : 58}px monospace`; let fontSize = text.length > 13 ? 30 : 58; while (x.measureText(text).width > 466 && fontSize > 12) {
        fontSize--;
        x.font = '900 ' + fontSize + 'px monospace';
    } x.fillText(text, 256, subtitle ? 82 : 100); if (subtitle) {
        x.fillStyle = '#c8b5a0';
        x.font = 'bold 19px monospace';
        x.fillText(subtitle, 256, 123);
    } const t = new THREE.CanvasTexture(c); t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; t.colorSpace = THREE.SRGBColorSpace; return t; }, [text, subtitle]);
    useLayoutEffect(() => () => texture.dispose(), [texture]);
    return <group position={position} scale={hovered ? 1.025 : 1}><mesh position={[0, 0, -0.16]} castShadow><boxGeometry args={[width + .14, height + .14, .22]}/><meshStandardMaterial color="#251f27"/></mesh><mesh onClick={e => { e.stopPropagation(); onClick?.(); }} onPointerOver={e => { if (onClick) {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
    } }} onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}><planeGeometry args={[width, height]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh></group>;
}
