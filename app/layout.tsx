import type { Metadata } from 'next';
import { Silkscreen } from 'next/font/google';
import './globals.css';
import './rooftop-surfaces.css';

const silkscreen = Silkscreen({
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-silkscreen',
    display: 'swap',
});

export const metadata: Metadata = { title: 'John Manuel Cuerdo — Full-stack Developer', description: "Explore Manuel's Roofies, the interactive rooftop portfolio of John Manuel Cuerdo (manuelAC). Projects, professional journey, and a place to connect." };
export default function RootLayout({ children }: {
    children: React.ReactNode;
}) { return <html lang="en" className={silkscreen.variable}><body>{children}</body></html>; }
