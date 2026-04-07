/**
 * Car brand logos as inline SVG strings (viewBox="0 0 80 80").
 * Each logo is crafted to be recognizable and visually consistent.
 */

export const CAR_BRANDS = [
  // 0 — Audi (four rings)
  { name: 'AUDI', color: '#CC0000', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="40" r="12" fill="none" stroke="white" stroke-width="4"/><circle cx="32" cy="40" r="12" fill="none" stroke="white" stroke-width="4"/><circle cx="46" cy="40" r="12" fill="none" stroke="white" stroke-width="4"/><circle cx="60" cy="40" r="12" fill="none" stroke="white" stroke-width="4"/></svg>` },
  // 1 — BMW (roundel)
  { name: 'BMW', color: '#1C69D4', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="34" fill="none" stroke="white" stroke-width="4"/><path d="M40 6 A34 34 0 0 1 74 40 L40 40 Z" fill="white"/><path d="M40 40 A34 34 0 0 1 6 40 L40 40 Z" fill="white"/><path d="M40 6 A34 34 0 0 1 74 40 L40 40 Z" fill="#1C69D4"/><path d="M40 40 A34 34 0 0 1 6 40 L40 40 Z" fill="#1C69D4"/><path d="M6 40 A34 34 0 0 1 40 6 L40 40 Z" fill="white"/><path d="M40 40 A34 34 0 0 1 74 40 L40 74 A34 34 0 0 1 40 40 Z" fill="white"/><circle cx="40" cy="40" r="34" fill="none" stroke="white" stroke-width="4"/><path d="M40 6 L40 74 M6 40 L74 40" stroke="white" stroke-width="3"/><path d="M40 6 A34 34 0 0 1 74 40 L40 40 Z" fill="#1C69D4"/><path d="M6 40 A34 34 0 0 1 40 74 L40 40 Z" fill="#1C69D4"/><path d="M6 40 A34 34 0 0 1 40 6 L40 40 Z" fill="white"/><path d="M40 40 A34 34 0 0 1 74 74" fill="white"/></svg>` },
  // 2 — Mercedes-Benz (three-pointed star)
  { name: 'MERCEDES', color: '#222222', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="34" fill="none" stroke="white" stroke-width="4"/><polygon points="40,8 46,36 74,44 46,44 40,72 34,44 6,44 34,44" fill="none"/><line x1="40" y1="8" x2="40" y2="44" stroke="white" stroke-width="3"/><line x1="40" y1="44" x2="68" y2="60" stroke="white" stroke-width="3"/><line x1="40" y1="44" x2="12" y2="60" stroke="white" stroke-width="3"/><circle cx="40" cy="44" r="4" fill="white"/></svg>` },
  // 3 — Toyota (three ovals)
  { name: 'TOYOTA', color: '#EB0A1E', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="40" rx="30" ry="18" fill="none" stroke="white" stroke-width="4"/><ellipse cx="40" cy="40" rx="12" ry="22" fill="none" stroke="white" stroke-width="4"/><ellipse cx="40" cy="22" rx="18" ry="8" fill="none" stroke="white" stroke-width="3"/></svg>` },
  // 4 — Volkswagen (VW)
  { name: 'VW', color: '#003399', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="34" fill="none" stroke="white" stroke-width="4"/><text x="40" y="52" font-family="Arial Black,sans-serif" font-size="30" font-weight="900" fill="white" text-anchor="middle">VW</text></svg>` },
  // 5 — Ferrari (prancing horse)
  { name: 'FERRARI', color: '#CC0000', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="64" height="64" rx="4" fill="none" stroke="#FFD700" stroke-width="3"/><path d="M40 62 C36 56 28 50 30 40 C32 32 36 28 38 20 C39 16 41 16 42 20 C44 28 48 32 50 40 C52 50 44 56 40 62Z" fill="white"/><path d="M35 40 C35 36 38 33 40 30 C42 33 45 36 45 40 C45 46 42 50 40 54 C38 50 35 46 35 40Z" fill="#FFD700"/></svg>` },
  // 6 — Porsche (crest)
  { name: 'PORSCHE', color: '#000000', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="12" width="60" height="56" rx="3" fill="none" stroke="white" stroke-width="3"/><line x1="40" y1="12" x2="40" y2="68" stroke="white" stroke-width="2"/><line x1="10" y1="40" x2="70" y2="40" stroke="white" stroke-width="2"/><text x="25" y="32" font-family="Arial,sans-serif" font-size="10" fill="white" text-anchor="middle">S</text><text x="55" y="32" font-family="Arial,sans-serif" font-size="10" fill="white" text-anchor="middle">T</text><text x="25" y="58" font-family="Arial,sans-serif" font-size="8" fill="#FFD700" text-anchor="middle">🐎</text><text x="55" y="58" font-family="Arial,sans-serif" font-size="10" fill="white" text-anchor="middle">G</text></svg>` },
  // 7 — Lamborghini (bull)
  { name: 'LAMBORGHINI', color: '#FFD700', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="64" height="64" rx="4" fill="none" stroke="#FFD700" stroke-width="3"/><path d="M25 55 C25 45 30 38 40 35 C50 38 55 45 55 55" fill="none" stroke="white" stroke-width="3"/><path d="M30 38 C28 32 32 26 40 28 C48 26 52 32 50 38" fill="none" stroke="white" stroke-width="2.5"/><circle cx="35" cy="32" r="2.5" fill="white"/><circle cx="45" cy="32" r="2.5" fill="white"/><path d="M28 36 L24 30 M52 36 L56 30" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>` },
  // 8 — Ford (oval)
  { name: 'FORD', color: '#003178', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="40" rx="36" ry="24" fill="none" stroke="white" stroke-width="4"/><text x="40" y="47" font-family="Times New Roman,serif" font-size="24" font-weight="bold" font-style="italic" fill="white" text-anchor="middle">Ford</text></svg>` },
  // 9 — Chevrolet (bowtie)
  { name: 'CHEVROLET', color: '#CF9900', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M4 34 L32 34 L32 28 L76 28 L76 46 L48 46 L48 52 L4 52 Z" fill="none" stroke="white" stroke-width="3" stroke-linejoin="round"/><path d="M4 34 L32 34 L32 28 L38 28 L38 34 L48 34 L48 46 L38 46 L38 52 L32 52 L32 46 L4 46 Z" fill="none" stroke="white" stroke-width="0"/><rect x="5" y="35" width="26" height="10" fill="white" rx="1"/><rect x="49" y="29" width="26" height="10" fill="white" rx="1"/></svg>` },
  // 10 — Renault (diamond)
  { name: 'RENAULT', color: '#FFCC00', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><polygon points="40,6 58,40 40,74 22,40" fill="none" stroke="white" stroke-width="4"/><polygon points="40,18 52,40 40,62 28,40" fill="none" stroke="white" stroke-width="3"/></svg>` },
  // 11 — Peugeot (lion head simplified)
  { name: 'PEUGEOT', color: '#002855', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="32" r="18" fill="none" stroke="white" stroke-width="3"/><path d="M28 32 Q40 22 52 32 Q52 46 40 56 Q28 46 28 32Z" fill="none" stroke="white" stroke-width="2.5"/><circle cx="35" cy="30" r="2" fill="white"/><circle cx="45" cy="30" r="2" fill="white"/><path d="M35 38 Q40 42 45 38" fill="none" stroke="white" stroke-width="2"/><path d="M40 56 L40 72" stroke="white" stroke-width="3"/></svg>` },
  // 12 — Citroën (double chevron)
  { name: 'CITROËN', color: '#C41E3A', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M10 50 L40 28 L70 50" fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 62 L40 40 L70 62" fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  // 13 — Opel (lightning bolt circle)
  { name: 'OPEL', color: '#FFCC00', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="34" fill="none" stroke="white" stroke-width="4"/><path d="M44 12 L30 42 L42 42 L36 68 L52 38 L40 38 Z" fill="white"/></svg>` },
  // 14 — Fiat (wordmark style)
  { name: 'FIAT', color: '#CC0000', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="34" fill="none" stroke="white" stroke-width="4"/><text x="40" y="50" font-family="Arial,sans-serif" font-size="26" font-weight="900" fill="white" text-anchor="middle">FIAT</text></svg>` },
  // 15 — Alfa Romeo (cross + serpent)
  { name: 'ALFA ROMEO', color: '#CC0000', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="34" fill="none" stroke="white" stroke-width="3"/><line x1="40" y1="6" x2="40" y2="74" stroke="white" stroke-width="2"/><rect x="8" y="20" width="24" height="40" rx="2" fill="none" stroke="white" stroke-width="2"/><line x1="8" y1="40" x2="32" y2="40" stroke="white" stroke-width="2"/><path d="M48 20 Q58 28 56 40 Q58 52 48 60 Q60 52 64 40 Q60 28 48 20Z" fill="white" opacity="0.8"/></svg>` },
  // 16 — Volvo (circle + arrow)
  { name: 'VOLVO', color: '#003057', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="36" cy="44" r="26" fill="none" stroke="white" stroke-width="4"/><line x1="54" y1="26" x2="72" y2="8" stroke="white" stroke-width="4" stroke-linecap="round"/><polyline points="60,8 72,8 72,20" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  // 17 — Jaguar (leaping cat)
  { name: 'JAGUAR', color: '#1B1B1B', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M8 48 C12 30 22 20 40 18 C55 16 68 24 72 38 C74 46 70 56 62 60 C50 66 36 60 28 52 C18 42 14 36 8 48Z" fill="none" stroke="white" stroke-width="2.5"/><path d="M20 50 C24 40 32 32 44 30" stroke="white" stroke-width="2" stroke-linecap="round"/><text x="40" y="72" font-family="Georgia,serif" font-size="10" fill="white" text-anchor="middle" letter-spacing="2">JAGUAR</text></svg>` },
  // 18 — Land Rover (oval)
  { name: 'LAND ROVER', color: '#005A2B', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="40" rx="36" ry="20" fill="none" stroke="white" stroke-width="3"/><text x="40" y="36" font-family="Arial,sans-serif" font-size="9" font-weight="bold" fill="white" text-anchor="middle" letter-spacing="1">LAND</text><text x="40" y="48" font-family="Arial,sans-serif" font-size="9" font-weight="bold" fill="white" text-anchor="middle" letter-spacing="1">ROVER</text></svg>` },
  // 19 — Bentley (winged B)
  { name: 'BENTLEY', color: '#1B4D2E', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M8 40 Q20 20 40 20 Q20 40 40 40 Q20 40 40 60 Q20 60 8 40Z" fill="none" stroke="white" stroke-width="2.5"/><path d="M72 40 Q60 20 40 20 Q60 40 40 40 Q60 40 40 60 Q60 60 72 40Z" fill="none" stroke="white" stroke-width="2.5"/><text x="40" y="45" font-family="Georgia,serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">B</text></svg>` },
  // 20 — Rolls-Royce (double R)
  { name: 'ROLLS-ROYCE', color: '#2C2C2C', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="34" fill="none" stroke="white" stroke-width="3"/><text x="40" y="50" font-family="Georgia,serif" font-size="22" font-weight="bold" fill="white" text-anchor="middle">RR</text></svg>` },
  // 21 — McLaren (speedmark)
  { name: 'MCLAREN', color: '#FF8000', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M6 40 C6 20 20 8 40 8 C60 8 74 20 74 40" fill="none" stroke="white" stroke-width="5" stroke-linecap="round"/><path d="M15 52 C20 62 30 70 40 70 C50 70 60 62 65 52" fill="none" stroke="white" stroke-width="4" stroke-linecap="round"/></svg>` },
  // 22 — Maserati (trident)
  { name: 'MASERATI', color: '#003DA5', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M40 10 L40 70" stroke="white" stroke-width="4" stroke-linecap="round"/><path d="M24 10 L24 50" stroke="white" stroke-width="4" stroke-linecap="round"/><path d="M56 10 L56 50" stroke="white" stroke-width="4" stroke-linecap="round"/><path d="M24 10 Q32 20 40 10 Q48 20 56 10" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M24 50 Q32 62 40 70" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M56 50 Q48 62 40 70" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>` },
  // 23 — Bugatti (oval EB)
  { name: 'BUGATTI', color: '#B5121B', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="40" rx="36" ry="28" fill="none" stroke="white" stroke-width="3"/><ellipse cx="40" cy="40" rx="28" ry="20" fill="none" stroke="#C9A84C" stroke-width="2"/><text x="40" y="47" font-family="Georgia,serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">EB</text></svg>` },
  // 24 — Tesla (T mark)
  { name: 'TESLA', color: '#CC0000', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M10 22 Q26 14 40 22 Q54 14 70 22" fill="none" stroke="white" stroke-width="4" stroke-linecap="round"/><path d="M28 22 Q32 18 40 22 Q48 18 52 22" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/><line x1="40" y1="22" x2="40" y2="70" stroke="white" stroke-width="4" stroke-linecap="round"/></svg>` },
  // 25 — Honda (H mark)
  { name: 'HONDA', color: '#CC0000', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M20 16 L20 64 M20 40 L60 40 M60 16 L60 64" stroke="white" stroke-width="6" stroke-linecap="round" fill="none"/></svg>` },
  // 26 — Nissan (oval with name)
  { name: 'NISSAN', color: '#C3002F', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="40" rx="36" ry="22" fill="none" stroke="white" stroke-width="3"/><line x1="4" y1="40" x2="76" y2="40" stroke="white" stroke-width="3"/><text x="40" y="44" font-family="Arial,sans-serif" font-size="12" font-weight="bold" fill="white" text-anchor="middle" letter-spacing="2">NISSAN</text></svg>` },
  // 27 — Hyundai (italic H)
  { name: 'HYUNDAI', color: '#002C5F', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="40" rx="36" ry="28" fill="none" stroke="white" stroke-width="3"/><text x="40" y="50" font-family="Arial,sans-serif" font-size="36" font-weight="bold" font-style="italic" fill="white" text-anchor="middle">H</text></svg>` },
  // 28 — Kia (oval)
  { name: 'KIA', color: '#BB162B', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="24" width="68" height="32" rx="16" fill="none" stroke="white" stroke-width="3"/><text x="40" y="46" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle" letter-spacing="3">KIA</text></svg>` },
  // 29 — Subaru (6 stars)
  { name: 'SUBARU', color: '#003399', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="40" rx="36" ry="28" fill="none" stroke="white" stroke-width="3"/><circle cx="52" cy="36" r="7" fill="none" stroke="white" stroke-width="2.5"/><circle cx="30" cy="38" r="5" fill="none" stroke="white" stroke-width="2"/><circle cx="42" cy="28" r="4" fill="none" stroke="white" stroke-width="2"/><circle cx="20" cy="44" r="3" fill="none" stroke="white" stroke-width="2"/><circle cx="34" cy="50" r="3" fill="none" stroke="white" stroke-width="2"/><circle cx="46" cy="48" r="3" fill="none" stroke="white" stroke-width="2"/></svg>` },
  // 30 — Mazda (M wings)
  { name: 'MAZDA', color: '#2B2B2B', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="40" rx="36" ry="28" fill="none" stroke="white" stroke-width="3"/><path d="M20 52 Q28 28 40 36 Q52 28 60 52" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M28 52 Q34 36 40 40 Q46 36 52 52" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>` },
  // 31 — Mitsubishi (three diamonds)
  { name: 'MITSUBISHI', color: '#CC0000', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><polygon points="40,6 52,28 28,28" fill="white"/><polygon points="14,52 26,30 38,52" fill="white"/><polygon points="42,52 54,30 66,52" fill="white"/></svg>` },
  // 32 — Lexus (L oval)
  { name: 'LEXUS', color: '#1A1A1A', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="40" rx="36" ry="28" fill="none" stroke="white" stroke-width="3"/><text x="40" y="50" font-family="Georgia,serif" font-size="30" font-style="italic" fill="white" text-anchor="middle">L</text></svg>` },
  // 33 — Infiniti (oval)
  { name: 'INFINITI', color: '#1A1A1A', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M40 24 Q10 24 10 44 Q10 60 40 60 Q70 60 70 44 Q70 24 40 24Z" fill="none" stroke="white" stroke-width="3"/><path d="M40 24 L40 60" stroke="white" stroke-width="2.5"/><ellipse cx="40" cy="44" rx="12" ry="8" fill="none" stroke="white" stroke-width="2.5"/></svg>` },
  // 34 — Acura (A shape)
  { name: 'ACURA', color: '#CC0000', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M16 64 L40 16 L64 64" fill="none" stroke="white" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/><line x1="26" y1="46" x2="54" y2="46" stroke="white" stroke-width="5" stroke-linecap="round"/><line x1="32" y1="46" x2="32" y2="52" stroke="white" stroke-width="4" stroke-linecap="round"/><line x1="48" y1="46" x2="48" y2="52" stroke="white" stroke-width="4" stroke-linecap="round"/></svg>` },
  // 35 — Cadillac (crest)
  { name: 'CADILLAC', color: '#2C2C2C', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect x="14" y="20" width="52" height="40" rx="2" fill="none" stroke="white" stroke-width="3"/><line x1="30" y1="20" x2="30" y2="60" stroke="white" stroke-width="2"/><line x1="50" y1="20" x2="50" y2="60" stroke="white" stroke-width="2"/><line x1="14" y1="36" x2="66" y2="36" stroke="white" stroke-width="2"/><line x1="14" y1="50" x2="66" y2="50" stroke="white" stroke-width="2"/><rect x="31" y="21" width="8" height="8" fill="#CC0000"/><rect x="21" y="37" width="8" height="8" fill="#003DA5"/><rect x="51" y="37" width="8" height="8" fill="#FFD700"/></svg>` },
  // 36 — MINI (wordmark)
  { name: 'MINI', color: '#000000', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="34" fill="none" stroke="white" stroke-width="3"/><circle cx="40" cy="40" r="26" fill="none" stroke="white" stroke-width="2"/><text x="40" y="45" font-family="Arial Black,sans-serif" font-size="16" font-weight="900" fill="white" text-anchor="middle">MINI</text></svg>` },
  // 37 — Aston Martin (wings)
  { name: 'ASTON MARTIN', color: '#004B32', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M4 40 Q16 24 40 28 Q64 24 76 40 Q64 56 40 52 Q16 56 4 40Z" fill="none" stroke="white" stroke-width="2.5"/><text x="40" y="44" font-family="Georgia,serif" font-size="9" font-weight="bold" fill="white" text-anchor="middle" letter-spacing="1">ASTON MARTIN</text></svg>` },
  // 38 — Jeep (grille slots)
  { name: 'JEEP', color: '#2B5F2B', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="22" width="60" height="36" rx="4" fill="none" stroke="white" stroke-width="3"/><rect x="14" y="28" width="8" height="24" rx="4" fill="white"/><rect x="25" y="28" width="8" height="24" rx="4" fill="white"/><rect x="36" y="28" width="8" height="24" rx="4" fill="white"/><rect x="47" y="28" width="8" height="24" rx="4" fill="white"/><rect x="58" y="28" width="8" height="24" rx="4" fill="white"/></svg>` },
  // 39 — Range Rover (oval badge)
  { name: 'RANGE ROVER', color: '#003A5D', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="40" rx="36" ry="22" fill="none" stroke="#C0A060" stroke-width="3"/><text x="40" y="36" font-family="Arial,sans-serif" font-size="8" font-weight="bold" fill="white" text-anchor="middle" letter-spacing="1">RANGE</text><text x="40" y="48" font-family="Arial,sans-serif" font-size="8" font-weight="bold" fill="white" text-anchor="middle" letter-spacing="1">ROVER</text></svg>` },
  // 40 — Seat (S mark)
  { name: 'SEAT', color: '#CC0000', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M28 20 L52 20 L52 38 L28 42 L28 60 L52 60" fill="none" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  // 41 — Škoda (winged arrow)
  { name: 'ŠKODA', color: '#4E9443', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="30" fill="none" stroke="white" stroke-width="3"/><path d="M40 14 L40 66 M14 40 L66 40" stroke="white" stroke-width="2" opacity="0.3"/><path d="M26 26 L40 40 L54 26 M40 40 L40 60" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  // 42 — Dodge (RAM head simplified)
  { name: 'DODGE', color: '#CC0000', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M10 40 L36 16 L70 16 L70 28 L46 28 L46 52 L70 52 L70 64 L36 64 Z" fill="none" stroke="white" stroke-width="3" stroke-linejoin="round"/></svg>` },
  // 43 — Chrysler (wing badge)
  { name: 'CHRYSLER', color: '#003DA5', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M4 44 Q16 28 40 32 Q64 28 76 44" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M12 52 Q26 36 40 40 Q54 36 68 52" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/><text x="40" y="68" font-family="Arial,sans-serif" font-size="9" fill="white" text-anchor="middle" letter-spacing="2">CHRYSLER</text></svg>` },
  // 44 — Polestar (asterisk)
  { name: 'POLESTAR', color: '#0D0D0D', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><line x1="40" y1="8" x2="40" y2="72" stroke="white" stroke-width="4" stroke-linecap="round"/><line x1="8" y1="40" x2="72" y2="40" stroke="white" stroke-width="4" stroke-linecap="round"/><line x1="17" y1="17" x2="63" y2="63" stroke="white" stroke-width="4" stroke-linecap="round"/><line x1="63" y1="17" x2="17" y2="63" stroke="white" stroke-width="4" stroke-linecap="round"/></svg>` },
  // 45 — Genesis (G wings)
  { name: 'GENESIS', color: '#1A1A1A', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="40" rx="36" ry="20" fill="none" stroke="white" stroke-width="3"/><path d="M4 40 Q20 28 40 32 Q60 28 76 40" fill="none" stroke="white" stroke-width="2" opacity="0.6"/><text x="40" y="45" font-family="Georgia,serif" font-size="13" font-weight="bold" fill="white" text-anchor="middle" letter-spacing="2">G</text></svg>` },
  // 46 — Suzuki (S mark)
  { name: 'SUZUKI', color: '#CC0000', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M16 56 L56 56 L64 48 L24 32 L32 24 L64 24" fill="none" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  // 47 — Dacia (D mark)
  { name: 'DACIA', color: '#003087', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="16" width="12" height="48" rx="2" fill="white"/><path d="M30 16 Q66 16 66 40 Q66 64 30 64" fill="none" stroke="white" stroke-width="6" stroke-linecap="round"/></svg>` },
  // 48 — Lancia (L flag)
  { name: 'LANCIA', color: '#003DA5', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M30 8 L30 72 M30 40 L60 24 M30 40 L60 56" stroke="white" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M24 8 L36 8 L40 16 L36 72 L24 72 Z" fill="none" stroke="white" stroke-width="2"/></svg>` },
  // 49 — Saab (Gripen emblem simplified)
  { name: 'SAAB', color: '#003057', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="30" fill="none" stroke="white" stroke-width="3"/><path d="M22 32 Q40 16 58 32 Q58 50 40 62 Q22 50 22 32Z" fill="none" stroke="white" stroke-width="2.5"/><circle cx="40" cy="40" r="6" fill="none" stroke="white" stroke-width="2"/></svg>` },
  // 50 — Lincoln (star)
  { name: 'LINCOLN', color: '#2C2C2C', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><line x1="40" y1="10" x2="40" y2="70" stroke="white" stroke-width="4" stroke-linecap="round"/><line x1="10" y1="40" x2="70" y2="40" stroke="white" stroke-width="4" stroke-linecap="round"/><line x1="18" y1="18" x2="62" y2="62" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="62" y1="18" x2="18" y2="62" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>` },
  // 51 — BYD (B Y D text)
  { name: 'BYD', color: '#CC0000', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="20" width="68" height="40" rx="8" fill="none" stroke="white" stroke-width="3"/><text x="40" y="48" font-family="Arial Black,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle" letter-spacing="2">BYD</text></svg>` },
  // 52 — Rivian (R)
  { name: 'RIVIAN', color: '#F5C400', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M22 64 L22 16 L50 16 Q66 16 66 32 Q66 48 50 48 L22 48 M44 48 L66 64" fill="none" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  // 53 — Lucid Motors (L mark)
  { name: 'LUCID', color: '#B4975A', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M22 14 L22 66 L58 66" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>` },
  // 54 — Lotus (ACBC badge)
  { name: 'LOTUS', color: '#007A3D', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="40" rx="32" ry="22" fill="none" stroke="#FFD700" stroke-width="3"/><text x="40" y="36" font-family="Arial,sans-serif" font-size="8" fill="white" text-anchor="middle" font-weight="bold" letter-spacing="1">LOTUS</text><path d="M20 44 Q40 56 60 44" fill="none" stroke="white" stroke-width="2"/><path d="M24 50 Q40 58 56 50" fill="none" stroke="white" stroke-width="1.5"/></svg>` },
  // 55 — Pagani (P)
  { name: 'PAGANI', color: '#1A1A1A', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M24 68 L24 14 L50 14 Q70 14 70 34 Q70 54 50 54 L24 54" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  // 56 — Koenigsegg (ghost/K)
  { name: 'KOENIGSEGG', color: '#1A1A1A', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M22 16 L22 64 M22 40 L58 16 M22 40 L58 64" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>` },
];

// Generate Dobble deck (order 7: 57 cards, 8 symbols each, any 2 cards share exactly 1)
export function generateDobbleDeck() {
  const n = 7;
  const cards = [];
  cards.push(Array.from({ length: n + 1 }, (_, i) => i));
  for (let i = 0; i < n; i++) {
    const card = [0];
    for (let j = 0; j < n; j++) card.push(n + 1 + i * n + j);
    cards.push(card);
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const card = [i + 1];
      for (let k = 0; k < n; k++) card.push(n + 1 + k * n + ((i * k + j) % n));
      cards.push(card);
    }
  }
  return cards;
}
