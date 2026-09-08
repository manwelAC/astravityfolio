import { Block } from '@/components/world/Primitives';
import { rooftops } from './cameraPositions';
export function generateWorld(low: boolean) {
    const blocks: Block[] = [];
    const lights: Block[] = [];
    let seed = 437;
    const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const add = (p: Block['p'], s: Block['s'], c: string) => blocks.push({ p, s, c });
    const glow = (p: Block['p'], s: Block['s'], c = '#ffc675') => lights.push({ p, s, c });
    const stone = ['#57515b', '#635b62', '#494751', '#746469', '#514956'];
    const lamp = (x: number, y: number, z: number) => { add([x, y + .45, z], [.16, .9, .16], '#332d37'); add([x, y + .9, z], [.43, .12, .43], '#624732'); glow([x, y + 1.12, z], [.32, .36, .32]); add([x, y + 1.34, z], [.43, .1, .43], '#624732'); };
    const plant = (x: number, y: number, z: number) => { add([x, y + .23, z], [.48, .46, .48], '#975c3b'); for (let i = 0; i < 6; i++)
        add([x + (rand() - .5) * .6, y + .5 + rand() * .7, z + (rand() - .5) * .6], [.36, .36, .36], ['#586d34', '#788346', '#354c35'][i % 3]); };
    const crate = (x: number, y: number, z: number) => { add([x, y + .34, z], [.7, .68, .7], '#9b683e'); for (const d of [-.25, .25]) {
        add([x + d, y + .34, z + .36], [.09, .68, .05], '#473632');
        add([x, y + .34 + d, z + .36], [.7, .07, .05], '#473632');
    } };
    const desk = (x: number, y: number, z: number) => { add([x, y + .8, z], [1.9, .16, .85], '#a37348'); for (const d of [-.75, .75])
        add([x + d, y + .38, z], [.12, .76, .65], '#4b3830'); add([x, y + 1.19, z], [.7, .58, .16], '#242733'); glow([x, y + 1.2, z + .09], [.58, .4, .03], '#91c6ca'); add([x, y + .92, z + .25], [.6, .05, .25], '#bba28b'); };
    Object.entries(rooftops).forEach(([id, p]) => {
        const [x, y, z] = p;
        const w = id === 'projects' ? 8.7 : 6.8;
        const depth = 5.4;
        add([x, y - 16, z], [w - 0.3, 32, depth - .3], '#45414d');
        // A coursed concrete facade, batched into one shared instance draw.
        for (let row = 0; row < 44; row++)
            for (let col = 0; col < Math.floor(w / .85); col++) {
                const xx = x - w / 2 + .44 + col * .85 + (row % 2) * .15;
                add([xx, y - .45 - row * .67, z + depth / 2], [.81, .62, .22], stone[Math.floor(rand() * stone.length)]);
            }
        for (let row = 0; row < 44; row++)
            for (let col = 0; col < 6; col++)
                add([x + w / 2, y - .45 - row * .67, z - depth / 2 + .43 + col * .85], [.22, .62, .81], stone[Math.floor(rand() * stone.length)]);
        add([x, y, z], [w + .35, .3, depth + .3], '#998174');
        for (let i = 0; i < Math.floor(w / .65); i++)
            for (let j = 0; j < 8; j++)
                add([x - w / 2 + .32 + i * .65, y + .17, z - depth / 2 + .34 + j * .65], [.61, .06, .61], rand() > .5 ? '#b18c6b' : '#9c7a62');
        // Rear gallery wall and its cornice.
        add([x, y + 1.75, z - 2.35], [w, 3.3, .42], '#60545a');
        for (let i = 0; i < Math.floor(w / .8); i++)
            add([x - w / 2 + .4 + i * .8, y + 3.47, z - 2.35], [.75, .35, .67], stone[i % 5]);
        // Front and side rails.
        for (let i = 0; i <= 6; i++) {
            const xx = x - w / 2 + i * w / 6;
            add([xx, y + .67, z + 2.55], [.12, 1.05, .12], '#352f36');
        }
        for (const h of [.42, 1.05])
            add([x, y + h, z + 2.55], [w, .1, .12], '#3a3036');
        for (const side of [-1, 1]) {
            add([x + side * w / 2, y + .75, z], [.12, .11, 5.2], '#3a3036');
            lamp(x + side * (w / 2 - .3), y, z + 2.35);
            plant(x + side * (w / 2 - .55), y, z - 1.4);
        }
        for (let i = 0; i < (low ? 5 : 13); i++) {
            const xx = x - w / 2 + rand() * w;
            const zz = i % 2 ? z + 2.8 : z - 2.6;
            const len = 3 + Math.floor(rand() * 9);
            for (let j = 0; j < len; j++)
                add([xx + (rand() - .5) * .3, y + .3 - j * .3, zz], [.3 + rand() * .12, .3, .3], ['#3d5133', '#657639', '#7b8840'][j % 3]);
        }
        for (let floor = 0; floor < 12; floor++)
            for (let col = 0; col < 3; col++) {
                add([x - w / 2 + 1.5 + col * 2, y - 2 - floor * 2.1, z + 2.85], [.7, 1.05, .1], '#292d3b');
                if (rand() > .25)
                    glow([x - w / 2 + 1.5 + col * 2, y - 2 - floor * 2.1, z + 2.91], [.42, .67, .04], rand() > .4 ? '#e9a968' : '#ac899e');
            }
        crate(x + w / 2 - 1, y, z + 1.1);
        desk(x + 1.3, y, z - .3);
        if (id === 'about') {
            add([x - 1.6, y + .5, z + .2], [2.1, .45, .85], '#c4a083');
            add([x - 1.6, y + .94, z - .14], [2.1, .65, .24], '#c4a083');
            for (const dx of [-2.65, -.55])
                add([x + dx, y + .66, z + .15], [.22, .65, .95], '#a77f68');
            add([x - 1.5, y + .22, z + 1.3], [2.7, .04, 1.3], '#5b6970');
            for (let i = 0; i < 9; i++)
                add([x - 2.5 + i * .23, y + 1.05, z - 1.95], [.16, .4 + rand() * .3, .3], ['#a77750', '#777e64', '#977a80'][i % 3]);
        }
        if (id === 'leads') {
            add([x - 2, y + .8, z + .3], [.8, 1.5, .65], '#a94f47');
            add([x - 2, y + 1.08, z + .64], [.54, .12, .02], '#2f2831');
            glow([x - 2, y + 1.48, z + .3], [.65, .08, .5], '#e8ac77');
        }
        if (id === 'socials') {
            add([x - 2.4, y + 2.5, z - 1.8], [.15, 5, .15], '#302b38');
            for (let h = 2; h < 5; h += .7)
                add([x - 2.4, y + h, z - 1.8], [1, .08, .08], '#37323d');
            glow([x - 2.4, y + 5, z - 1.8], [.22, .24, .22], '#f27762');
            add([x - 1.4, y + .6, z], [.3, 1.2, .3], '#736776');
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
    bridge([-1, 3, -1.2], [1.8, 2.2, -1.2]);
    bridge([-5, 3, .2], [-5, -.2, 2.3]);
    bridge([5.5, 2.2, -.3], [5.5, -.7, 1.8]);
    bridge([-1.6, -.2, 5], [2.1, -.7, 5]);
    // Rooftop water tank, service pipes and skylights.
    add([-9.1, 8, -5.2], [1.7, 1.8, 1.7], '#694c3f');
    add([-9.1, 9, -5.2], [2, .22, 2], '#3a3039');
    for (const dx of [-.65, .65])
        for (const dz of [-.65, .65])
            add([-9.1 + dx, 6.3, -5.2 + dz], [.13, 1.7, .13], '#352b33');
    for (let i = 0; i < 9; i++) {
        add([-9.7, 1 - i * .5, -.3], [.12, .12, .9], '#37313b');
    }
    // Distant skyline: deterministic, instanced, with sparse warm windows.
    for (let i = 0; i < (low ? 65 : 145); i++) {
        let x = (rand() - .5) * 110, z = -14 - rand() * 50;
        if (i % 4 === 0) {
            x = (rand() > .5 ? 1 : -1) * (19 + rand() * 35);
            z = rand() * 40 - 15;
        }
        const h = 3 + rand() * 19, w = 1.2 + rand() * 3;
        const y = -30 + h / 2;
        add([x, y, z], [w, h + 20, w], ['#4b4669', '#595070', '#685475', '#41415f'][i % 4]);
        add([x, y + h / 2 + 10.7, z], [w * .35, 1.4, w * .35], '#514965');
        for (let k = 0; k < (low ? 4 : 12); k++)
            glow([x + (rand() - .5) * w * .7, -18 + rand() * (h - 1), z + w / 2 + .02], [.16, .3, .03], ['#d39087', '#b58caa', '#edb172'][k % 3]);
    }
    for (let i = 0; i < 26; i++) {
        const x = -45 + rand() * 85, z = -42 - rand() * 18, y = 10 + rand() * 13;
        for (let j = 0; j < 4; j++)
            add([x + j * 1.5, y + Math.floor(rand() * 2) * .6, z], [2.3, .7, 1], i % 2 ? '#ba788d' : '#dc8b8c');
    }
    return { blocks, lights };
}

