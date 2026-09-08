import React from 'react';

interface SocialAppLogoProps {
  name: string;
  className?: string;
  size?: number | string;
}

export default function SocialAppLogo({ name, className = '', size = '100%' }: SocialAppLogoProps) {
  const key = name.toLowerCase().trim();

  if (key.includes('instagram')) {
    return (
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={className}
        style={{ display: 'block' }}
        aria-label="Instagram logo"
      >
        <defs>
          <radialGradient id="ig-grad-real" cx="20%" cy="110%" r="130%">
            <stop offset="0%" stopColor="#ffd521" />
            <stop offset="10%" stopColor="#ffd521" />
            <stop offset="45%" stopColor="#f50000" />
            <stop offset="68%" stopColor="#c13584" />
            <stop offset="90%" stopColor="#405de6" />
          </radialGradient>
        </defs>
        {/* App Squircle */}
        <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#ig-grad-real)" />
        {/* Camera Outline */}
        <rect
          x="20"
          y="20"
          width="60"
          height="60"
          rx="17"
          fill="none"
          stroke="#ffffff"
          strokeWidth="6.5"
        />
        {/* Camera Lens Circle */}
        <circle
          cx="50"
          cy="50"
          r="15"
          fill="none"
          stroke="#ffffff"
          strokeWidth="6.5"
        />
        {/* Flash Dot */}
        <circle cx="66" cy="34" r="3.8" fill="#ffffff" />
      </svg>
    );
  }

  if (key.includes('tiktok')) {
    const notePath =
      'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z';

    return (
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={className}
        style={{ display: 'block' }}
        aria-label="TikTok logo"
      >
        {/* App Squircle */}
        <rect
          x="2"
          y="2"
          width="96"
          height="96"
          rx="22"
          fill="#010101"
          stroke="rgba(255, 255, 255, 0.16)"
          strokeWidth="1.5"
        />
        {/* Chromatic Aberration Layers for TikTok Note */}
        <g transform="translate(26, 23) scale(2.05)">
          {/* Cyan layer (offset left & down) */}
          <path d={notePath} fill="#25F4EE" transform="translate(-1.1, 0.9)" opacity="0.95" />
          {/* Magenta / Red layer (offset right & up) */}
          <path d={notePath} fill="#FE2C55" transform="translate(1.1, -0.9)" opacity="0.95" />
          {/* Pure White primary note on top */}
          <path d={notePath} fill="#FFFFFF" />
        </g>
      </svg>
    );
  }

  if (key.includes('linkedin')) {
    return (
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={className}
        style={{ display: 'block' }}
        aria-label="LinkedIn logo"
      >
        <defs>
          <linearGradient id="li-grad-real" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B76E0" />
            <stop offset="100%" stopColor="#0A66C2" />
          </linearGradient>
        </defs>
        {/* App Squircle */}
        <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#li-grad-real)" />
        {/* LinkedIn official 'in' monogram */}
        <g transform="translate(20, 20) scale(2.5)">
          {/* 'i' dot */}
          <circle cx="4.2" cy="4.2" r="1.8" fill="#FFFFFF" />
          {/* 'i' stem */}
          <rect x="2.6" y="7.6" width="3.2" height="9.6" rx="0.5" fill="#FFFFFF" />
          {/* 'n' curve & stem */}
          <path
            d="M8.2 7.6 h3.1 v1.4 h0.1 c0.5-0.9 1.7-1.8 3.5-1.8 3.7 0 4.4 2.4 4.4 5.6 v6.4 h-3.3 v-5.1 c0-1.2-0.1-2.8-1.7-2.8-1.7 0-2 1.3-2 2.7 v5.2 H 8.2 Z"
            fill="#FFFFFF"
          />
        </g>
      </svg>
    );
  }

  if (key.includes('github')) {
    return (
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={className}
        style={{ display: 'block' }}
        aria-label="GitHub logo"
      >
        <rect x="2" y="2" width="96" height="96" rx="22" fill="#181717" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <g transform="translate(22, 22) scale(2.33)">
          <path
            fill="#ffffff"
            d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
          />
        </g>
      </svg>
    );
  }

  // Fallback if not recognized
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        display: 'grid',
        placeItems: 'center',
        background: '#c5a36b16',
        border: '2px solid #bea26d',
        borderRadius: '16px',
        color: '#f2ce8b',
        fontWeight: 'bold',
        fontSize: '24px',
        fontFamily: 'monospace',
      }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}
