# Manuel's Roofies

A procedural rooftop portfolio for John Manuel Cuerdo / manuelAC, built with Next.js, React Three Fiber, Three.js, GSAP, and Zustand. No external models or fonts are required.

## Run locally

```sh
pnpm install
pnpm dev
```

Open http://localhost:3000. Use the rooftop signs or persistent navigation to visit Projects, About, Leads, and Socials. Escape closes project details or returns to the overview. Hash navigation supports browser Back and direct section links.

```sh
pnpm lint
pnpm exec tsc --noEmit
pnpm build
pnpm start
```

## Edit content

- `data/projects.ts`: nine projects discovered from the existing `public/assets/projects` folders. All 66 original image paths are preserved. Fill in descriptions, stack, category, role, year, status, and URLs when ready. Empty values are hidden. Set `featured: true` to move a project earlier in the gallery.
- `data/profile.ts`: biography, education, stack, and journey. Add a PDF at `public/profile/cv.pdf` and set `cvUrl` to `/profile/cv.pdf` to reveal View CV.
- `data/socials.ts`: the three supplied public social accounts.
- `data/contact.ts`: contact copy, recipient fallback, and shared form validation.

Project screenshots remain full-quality browser images in the details panel. Click a screenshot to open its original size. Rooftop screens use linear-filtered textures; pixel signage uses nearest-neighbor textures.

## Contact delivery

Copy `.env.example` to `.env.local`, supply a Resend API key and a sender email on your verified Resend domain, and restart the server. `CONTACT_TO_EMAIL` defaults to the supplied email address. Secrets are accessed only by `app/api/contact/route.ts`.

Without configuration, the route returns HTTP 503 and the form displays a direct-email fallback. It never reports delivery unless Resend accepts the message. Client and server validation, a honeypot, origin checks, and a request size limit are included. For a public high-traffic deployment, apply a durable rate limit at the hosting edge.

## World architecture

- `three/generateWorld.ts`: seeded geometry placement for rooftops, bridges, stairs, props, plants, clouds, and skyline; batched into two instanced meshes.
- `three/cameraPositions.ts`: central rooftop coordinates and camera destinations.
- `components/world`: scene, shared primitives, signs, screenshot textures, and GSAP camera controller.
- `components/sections`: accessible DOM galleries, profile panels, timeline, and form.
- `stores/portfolio-store.ts`: navigation, transition, project, and quality state.

Mobile starts at reduced detail/DPR. The performance monitor can lower detail automatically, and the visitor can toggle it manually. Reduced-motion preference removes camera travel and beacon animation. WebGL initialization failure or context loss enables the HTML destination fallback; failed project images get a readable fallback. No development panels are included in the production scene.

## Validation

Run `node scripts/verify-assets.mjs` to check that every immediate project directory is represented and that all gallery/cover paths exist.

## Rooftop section interaction

The selected rooftop is the content surface. Primary 3D views do not open viewport panels:

- Projects uses three physical carousel panels and a railing-mounted previous/select/next console. Selection replaces the display wall with an attached screenshot/detail cabinet.
- About uses a physical archive with switchable Profile, Tech Stack, Education, and My Journey boards. Milestone information expands inside that archive. A CV folder appears when `profile.cvUrl` is configured.
- Leads uses an interactive DOM form transformed onto a modeled CRT cabinet. Accepted email delivery illuminates its status indicator.
- Socials uses three illuminated, outward-moving link tiles.

`components/world/WorldDisplay.tsx` handles the physical bezel and Drei `Html transform` surface. Desktop and portrait camera position, target, and FOV live in `three/cameraPositions.ts`. Portrait boards expand within the rooftop; long content scrolls inside the screen. The explicit Read without 3D accessibility mode retains the simplified HTML views.

Drag the city to orbit its camera. Overview permits a full horizontal rotation; selected rooftops limit rotation to keep their front-facing displays usable. Reset view returns to the designed composition, and Back to Manuel's Roofies restores the overview. Camera travel temporarily disables orbit input. Reduced-motion preferences remove travel and cloud drift.

`components/world/PixelCloudBank.tsx` creates thick, stepped cloud masses from voxelized overlapping ellipsoids using a single instanced batch and lower mobile density.
