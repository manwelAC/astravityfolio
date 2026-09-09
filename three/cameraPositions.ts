import type { Section } from '@/stores/portfolio-store';

export const rooftops = {
  projects: [-7.6, 3.4, -4.2], about: [7.4, 2.6, -4.2],
  socials: [-7.2, 0.2, 6], leads: [7.2, -0.4, 6],
} as const;

export const roofDimensions = {
  projects: { width: 13.2, depth: 8.2 },
  about: { width: 11.8, depth: 8.2 },
  socials: { width: 11.8, depth: 7.8 },
  leads: { width: 11.8, depth: 7.8 },
} as const;

type Shot = { position: [number, number, number]; target: [number, number, number]; fov: number };
// Near-eye-level reading shots keep lettering almost frontal while retaining the roof.
export const cameraPositions: Record<Section, Shot> = {
  overview: { position: [25, 24, 42], target: [0, -6, 0], fov: 46 },
  projects: { position: [-7.4, 8.7, 8.8], target: [-7.6, 6.6, -6.2], fov: 34 },
  about: { position: [7.6, 7.9, 8.8], target: [7.4, 5.8, -6.2], fov: 34 },
  socials: { position: [-7, 5.5, 19], target: [-7.2, 3.4, 4], fov: 34 },
  leads: { position: [7.4, 4.9, 19], target: [7.2, 2.8, 4], fov: 34 },
};

// Portrait fixtures grow vertically; CameraController fits their physical bounds.
export const mobileCameraPositions: Record<Section, Shot> = {
  overview: { position: [35, 33, 57], target: [0, -6, 0], fov: 47 },
  projects: { position: [-7.6, 8.9, 6.8], target: [-7.6, 8, -6.2], fov: 50 },
  about: { position: [7.4, 8.1, 6.8], target: [7.4, 7.2, -6.2], fov: 50 },
  socials: { position: [-7.2, 5.7, 17], target: [-7.2, 4.8, 4], fov: 50 },
  leads: { position: [7.2, 5.1, 17], target: [7.2, 4.2, 4], fov: 50 },
};
