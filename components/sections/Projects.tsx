/* eslint-disable @next/next/no-img-element -- Preserve original project screenshots at their natural resolution. */
'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { projects, Project } from '@/data/projects';
import { usePortfolio } from '@/stores/portfolio-store';
export function SafeImage({ src, alt, ...props }: {
    src: string;
    alt: string;
    className?: string;
    loading?: 'lazy' | 'eager';
}) { const [failed, setFailed] = useState(false); return failed ? <div className="image-fallback">{alt}</div> : <img src={src} alt={alt} onError={() => setFailed(true)} {...props}/>; }
function Detail({ project }: {
    project: Project;
}) {
    const [index, setIndex] = useState(0);
    const images = project.gallery.length ? project.gallery : [project.cover];
    return <div className="project-detail"><button className="text-button" onClick={() => usePortfolio.getState().selectProject(null)}>← All projects</button><h3>{project.title}</h3>{project.shortDescription && <p>{project.shortDescription}</p>}<a href={images[index]} target="_blank" rel="noopener noreferrer" title="Open full-size screenshot"><SafeImage key={images[index]} src={images[index]} alt={`${project.title} screenshot ${index + 1}`} className="detail-image"/></a><div className="gallery-controls"><button aria-label="Previous screenshot" onClick={() => setIndex((index - 1 + images.length) % images.length)}><ChevronLeft size={18}/></button><span>{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span><button aria-label="Next screenshot" onClick={() => setIndex((index + 1) % images.length)}><ChevronRight size={18}/></button></div><div className="thumbnails">{images.map((src, i) => <button key={src} aria-label={`View screenshot ${i + 1}`} aria-pressed={index === i} onClick={() => setIndex(i)}><SafeImage src={src} alt="" loading="lazy"/></button>)}</div>{project.description && <p>{project.description}</p>}<dl>{(['category', 'role', 'year', 'status'] as const).filter(k => project[k]).map(k => <div key={k}><dt>{k}</dt><dd>{project[k]}</dd></div>)}</dl>{project.stack.length > 0 && <div className="tags">{project.stack.map(t => <span key={t}>{t}</span>)}</div>}<div className="project-links">{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Visit project <ArrowUpRight size={16}/></a>}{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={16}/></a>}</div></div>;
}
export default function Projects() {
    const selected = usePortfolio(s => s.selectedProject);
    const [page, setPage] = useState(0);
    const project = projects.find(p => p.id === selected);
    const ordered = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));
    if (project)
        return <Detail key={project.id} project={project}/>;
    return <><div className="section-intro"><p>A collection of things I’ve built.</p><span>{String(projects.length).padStart(2, '0')} PROJECTS</span></div><div className="project-list">{ordered.slice(page * 3, page * 3 + 3).map((p, i) => <button className="project-card" key={p.id} onClick={() => usePortfolio.getState().selectProject(p.id)}><SafeImage src={p.cover} alt={`${p.title} preview`} loading="lazy"/><div><span className="eyebrow">{String(page * 3 + i + 1).padStart(2, '0')} / SELECTED WORK</span><h3>{p.title}<ArrowUpRight size={20}/></h3>{p.shortDescription && <p>{p.shortDescription}</p>}</div></button>)}</div><div className="gallery-controls"><button aria-label="Previous projects" disabled={page === 0} onClick={() => setPage(page - 1)}><ChevronLeft size={18}/></button><span>{page + 1} / {Math.ceil(projects.length / 3)}</span><button aria-label="Next projects" disabled={(page + 1) * 3 >= projects.length} onClick={() => setPage(page + 1)}><ChevronRight size={18}/></button></div></>;
}
