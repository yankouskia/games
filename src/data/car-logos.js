/**
 * Car brand logos from filippofilip95/car-logos-dataset (GitHub).
 * Images served via raw.githubusercontent.com — free dataset, open for use.
 * Base URL for "thumb" size (120x120 PNG, transparent background).
 */

const BASE = 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/';

export const CAR_BRANDS = [
  { name: 'AUDI',         slug: 'audi' },
  { name: 'BMW',          slug: 'bmw' },
  { name: 'MERCEDES',     slug: 'mercedes-benz' },
  { name: 'TOYOTA',       slug: 'toyota' },
  { name: 'VW',           slug: 'volkswagen' },
  { name: 'FERRARI',      slug: 'ferrari' },
  { name: 'PORSCHE',      slug: 'porsche' },
  { name: 'LAMBORGHINI',  slug: 'lamborghini' },
  { name: 'FORD',         slug: 'ford' },
  { name: 'CHEVROLET',    slug: 'chevrolet' },
  { name: 'RENAULT',      slug: 'renault' },
  { name: 'PEUGEOT',      slug: 'peugeot' },
  { name: 'CITROËN',      slug: 'citroen' },
  { name: 'OPEL',         slug: 'opel' },
  { name: 'FIAT',         slug: 'fiat' },
  { name: 'ALFA ROMEO',   slug: 'alfa-romeo' },
  { name: 'VOLVO',        slug: 'volvo' },
  { name: 'JAGUAR',       slug: 'jaguar' },
  { name: 'LAND ROVER',   slug: 'land-rover' },
  { name: 'BENTLEY',      slug: 'bentley' },
  { name: 'ROLLS-ROYCE',  slug: 'rolls-royce' },
  { name: 'MCLAREN',      slug: 'mclaren' },
  { name: 'MASERATI',     slug: 'maserati' },
  { name: 'BUGATTI',      slug: 'bugatti' },
  { name: 'TESLA',        slug: 'tesla' },
  { name: 'HONDA',        slug: 'honda' },
  { name: 'NISSAN',       slug: 'nissan' },
  { name: 'HYUNDAI',      slug: 'hyundai' },
  { name: 'KIA',          slug: 'kia' },
  { name: 'SUBARU',       slug: 'subaru' },
  { name: 'MAZDA',        slug: 'mazda' },
  { name: 'MITSUBISHI',   slug: 'mitsubishi' },
  { name: 'LEXUS',        slug: 'lexus' },
  { name: 'INFINITI',     slug: 'infiniti' },
  { name: 'ACURA',        slug: 'acura' },
  { name: 'CADILLAC',     slug: 'cadillac' },
  { name: 'MINI',         slug: 'mini' },
  { name: 'ASTON MARTIN', slug: 'aston-martin' },
  { name: 'JEEP',         slug: 'jeep' },
  { name: 'SEAT',         slug: 'seat' },
  { name: 'ŠKODA',        slug: 'skoda' },
  { name: 'DODGE',        slug: 'dodge' },
  { name: 'CHRYSLER',     slug: 'chrysler' },
  { name: 'POLESTAR',     slug: 'polestar' },
  { name: 'GENESIS',      slug: 'genesis' },
  { name: 'SUZUKI',       slug: 'suzuki' },
  { name: 'DACIA',        slug: 'dacia' },
  { name: 'LINCOLN',      slug: 'lincoln' },
  { name: 'BYD',          slug: 'byd' },
  { name: 'LOTUS',        slug: 'lotus' },
  { name: 'PAGANI',       slug: 'pagani' },
  { name: 'KOENIGSEGG',   slug: 'koenigsegg' },
  { name: 'LANCIA',       slug: 'lancia' },
  { name: 'SAAB',         slug: 'saab' },
  { name: 'RIVIAN',       slug: 'rivian' },
  { name: 'LUCID',        slug: 'lucid' },
  { name: 'RAM',          slug: 'ram' },
].map(b => ({ ...b, img: `${BASE}${b.slug}.png` }));

// Generate Dobble deck (order 7: 57 cards, 8 symbols each)
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
