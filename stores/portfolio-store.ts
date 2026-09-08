import { create } from 'zustand';
export type Section = 'overview' | 'projects' | 'about' | 'leads' | 'socials';
type State = {
  section: Section; transitioning: boolean; selectedProject: string | null;
  quality: 'high' | 'low'; viewRevision: number;
  navigate: (section: Section) => void; resetView: () => void;
  setTransitioning: (value: boolean) => void;
  selectProject: (id: string | null) => void;
  setQuality: (value: 'high' | 'low') => void;
};
export const usePortfolio = create<State>((set) => ({
  section: 'overview', transitioning: false, selectedProject: null, quality: 'high', viewRevision: 0,
  navigate: (section) => {
    if (typeof window !== 'undefined') window.location.hash = section === 'overview' ? '' : section;
    set(state => ({ section, selectedProject: null, viewRevision: state.viewRevision + 1 }));
  },
  resetView: () => set(state => ({ viewRevision: state.viewRevision + 1 })),
  setTransitioning: (transitioning) => set({ transitioning }),
  selectProject: (selectedProject) => set({ selectedProject }),
  setQuality: (quality) => set({ quality }),
}));
