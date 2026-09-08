import type { Section } from '@/stores/portfolio-store';

export const rooftops = {
  projects: [-5.4, 3, -2.5], about: [5.2, 2.2, -3],
  socials: [-5, -0.2, 5], leads: [5.5, -0.7, 4.5],
} as const;

type Shot = { position: [number, number, number]; target: [number, number, number]; fov: number };
// Close-up cameras sit above the front railing, not behind the neighboring roof.
// Each shot centers the physical wall and leaves floor space and skyline in frame.
export const cameraPositions: Record<Section, Shot> = {
  overview: { position: [19, 18, 30], target: [0, 1.5, 0], fov: 43 },
  projects: { position: [-4.5, 8.6, 6.4], target: [-5.4, 4.9, -3.0], fov: 43 },
  about: { position: [6.0, 7.6, 5.0], target: [5.2, 4.0, -3.6], fov: 43 },
  socials: { position: [-3.9, 5.1, 13.0], target: [-5, 1.6, 4.4], fov: 43 },
  leads: { position: [6.1, 4.8, 12.5], target: [5.5, 1.1, 3.9], fov: 43 },
};

// Portrait shots look almost straight onto the display. The roofs remain visible
// below the boards; no viewport-sized content layer is needed on small screens.
export const mobileCameraPositions: Record<Section, Shot> = {
  overview: { position: [28.5, 26.25, 45], target: [0, 1.5, 0], fov: 43 },
  projects: { position: [-5.1, 7.7, 1.8], target: [-5.4, 5.4, -3.2], fov: 105 },
  about: { position: [5.5, 6.7, 1.3], target: [5.2, 4.6, -3.7], fov: 105 },
  socials: { position: [-4.7, 4.3, 9.5], target: [-5, 2.2, 4.3], fov: 105 },
  leads: { position: [5.8, 3.8, 9.0], target: [5.5, 1.7, 3.8], fov: 105 },
};
