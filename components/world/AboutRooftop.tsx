'use client';
import { useState } from 'react';
import { useThree } from '@react-three/fiber';
import { profile, journey } from '@/data/profile';
import WorldDisplay from './WorldDisplay';

const chapters = ['The builder', 'The tools', 'The degree', 'The journey'] as const;
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
    {[-1, 1].map(side => <mesh key={side} position={[side * (width / 2 - .2), compact ? 3.7 : 2.65, -2.7]} castShadow>
      <boxGeometry args={[.16, compact ? 7.5 : 5.4, .2]} /><meshStandardMaterial color="#513b32" roughness={1} />
    </mesh>)}
    <WorldDisplay position={[0, compact ? 7.1 : 5.15, -2.3]} width={width} height={compact ? 1 : .95} pixels={pixels} label="John Manuel's workshop nameplate" surface="plaque">
      <header className="workshop-name"><span className="workshop-monogram" aria-hidden="true">JM</span><div><span>THE PERSON BEHIND THE BLOCK</span><h2>John Manuel Cuerdo</h2></div></header>
    </WorldDisplay>
    <WorldDisplay position={[0, compact ? 3.65 : 2.55, -2.15]} width={width} height={compact ? 5.45 : 3.95} pixels={pixels} label="About workshop story" surface="plaque">
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
    <group position={[0, compact ? .35 : .15, -1.9]}>
      {chapters.map((name, i) => <WorldDisplay key={name} position={[(i - 1.5) * (width / 4 + .06), 0, chapter === i ? .12 : 0]} width={width / 4 - .09} height={compact ? .7 : .65} pixels={compact ? 88 : 175} label={name} surface="plaque">
        <button className="chapter-marker" aria-pressed={chapter === i} onClick={() => setChapter(i)}><span>0{i + 1}</span>{name}</button>
      </WorldDisplay>)}
    </group>
  </>;
}
