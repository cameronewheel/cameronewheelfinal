export type Venue = {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lon: number;
  /** Position on the 1600×900 atlas plate. */
  mx: number;
  my: number;
  stamp: string;
  short: string;
};

/** Race venues + home. Addresses checked against event pages / TFL calendar. */
export const venues: Record<string, Venue> = {
  home: {
    id: "home",
    name: "Home",
    city: "Lake Elsinore",
    state: "CA",
    lat: 33.668,
    lon: -117.327,
    mx: 232,
    my: 538,
    stamp: "home",
    short: "Home",
  },
  wfw: {
    id: "wfw",
    name: "Luiseño Bike Park",
    city: "Pauma Valley",
    state: "CA",
    lat: 33.277,
    lon: -116.944,
    mx: 242,
    my: 552,
    stamp: "home",
    short: "Wheel Fun",
  },
  lir: {
    id: "lir",
    name: "Boulder City MX",
    city: "Boulder City",
    state: "NV",
    lat: 35.94944,
    lon: -114.78904,
    mx: 298,
    my: 490,
    stamp: "desert",
    short: "Let It Ride",
  },
  sns: {
    id: "sns",
    name: "Blue Mountain Event Center",
    city: "Wilseyville",
    state: "CA",
    lat: 38.36767,
    lon: -120.44177,
    mx: 252,
    my: 428,
    stamp: "sierra",
    short: "Seek n Shred",
  },
  nwef: {
    id: "nwef",
    name: "Havenroot",
    city: "Veneta",
    state: "OR",
    lat: 44.03315,
    lon: -123.37102,
    mx: 214,
    my: 292,
    stamp: "pnw",
    short: "NWEF",
  },
  butte: {
    id: "butte",
    name: "Bosley Butte",
    city: "Brookings",
    state: "OR",
    lat: 42.125,
    lon: -124.185,
    mx: 204,
    my: 348,
    stamp: "coast",
    short: "The Butte",
  },
  ds: {
    id: "ds",
    name: "The Great Passion Play",
    city: "Eureka Springs",
    state: "AR",
    lat: 36.407,
    lon: -93.738,
    mx: 828,
    my: 508,
    stamp: "ozark",
    short: "Passion Play",
  },
  amped: {
    id: "amped",
    name: "Amped Electric Games",
    city: "Bentonville",
    state: "AR",
    lat: 36.362,
    lon: -94.209,
    mx: 812,
    my: 492,
    stamp: "ozark",
    short: "Amped",
  },
  turkey: {
    id: "turkey",
    name: "Turkey Mountain",
    city: "Tulsa",
    state: "OK",
    lat: 36.089,
    lon: -96.002,
    mx: 768,
    my: 522,
    stamp: "ok",
    short: "Turkey Mtn",
  },
  winman: {
    id: "winman",
    name: "WinMan Trails",
    city: "Winchester",
    state: "WI",
    lat: 46.187,
    lon: -89.884,
    mx: 858,
    my: 318,
    stamp: "woods",
    short: "WinMan",
  },
};

/** Chronological drive for each season. Always starts at home. */
export const seasonRoutes: Record<number, string[]> = {
  2026: ["home", "lir", "ds", "sns", "butte", "nwef"],
  2025: ["home", "wfw", "lir", "ds", "sns", "nwef", "winman", "turkey"],
  2024: ["home", "amped"],
  2022: ["home"],
};

export function venueOf(id: string | undefined): Venue | undefined {
  if (!id) return undefined;
  return venues[id];
}

export function milesBetween(a: Venue, b: Venue) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  const crow = 2 * 3959 * Math.asin(Math.min(1, Math.sqrt(h)));
  return Math.round(crow * 1.18);
}

export function seasonMiles(year: number) {
  const ids = seasonRoutes[year] ?? ["home"];
  let total = 0;
  for (let i = 1; i < ids.length; i++) {
    const a = venues[ids[i - 1]!];
    const b = venues[ids[i]!];
    if (a && b) total += milesBetween(a, b);
  }
  return total;
}

const WEST = -126;
const EAST = -66;
const NORTH = 50;
const SOUTH = 24;
export const MAP = { w: 1000, h: 620 };

export function project(lat: number, lon: number) {
  return {
    x: ((lon - WEST) / (EAST - WEST)) * MAP.w,
    y: ((NORTH - lat) / (NORTH - SOUTH)) * MAP.h,
  };
}

/** Simplified CONUS outline, west-coast heavy. */
export const conus: [number, number][] = [
  [48.5, -124.7],
  [47.0, -124.3],
  [46.2, -124.0],
  [44.5, -124.2],
  [43.0, -124.4],
  [42.0, -124.4],
  [40.0, -124.0],
  [38.0, -123.0],
  [36.6, -121.9],
  [34.5, -120.5],
  [34.4, -119.0],
  [33.0, -117.3],
  [32.52, -117.12],
  [32.55, -114.8],
  [31.33, -111.07],
  [31.33, -108.2],
  [31.78, -106.53],
  [29.3, -104.0],
  [26.0, -97.4],
  [27.6, -97.2],
  [29.75, -93.9],
  [29.25, -89.5],
  [30.4, -88.1],
  [30.4, -86.5],
  [29.7, -85.0],
  [29.2, -83.0],
  [25.2, -81.1],
  [25.15, -80.4],
  [26.9, -80.03],
  [30.4, -81.4],
  [32.05, -80.85],
  [33.9, -78.5],
  [35.22, -75.53],
  [36.55, -75.87],
  [37.2, -76.0],
  [38.0, -75.3],
  [38.93, -74.9],
  [40.5, -74.0],
  [40.9, -72.3],
  [41.7, -69.95],
  [42.87, -70.6],
  [43.8, -69.75],
  [44.8, -66.98],
  [47.35, -68.15],
  [47.45, -69.2],
  [45.3, -71.3],
  [45.0, -74.3],
  [43.6, -76.5],
  [43.25, -79.05],
  [42.25, -81.2],
  [41.68, -83.45],
  [43.65, -82.4],
  [45.97, -84.78],
  [46.48, -84.6],
  [48.0, -89.5],
  [48.0, -94.96],
  [49.0, -95.15],
  [49.0, -123.2],
  [48.3, -124.7],
];

export const lakes: [number, number][] = [
  [46.5, -84.8],
  [46.9, -87.6],
  [46.5, -90.5],
  [46.9, -87.0],
  [45.8, -84.8],
  [45.0, -83.0],
  [43.6, -83.9],
  [41.6, -82.5],
  [41.7, -87.5],
  [43.0, -87.8],
  [44.8, -87.0],
  [45.8, -86.5],
];
