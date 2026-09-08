'use client';
import { useState } from 'react';
import { useThree } from '@react-three/fiber';
import {
  User,
  Layers,
  GraduationCap,
  Compass,
  Building2,
  Calendar,
  Gamepad2,
  Code2,
  Terminal,
  Database,
  FolderGit2,
  Briefcase,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { profile, journey } from '@/data/profile';
import WorldDisplay from './WorldDisplay';

export default function AboutRooftop() {
  const compact = useThree(state => state.size.width < 700);
  const [tab, setTab] = useState<'Profile' | 'Tech stack' | 'Education' | 'My journey'>('Profile');
  const [milestone, setMilestone] = useState(journey.length - 1);
  const current = journey[milestone];

  const tabList: Array<{ id: 'Profile' | 'Tech stack' | 'Education' | 'My journey'; label: string; icon: typeof User }> = [
    { id: 'Profile', label: 'Profile', icon: User },
    { id: 'Tech stack', label: 'Tech stack', icon: Layers },
    { id: 'Education', label: 'Education', icon: GraduationCap },
    { id: 'My journey', label: 'My journey', icon: Compass },
  ];

  const stackCategories = [
    { name: 'Languages', icon: Code2, items: profile.stack.Languages },
    { name: 'Backend', icon: Terminal, items: profile.stack.Backend },
    { name: 'Frontend', icon: Layers, items: profile.stack.Frontend },
    { name: 'Database', icon: Database, items: profile.stack.Database },
    { name: 'Tools & DevOps', icon: FolderGit2, items: profile.stack.Tools },
  ];

  return (
    <WorldDisplay
      position={[0, compact ? 2.1 : 1.65, -1.72]}
      width={6.15}
      height={compact ? 4 : 2.75}
      pixels={compact ? 540 : 920}
      label="About personal archive"
      animateKey={tab}
    >
      <div className="archive-layout">
        {/* Left Navigation Bar */}
        <nav className="archive-tabs" aria-label="Personal archive boards">
          <div className="wall-kicker-wrapper">
            <span className="wall-kicker">PERSONAL ARCHIVE</span>
            <span className="live-signal-badge">● ONLINE</span>
          </div>

          <div className="tab-buttons-group">
            {tabList.map((t, i) => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`archive-tab-btn ${isActive ? 'active' : ''}`}
                  aria-pressed={isActive}
                  onPointerDown={e => e.stopPropagation()}
                  onClick={e => {
                    e.stopPropagation();
                    setTab(t.id);
                  }}
                >
                  <Icon size={16} className="tab-icon" />
                  <span className="tab-num">0{i + 1}</span>
                  <span className="tab-text">{t.label}</span>
                  <span className="tab-arrow">→</span>
                </button>
              );
            })}
          </div>

          {profile.cvUrl && (
            <a
              className="cv-folder"
              href={profile.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              onPointerDown={e => e.stopPropagation()}
              onClick={e => e.stopPropagation()}
            >
              <span>View CV / Resume</span>
              <ExternalLink size={14} />
            </a>
          )}

          <div className="archive-stamp">
            <strong>{profile.alias}</strong>
            <small>FULL-STACK BUILDER</small>
            <div className="stamp-sub">BUILD · LEARN · REPEAT</div>
          </div>
        </nav>

        {/* Right Content Pane */}
        <div className="archive-page" key={tab}>
          {/* TAB 1: PROFILE */}
          {tab === 'Profile' && (
            <div className="profile-view">
              {/* Persona Card */}
              <div className="profile-hero-card">
                <div className="persona-avatar-box">
                  <span className="avatar-initials">JM</span>
                  <span className="avatar-dot" />
                </div>
                <div className="persona-meta">
                  <div className="persona-kicker-row">
                    <span className="wall-kicker">{profile.alias} · {profile.role}</span>
                    <span className="availability-tag">● OPEN TO CONNECTIONS</span>
                  </div>
                  <h2>{profile.name}</h2>
                  <div className="profile-headline-pill">
                    <Sparkles size={15} />
                    <span>&ldquo;{profile.headline}&rdquo;</span>
                  </div>
                </div>
              </div>

              {/* Bio & Fast Stats Grid */}
              <div className="profile-content-grid">
                <div className="bio-card">
                  <h4>ABOUT ME</h4>
                  <p>{profile.bio}</p>
                  <p>{profile.educationSummary}</p>
                </div>

                <div className="fast-facts-card">
                  <h4>CURRENT FOCUS & ROLES</h4>
                  <ul className="facts-list">
                    <li>
                      <Briefcase size={16} className="fact-icon" />
                      <div>
                        <strong>Junior System Developer</strong>
                        <small>Ascendens Asia (June 2026 — Present)</small>
                      </div>
                    </li>
                    <li>
                      <GraduationCap size={16} className="fact-icon" />
                      <div>
                        <strong>BS Computer Science</strong>
                        <small>University of Caloocan City (Class of 2026)</small>
                      </div>
                    </li>
                    <li>
                      <MapPin size={16} className="fact-icon" />
                      <div>
                        <strong>Based in Philippines</strong>
                        <small>Caloocan / Metro Manila</small>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Personal Note / Indie Explorer Footer */}
              <div className="indie-note-card">
                <Gamepad2 size={22} className="game-icon" />
                <div className="indie-note-text">
                  <strong>Beyond the Terminal:</strong>
                  <p>{profile.personalNote}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TECH STACK */}
          {tab === 'Tech stack' && (
            <div className="stack-view">
              <div className="section-heading-bar">
                <div>
                  <span className="wall-kicker">ENGINEERING ARSENAL</span>
                  <h2>Tools of the trade.</h2>
                </div>
                <span className="stack-summary-count">
                  {Object.values(profile.stack).flat().length} Core Technologies
                </span>
              </div>
              <p className="section-subtext">
                Specialized in architecting reliable backend services, scalable relational databases, and snappy reactive user interfaces.
              </p>

              <div className="wall-stack-cards">
                {stackCategories.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <div key={cat.name} className="stack-card">
                      <div className="stack-card-header">
                        <Icon size={16} className="cat-icon" />
                        <h3>{cat.name}</h3>
                        <span className="cat-count">{cat.items.length}</span>
                      </div>
                      <div className="stack-pills">
                        {cat.items.map(item => (
                          <span key={item} className="tech-pill">
                            <span className="tech-dot" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: EDUCATION */}
          {tab === 'Education' && (
            <div className="education-view">
              <div className="section-heading-bar">
                <div>
                  <span className="wall-kicker">ACADEMIC MILESTONE</span>
                  <h2>Degree Conferred.</h2>
                </div>
                <div className="degree-status-pill">
                  <CheckCircle2 size={16} />
                  <span>ALUMNUS 2026</span>
                </div>
              </div>

              {/* Diploma Presentation Box */}
              <div className="diploma-card">
                <div className="diploma-top">
                  <GraduationCap size={32} className="diploma-seal-icon" />
                  <div className="diploma-headline">
                    <span className="diploma-date">{profile.education.date}</span>
                    <h3>{profile.education.title}</h3>
                    <h4>{profile.education.organization}</h4>
                  </div>
                </div>

                <p className="diploma-description">{profile.education.description}</p>

                <div className="coursework-section">
                  <h5>CORE FOUNDATIONS & EXPERTISE</h5>
                  <div className="coursework-chips">
                    <span>Software Engineering</span>
                    <span>Database Management Systems</span>
                    <span>Algorithms & Complexity</span>
                    <span>Web Systems & Technologies</span>
                    <span>Systems Architecture</span>
                    <span>Object-Oriented Programming</span>
                  </div>
                </div>

                <div className="diploma-footer">
                  <span className="degree-stamp">
                    ✓ DEGREE UNLOCKED · UNIVERSITY OF CALOOCAN CITY
                  </span>
                  <small>CLASS OF 2026 · BSCS</small>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MY JOURNEY */}
          {tab === 'My journey' && (
            <div className="journey-view">
              <div className="section-heading-bar">
                <div>
                  <span className="wall-kicker">CAREER ROADMAP</span>
                  <h2>The Journey So Far.</h2>
                </div>
                <span className="milestone-counter">
                  Milestone {milestone + 1} of {journey.length}
                </span>
              </div>

              <div className="wall-journey">
                {/* Timeline Selector List */}
                <div className="milestone-track" aria-label="Journey milestones">
                  {journey.map((j, i) => {
                    const isSelected = milestone === i;
                    return (
                      <button
                        key={j.period + j.title}
                        type="button"
                        className={`milestone-item ${isSelected ? 'selected' : ''}`}
                        aria-pressed={isSelected}
                        onPointerDown={e => e.stopPropagation()}
                        onClick={e => {
                          e.stopPropagation();
                          setMilestone(i);
                        }}
                      >
                        <span className="milestone-dot" />
                        <span className="milestone-period">{j.period}</span>
                        <b className="milestone-title">{j.title}</b>
                        <small className="milestone-org">{j.organization}</small>
                      </button>
                    );
                  })}
                </div>

                {/* Milestone Detail Card */}
                <article className="milestone-detail">
                  <div className="milestone-badge-row">
                    <span className="period-pill">
                      <Calendar size={13} />
                      {current.period}
                    </span>
                    <span className="org-pill">
                      <Building2 size={13} />
                      {current.organization}
                    </span>
                  </div>

                  <h2>{current.title}</h2>
                  <p className="milestone-desc">{current.description}</p>

                  {current.topics.length > 0 && (
                    <div className="milestone-skills">
                      <h5>TOOLS & TOPICS COVERED</h5>
                      <div className="tags">
                        {current.topics.map(t => (
                          <span key={t} className="journey-skill-chip">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              </div>
            </div>
          )}
        </div>
      </div>
    </WorldDisplay>
  );
}
