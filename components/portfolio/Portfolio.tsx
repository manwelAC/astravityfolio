'use client';
import dynamic from 'next/dynamic';
import { Component, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Blocks, BriefcaseBusiness, CircleUserRound, Home, Mail, Radio, X, Scan, ArrowLeft, Coffee } from 'lucide-react';
import { Section, usePortfolio } from '@/stores/portfolio-store';
import { profile } from '@/data/profile';
import { socials } from '@/data/socials';
import Projects from '@/components/sections/Projects';
import About from '@/components/sections/About';
import ContactForm from '@/components/sections/ContactForm';
import SocialAppLogo from '@/components/world/SocialAppLogo';
const World = dynamic(() => import('@/components/world/PortfolioCanvas'), { ssr: false });
const destinations = [{ id: 'projects', label: 'Projects', sub: 'Ideas into things', icon: BriefcaseBusiness }, { id: 'about', label: 'About', sub: 'Same human. More ideas.', icon: CircleUserRound }, { id: 'leads', label: 'Lounge', sub: 'Pull up a chair & connect.', icon: Coffee }, { id: 'socials', label: 'Socials', sub: 'Find me around', icon: Radio }] as const;
class SceneBoundary extends Component<{
    children: ReactNode;
    onFailure: () => void;
}, {
    failed: boolean;
}> {
    state = { failed: false };
    static getDerivedStateFromError() { return { failed: true }; }
    componentDidCatch() { this.props.onFailure(); }
    render() { return this.state.failed ? null : this.props.children; }
}
export default function Portfolio() {
    const section = usePortfolio(s => s.section);
    const transitioning = usePortfolio(s => s.transitioning);
    const quality = usePortfolio(s => s.quality);
    const [ready, setReady] = useState(false);
    const [fallback, setFallback] = useState(false);
    const heading = useRef<HTMLHeadingElement>(null);
    const onReady = useCallback(() => setReady(true), []);
    const onFailure = useCallback(() => { setFallback(true); setReady(true); usePortfolio.getState().setTransitioning(false); }, []);
    useEffect(() => { const canvas = document.createElement('canvas'); const context = canvas.getContext('webgl2'); context?.getExtension('WEBGL_lose_context')?.loseContext(); if (!context) {
        queueMicrotask(onFailure);
    } if (window.innerWidth < 700)
        usePortfolio.getState().setQuality('low'); const sync = () => { const s = location.hash.slice(1); const section: Section = destinations.some(d => d.id === s) ? s as Section : 'overview'; usePortfolio.setState(state => ({ section, selectedProject: state.section === section ? state.selectedProject : null })); }; sync(); window.addEventListener('hashchange', sync); const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') {
        if (usePortfolio.getState().selectedProject)
            usePortfolio.getState().selectProject(null);
        else
            usePortfolio.getState().navigate('overview');
    } }; window.addEventListener('keydown', esc); return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('keydown', esc); }; }, [onFailure]);
    useEffect(() => { if (section !== 'overview' && !transitioning)
        heading.current?.focus(); }, [section, transitioning]);
    const visit = (s: Section) => { usePortfolio.getState().navigate(s); if (fallback)
        usePortfolio.getState().setTransitioning(false); };
    const active = destinations.find(d => d.id === section);
    return <main className={`portfolio ${section !== 'overview' ? 'is-focused' : ''} ${fallback ? 'is-fallback' : ''}`}><div className="sky"/><div className="world">{!fallback && <SceneBoundary onFailure={onFailure}><World onReady={onReady} onFailure={onFailure}/></SceneBoundary>}</div><div className="grain"/>
 <header className="topbar"><button className="brand" onClick={() => visit('overview')} aria-label="Manuel's Roofies overview"><Blocks size={27}/><span>MANUEL'S ROOFIES<small>A LITTLE WORLD BY {profile.alias}</small></span></button></header>
 {!ready && <div className="loading" role="status"><Blocks size={40}/><h2>MANUEL'S ROOFIES</h2><p>BUILDING THE NEIGHBORHOOD</p><div className="loading-track"><span /></div></div>}
 {section === 'overview' && <><div className="intro"><span className="eyebrow">DEVELOPER BY TRADE. BUILDER AT HEART.</span><h1>A small block.<br />A world of ideas<span>.</span></h1><p>{profile.name} <span>/</span> {profile.role}</p></div>{fallback && <div className="fallback-card"><h2>Welcome to Manuel's Roofies.</h2><p>The city is taking a breather. All projects, stories, and ways to connect are available below.</p>{destinations.map(d => <button key={d.id} onClick={() => visit(d.id)}>{d.label}<ArrowUpRight size={18}/></button>)}</div>}</>}
 {active && fallback && <section className="content-panel" aria-labelledby="section-heading"><div className="panel-top"><span className="eyebrow">MANUEL'S ROOFIES / {String(destinations.findIndex(d => d.id === section) + 1).padStart(2, '0')}</span><button className="icon-button" onClick={() => visit('overview')} aria-label="Back to Manuel's Roofies"><X size={20}/></button></div><h2 ref={heading} tabIndex={-1} id="section-heading">{active.label}<span>↗</span></h2><div className="panel-subtitle">{active.sub}</div>{section === 'projects' && <Projects />}{section === 'about' && <About />}{section === 'leads' && <ContactForm />}{section === 'socials' && <><h3>Same sky. Different stories.</h3><p>Around the internet, usually building, exploring, or finding the next little thing.</p><div className="social-list">{socials.map(s => <a href={s.url} key={s.name} target="_blank" rel="noopener noreferrer"><span className="social-mark"><SocialAppLogo name={s.name} size={36}/></span><span><strong>{s.name}</strong><small>{s.label}</small></span><ArrowUpRight size={22}/></a>)}</div></>}<button className="back-link" onClick={() => visit('overview')}><ArrowLeft size={15}/> Back to Manuel's Roofies</button></section>}
 {active && !fallback && <div className="rooftop-navigation"><button onClick={() => visit('overview')}><ArrowLeft size={15}/> Back to Manuel's Roofies</button><span aria-live="polite">{transitioning ? `Travelling to ${active.label}…` : `${active.label} / drag to rotate · use the rooftop displays`}</span></div>}
 {!fallback && <button className="reset-view" onClick={() => usePortfolio.getState().resetView()}>↺ Reset view</button>}<footer className="bottom-bar"><div className="explore-hint"><span className="tiny-cross">+</span>{section === 'overview' ? 'DRAG TO ROTATE · PICK A ROOFTOP' : 'YOU’RE IN THE NEIGHBORHOOD'}</div><nav className="navigation" aria-label="Portfolio destinations"><button className={section === 'overview' ? 'active home' : 'home'} aria-label="Overview" aria-current={section === 'overview' ? 'page' : undefined} onClick={() => visit('overview')}><Home size={18}/></button>{destinations.map((d, i) => <button key={d.id} className={section === d.id ? 'active' : ''} aria-current={section === d.id ? 'page' : undefined} onClick={() => visit(d.id)}><d.icon size={16}/><span>{d.label}</span><small>0{i + 1}</small></button>)}</nav><button className="quality" aria-label={`Scene quality: ${quality}. Toggle quality.`} onClick={() => usePortfolio.getState().setQuality(quality === 'high' ? 'low' : 'high')}><Scan size={17}/><span>{quality === 'high' ? 'FULL DETAIL' : 'LOW DETAIL'}</span></button></footer>
 <noscript><div className="fallback-card"><h1>{profile.name}</h1><p>{profile.bio}</p><p>Enable JavaScript to explore projects and the rooftop world.</p><a href="mailto:johnmanuelcuerdo@gmail.com">Email John Manuel</a>{socials.map(s => <p key={s.name}><a href={s.url}>{s.name}</a></p>)}</div></noscript></main>;
}




