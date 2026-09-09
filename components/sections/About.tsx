'use client';
import { useState } from 'react';
import {
  User,
  Layers,
  GraduationCap,
  Compass,
  Briefcase,
  MapPin,
  Sparkles,
  Gamepad2,
  Code2,
  Terminal,
  Database,
  FolderGit2,
  ExternalLink,
} from 'lucide-react';
import { profile, journey } from '@/data/profile';

export default function About() {
  const [tab, setTab] = useState<'Profile' | 'Tech stack' | 'Education' | 'My journey'>('Profile');

  const tabList = [
    { id: 'Profile' as const, label: 'Profile', icon: User },
    { id: 'Tech stack' as const, label: 'Tech stack', icon: Layers },
    { id: 'Education' as const, label: 'Education', icon: GraduationCap },
    { id: 'My journey' as const, label: 'My journey', icon: Compass },
  ];

  const stackCategories = [
    { name: 'Languages', icon: Code2, items: profile.stack.Languages },
    { name: 'Backend', icon: Terminal, items: profile.stack.Backend },
    { name: 'Frontend', icon: Layers, items: profile.stack.Frontend },
    { name: 'Database', icon: Database, items: profile.stack.Database },
    { name: 'Tools & DevOps', icon: FolderGit2, items: profile.stack.Tools },
  ];

  return (
    <>
      <div className="profile-heading">
        <div className="persona-avatar-box">
          <span className="avatar-initials">JM</span>
          <span className="avatar-dot" />
        </div>
        <div>
          <h3>{profile.name}</h3>
          <span className="muted">{profile.alias} / {profile.role}</span>
        </div>
      </div>

      <div className="tabs" aria-label="About topics">
        {tabList.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={tab === t.id}
              onClick={() => setTab(t.id)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
        {profile.cvUrl && (
          <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span>View CV</span>
            <ExternalLink size={13} />
          </a>
        )}
      </div>

      <div className="about-content" key={tab}>
        {tab === 'Profile' && (
          <div className="profile-tab-content">
            <div className="profile-headline-pill" style={{ marginBottom: '14px' }}>
              <Sparkles size={14} />
              <span>&ldquo;{profile.headline}&rdquo;</span>
            </div>
            <p>{profile.bio}</p>
            <p>{profile.educationSummary}</p>

            <div className="profile-content-grid" style={{ marginTop: '16px' }}>
              <div className="fast-facts-card">
                <h4>CURRENT HIGHLIGHTS</h4>
                <ul className="facts-list">
                  <li>
                    <Briefcase size={15} className="fact-icon" />
                    <div>
                      <strong>Junior System Developer</strong>
                      <small>Ascendens Asia</small>
                    </div>
                  </li>
                  <li>
                    <GraduationCap size={15} className="fact-icon" />
                    <div>
                      <strong>BS Computer Science</strong>
                      <small>University of Caloocan City</small>
                    </div>
                  </li>
                  <li>
                    <MapPin size={15} className="fact-icon" />
                    <div>
                      <strong>Philippines</strong>
                      <small>Caloocan / Metro Manila</small>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="indie-note-card">
                <Gamepad2 size={20} className="game-icon" />
                <div className="indie-note-text">
                  <strong>Beyond Code:</strong>
                  <p>{profile.personalNote}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'Tech stack' && (
          <div className="stack-view">
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '14px' }}>
              Tools, frameworks, and workflows I use to build complete end-to-end applications.
            </p>
            <div className="wall-stack-cards">
              {stackCategories.map(cat => {
                const Icon = cat.icon;
                return (
                  <div key={cat.name} className="stack-card">
                    <div className="stack-card-header">
                      <Icon size={14} className="cat-icon" />
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

        {tab === 'Education' && (
          <div className="diploma-card">
            <div className="diploma-top">
              <GraduationCap size={28} className="diploma-seal-icon" />
              <div className="diploma-headline">
                <span className="diploma-date">{profile.education.date}</span>
                <h3>{profile.education.title}</h3>
                <h4>{profile.education.organization}</h4>
              </div>
            </div>
            <p className="diploma-description">{profile.education.description}</p>
            <div className="diploma-footer">
              <span className="degree-stamp">✓ DEGREE UNLOCKED · CLASS OF 2026</span>
            </div>
          </div>
        )}

        {tab === 'My journey' && (
          <div className="timeline">
            {journey.map((j, i) => (
              <details key={i} open={i === journey.length - 1}>
                <summary>
                  <span className="eyebrow">{j.period}</span>
                  <h4>{j.title}</h4>
                  <span>{j.organization}</span>
                </summary>
                <p>{j.description}</p>
                {j.topics.length > 0 && (
                  <div className="tags">
                    {j.topics.map(t => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                )}
              </details>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
