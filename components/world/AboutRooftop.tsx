'use client';
import { useState } from 'react';
import { useThree } from '@react-three/fiber';
import { profile, journey } from '@/data/profile';
import WorldDisplay from './WorldDisplay';

const chapters = ['Builder', 'Tools', 'Degree', 'Journey'] as const;
const shelves = Object.entries(profile.stack);

export default function AboutRooftop() {
  const compact = useThree(state => state.size.width < 700);
  const [chapter, setChapter] = useState(0);
  const [shelf, setShelf] = useState(0);
  const [milestone, setMilestone] = useState(journey.length - 1);
  const current = journey[milestone];
  const width = compact ? 5.4 : 10.4;
  const pixels = compact ? 360 : 760;
  return <>
    {/* Separate fixtures leave real air, wall and supports between the stories. */}
    {[-1, 1].map(side => <mesh key={side} position={[side * (width / 2 - .2), compact ? 3.7 : 1.6, -3.45]} castShadow>
      <boxGeometry args={[.16, compact ? 7.5 : 3.2, .2]} /><meshStandardMaterial color="#513b32" roughness={1} />
    </mesh>)}
    <WorldDisplay position={[compact ? 0 : -3.8, compact ? 7.1 : 2.65, -3.15]} width={compact ? width : 2.6} height={compact ? 1 : 1} pixels={compact ? pixels : 210} label="John Manuel's workshop nameplate" surface="plaque">
      <header className="workshop-name"><span className="workshop-monogram" aria-hidden="true">JM</span><div><span>THE PERSON BEHIND THE BLOCK</span><h2>John Manuel Cuerdo</h2></div></header>
    </WorldDisplay>
    <WorldDisplay position={[compact ? 0 : 1.5, compact ? 3.65 : 1.9, -3.15]} width={compact ? width : 7.4} height={compact ? 5.45 : 2.65} pixels={compact ? pixels : 580} label="About workshop story" surface="plaque">
      <article className={`workshop-story chapter-${chapter}`} key={chapter}>
        <span className="story-number" aria-hidden="true">0{chapter + 1}</span>
        {chapter === 0 && <>
          <span className="story-eyebrow">MANUELAC / FULL-STACK DEVELOPER</span>
          <h2>I build across<br />the whole product.</h2>
          <p>I turn rough ideas into clear interfaces, dependable APIs, and systems that are built to last.</p>
          <footer className="story-footnote"><strong>Based in Caloocan, Philippines.</strong><span>Off the clock: indie games & small creative teams.</span></footer>
        </>}
        {chapter === 1 && <>
          <span className="story-eyebrow">THE WORKBENCH / {shelf + 1} OF {shelves.length}</span>
          <h2>{shelves[shelf][0] === 'Tools' ? 'Tools & DevOps' : shelves[shelf][0]}</h2>
          <div className="workshop-tools">{shelves[shelf][1].map(tool => <span key={tool}>{tool}</span>)}</div>
          <nav className="story-pager" aria-label="Tool shelves"><button onClick={() => setShelf(i => (i - 1 + shelves.length) % shelves.length)}>← Previous shelf</button><button onClick={() => setShelf(i => (i + 1) % shelves.length)}>Next shelf →</button></nav>
        </>}
        {chapter === 2 && <>
          <span className="story-eyebrow">CLASS OF 2026 / APRIL 27</span>
          <h2>BS Computer Science</h2>
          <p className="degree-school">University of Caloocan City</p>
          <p>A foundation in learning, building, debugging—and trying again.</p>
          <footer className="story-footnote"><strong>Degree earned. Curiosity ongoing.</strong>{profile.cvUrl && <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">View my CV ↗</a>}</footer>
        </>}
        {chapter === 3 && <>
          <span className="story-eyebrow">{current.period}</span>
          <h2>{current.title}</h2>
          <strong className="story-organization">{current.organization}</strong>
          <p>{current.description}</p>
          <nav className="story-pager" aria-label="Career milestones"><button disabled={milestone === 0} onClick={() => setMilestone(i => i - 1)}>← Earlier</button><span>{milestone + 1} / {journey.length}</span><button disabled={milestone === journey.length - 1} onClick={() => setMilestone(i => i + 1)}>Later →</button></nav>
        </>}
      </article>
    </WorldDisplay>
    <group position={[0, compact ? .35 : 0, -3.15]}>
      {chapters.map((name, i) => <WorldDisplay key={name} position={[compact ? (i - 1.5) * (width / 4 + .06) : -3.8, compact ? 0 : 1.85 - i * .43, 0]} width={compact ? width / 4 - .09 : 2.6} height={compact ? .7 : .34} pixels={compact ? 88 : 210} label={name} surface="plaque">
        <button className="chapter-marker" aria-pressed={chapter === i} onClick={() => setChapter(i)}><span>0{i + 1}</span>{name}</button>
      </WorldDisplay>)}
    </group>
  </>;
}
