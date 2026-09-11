export const site = {
  name: "CamerOnewheel",
  rider: "Cameron Patecell",
  location: "Orange County, California",
  oneLiner: "I race a 134V VESC out of Orange County.",
  youtubeHandle: "@CamerOnewheel",
  instagramHandle: "@cameronewheel",
  subscribers: "1.2K",
  updated: "September 2026",
  currentSeason: 2026,
  howIRunIt:
    "Remote for live angle. Tune has not moved since last September. Printed footholds are the most locked-in short of strapped, and they break. If you just want a board to ride, buy an XL.",
} as const;

export const links = {
  youtube: "https://www.youtube.com/@CamerOnewheel",
  instagram: "https://www.instagram.com/cameronewheel/",
  usaflt: "https://usaflt.com/news/cameron-patecell-racer-profile",
  tfl: "https://thefloatlife.com/CAMERONEWHEEL",
  landed: "https://landedfootwear.com/?ref=bhwwspfs",
  fungineers: "https://fungineers.us/",
  superflux: "https://fungineers.us/products/superflux",
  thor400: "https://fungineers.us/products/thor400-32s",
} as const;

export type AffiliateKey = keyof typeof links;

export const affiliates: Record<
  AffiliateKey,
  { url: string; label: string; sponsored?: boolean }
> = {
  youtube: { url: links.youtube, label: "YouTube" },
  instagram: { url: links.instagram, label: "Instagram" },
  usaflt: { url: links.usaflt, label: "USA FLT" },
  tfl: { url: links.tfl, label: "The Float Life", sponsored: true },
  landed: { url: links.landed, label: "Landed Footwear", sponsored: true },
  fungineers: { url: links.fungineers, label: "Fungineers" },
  superflux: { url: links.superflux, label: "SuperFlux" },
  thor400: { url: links.thor400, label: "Thor400" },
};

export function youtubeWatch(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
}

export function youtubeThumb(id: string) {
  return `/media/${id}.jpg`;
}

export type Place =
  | "1st"
  | "2nd"
  | "3rd"
  | "4th"
  | "6th"
  | "7th"
  | "10th"
  | "DNF"
  | "DNS"
  | "—";

export type Result = {
  id: string;
  event: string;
  year: number;
  place: Place;
  className: string;
  time?: string;
  location?: string;
  videoId?: string;
  unconfirmed?: boolean;
  featured?: boolean;
  order: number;
  venue?: string;
};

export const results: Result[] = [
  {
    id: "nwef-2026",
    event: "Northwest Electric Fest",
    year: 2026,
    place: "1st",
    className: "H2H",
    time: "8:47.130",
    location: "Veneta, Oregon",
    videoId: "v8z0MGeXS0E",
    featured: true,
    order: 10,
    venue: "nwef",
  },
  {
    id: "butte-open-2026",
    event: "Battle at the Butte",
    year: 2026,
    place: "1st",
    className: "H2H Open",
    location: "Brookings, Oregon",
    videoId: "OmZTGTUX3Xw",
    featured: true,
    order: 20,
    venue: "butte",
  },
  {
    id: "butte-orl-2026",
    event: "Battle at the Butte",
    year: 2026,
    place: "4th",
    className: "H2H ORL · GTS XL",
    location: "Brookings, Oregon",
    order: 21,
    venue: "butte",
  },
  {
    id: "butte-ms-2026",
    event: "Battle at the Butte",
    year: 2026,
    place: "DNF",
    className: "Mass Start",
    location: "Brookings, Oregon",
    order: 22,
    venue: "butte",
  },
  {
    id: "sns-h2h-2026",
    event: "Seek n Shred",
    year: 2026,
    place: "1st",
    className: "H2H",
    location: "Wilseyville, California",
    videoId: "2c4U_y2GYak",
    featured: true,
    order: 30,
    venue: "sns",
  },
  {
    id: "sns-ms-2026",
    event: "Seek n Shred",
    year: 2026,
    place: "1st",
    className: "Mass Start",
    location: "Wilseyville, California",
    order: 31,
    venue: "sns",
  },
  {
    id: "ds-enduro-2026",
    event: "Dirtsurferz · The Great Passion Play",
    year: 2026,
    place: "6th",
    className: "Enduro",
    location: "Eureka Springs, Arkansas",
    order: 40,
    venue: "ds",
  },
  {
    id: "ds-ms-2026",
    event: "Dirtsurferz · The Great Passion Play",
    year: 2026,
    place: "2nd",
    className: "Mass Start · Excursion",
    location: "Eureka Springs, Arkansas",
    videoId: "SSpqDuUjUmw",
    featured: true,
    order: 41,
    venue: "ds",
  },
  {
    id: "lir-2026",
    event: "Let It Ride 5",
    year: 2026,
    place: "DNF",
    className: "H2H",
    location: "Boulder City, Nevada",
    videoId: "Eou97LlMafM",
    featured: true,
    order: 50,
    venue: "lir",
  },
  {
    id: "ds-circuit-2025",
    event: "Dirtsurferz Enduro Circuit",
    year: 2025,
    place: "3rd",
    className: "Overall · 10th + 2nd + 2nd",
    order: 5,
  },
  {
    id: "ds-turkey-2025",
    event: "Dirtsurferz Turkey Mountain",
    year: 2025,
    place: "2nd",
    className: "Enduro",
    location: "Tulsa, Oklahoma",
    order: 10,
    venue: "turkey",
  },
  {
    id: "ds-bomb-cellar-2025",
    event: "Bomb Cellar Showdown",
    year: 2025,
    place: "1st",
    className: "Unlimited run",
    location: "Tulsa, Oklahoma",
    order: 11,
    venue: "turkey",
  },
  {
    id: "winman-2025",
    event: "Winman × Dirtsurferz",
    year: 2025,
    place: "2nd",
    className: "Enduro",
    location: "Winchester, Wisconsin",
    order: 20,
    venue: "winman",
  },
  {
    id: "nwef-2025",
    event: "Northwest Electric Fest",
    year: 2025,
    place: "1st",
    className: "H2H",
    location: "Veneta, Oregon",
    videoId: "yLwPZKs5NPI",
    order: 30,
    venue: "nwef",
  },
  {
    id: "sns-2025",
    event: "Seek n Shred",
    year: 2025,
    place: "1st",
    className: "H2H",
    location: "Wilseyville, California",
    order: 40,
    venue: "sns",
  },
  {
    id: "ds-enduro-2025",
    event: "Dirtsurferz · The Great Passion Play",
    year: 2025,
    place: "10th",
    className: "Enduro",
    location: "Eureka Springs, Arkansas",
    order: 50,
    venue: "ds",
  },
  {
    id: "ds-ms-2025",
    event: "Dirtsurferz · The Great Passion Play",
    year: 2025,
    place: "7th",
    className: "Mass Start",
    location: "Eureka Springs, Arkansas",
    unconfirmed: true,
    order: 51,
    venue: "ds",
  },
  {
    id: "lir-h2h-2025",
    event: "Let It Ride 4",
    year: 2025,
    place: "10th",
    className: "H2H",
    location: "Boulder City, Nevada",
    order: 60,
    venue: "lir",
  },
  {
    id: "lir-ms-2025",
    event: "Let It Ride 4",
    year: 2025,
    place: "4th",
    className: "Mass Start · flat tire",
    location: "Boulder City, Nevada",
    order: 61,
    venue: "lir",
  },
  {
    id: "wfw-2025",
    event: "Wheel Fun Weekend 4.5",
    year: 2025,
    place: "3rd",
    className: "H2H",
    location: "Pauma Valley, California",
    unconfirmed: true,
    order: 80,
    venue: "wfw",
  },
  {
    id: "amped-2024",
    event: "Amped Electric Games",
    year: 2024,
    place: "—",
    className: "Underground Finals · borrowed GT",
    location: "Bentonville, Arkansas",
    order: 20,
    venue: "amped",
  },
];

export function resultsForYear(year: number) {
  return results
    .filter((r) => r.year === year)
    .slice()
    .sort((a, b) => a.order - b.order);
}

export function featuredForYear(year: number) {
  return resultsForYear(year).filter((r) => r.featured);
}

export function resultYears() {
  return [...new Set(results.map((r) => r.year))].sort((a, b) => b - a);
}

export type Beat = {
  id: string;
  year: number;
  order: number;
  label: string;
  line: string;
  placeholder?: boolean;
  videoId?: string;
  venue?: string;
};

export const beats: Beat[] = [
  {
    id: "monster-2026",
    year: 2026,
    order: 70,
    label: "Baby Monster",
    line: "15×7 ATV tire in extended rails. Same pack and Thor400. Not the race board.",
    videoId: "nVOTihydSsk",
  },
  {
    id: "butte-knee-2026",
    year: 2026,
    order: 23,
    label: "Battle weekend",
    line: "H2H on an injured knee. It was hurting Sunday. Mass start DNF.",
  },
  {
    id: "ds-ankle-2026",
    year: 2026,
    order: 42,
    label: "Sprained ankle",
    line: "Night before Passion Play. Woke up limping. Splinted it and raced anyway.",
  },
  {
    id: "lir-crash-2026",
    year: 2026,
    order: 51,
    label: "Cased the gap",
    line: "Tried not to overshoot it. Broke the board and myself. Weekend over.",
  },
  {
    id: "btg-proto-2025",
    year: 2025,
    order: 21,
    label: "BTG Pioneer prototype",
    line: "Winman tire. Same 134V Hypercore MTE setup otherwise.",
  },
  {
    id: "race-board-2025",
    year: 2025,
    order: 62,
    label: "134V",
    line: '32s1p 21700 JP40, 5" Hypercore MTE Pioneer. Poutz footholds, express from Vincent a few days before Let It Ride 4.',
  },
  {
    id: "footholds-2025",
    year: 2025,
    order: 81,
    label: "Footholds",
    line: 'First month on them. 84V 20s2p 18650, 5" MTE Hypercore Pioneer, Joe hooks. Wheel Fun Weekend 4.5.',
  },
  {
    id: "first-race-beat",
    year: 2024,
    order: 10,
    label: "First race",
    line: "Board broke first practice day. Rode a borrowed GT, slowly, behind the fast guys.",
  },
  {
    id: "first-wheel",
    year: 2022,
    order: 10,
    label: "First wheel",
    line: "A Pint. Exact month TBD.",
    placeholder: true,
    venue: "home",
  },
  {
    id: "came-back",
    year: 2022,
    order: 20,
    label: "Came back",
    line: "Sat out after a day-one crash. Came back on a GT. Placeholder.",
    placeholder: true,
  },
];

export type TimelineItem =
  | { type: "race"; id: string; year: number; order: number; result: Result }
  | { type: "beat"; id: string; year: number; order: number; beat: Beat };

export function timelineYears() {
  return [
    ...new Set([...results.map((r) => r.year), ...beats.map((b) => b.year)]),
  ].sort((a, b) => b - a);
}

export function timelineForYear(year: number): TimelineItem[] {
  const raceItems: TimelineItem[] = results
    .filter((r) => r.year === year)
    .map((result) => ({
      type: "race",
      id: result.id,
      year,
      order: result.order,
      result,
    }));
  const beatItems: TimelineItem[] = beats
    .filter((b) => b.year === year)
    .map((beat) => ({
      type: "beat",
      id: beat.id,
      year,
      order: beat.order,
      beat,
    }));
  return [...raceItems, ...beatItems].sort((a, b) => a.order - b.order);
}

export type Part = {
  name: string;
  role: string;
  why: string;
  affiliate?: AffiliateKey;
};

export const raceParts: Part[] = [
  {
    name: 'TFL 5" BTG Pioneer',
    role: "Tire",
    why: "The tire I prefer. The motor had to change for 2026. The Pioneer stayed.",
    affiliate: "tfl",
  },
  {
    name: "TFL extended Steep n Deep WTF",
    role: "Rails",
    why: "Extended rail for the race setup.",
    affiliate: "tfl",
  },
  {
    name: 'Fungineers 5" HT SuperFlux',
    role: "Motor",
    why: "High-torque SuperFlux.",
    affiliate: "superflux",
  },
  {
    name: "Fungineers Thor400",
    role: "Controller",
    why: "32s / 134V, 400A.",
    affiliate: "thor400",
  },
  {
    name: "EVE50pl 32s2p 134V in TFL Torque Box",
    role: "Battery",
    why: "Voltage is the point of the build. 2026 race pack.",
    affiliate: "tfl",
  },
  {
    name: "MOFF POUTZ footholds, vow-style blocks",
    role: "Footholds",
    why: "Toe hook, center block, heel stop. Printed parts break.",
  },
];

export type Board = {
  id: string;
  name: string;
  kind: "Race" | "Daily" | "Experiment";
  status: string;
  summary: string;
  parts?: Part[];
  how?: string;
  videoId?: string;
  photo?: string;
  placeholder?: boolean;
};

export const boards: Board[] = [
  {
    id: "race",
    name: "Race board",
    kind: "Race",
    status: "Current · 2026",
    summary: "Custom VESC. 134 volts, 400 amps, remote for live angle.",
    parts: raceParts,
    how: site.howIRunIt,
    photo: "/media/hero-nwef-2025.jpg",
  },
  {
    id: "daily",
    name: "Daily",
    kind: "Daily",
    status: "Placeholder",
    summary: "The board I actually ride when I’m not racing. Specs and photo later.",
    placeholder: true,
  },
  {
    id: "monster",
    name: "Baby Monster",
    kind: "Experiment",
    status: "Shop experiment",
    summary:
      '15" × 7" ATV tire in extended rails. Same 32s2p pack and Thor400. Not the race board.',
    videoId: "nVOTihydSsk",
  },
];

export const raceBoard = boards[0]!;

export type WatchCategory = "races" | "tests" | "first" | "vesc";

export const watchCategories: { id: WatchCategory; label: string }[] = [
  { id: "races", label: "Races" },
  { id: "tests", label: "Board tests" },
  { id: "first", label: "First rides" },
  { id: "vesc", label: "VESC / mods" },
];

export type Video = {
  id: string;
  title: string;
  views: string;
  blurb: string;
  category: WatchCategory;
};

export const videos: Video[] = [
  {
    id: "v8z0MGeXS0E",
    title: "How I WON the Hardest Race... AGAIN",
    views: "965",
    blurb: "Northwest Electric Fest 2026. 8:47.130.",
    category: "races",
  },
  {
    id: "SSpqDuUjUmw",
    title: "HOW I (almost) WON THE MOST CHAOTIC ONEWHEEL RACE",
    views: "2.0K",
    blurb: "Dirtsurferz mass start. Second.",
    category: "races",
  },
  {
    id: "OmZTGTUX3Xw",
    title: "Surviving another Onewheel Mass Start (And WINNING)",
    views: "3.1K",
    blurb: "Mass start.",
    category: "races",
  },
  {
    id: "2c4U_y2GYak",
    title: "Defending My Title at Shredfest 6",
    views: "947",
    blurb: "Seek n Shred 2026.",
    category: "races",
  },
  {
    id: "Eou97LlMafM",
    title: "This Course was so GNARLY I barely made it out... (Let it Ride 5)",
    views: "1.1K",
    blurb: "Let It Ride 2026.",
    category: "races",
  },
  {
    id: "yLwPZKs5NPI",
    title: "Hardest Race of 2025 (RAW POV) | Northwest Electricfest",
    views: "790",
    blurb: "Northwest Electric Fest 2025.",
    category: "races",
  },
  {
    id: "qKD3bkYOhDY",
    title: "The Best Onewheel in 2026 (In My Opinion)",
    views: "4.6K",
    blurb: "Race board vs GTS XL Rally vs Hypercore.",
    category: "tests",
  },
  {
    id: "mGEXTgGjM8U",
    title: "Is THIS the Future of Onewheel?",
    views: "7.3K",
    blurb: "134V VESC vs Floatwheel ADV2.",
    category: "vesc",
  },
  {
    id: "aLtNHlrYkFY",
    title: "Fungineers X7 | Worth the Hype?",
    views: "2.7K",
    blurb: "Parts-sponsor board, ridden like a test.",
    category: "tests",
  },
  {
    id: "8dS_2_AkFGs",
    title: "Pro Rider tests GTS XL on San Diego's Most Iconic Trail",
    views: "1.9K",
    blurb: "VESC vs XL vs GTS Rally.",
    category: "tests",
  },
  {
    id: "nVOTihydSsk",
    title: 'I Put a 15" ATV Tire on a Onewheel',
    views: "1.3K",
    blurb: "Baby Monster maiden voyage.",
    category: "first",
  },
  {
    id: "aK6VGvDdepI",
    title: "Our OG Onewheel Stomping Grounds | Greer Ranch Trails SoCal",
    views: "832",
    blurb: "Home trails.",
    category: "tests",
  },
];

export type GearItem = {
  name: string;
  use: string;
  affiliate?: AffiliateKey;
  href?: string;
  placeholder?: boolean;
};

export function gearShop(item: GearItem) {
  if (item.affiliate) {
    return {
      href: `/go/${item.affiliate}`,
      rel: affiliates[item.affiliate].sponsored
        ? ("noreferrer sponsored" as const)
        : ("noreferrer" as const),
    };
  }
  if (item.href) {
    return { href: item.href, rel: "noreferrer sponsored" as const };
  }
  return null;
}

export const gear: GearItem[] = [
  {
    name: "Landed Footwear",
    use: "What I race in. 15% off through the link, including high tops.",
    affiliate: "landed",
  },
  {
    name: "The Float Life",
    use: "Tires, rails, pads, bumpers. Code CAMERONEWHEEL.",
    affiliate: "tfl",
  },
  {
    name: "Alpinestars Bionic Plus",
    use: "Main protection.",
    href: "https://amzn.to/4ocAAz5",
  },
];

export type KitWhen = "always" | "race" | "varies";
export type KitSlot =
  | "head"
  | "neck"
  | "torso"
  | "back"
  | "elbows"
  | "hips"
  | "knees"
  | "ankles"
  | "feet";

export type KitPiece = {
  id: string;
  slot: KitSlot;
  pair?: boolean;
  name: string;
  brand: string;
  covers: string;
  when: KitWhen;
  why: string;
  href: string;
  image?: string;
};

export const kitPieces: KitPiece[] = [
  {
    id: "main",
    slot: "torso",
    name: "Alpinestars Bionic Plus",
    brand: "Alpinestars",
    covers: "Chest, back, shoulders, elbows",
    when: "always",
    why: "Main protection. For races I add a lightweight D3O Level 2 jacket under it for extra elbows, shoulders, and back.",
    href: "https://amzn.to/4ocAAz5",
    image: "/media/gear/main.jpg",
  },
  {
    id: "jacket",
    slot: "torso",
    name: "D3O jacket",
    brand: "Race layer",
    covers: "Elbows, shoulders, back",
    when: "race",
    why: "Under the Alpinestars on race day. Pads swapped for better D3O after it ran too hot.",
    href: "https://amzn.to/3SlLOVO",
    image: "/media/gear/jacket.jpg",
  },
  {
    id: "football",
    slot: "torso",
    name: "Football padded shirt",
    brand: "Base layer",
    covers: "Chest, ribs, shoulders",
    when: "always",
    why: "Compression base. Always on under the Bionic.",
    href: "https://amzn.to/43H5TZg",
    image: "/media/gear/football.jpg",
  },
  {
    id: "neck",
    slot: "neck",
    name: "Neck protector",
    brand: "Leatt-style",
    covers: "Neck",
    when: "race",
    why: "Race days.",
    href: "https://amzn.to/3PM3dX4",
    image: "/media/gear/neckb.jpg",
  },
  {
    id: "kidney",
    slot: "back",
    name: "Fox Titan kidney belt",
    brand: "Fox",
    covers: "Kidneys, lower back",
    when: "always",
    why: "Over the jacket hem.",
    href: "https://amzn.to/4e9QDZH",
    image: "/media/gear/kidney.jpg",
  },
  {
    id: "demon",
    slot: "elbows",
    pair: true,
    name: "Demon D3O elbows",
    brand: "Demon",
    covers: "Elbows",
    when: "varies",
    why: "Thickest D3O elbows I’ve found. Varies with the day’s elbow setup.",
    href: "https://amzn.to/4awaAIn",
    image: "/media/gear/demon.jpg",
  },
  {
    id: "hips",
    slot: "hips",
    name: "Hip pads",
    brand: "Impact shorts",
    covers: "Hips",
    when: "always",
    why: "Favorite pair. Always on.",
    href: "https://amzn.to/4rVBSz6",
    image: "/media/gear/race-shell.jpg",
  },
  {
    id: "race-shell",
    slot: "hips",
    name: "Hardshell second layer",
    brand: "Race",
    covers: "Hips, tailbone",
    when: "race",
    why: "Second layer for races. Saved me many times.",
    href: "https://amzn.to/4qBeINa",
    image: "/media/gear/race-shell.jpg",
  },
  {
    id: "scoyco",
    slot: "knees",
    pair: true,
    name: "Scoyco hardshell",
    brand: "Scoyco",
    covers: "Knees, shins",
    when: "race",
    why: "Knees + elbows combo for race day.",
    href: "https://amzn.to/4aqkuLy",
    image: "/media/gear/scoyco.jpg",
  },
  {
    id: "d3o-knees",
    slot: "knees",
    pair: true,
    name: "D3O knees",
    brand: "D3O",
    covers: "Knees",
    when: "always",
    why: "Thick high-impact. Under the Scoyco on race day.",
    href: "https://amzn.to/4re4kvP",
    image: "/media/gear/d3o-knees.jpg",
  },
  {
    id: "sleeves",
    slot: "knees",
    pair: true,
    name: "Knee compression sleeves",
    brand: "Always",
    covers: "Knees",
    when: "always",
    why: "I never ride without them.",
    href: "https://amzn.to/4coM1hp",
    image: "/media/gear/d3o-knees.jpg",
  },
  {
    id: "t2",
    slot: "ankles",
    pair: true,
    name: "Active Ankle T2",
    brand: "Active Ankle",
    covers: "Ankles",
    when: "always",
    why: "Main ankle brace.",
    href: "https://amzn.to/3QGV7PO",
    image: "/media/gear/t2.jpg",
  },
  {
    id: "ankle-nice",
    slot: "ankles",
    pair: true,
    name: "Foot-specific ankle brace",
    brand: "Nicer pair",
    covers: "Ankles",
    when: "varies",
    why: "Foot-specific version when I want the nicer pair.",
    href: "https://amzn.to/4v7MPzm",
    image: "/media/gear/t2.jpg",
  },
  {
    id: "landed",
    slot: "feet",
    name: "Landed High",
    brand: "Landed",
    covers: "Feet",
    when: "always",
    why: "What I race in.",
    href: "https://landedfootwear.com/?ref=bhwwspfs",
    image: "/media/gear/landed.jpg",
  },
];

export const kitPacks = [
  { id: "race", title: "Race", line: "Bionic + D3O jacket + hardshell + neck." },
  { id: "trail", title: "Trail", line: "Bionic + football shirt + soft D3O." },
  { id: "casual", title: "Casual", line: "Shirt, hips, sleeves, braces, Landed." },
];

export const sponsors = [
  {
    name: "Fungineers",
    role: "Parts. Not travel. Current hardware sponsor.",
    href: "fungineers" as AffiliateKey,
    kind: "sponsor",
  },
  {
    name: "The Float Life",
    role: "Affiliate. Code CAMERONEWHEEL.",
    href: "tfl" as AffiliateKey,
    kind: "affiliate",
  },
  {
    name: "Landed Footwear",
    role: "Affiliate.",
    href: "landed" as AffiliateKey,
    kind: "affiliate",
  },
];

export const kit = {
  recent: "1st, Northwest Electric Fest 2026, 8:47.130",
  board: "134V VESC. SuperFlux, Thor400, Pioneer.",
};

export const homeStrip = [
  { href: "/go/youtube", label: "YouTube" },
  { href: "/go/instagram", label: "Instagram" },
  { href: "/go/tfl", label: "The Float Life" },
  { href: "/go/landed", label: "Landed" },
];

export const treeLinks = [
  { kind: "go" as const, partner: "youtube" as AffiliateKey, label: "YouTube" },
  { kind: "go" as const, partner: "instagram" as AffiliateKey, label: "Instagram" },
  { kind: "go" as const, partner: "usaflt" as AffiliateKey, label: "USA FLT profile" },
  { kind: "go" as const, partner: "tfl" as AffiliateKey, label: "The Float Life" },
  { kind: "go" as const, partner: "landed" as AffiliateKey, label: "Landed" },
  { kind: "page" as const, to: "/watch", label: "Watch" },
  { kind: "page" as const, to: "/garage", label: "Garage" },
  { kind: "page" as const, to: "/results", label: "Results" },
  { kind: "page" as const, to: "/contact", label: "Contact" },
  { kind: "page" as const, to: "/sponsors", label: "Sponsorship" },
];

export const nav = [
  { to: "/results", label: "Results" },
  { to: "/garage", label: "Garage" },
  { to: "/watch", label: "Watch" },
  { to: "/gear", label: "Gear" },
  { to: "/sponsors", label: "Sponsors" },
  { to: "/links", label: "Links" },
  { to: "/contact", label: "Contact" },
] as const;
