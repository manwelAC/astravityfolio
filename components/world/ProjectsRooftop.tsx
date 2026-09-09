'use client';
import { useState } from 'react';
import { useThree } from '@react-three/fiber';
import { projects } from '@/data/projects';
import { usePortfolio } from '@/stores/portfolio-store';
import { SafeImage } from '@/components/sections/Projects';
import WorldDisplay from './WorldDisplay';

function ProjectWindow({ index, slot, active, onSelect }: { index: number; slot: number; active: boolean; onSelect: () => void }) {
  const compact = useThree(state => state.size.width < 700);
  const project = projects[index];
  const [image, setImage] = useState(0);
  const images = project.gallery.length ? project.gallery : [project.cover];
  const moveImage = (direction: number) => { onSelect(); setImage(i => (i + direction + images.length) % images.length); };
  return <WorldDisplay position={[compact ? 0 : (slot - 1) * 3.5, compact ? 4 : 2.05, -3.25]} width={compact ? 5.4 : 3.05} height={compact ? 5.9 : 2.25} pixels={compact ? 360 : 340} label={`${project.title} exhibition window`} tone="gallery" surface="plaque">
    <div className={`fixed-project-window ${active ? 'is-selected' : ''}`}>
      <button className="project-window-preview" aria-label={`Select ${project.title}`} aria-pressed={active} onClick={onSelect}><SafeImage src={images[image]} alt={`${project.title} screenshot ${image + 1}`} /></button>
      <div className="project-window-label"><button onClick={onSelect} aria-label={`Highlight ${project.title}`}>{project.title}</button><a href={images[image]} target="_blank" rel="noopener noreferrer" aria-label={`Inspect ${project.title} screenshot full-size`}>Inspect ↗</a></div>
      <nav className="project-window-pages" aria-label={`${project.title} screenshots`}><button disabled={images.length < 2} onClick={() => moveImage(-1)} aria-label={`Previous ${project.title} screenshot`}>←</button><span>{image + 1} / {images.length}</span><button disabled={images.length < 2} onClick={() => moveImage(1)} aria-label={`Next ${project.title} screenshot`}>→</button>{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Visit ↗</a>}{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">Code ↗</a>}</nav>
    </div>
  </WorldDisplay>;
}

export default function ProjectsRooftop() {
  const compact = useThree(state => state.size.width < 700);
  const selected = usePortfolio(s => s.selectedProject);
  const selectedIndex = projects.findIndex(p => p.id === selected);
  const [start, setStart] = useState(() => Math.max(0, selectedIndex));
  const count = compact ? 1 : 3;
  const first = Math.floor(start / count) * count;
  const move = (direction: number) => {
    const pages = Math.ceil(projects.length / count);
    const next = ((Math.floor(first / count) + direction + pages) % pages) * count;
    setStart(next);
    usePortfolio.getState().selectProject(null);
  };
  return <>
    {projects.slice(first, first + count).map((project, slot) => <ProjectWindow key={project.id} index={first + slot} slot={slot} active={selected === project.id} onSelect={() => usePortfolio.getState().selectProject(project.id)} />)}
    <WorldDisplay position={[0, compact ? .45 : .42, -3.2]} width={compact ? 5.4 : 10.3} height={compact ? .75 : .48} pixels={compact ? 360 : 800} label="Browse the project wall" tone="gallery" surface="plaque">
      <nav className="project-wall-browse" aria-label="Project groups"><button onClick={() => move(-1)} aria-label="Previous projects">← Previous</button><span>{compact ? first + 1 : `${first + 1}–${Math.min(first + count, projects.length)}`} / {projects.length}</span><button onClick={() => move(1)} aria-label="Next projects">Next →</button></nav>
    </WorldDisplay>
  </>;
}
