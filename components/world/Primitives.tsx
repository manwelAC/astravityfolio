'use client';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { pixelLettering } from '@/three/pixelLettering';
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
    const texture = useMemo(() => {
        const c = document.createElement('canvas');
        c.width = Math.round(width * 64); c.height = Math.round(height * 64);
        const x = c.getContext('2d')!;
        x.imageSmoothingEnabled = false;
        x.fillStyle = '#211c22'; x.fillRect(0, 0, c.width, c.height);
        x.strokeStyle = '#977353'; x.lineWidth = 2; x.strokeRect(5, 5, c.width - 10, c.height - 10);
        x.fillStyle = '#ffe3a4'; x.shadowColor = '#ff8a28'; x.shadowBlur = 8;
        if (/^[A-Z ']+$/.test(text)) {
            pixelLettering(x, text, c.width, Math.round(c.height * .16), c.height * (subtitle ? .52 : .65));
        } else {
            x.textAlign = 'center'; x.textBaseline = 'middle';
            x.font = `bold ${Math.min(c.height * .34, c.width / (text.length * .63))}px monospace`;
            x.fillText(text, c.width / 2, c.height * .48);
        }
        if (subtitle) {
            x.shadowBlur = 0; x.fillStyle = '#eee0ce'; x.textAlign = 'center';
            x.font = `bold ${Math.floor(Math.min(c.height * .17, (c.width - 30) / (subtitle.length * .62)))}px monospace`;
            x.fillText(subtitle, c.width / 2, c.height * .84);
        }
        const t = new THREE.CanvasTexture(c); t.magFilter = THREE.NearestFilter; t.minFilter = THREE.LinearMipmapLinearFilter;
        t.colorSpace = THREE.SRGBColorSpace; return t;
    }, [text, subtitle, width, height]);
    useLayoutEffect(() => () => texture.dispose(), [texture]);
    return <group position={position} scale={hovered ? 1.025 : 1}><mesh position={[0, 0, -0.16]} castShadow><boxGeometry args={[width + .14, height + .14, .22]}/><meshStandardMaterial color="#251f27"/></mesh><mesh onClick={e => { e.stopPropagation(); onClick?.(); }} onPointerOver={e => { if (onClick) {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
    } }} onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}><planeGeometry args={[width, height]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh></group>;
}
