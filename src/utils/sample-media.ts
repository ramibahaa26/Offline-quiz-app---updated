// Educational vector media embedded as Data URIs for 100% offline access

export const MARS_PLANET_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="400" height="240">
  <defs>
    <radialGradient id="marsGlow" cx="45%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#FF7A59"/>
      <stop offset="50%" stop-color="#D9381E"/>
      <stop offset="85%" stop-color="#8C1D0F"/>
      <stop offset="100%" stop-color="#3D0B05"/>
    </radialGradient>
    <radialGradient id="spaceBg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1A162B"/>
      <stop offset="100%" stop-color="#0B0914"/>
    </radialGradient>
    <filter id="planetShadow">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#FF5722" flood-opacity="0.3"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#spaceBg)" rx="16"/>
  <!-- Stars -->
  <circle cx="40" cy="30" r="1.5" fill="#FFFFFF" opacity="0.8"/>
  <circle cx="85" cy="80" r="1" fill="#FFFFFF" opacity="0.6"/>
  <circle cx="340" cy="45" r="1.5" fill="#FFFFFF" opacity="0.8"/>
  <circle cx="310" cy="180" r="1" fill="#FFFFFF" opacity="0.7"/>
  <circle cx="60" cy="190" r="1.2" fill="#FFFFFF" opacity="0.5"/>
  <circle cx="370" cy="110" r="1.8" fill="#FFFFFF" opacity="0.9"/>
  <!-- Mars Body -->
  <circle cx="200" cy="120" r="75" fill="url(#marsGlow)" filter="url(#planetShadow)"/>
  <!-- Craters & Surface Detail -->
  <ellipse cx="180" cy="95" rx="14" ry="9" fill="#7A180C" opacity="0.6"/>
  <ellipse cx="230" cy="140" rx="18" ry="11" fill="#7A180C" opacity="0.6"/>
  <ellipse cx="170" cy="145" rx="10" ry="6" fill="#69140A" opacity="0.5"/>
  <ellipse cx="215" cy="85" rx="8" ry="5" fill="#69140A" opacity="0.5"/>
  <!-- North Polar Ice Cap -->
  <ellipse cx="200" cy="48" rx="28" ry="7" fill="#FFF3E0" opacity="0.85"/>
  <!-- Atmosphere Limb -->
  <circle cx="200" cy="120" r="75" fill="none" stroke="#FFA07A" stroke-width="2" opacity="0.4"/>
  <!-- Label Banner -->
  <rect x="120" y="202" width="160" height="24" rx="12" fill="rgba(0,0,0,0.6)" stroke="#FF7A59" stroke-width="1"/>
  <text x="200" y="218" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#FFE0B2" text-anchor="middle" letter-spacing="1">CELESTIAL FIGURE A</text>
</svg>
`)}`;

export const OXYGEN_ATOM_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="400" height="240">
  <defs>
    <radialGradient id="atomBg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <radialGradient id="nucleusGlow" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#EF4444"/>
      <stop offset="60%" stop-color="#DC2626"/>
      <stop offset="100%" stop-color="#7F1D1D"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#atomBg)" rx="16"/>
  <!-- Inner Shell K (n=1) -->
  <circle cx="200" cy="120" r="45" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.7"/>
  <!-- Outer Shell L (n=2) -->
  <circle cx="200" cy="120" r="85" fill="none" stroke="#818CF8" stroke-width="1.5" stroke-dasharray="5 3" opacity="0.8"/>
  <!-- Nucleus -->
  <circle cx="200" cy="120" r="24" fill="url(#nucleusGlow)"/>
  <text x="200" y="124" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#FFFFFF" text-anchor="middle">8p+ 8n</text>
  <!-- Inner Shell Electrons (2) -->
  <circle cx="200" cy="75" r="5" fill="#38BDF8"/>
  <circle cx="200" cy="165" r="5" fill="#38BDF8"/>
  <!-- Outer Shell Electrons (6) -->
  <circle cx="200" cy="35" r="5" fill="#C084FC"/>
  <circle cx="274" cy="78" r="5" fill="#C084FC"/>
  <circle cx="274" cy="162" r="5" fill="#C084FC"/>
  <circle cx="200" cy="205" r="5" fill="#C084FC"/>
  <circle cx="126" cy="162" r="5" fill="#C084FC"/>
  <circle cx="126" cy="78" r="5" fill="#C084FC"/>
  <!-- Label -->
  <rect x="115" y="10" width="170" height="22" rx="11" fill="rgba(255,255,255,0.1)" stroke="#818CF8" stroke-width="1"/>
  <text x="200" y="25" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#E2E8F0" text-anchor="middle" letter-spacing="0.5">BOHR MODEL (Z = 8)</text>
</svg>
`)}`;
