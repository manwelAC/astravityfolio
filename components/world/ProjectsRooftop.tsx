'use client';
import { useEffect, useRef, useState } from 'react';
import { Group } from 'three';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { projects } from '@/data/projects';
import { usePortfolio } from '@/stores/portfolio-store';
import { SafeImage } from '@/components/sections/Projects';
import WorldDisplay from './WorldDisplay';

function CarouselPanel({ index, offset, onSelect }: { index: number; offset: number; onSelect: () => void }) {
  const compact = useThree(state => state.size.width < 700);
  const group = useRef<Group>(null);
  const project = projects[index];
  useEffect(() => {
    if (!group.current) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tween = gsap.to(group.current.position, { x: offset * 4, z: -2.45 + (offset === 0 ? .2 : 0), duration: reduced ? 0 : .42, ease: 'power2.inOut' });
    return () => { tween.kill(); };
  }, [offset]);
  return <group ref={group} position={[offset * 4, compact ? 4 : 2.8, -2.45]}>
    <WorldDisplay width={compact ? 5.4 : offset === 0 ? 4.5 : 3.15} height={compact ? 5.9 : offset === 0 ? 2.85 : 2.3} pixels={compact ? 360 : 430} position={[0, 0, 0]} label={project.title} tone="gallery">
      <button className="billboard-project" onClick={onSelect} aria-label={`Select ${project.title}`}>
        <SafeImage src={project.cover} alt={`${project.title} preview`} />
        <span><b>{project.title}</b><small>{offset === 0 ? 'SELECT PROJECT ↗' : 'VIEW PROJECT ↗'}</small></span>
      </button>
    </WorldDisplay>
  </group>;
}

export default function ProjectsRooftop() {
  const compact = useThree(state => state.size.width < 700);
  const selected = usePortfolio(s => s.selectedProject);
  const selectedIndex = projects.findIndex(p => p.id === selected);
  const [index, setIndex] = useState(() => Math.max(0, selectedIndex));
  const [image, setImage] = useState(0);
  const project = projects[selectedIndex < 0 ? index : selectedIndex];
  const move = (direction: number) => { setIndex(i => (i + direction + projects.length) % projects.length); setImage(0); };
  const select = (i: number) => { setIndex(i); setImage(0); usePortfolio.getState().selectProject(projects[i].id); };
  if (selected) return <>
    <WorldDisplay position={[0, compact ? 4 : 2.8, -2.35]} width={compact ? 5.4 : 11.8} height={compact ? 6.2 : 4.15} pixels={compact ? 360 : 850} label={`${project.title} project display`} tone="gallery" animateKey={project.id}>
      <div className="project-wall-detail">
        <div className="project-wall-image">
          <a href={project.gallery[image] || project.cover} target="_blank" rel="noopener noreferrer" aria-label="Open full-size screenshot"><SafeImage key={project.gallery[image]} src={project.gallery[image] || project.cover} alt={`${project.title} screenshot ${image + 1}`} /><span className="image-inspect-label">Inspect full-size ↗</span></a>
          <div className="wall-controls"><button aria-label="Previous screenshot" onClick={() => setImage(i => (i - 1 + project.gallery.length) % project.gallery.length)}>←</button><span>{image + 1} / {project.gallery.length}</span><button aria-label="Next screenshot" onClick={() => setImage(i => (i + 1) % project.gallery.length)}>→</button></div>
        </div>
        <div className="project-wall-copy">
          <span className="wall-kicker">PROJECT ARCHIVE / {String(selectedIndex + 1).padStart(2, '0')}</span>
          <h2>{project.title}</h2>
          {project.shortDescription && <p>{project.shortDescription}</p>}
          {project.description && <p>{project.description}</p>}
          {(['category', 'role', 'year', 'status'] as const).filter(k => project[k]).map(k => <p key={k}><b>{k}:</b> {project[k]}</p>)}
          {!!project.stack.length && <div className="tags">{project.stack.map(t => <span key={t}>{t}</span>)}</div>}
          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Visit project ↗</a>}
          {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
          <button className="wall-action" onClick={() => usePortfolio.getState().selectProject(null)}>← Back to display wall</button>
        </div>
      </div>
    </WorldDisplay>
  </>;
  return <>
    {(compact ? [0] : [-1, 0, 1]).map(offset => {
      const i = (index + offset + projects.length) % projects.length;
      return <CarouselPanel key={projects[i].id} index={i} offset={offset} onSelect={() => select(i)} />;
    })}
    <mesh position={[-5.1, .4, 1.65]}><boxGeometry args={[.13, .8, .13]}/><meshStandardMaterial color="#574333"/></mesh><mesh position={[5.1, .4, 1.65]}><boxGeometry args={[.13, .8, .13]}/><meshStandardMaterial color="#574333"/></mesh><WorldDisplay position={[0, .45, -1.6]} width={compact ? 5.4 : 11.2} height={compact ? .85 : .65} pixels={compact ? 360 : 850} label="Project carousel controls" tone="gallery">
      <div className="wall-controls"><button onClick={() => move(-1)} aria-label="Previous project">← Previous</button><span>{String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')} <b>{project.title}</b></span><button onClick={() => select(index)}>Select ↗</button><button onClick={() => move(1)} aria-label="Next project">Next →</button></div>
    </WorldDisplay>
  </>;
}




