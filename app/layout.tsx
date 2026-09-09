import type { Metadata } from 'next';
import './globals.css';
import './rooftop-surfaces.css';
export const metadata: Metadata = { title: 'John Manuel Cuerdo — Full-stack Developer', description: 'Explore Indie Block, the interactive rooftop portfolio of John Manuel Cuerdo (manuelAC). Projects, professional journey, and a place to connect.' };
export default function RootLayout({ children }: {
    children: React.ReactNode;
}) { return <html lang="en"><body>{children}</body></html>; }
