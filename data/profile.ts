// Edit personal content here. Set cvUrl to '/profile/cv.pdf' after adding your PDF to public/profile.
export const profile = {
    name: 'John Manuel Cuerdo', alias: 'manuelAC', role: 'Full-stack Developer',
    headline: 'I build across the whole product.',
    bio: "I'm John Manuel Cuerdo, also known as manuelAC—a full-stack developer who enjoys turning rough ideas into clear interfaces, dependable APIs, and maintainable systems.",
    educationSummary: 'I earned my BS in Computer Science from the University of Caloocan City.',
    personalNote: "Away from the editor, I'm usually exploring indie games and the small teams behind them.", cvUrl: '',
    education: { title: 'BS Computer Science', organization: 'University of Caloocan City', date: 'April 27, 2026', description: 'Degree unlocked—a milestone built from years of learning, building, debugging, and trying again.' },
    stack: { Languages: ['PHP', 'JavaScript', 'TypeScript', 'Python'], Backend: ['Laravel', 'Node.js', 'REST', 'GraphQL', 'FastAPI'], Frontend: ['React', 'Next.js', 'Bootstrap', 'Angular', 'Electron'], Database: ['MySQL', 'PostgreSQL', 'Firebase'], Tools: ['Docker', 'AWS', 'Vercel', 'GitHub', 'Bitbucket'] },
};
export const journey = [
    { period: 'August 2022', title: 'Hello, World.', organization: 'University of Caloocan City', description: 'The starting point of my Computer Science journey—and where curiosity began turning into things I could build.', topics: ['Programming Fundamentals', 'Web Development', 'Databases'] },
    { period: 'May 2025 — August 2025', title: 'Junior Fullstack Developer', organization: 'Intracode IT Solutions', description: 'My first professional development experience, contributing across frontend and backend work while learning how real products move from requirements to release.', topics: ['PHP', 'Laravel', 'JavaScript', 'Bootstrap', 'MySQL'] },
    { period: 'September 2025 — June 2026', title: 'Junior Fullstack Developer', organization: 'Intracode IT Solutions', description: "Continued the journey as a full-time developer, while I'm still continuing my studies and taking on deeper ownership of application features, fixes, and day-to-day product delivery.", topics: ['PHP', 'Laravel', 'JavaScript', 'Bootstrap', 'MySQL'] },
    { period: 'April 27, 2026', title: profile.education.title, organization: profile.education.organization, description: profile.education.description, topics: [] },
    { period: 'June 2026 — Present', title: 'Junior System Developer', organization: 'Ascendens Asia', description: 'Currently building and supporting systems with a stronger focus on dependable workflows, maintainable architecture, and practical business impact.', topics: ['PHP', 'Laravel', 'Angular', 'React', 'MySQL', 'Docker', 'Bitbucket'] },
];
