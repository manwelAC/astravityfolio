import { Block } from '@/components/world/Primitives';
import { roofDimensions, rooftops } from './cameraPositions';
export function generateWorld(low: boolean) {
    const blocks: Block[] = [];
    const lights: Block[] = [];
    let seed = 437;
    const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const add = (p: Block['p'], s: Block['s'], c: string) => blocks.push({ p, s, c });
    const glow = (p: Block['p'], s: Block['s'], c = '#ffc675') => lights.push({ p, s, c });
    const stone = ['#4d4954', '#57505a', '#484550', '#60565e', '#514b55'];
    const lamp = (x: number, y: number, z: number) => { add([x, y + .45, z], [.16, .9, .16], '#332d37'); add([x, y + .9, z], [.43, .12, .43], '#624732'); glow([x, y + 1.12, z], [.32, .36, .32]); add([x, y + 1.34, z], [.43, .1, .43], '#624732'); };
    const plant = (x: number, y: number, z: number) => { add([x, y + .23, z], [.48, .46, .48], '#975c3b'); for (let i = 0; i < 6; i++)
        add([x + (rand() - .5) * .6, y + .5 + rand() * .7, z + (rand() - .5) * .6], [.36, .36, .36], ['#586d34', '#788346', '#354c35'][i % 3]); };
    const crate = (x: number, y: number, z: number) => { add([x, y + .34, z], [.7, .68, .7], '#9b683e'); for (const d of [-.25, .25]) {
        add([x + d, y + .34, z + .36], [.09, .68, .05], '#473632');
        add([x, y + .34 + d, z + .36], [.7, .07, .05], '#473632');
    } };
    const desk = (x: number, y: number, z: number) => { add([x, y + .8, z], [1.9, .16, .85], '#a37348'); for (const d of [-.75, .75])
        add([x + d, y + .38, z], [.12, .76, .65], '#4b3830'); add([x, y + 1.19, z], [.7, .58, .16], '#242733'); glow([x, y + 1.2, z + .09], [.58, .4, .03], '#91c6ca'); add([x, y + .92, z + .25], [.6, .05, .25], '#bba28b'); };
    // One continuous voxel city floor grounds the complete simulation. The
    // stepped outer rim stays readable through the cloud layer from every side.
    add([0, -23.2, -5], [118, 2.2, 92], '#252838');
    add([0, -22.02, -5], [112, .18, 86], '#564451');
    add([0, -21.82, -5], [104, .18, 78], '#6d5359');
    for (let lane = -45; lane <= 45; lane += 10) {
        add([lane, -21.68, -5], [.2, .04, 76], '#bc775a');
        add([0, -21.68, lane - 5], [102, .04, .2], '#bc775a');
    }
    for (let x = -48; x <= 48; x += 6) {
        for (let z = -38; z <= 32; z += 6) {
            if (Math.abs(x) < 13 && Math.abs(z) < 12)
                continue;
            const h = 1.6 + Math.floor(rand() * 5) * .9;
            add([x, -21.7 + h / 2, z], [3.6, h, 3.6], ['#313343', '#413846', '#503d48'][Math.floor(rand() * 3)]);
            if ((x + z) % 12 === 0)
                glow([x, -21.0 + h, z + 1.82], [.45, .4, .04], '#f0a45f');
        }
    }
    Object.entries(rooftops).forEach(([id, p]) => {
        const [x, y, z] = p;
        const { width: w, depth } = roofDimensions[id as keyof typeof roofDimensions];
        const towerHeight = y + 21.7;
        add([x, y - towerHeight / 2, z], [w - 0.35, towerHeight, depth - .35], '#393740');
        // A coursed concrete facade, batched into one shared instance draw.
        for (let row = 0; row < Math.floor(towerHeight / .67); row++)
            for (let col = 0; col < Math.floor(w / .85); col++) {
                const xx = x - w / 2 + .44 + col * .85 + (row % 2) * .15;
                add([xx, y - .45 - row * .67, z + depth / 2], [.81, .62, .22], stone[Math.floor(rand() * stone.length)]);
            }
        for (let row = 0; row < Math.floor(towerHeight / .67); row++)
            for (let col = 0; col < Math.floor(depth / .85); col++)
                add([x + w / 2, y - .45 - row * .67, z - depth / 2 + .43 + col * .85], [.22, .62, .81], stone[Math.floor(rand() * stone.length)]);
        add([x, y, z], [w + .55, .42, depth + .55], '#b08263');
        for (let i = 0; i < Math.floor(w / .65); i++)
            for (let j = 0; j < Math.floor(depth / .65); j++)
                add([x - w / 2 + .32 + i * .65, y + .26, z - depth / 2 + .34 + j * .65], [.61, .07, .61], rand() > .5 ? '#ac896e' : '#99765e');
        // Chunky corner masonry and a stepped roofline give every section the
        // fortified, hand-built silhouette of the concept art.
        for (const side of [-1, 1]) {
            add([x + side * (w / 2 - .42), y + 1.05, z - depth / 2 + .38], [.72, 2.05, .72], stone[side > 0 ? 1 : 3]);
            add([x + side * (w / 2 - .42), y + 2.22, z - depth / 2 + .38], [1.02, .3, 1.02], '#332e34');
        }
        // Rear gallery wall and its cornice.
        add([x, y + 1.75, z - depth / 2 + .28], [w, 3.3, .56], '#4c3d42');
        for (let i = 0; i < Math.floor(w / .8); i++)
            add([x - w / 2 + .4 + i * .8, y + 3.47, z - depth / 2 + .28], [.75, .35, .72], stone[i % 5]);
        // Front and side rails.
        for (let i = 0; i <= 6; i++) {
            const xx = x - w / 2 + i * w / 6;
            add([xx, y + .67, z + depth / 2], [.12, 1.05, .12], '#2d282d');
        }
        for (const h of [.42, 1.05])
            add([x, y + h, z + depth / 2], [w, .1, .12], '#2d282d');
        for (const side of [-1, 1]) {
            add([x + side * w / 2, y + .75, z], [.12, .11, depth], '#2d282d');
            lamp(x + side * (w / 2 - .3), y, z + depth / 2 - .2);
            plant(x + side * (w / 2 - .55), y, z - depth / 2 + .8);
        }
        for (let i = 0; i < (low ? 5 : 13); i++) {
            const xx = x - w / 2 + rand() * w;
            const zz = i % 2 ? z + depth / 2 + .2 : z - depth / 2;
            const len = 3 + Math.floor(rand() * 9);
            for (let j = 0; j < len; j++)
                add([xx + (rand() - .5) * .3, y + .3 - j * .3, zz], [.3 + rand() * .12, .3, .3], ['#3d5133', '#657639', '#7b8840'][j % 3]);
        }
        // Evenly spaced framed windows across all four elevations. Warm glazing,
        // recessed surrounds, mullions and sills read as architecture, not dots.
        for (let floor = 0; floor < Math.floor((towerHeight - 1) / 2.8); floor++) {
            const wy = y - 2.1 - floor * 2.8;
            for (const side of [-1, 1]) {
                for (let col = 0; col < 4; col++) {
                    const wx = x + (col - 1.5) * (w - 2.4) / 3;
                    const wz = z + side * (depth / 2 + .18);
                    add([wx, wy, wz], [1.15, 1.55, .24], '#272a35');
                    const color = rand() > .28 ? '#ffc47c' : '#675b6b';
                    glow([wx, wy, wz + side * .14], [.83, 1.19, .035], color);
                    add([wx, wy, wz + side * .17], [.08, 1.24, .04], '#38333b');
                    add([wx, wy - .84, wz + side * .06], [1.35, .16, .4], '#746471');
                }
                for (let col = 0; col < 3; col++) {
                    const wx = x + side * (w / 2 + .18);
                    const wz = z + (col - 1) * (depth - 2.4) / 2;
                    add([wx, wy, wz], [.24, 1.55, 1.15], '#272a35');
                    glow([wx + side * .14, wy, wz], [.035, 1.19, .83], rand() > .3 ? '#ffc47c' : '#675b6b');
                    add([wx + side * .17, wy, wz], [.04, 1.24, .08], '#38333b');
                    add([wx + side * .06, wy - .84, wz], [.4, .16, 1.35], '#746471');
                }
            }
            if (floor % 2 === 0) add([x, wy - 1.25, z], [w + .36, .2, depth + .36], '#403d48');
        }
        // Light rails and planted corners frame the exhibition wall.
        glow([x, y + 3.15, z - depth / 2 + .65], [w - 1.4, .07, .09], '#ffb95d');
        for (const side of [-1, 1]) {
            lamp(x + side * (w / 2 - .65), y, z);
            for (let i = 0; i < (low ? 6 : 16); i++) {
                const vx = x + side * (w / 2 - .35) + (rand() - .5) * .65;
                const vy = y + 3.65 - i * .25;
                add([vx, vy, z - depth / 2 + .68], [.42, .32, .45], ['#395631', '#587039', '#7b883e'][i % 3]);
            }
            crate(x + side * (w / 2 - 1), y + .1, z + 2.5);
        }
        crate(x + w / 2 - 1, y, z + 1.1);
        if (id !== 'socials' && id !== 'leads') {
            desk(x + 1.3, y, z - .3);
        }
        if (id === 'about') {
            // A furnished reading corner, kept away from the central display.

            add([x - 1.6, y + .5, z + .2], [2.1, .45, .85], '#c4a083');
            add([x - 1.6, y + .94, z - .14], [2.1, .65, .24], '#c4a083');
            for (const dx of [-2.65, -.55])
                add([x + dx, y + .66, z + .15], [.22, .65, .95], '#a77f68');
            add([x - 1.5, y + .32, z + 1.3], [3.8, .04, 2], '#475561');
            for (let tile = -3; tile <= 3; tile++) add([x - 1.5 + tile * .45, y + .35, z + 1.3], [.23, .02, 1.6], '#b3946b');
        }
    });
    // Walkways climb between roofs in broad, physical steps.
    const bridge = (a: readonly number[], b: readonly number[]) => { const dx = b[0] - a[0], dz = b[2] - a[2]; const n = Math.ceil(Math.hypot(dx, dz) / .45); const alongX = Math.abs(dx) > Math.abs(dz); for (let i = 0; i <= n; i++) {
        const t = i / n;
        const x = a[0] + dx * t, y = a[1] + (b[1] - a[1]) * t, z = a[2] + dz * t;
        add([x, y, z], alongX ? [.47, .28, 1.35] : [1.35, .28, .47], '#957966');
        if (i % 3 === 0)
            for (const s of [-1, 1]) {
                const xx = x + (alongX ? 0 : s * .68), zz = z + (alongX ? s * .68 : 0);
                add([xx, y + .58, zz], [.09, 1.1, .09], '#44343a');
                if (i % 6 === 0)
                    lamp(xx, y, zz);
            }
        for (const s of [-1, 1])
            add([x + (alongX ? 0 : s * .68), y + 1.05, z + (alongX ? s * .68 : 0)], alongX ? [.54, .1, .1] : [.1, .1, .54], '#654738');
    } };
    bridge([-1, 3.4, -2.2], [1.4, 2.6, -2.2]);
    bridge([-7.2, 3.4, -.1], [-7.2, .2, 2.1]);
    bridge([7.2, 2.6, -.1], [7.2, -.4, 2.1]);
    bridge([-1.25, .2, 6], [1.25, -.4, 6]);
    // Rooftop water tank, service pipes and skylights.
    add([0, 8, -5.2], [1.7, 1.8, 1.7], '#694c3f');
    add([0, 9, -5.2], [2, .22, 2], '#3a3039');
    for (const dx of [-.65, .65])
        for (const dz of [-.65, .65])
            add([dx, 6.3, -5.2 + dz], [.13, 1.7, .13], '#352b33');
    for (let i = 0; i < 9; i++) {
        add([-9.7, 1 - i * .5, -.3], [.12, .12, .9], '#37313b');
    }
    // Distant skyline rises from the same world floor, so rotating never reveals
    // an endless void beneath the city.
    for (let i = 0; i < (low ? 65 : 145); i++) {
        let x = (rand() - .5) * 110, z = -14 - rand() * 50;
        if (i % 4 === 0) {
            x = (rand() > .5 ? 1 : -1) * (19 + rand() * 35);
            z = rand() * 40 - 15;
        }
        const h = 4 + rand() * 20, w = 1.2 + rand() * 3;
        const y = -21.7 + h / 2;
        add([x, y, z], [w, h, w], ['#403958', '#514361', '#63495f', '#35364f'][i % 4]);
        add([x, -21.7 + h + .7, z], [w * .35, 1.4, w * .35], '#463c54');
        for (let k = 0; k < (low ? 4 : 12); k++)
            glow([x + (rand() - .5) * w * .7, -20.5 + rand() * (h - 1), z + w / 2 + .02], [.16, .3, .03], ['#e37f75', '#c27ca2', '#ffb55f'][k % 3]);
    }
    for (let i = 0; i < 26; i++) {
        const x = -45 + rand() * 85, z = -42 - rand() * 18, y = 10 + rand() * 13;
        for (let j = 0; j < 4; j++)
            add([x + j * 1.5, y + Math.floor(rand() * 2) * .6, z], [2.3, .7, 1], i % 2 ? '#ba788d' : '#dc8b8c');
    }
    return { blocks, lights };
}

