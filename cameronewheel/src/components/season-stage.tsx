import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { PlayMark } from "@/components/play-mark";
import { cn } from "@/lib/utils";
import {
  beats,
  results,
  youtubeThumb,
  youtubeWatch,
  type Beat,
  type Result,
} from "@/lib/site-data";
import {
  milesBetween,
  seasonMiles,
  seasonRoutes,
  venueOf,
  venues,
  type Venue,
} from "@/lib/venues";

const AW = 1600;
const AH = 900;
const HEADER = 56;

const beatVenue: Record<string, string> = {
  "butte-knee-2026": "butte",
  "ds-ankle-2026": "ds",
  "lir-crash-2026": "lir",
  "btg-proto-2025": "winman",
  "footholds-2025": "wfw",
  "first-race-beat": "amped",
};

type Stop = {
  venueId: string;
  headline: Result;
  others: Result[];
  notes: Beat[];
};

function mappedYears() {
  return Object.keys(seasonRoutes)
    .map(Number)
    .filter((year) => (seasonRoutes[year]?.length ?? 0) > 1)
    .sort((a, b) => b - a);
}

function stopsForYear(year: number): Stop[] {
  const route = (seasonRoutes[year] ?? []).filter((id) => id !== "home");
  const out: Stop[] = [];
  for (const venueId of route) {
    const races = results
      .filter((r) => r.year === year && r.venue === venueId)
      .slice()
      .sort((a, b) => a.order - b.order);
    if (!races.length) continue;
    const headline =
      races.find((r) => r.featured) ??
      races.find((r) => r.videoId) ??
      races[0]!;
    const notes = beats.filter(
      (b) =>
        b.year === year &&
        (b.venue === venueId || beatVenue[b.id] === venueId),
    );
    out.push({
      venueId,
      headline,
      others: races.filter((r) => r.id !== headline.id),
      notes,
    });
  }
  return out;
}

function looseBeats(year: number, used: Set<string>) {
  return beats.filter((b) => {
    if (b.year !== year) return false;
    const venue = b.venue ?? beatVenue[b.id];
    return !venue || !used.has(venue);
  });
}

function drivePath(ids: string[]) {
  const pts = ids.map((id) => venues[id]).filter(Boolean) as Venue[];
  if (!pts.length) return "";
  let d = `M ${pts[0]!.mx} ${pts[0]!.my}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]!;
    const b = pts[i]!;
    const dx = b.mx - a.mx;
    const dy = b.my - a.my;
    const len = Math.hypot(dx, dy) || 1;
    const bulge = Math.min(90, len * 0.18);
    const cx = (a.mx + b.mx) / 2 - (dy / len) * bulge * 0.2;
    const cy = (a.my + b.my) / 2 - bulge;
    d += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.mx} ${b.my}`;
  }
  return d;
}

/** Camera window centered on a point. `width` is atlas-px; height follows the scene. */
function viewFollow(
  px: number,
  py: number,
  aspect: number,
  width: number,
  yBias = 0.46,
) {
  const ratio = clamp(aspect, 0.32, 2.4);
  let w = clamp(width, 140, AW);
  let h = w * ratio;
  if (h > AH) {
    h = AH;
    w = clamp(h / ratio, 140, AW);
    h = w * ratio;
    if (h > AH) h = AH;
  }
  if (w > AW) {
    w = AW;
    h = Math.min(AH, w * ratio);
  }
  const x = clamp(px - w / 2, 0, Math.max(0, AW - w));
  const y = clamp(py - h * yBias, 0, Math.max(0, AH - h));
  return `${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`;
}

/** Ride with the van — zoom is FOV, look is a little down-road. */
function followCam(
  px: number,
  py: number,
  tx: number,
  ty: number,
  aspect: number,
  width: number,
  eased: number,
) {
  const look = eased * 0.18;
  return viewFollow(
    px + (tx - px) * look,
    py + (ty - py) * look,
    aspect,
    width,
    0.4 + eased * 0.05,
  );
}

/** Metro crop around the van. Tight, but not so tight the print falls apart. */
function eventW(elW: number) {
  return clamp(elW / 8.2, 156, 214);
}

/**
 * Miles in, atlas-px out. Short hops barely leave the city;
 * cross-country opens the whole plate.
 */
function hopW(miles: number, elW: number) {
  const tight = eventW(elW);
  const t = clamp((miles - 70) / 1320);
  const k = 0.16 + t * t * 1.22;
  return clamp(tight + 22 + miles * k, tight + 20, 1600);
}

function nearestOnPath(
  el: SVGPathElement,
  x: number,
  y: number,
  hint: number,
) {
  const len = el.getTotalLength();
  if (!len) return 0;
  const span = Math.min(48, Math.max(12, len * 0.04));
  const lo = clamp(hint - span, 0, len);
  const hi = clamp(hint + span, 0, len);
  const step = Math.max(0.4, (hi - lo) / 40);
  let best = clamp(hint, 0, len);
  let bestD = Infinity;
  for (let d = lo; d <= hi; d += step) {
    const p = el.getPointAtLength(d);
    const dist = Math.hypot(p.x - x, p.y - y);
    if (dist < bestD) {
      bestD = dist;
      best = d;
    }
  }
  return best;
}

/** Real traveled geometry from the start of the route to the van. */
function traveledD(
  el: SVGPathElement,
  to: number,
  endX: number,
  endY: number,
) {
  const len = el.getTotalLength();
  if (!len) return "";
  const b = clamp(to, 0, len);
  if (b < 0.4) return `M ${endX.toFixed(2)} ${endY.toFixed(2)}`;
  const n = Math.max(12, Math.min(280, Math.round(b / 2)));
  let d = "";
  for (let i = 0; i < n; i++) {
    const p = el.getPointAtLength((b * i) / n);
    d += `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)} `;
  }
  d += `L${endX.toFixed(2)} ${endY.toFixed(2)}`;
  return d;
}

function stationsOnPath(el: SVGPathElement, ids: string[]) {
  const len = el.getTotalLength();
  if (!len) return ids.map(() => 0);
  const samples = 720;
  const pts: { d: number; x: number; y: number }[] = [];
  for (let i = 0; i <= samples; i++) {
    const d = (len * i) / samples;
    const p = el.getPointAtLength(d);
    pts.push({ d, x: p.x, y: p.y });
  }
  const ds: number[] = [];
  let floor = 0;
  for (let n = 0; n < ids.length; n++) {
    const v = venues[ids[n]!];
    if (!v) {
      ds.push(ds[ds.length - 1] ?? 0);
      continue;
    }
    let best = floor;
    let bestD = Infinity;
    for (const pt of pts) {
      if (pt.d + 0.5 < floor) continue;
      const dist = Math.hypot(pt.x - v.mx, pt.y - v.my);
      if (dist < bestD) {
        bestD = dist;
        best = pt.d;
      }
    }
    ds.push(best);
    floor = best;
  }
  ds[0] = 0;
  if (ds.length) ds[ds.length - 1] = len;
  return ds;
}

/** Shared year-handoff crop: SoCal porch, not the whole country. */
function porchView(v: Venue | undefined, aspect: number, elW: number) {
  return viewFollow(
    v?.mx ?? 232,
    v?.my ?? 538,
    aspect,
    eventW(elW) * 2.7,
    0.42,
  );
}

function placeOnMap(
  px: number,
  py: number,
  vb: string,
  elW: number,
  elH: number,
) {
  const [x, y, w, h] = vb.split(" ").map(Number);
  if (!w || !h || !elW || !elH) return { left: "50%", top: "50%" };
  const scale = Math.max(elW / w, elH / h);
  const ox = (elW - w * scale) / 2;
  const oy = (elH - h * scale) / 2;
  return {
    left: `${(((ox + (px - x) * scale) / elW) * 100).toFixed(2)}%`,
    top: `${(((oy + (py - y) * scale) / elH) * 100).toFixed(2)}%`,
  };
}

function lerpView(a: string, b: string, t: number) {
  const pa = a.split(" ").map(Number);
  const pb = b.split(" ").map(Number);
  const e = Math.max(0, Math.min(1, t));
  return pa
    .map((v, i) => (v + ((pb[i] ?? v) - v) * e).toFixed(1))
    .join(" ");
}

function spreadPins(stops: Stop[], minDist: number) {
  const pts = stops
    .map((s) => {
      const v = venueOf(s.venueId);
      return v ? { id: v.id, x: v.mx, y: v.my } : null;
    })
    .filter((p): p is { id: string; x: number; y: number } => p !== null);
  for (let n = 0; n < 10; n++) {
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i]!;
        const b = pts[j]!;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.01;
        if (d >= minDist) continue;
        const push = (minDist - d) / 2;
        const ux = dx / d;
        const uy = dy / d;
        a.x -= ux * push;
        a.y -= uy * push;
        b.x += ux * push;
        b.y += uy * push;
      }
    }
  }
  return Object.fromEntries(pts.map((p) => [p.id, p]));
}

function formatMiles(n: number) {
  return n.toLocaleString("en-US");
}

function hopsOf(route: string[]) {
  const miles: number[] = [];
  for (let i = 1; i < route.length; i++) {
    const a = venues[route[i - 1]!];
    const b = venues[route[i]!];
    miles.push(a && b ? Math.max(48, milesBetween(a, b)) : 90);
  }
  return miles;
}

function hopVh(miles: number) {
  return Math.round(Math.min(200, 92 + miles * 0.078));
}

function roadT(raw: number, leave = 0.08, arrive = 0.22) {
  const x = clamp((raw - leave) / (1 - leave - arrive));
  return x * x * (3 - 2 * x);
}

/** 0 at both ends, 1 cruising. Linger on the wide shot, then ease into town. */
function cruise(frac: number) {
  if (frac <= 0 || frac >= 1) return 0;
  if (frac < 0.16) {
    const x = frac / 0.16;
    return x * x * (3 - 2 * x);
  }
  if (frac < 0.36) return 1;
  const x = (frac - 0.36) / 0.64;
  return 1 - x * x;
}

/** Heading along this hop only — never sample the next leg. */
function headingAt(
  el: SVGPathElement,
  d: number,
  len: number,
  dMin = 0,
  dMax = len,
) {
  if (!len) return 0;
  const lo = clamp(Math.min(dMin, dMax), 0, len);
  const hi = clamp(Math.max(dMin, dMax), 0, len);
  const span = Math.max(hi - lo, 1);
  const step = Math.min(24, Math.max(8, span * 0.04));
  const d0 = clamp(d, lo, hi);
  let a: DOMPoint;
  let b: DOMPoint;
  if (d0 + step * 0.4 >= hi) {
    a = el.getPointAtLength(Math.max(lo, hi - step));
    b = el.getPointAtLength(hi);
  } else if (d0 <= lo + step * 0.4) {
    a = el.getPointAtLength(lo);
    b = el.getPointAtLength(Math.min(hi, lo + step));
  } else {
    a = el.getPointAtLength(d0);
    b = el.getPointAtLength(Math.min(hi, d0 + step));
  }
  const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  return Number.isFinite(ang) ? ang : 0;
}

function unwrapHeading(prev: number, next: number) {
  let d = next - prev;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return prev + d;
}

/** Keep the roof up — mirror when the hop heads west so a 3/4 never flips. */
function vanPose(heading: number) {
  let a = heading;
  while (a > 180) a -= 360;
  while (a < -180) a += 360;
  const flip = a > 90 || a < -90;
  const vis = flip ? a - 180 * (a >= 0 ? 1 : -1) : a;
  return { a: vis, flip };
}

/** Year open: hold the porch with the year, then punch into the house. */
function introT(raw: number) {
  const x = clamp((raw - 0.22) / 0.62);
  return x * x * (3 - 2 * x);
}

/** Year close: stay on the house, then breathe out to the porch. */
function closeT(raw: number) {
  const x = clamp((raw - 0.08) / 0.72);
  return x * x * (3 - 2 * x);
}

type Cam = {
  u: number;
  intro: number;
  homeward: number;
  close: number;
};

function mixCam(a: Cam, b: Cam, k: number): Cam {
  return {
    u: a.u + (b.u - a.u) * k,
    intro: a.intro + (b.intro - a.intro) * k,
    homeward: a.homeward + (b.homeward - a.homeward) * k,
    close: a.close + (b.close - a.close) * k,
  };
}

function progressAt(miles: number[], index: number, t: number) {
  const total = miles.reduce((a, b) => a + b, 0) || 1;
  let acc = 0;
  for (let i = 0; i < index; i++) acc += miles[i]!;
  return (acc + clamp(t) * (miles[index] ?? 0)) / total;
}

function segmentAt(miles: number[], u: number) {
  const total = miles.reduce((a, b) => a + b, 0) || 1;
  let acc = 0;
  for (let i = 0; i < miles.length; i++) {
    const span = miles[i]! / total;
    const end = acc + span;
    if (u < end - 1e-6 || i === miles.length - 1) {
      const frac = span > 0 ? clamp((u - acc) / span) : 1;
      return { i0: i, frac };
    }
    acc = end;
  }
  return { i0: Math.max(0, miles.length - 1), frac: 1 };
}

function isMuted(place: string) {
  return place === "DNF" || place === "DNS" || place === "—";
}

function clamp(n: number, a = 0, b = 1) {
  return Math.max(a, Math.min(b, n));
}

export function SeasonStage() {
  const years = useMemo(mappedYears, []);
  return (
    <div className="journey-book">
      {years.map((year, i) => (
        <YearChapter key={year} year={year} years={years} lead={i === 0} />
      ))}
    </div>
  );
}

function YearChapter({
  year,
  years,
  lead,
}: {
  year: number;
  years: number[];
  lead: boolean;
}) {
  const stops = useMemo(() => stopsForYear(year), [year]);
  const route = useMemo(
    () => [...(seasonRoutes[year] ?? ["home"])],
    [year],
  );
  const pathD = useMemo(() => drivePath(route), [route]);
  const returnD = useMemo(() => {
    const last = route[route.length - 1];
    if (!last || last === "home") return "";
    return drivePath([last, "home"]);
  }, [route]);
  const hopMiles = useMemo(() => hopsOf(route), [route]);
  const chapterRef = useRef<HTMLElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const atlasRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const ghostRef = useRef<SVGPathElement>(null);
  const inkRef = useRef<SVGPathElement>(null);
  const returnRef = useRef<SVGPathElement>(null);
  const returnInkRef = useRef<SVGPathElement>(null);
  const vanRef = useRef<HTMLDivElement>(null);
  const pinsRef = useRef<HTMLDivElement>(null);
  const tripRef = useRef<HTMLParagraphElement>(null);
  const tripBarRef = useRef<HTMLElement>(null);
  const driveRef = useRef<number | null>(null);
  const holdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const camRef = useRef<Cam>({
    u: 0,
    intro: lead ? 1 : 0,
    homeward: 0,
    close: 0,
  });
  const activeRef = useRef("home");
  const [aspect, setAspect] = useState(0.72);
  const [atlasW, setAtlasW] = useState(360);
  const [atlasH, setAtlasH] = useState(240);
  const [active, setActive] = useState("home");
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const world = worldRef.current;
    const el = atlasRef.current;
    if (!el) return;
    const sync = () => {
      const vv = window.visualViewport;
      const sceneH = Math.max(
        320,
        Math.round((vv?.height ?? window.innerHeight) - HEADER),
      );
      world?.style.setProperty("--scene-h", `${sceneH}px`);
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        setAspect(r.height / r.width);
        setAtlasW(r.width);
        setAtlasH(r.height);
      } else {
        setAspect(sceneH / Math.max(window.innerWidth, 1));
      }
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync);
    vvListen();
    function vvListen() {
      window.visualViewport?.addEventListener("resize", sync);
      window.visualViewport?.addEventListener("scroll", sync);
    }
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
      window.visualViewport?.removeEventListener("resize", sync);
      window.visualViewport?.removeEventListener("scroll", sync);
    };
  }, []);

  useEffect(() => {
    const chapter = chapterRef.current;
    if (!chapter || !stops.length) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let raf = 0;
    let running = false;
    let dirty = true;
    let stations: number[] | null = null;
    let headingTarget = 0;
    let headingNow = 0;

    const face = (raw: number) => {
      headingTarget = unwrapHeading(headingTarget, raw);
      const gap = headingTarget - headingNow;
      const abs = Math.abs(gap);
      const k = abs > 120 ? 0.08 : abs > 45 ? 0.16 : 0.3;
      headingNow += gap * k;
      return headingNow;
    };

    const focusLine = () => {
      const scene = sceneRef.current?.getBoundingClientRect();
      if (!scene || scene.height < 40) return window.innerHeight * 0.62;
      return scene.top + scene.height * 0.6;
    };

    const rest = (): Cam => ({
      u: 0,
      intro: lead ? 1 : 0,
      homeward: 0,
      close: 0,
    });

    const readTarget = (): Cam => {
      const stopNodes = [
        ...chapter.querySelectorAll<HTMLElement>("[data-stop]"),
      ];
      const hopNodes = [
        ...chapter.querySelectorAll<HTMLElement>("[data-hop]"),
      ];
      const openEl = chapter.querySelector<HTMLElement>("[data-open]");
      const homewardEl =
        chapter.querySelector<HTMLElement>("[data-homeward]");
      const closeEl = chapter.querySelector<HTMLElement>("[data-close]");
      const focusY = focusLine();
      if (!stopNodes.length) return rest();

      if (openEl) {
        const r = openEl.getBoundingClientRect();
        if (focusY < r.bottom - 4) {
          const raw = clamp((focusY - r.top) / Math.max(r.height, 1));
          return { u: 0, intro: introT(raw), homeward: 0, close: 0 };
        }
      }

      if (homewardEl) {
        const hr = homewardEl.getBoundingClientRect();
        if (focusY >= hr.top - 8) {
          if (closeEl) {
            const cr = closeEl.getBoundingClientRect();
            if (focusY >= cr.top) {
              const raw = clamp((focusY - cr.top) / Math.max(cr.height, 1));
              return { u: 1, intro: 1, homeward: 1, close: closeT(raw) };
            }
          }
          const raw = clamp((focusY - hr.top) / Math.max(hr.height, 1));
          return { u: 1, intro: 1, homeward: roadT(raw), close: 0 };
        }
      } else if (closeEl) {
        const cr = closeEl.getBoundingClientRect();
        if (focusY >= cr.top) {
          const raw = clamp((focusY - cr.top) / Math.max(cr.height, 1));
          return { u: 1, intro: 1, homeward: 1, close: closeT(raw) };
        }
      }

      const firstTop = stopNodes[0]!.getBoundingClientRect().top;
      if (focusY < firstTop - 48) {
        return { u: 0, intro: 1, homeward: 0, close: 0 };
      }

      for (let i = 0; i < stopNodes.length; i++) {
        const hop = hopNodes[i];
        const sr = stopNodes[i]!.getBoundingClientRect();
        const hopBottom = hop
          ? hop.getBoundingClientRect().bottom
          : sr.bottom;
        if (focusY > hopBottom && i < stopNodes.length - 1) continue;
        const dwellEnd = sr.bottom + 24;
        if (focusY <= dwellEnd || !hop) {
          return {
            u: progressAt(hopMiles, i, 0),
            intro: 1,
            homeward: 0,
            close: 0,
          };
        }
        const hr = hop.getBoundingClientRect();
        const raw = clamp((focusY - hr.top) / Math.max(hr.height, 1));
        return {
          u: progressAt(hopMiles, i, roadT(raw)),
          intro: 1,
          homeward: 0,
          close: 0,
        };
      }
      return { u: 1, intro: 1, homeward: 0, close: 0 };
    };

    const pointOn = (el: SVGPathElement | null, t: number, fallback: Venue | undefined) => {
      const base = {
        x: fallback?.mx ?? 232,
        y: fallback?.my ?? 538,
        a: 0,
      };
      if (!el) return { ...base, along: 0, len: 0 };
      const len = el.getTotalLength();
      if (!len) return { ...base, along: 0, len: 0 };
      const d = clamp(t) * len;
      const p = el.getPointAtLength(d);
      return {
        x: p.x,
        y: p.y,
        a: headingAt(el, d, len),
        along: d,
        len,
      };
    };

    const paint = (cam: Cam) => {
      const { u, intro, homeward, close } = cam;
      const el = pathRef.current;
      const lastId = route[route.length - 1] ?? "home";
      const homeV = venues.home;
      const lastV = venues[lastId] ?? homeV;
      const atlasBox = atlasRef.current?.getBoundingClientRect();
      const elW = atlasBox?.width || atlasW;
      const elH = atlasBox?.height || elW * aspect;
      const tight = (v: Venue | undefined) =>
        viewFollow(
          v?.mx ?? 232,
          v?.my ?? 538,
          aspect,
          eventW(elW),
          0.4,
        );
      const wide = porchView(homeV, aspect, elW);

      let fromId = route[0] ?? "home";
      let toId = fromId;
      let hereId = fromId;
      let fromVenue = venues[fromId];
      let toVenue = fromVenue;
      let hereVenue = fromVenue;
      let miles = hopMiles[0] ?? 0;
      let frac = 0;
      let eased = 0;
      let van = {
        x: homeV?.mx ?? 232,
        y: homeV?.my ?? 538,
        a: 0,
      };
      let along = 0;
      let hopEnd = 0;
      let pathLen = 0;
      let vb = tight(homeV);
      let phase = "drive";
      let tripFrac = 0;
      let showTrip = false;
      let tripMiles = miles;
      let survey = intro < 0.62 || close > 0.18;

      if (intro < 0.985) {
        phase = "open";
        hereId = "home";
        fromId = "home";
        toId = "home";
        eased = 1 - intro;
        vb = lerpView(wide, tight(homeV), intro);
        const startH = el
          ? headingAt(el, 0, el.getTotalLength() || 0)
          : headingNow;
        van = { x: homeV?.mx ?? 232, y: homeV?.my ?? 538, a: startH };
        survey = intro < 0.62;
        along = 0;
        hopEnd = 0;
      } else if (close > 0.002) {
        phase = "close";
        hereId = "home";
        fromId = "home";
        toId = "home";
        eased = close;
        vb = lerpView(tight(homeV), wide, close);
        const retEl = returnRef.current;
        const endH = retEl
          ? headingAt(retEl, retEl.getTotalLength(), retEl.getTotalLength())
          : headingNow;
        van = { x: homeV?.mx ?? 232, y: homeV?.my ?? 538, a: endH };
        along = 1;
        pathLen = 1;
        hopEnd = 1;
        survey = close > 0.22;
      } else if (homeward > 0.002 && homeV && lastV) {
        phase = "homeward";
        frac = homeward;
        fromId = lastId;
        toId = "home";
        hereId = frac < 0.86 ? lastId : "home";
        fromVenue = lastV;
        toVenue = homeV;
        hereVenue = venues[hereId] ?? homeV;
        miles = Math.max(48, milesBetween(lastV, homeV));
        tripMiles = miles;
        eased = cruise(frac);
        const ret = pointOn(returnRef.current, frac, lastV);
        van = { x: ret.x, y: ret.y, a: ret.a };
        if (frac <= 0.07) {
          const k = 1 - frac / 0.07;
          van.x += (lastV.mx - van.x) * k;
          van.y += (lastV.my - van.y) * k;
        } else if (frac >= 0.93) {
          const k = (frac - 0.93) / 0.07;
          van.x += (homeV.mx - van.x) * k;
          van.y += (homeV.my - van.y) * k;
        }
        const zoom =
          eventW(elW) + (hopW(miles, elW) - eventW(elW)) * eased;
        vb = followCam(
          van.x,
          van.y,
          homeV.mx,
          homeV.my,
          aspect,
          zoom,
          eased,
        );
        along = 1;
        pathLen = 1;
        hopEnd = 1;
        tripFrac = frac;
        showTrip = eased > 0.18;
      } else {
        phase = "drive";
        const seg = segmentAt(hopMiles, u);
        frac = seg.frac;
        const i0 = seg.i0;
        const i1 = Math.min(route.length - 1, i0 + 1);
        fromId = route[i0] ?? route[0] ?? "home";
        toId = route[i1] ?? fromId;
        hereId = frac < 0.86 ? fromId : toId;
        fromVenue = venues[fromId];
        toVenue = venues[toId];
        hereVenue = venues[hereId] ?? fromVenue;
        miles = hopMiles[i0] ?? 200;
        tripMiles = miles;
        eased = cruise(frac);
        let d0 = 0;
        let d1 = 0;
        if (el) {
          pathLen = el.getTotalLength();
          if (pathLen) {
            if (!stations || stations[stations.length - 1] !== pathLen) {
              stations = stationsOnPath(el, route);
            }
            d0 = stations[i0] ?? 0;
            d1 = stations[i1] ?? pathLen;
            hopEnd = d1;
            along = d0 + (d1 - d0) * frac;
            const d = clamp(along, 0, pathLen);
            const p = el.getPointAtLength(d);
            van = {
              x: p.x,
              y: p.y,
              a: headingAt(el, d, pathLen, d0, d1),
            };
          }
        } else {
          const dx = (toVenue?.mx ?? 0) - (fromVenue?.mx ?? 0);
          const dy = (toVenue?.my ?? 0) - (fromVenue?.my ?? 0);
          const fallbackA =
            dx || dy ? (Math.atan2(dy, dx) * 180) / Math.PI : headingNow;
          van = {
            x: fromVenue?.mx ?? 232,
            y: fromVenue?.my ?? 538,
            a: fallbackA,
          };
        }
        if (fromVenue && frac <= 0.07) {
          const k = 1 - frac / 0.07;
          van.x += (fromVenue.mx - van.x) * k;
          van.y += (fromVenue.my - van.y) * k;
          along = d0 + (along - d0) * (frac / 0.07);
        } else if (toVenue && frac >= 0.93) {
          const k = (frac - 0.93) / 0.07;
          van.x += (toVenue.mx - van.x) * k;
          van.y += (toVenue.my - van.y) * k;
          along = along + (d1 - along) * k;
        }
        const zoom =
          eventW(elW) + (hopW(miles, elW) - eventW(elW)) * eased;
        vb = followCam(
          van.x,
          van.y,
          toVenue?.mx ?? van.x,
          toVenue?.my ?? van.y,
          aspect,
          zoom,
          eased,
        );
        tripFrac = frac;
        showTrip = eased > 0.18 && !!toVenue && !!fromVenue;
        survey = false;
      }

      if (svgRef.current) svgRef.current.setAttribute("viewBox", vb);
      if (el && phase === "drive") {
        const len = el.getTotalLength();
        if (len) along = nearestOnPath(el, van.x, van.y, along);
      }
      if (inkRef.current) {
        inkRef.current.removeAttribute("stroke-dasharray");
        inkRef.current.removeAttribute("stroke-dashoffset");
        inkRef.current.removeAttribute("pathLength");
        if (phase === "drive" && el) {
          const len = el.getTotalLength();
          inkRef.current.setAttribute(
            "d",
            len ? traveledD(el, along, van.x, van.y) : "",
          );
          inkRef.current.style.opacity = along > 1 ? "1" : "0";
        } else if (
          (phase === "homeward" || phase === "close") &&
          pathD
        ) {
          inkRef.current.setAttribute("d", pathD);
          inkRef.current.style.opacity = "1";
        } else {
          inkRef.current.setAttribute("d", "");
          inkRef.current.style.opacity = "0";
        }
      }
      if (ghostRef.current && pathD) {
        ghostRef.current.setAttribute("d", pathD);
      }
      if (returnInkRef.current) {
        const src = returnRef.current;
        returnInkRef.current.removeAttribute("stroke-dasharray");
        returnInkRef.current.removeAttribute("stroke-dashoffset");
        returnInkRef.current.removeAttribute("pathLength");
        if (phase === "homeward" && src) {
          const retLen = src.getTotalLength();
          const retAlong = retLen
            ? nearestOnPath(src, van.x, van.y, clamp(frac) * retLen)
            : 0;
          returnInkRef.current.setAttribute(
            "d",
            retLen ? traveledD(src, retAlong, van.x, van.y) : "",
          );
          returnInkRef.current.style.opacity = "1";
        } else if (phase === "close" && returnD) {
          returnInkRef.current.setAttribute("d", returnD);
          returnInkRef.current.style.opacity = "1";
        } else {
          returnInkRef.current.setAttribute("d", "");
          returnInkRef.current.style.opacity = "0";
        }
      }
      if (vanRef.current) {
        const pos = placeOnMap(van.x, van.y, vb, elW, elH);
        const pose = vanPose(face(van.a));
        vanRef.current.style.left = pos.left;
        vanRef.current.style.top = pos.top;
        vanRef.current.style.setProperty("--van-a", `${pose.a.toFixed(1)}deg`);
        vanRef.current.style.setProperty("--van-flip", pose.flip ? "-1" : "1");
        vanRef.current.classList.toggle(
          "is-rolling",
          eased > 0.28 && (phase === "drive" || phase === "homeward"),
        );
      }
      const pinRoot = pinsRef.current;
      if (pinRoot) {
        for (const pin of pinRoot.querySelectorAll<HTMLElement>("[data-pin]")) {
          const px = Number(pin.dataset.x);
          const py = Number(pin.dataset.y);
          const pos = placeOnMap(px, py, vb, elW, elH);
          pin.style.left = pos.left;
          pin.style.top = pos.top;
          const pid = pin.dataset.pin;
          pin.classList.toggle("is-on", !survey && pid === hereId);
          pin.classList.toggle(
            "is-from",
            !survey && pid === fromId,
          );
          pin.classList.toggle(
            "is-to",
            !survey && pid === toId && eased > 0.2,
          );
          pin.classList.toggle(
            "is-dim",
            !survey && pid !== fromId && pid !== toId,
          );
        }
      }

      const focusY = focusLine();
      let maxFocus = 0;
      for (const node of chapter.querySelectorAll<HTMLElement>("[data-stop]")) {
        const card = node.querySelector<HTMLElement>(".journey-stop-card");
        const r = (card ?? node).getBoundingClientRect();
        const mid = (r.top + r.bottom) / 2;
        const range = Math.max(240, r.height * 1.35 + 96);
        const f = clamp(1 - Math.abs(mid - focusY) / range);
        node.style.setProperty("--focus", f.toFixed(3));
        if (f > maxFocus) maxFocus = f;
      }
      const atlas = atlasRef.current;
      const arrive = phase === "drive" && eased < 0.16 && maxFocus > 0.52;
      if (atlas) {
        const blur = reduced || !arrive ? 0 : (maxFocus - 0.52) * 16;
        const dim = !arrive ? 0 : (maxFocus - 0.52) * 0.38;
        atlas.style.setProperty("--map-blur", `${blur.toFixed(2)}px`);
        atlas.style.setProperty("--map-scale", "1");
        atlas.style.setProperty("--map-dim", dim.toFixed(3));
        atlas.classList.toggle("is-deep", arrive);
      }

      if (tripRef.current) {
        if (showTrip && toVenue && fromVenue) {
          tripRef.current.textContent = `${fromVenue.city} → ${toVenue.city}  ·  ~${formatMiles(tripMiles)} mi`;
        } else if (phase === "homeward" && lastV && homeV) {
          tripRef.current.textContent = `${lastV.city} → ${homeV.city}  ·  ~${formatMiles(tripMiles)} mi`;
        }
      }
      if (tripBarRef.current) {
        tripBarRef.current.style.transform = `scaleX(${tripFrac.toFixed(3)})`;
      }
      const tickRoot = chapter.querySelector(".journey-ticks");
      if (tickRoot) {
        for (const tick of tickRoot.querySelectorAll<HTMLElement>("[data-tick]")) {
          tick.classList.toggle("is-on", tick.dataset.tick === hereId);
          tick.classList.toggle(
            "is-to",
            tick.dataset.tick === toId &&
              toId !== hereId &&
              eased > 0.28 &&
              !survey,
          );
        }
      }

      if (activeRef.current !== hereId) {
        activeRef.current = hereId;
        setActive(hereId);
      }

      const world = worldRef.current;
      if (world && chapter) {
        const sceneBox = sceneRef.current?.getBoundingClientRect();
        const live =
          !!sceneBox &&
          sceneBox.top < HEADER + 36 &&
          sceneBox.bottom > HEADER + 100;
        const hide =
          phase === "drive" || phase === "homeward"
            ? clamp((eased - 0.18) / 0.5)
            : phase === "open"
              ? clamp(1 - intro)
              : phase === "close"
                ? clamp(close)
                : 0;
        const driving =
          (phase === "drive" && hide > 0.45 && maxFocus < 0.35) ||
          (phase === "open" && intro < 0.88) ||
          (phase === "close" && close > 0.2) ||
          (phase === "homeward" && hide > 0.45);
        world.classList.toggle("is-live", live);
        world.classList.toggle("is-driving", driving);
        world.style.setProperty("--drive", eased.toFixed(3));
        world.style.setProperty("--drive-hide", hide.toFixed(3));
        world.style.setProperty("--intro", intro.toFixed(3));
        world.style.setProperty("--close", close.toFixed(3));
        world.dataset.here = hereId;
        world.dataset.from = fromId;
        world.dataset.to = toId;
        world.dataset.phase = phase;
        world.dataset.vw = String(Math.round(Number(vb.split(" ")[2]) || 0));
        world.dataset.heading = headingNow.toFixed(1);
        world.dataset.flip = vanPose(headingNow).flip ? "1" : "0";
      }
    };

    const loop = () => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      const target = readTarget();
      const cur = camRef.current;
      const drift =
        Math.abs(target.u - cur.u) +
        Math.abs(target.intro - cur.intro) +
        Math.abs(target.homeward - cur.homeward) +
        Math.abs(target.close - cur.close);
      if (!dirty && drift < 0.0006) return;
      const catchup = reduced ? 1 : drift > 0.2 ? 0.18 : 0.11;
      const next = mixCam(cur, target, catchup);
      camRef.current = next;
      dirty = drift > 0.0012;
      paint(next);
    };

    const onScroll = () => {
      dirty = true;
      const box = chapter.getBoundingClientRect();
      const inView = box.bottom > HEADER && box.top < window.innerHeight;
      if (inView && !running) {
        running = true;
        worldRef.current?.classList.add("is-live");
        raf = requestAnimationFrame(loop);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          worldRef.current?.classList.add("is-live");
          const target = readTarget();
          const cur = camRef.current;
          const jump =
            Math.abs(target.u - cur.u) +
            Math.abs(target.intro - cur.intro) +
            Math.abs(target.homeward - cur.homeward) +
            Math.abs(target.close - cur.close);
          if (jump > 0.55) camRef.current = target;
          if (!running) {
            running = true;
            dirty = true;
            raf = requestAnimationFrame(loop);
          }
        } else {
          running = false;
          cancelAnimationFrame(raf);
          worldRef.current?.classList.remove("is-live", "is-driving");
        }
      },
      { rootMargin: "40% 0px" },
    );
    io.observe(chapter);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    dirty = true;
    running = true;
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [year, pathD, aspect, route, stops, hopMiles, lead]);

  useEffect(
    () => () => {
      if (driveRef.current) cancelAnimationFrame(driveRef.current);
      if (holdRef.current) clearTimeout(holdRef.current);
    },
    [],
  );

  const used = new Set(stops.map((s) => s.venueId));
  const extras = results.filter((r) => r.year === year && !r.venue);
  const leftover = looseBeats(year, used);
  const startAt = venueOf(route[0]) ?? venues.home!;
  const lastId = route[route.length - 1] ?? "home";
  const lastVenue = venueOf(lastId);
  const homeMiles =
    lastId !== "home" && lastVenue && venues.home
      ? milesBetween(lastVenue, venues.home)
      : 0;
  const initVb = lead
    ? viewFollow(
        startAt.mx,
        startAt.my,
        aspect,
        eventW(atlasW || 800),
        0.4,
      )
    : porchView(startAt, aspect, atlasW || 800);
  const iw = Number(initVb.split(" ")[2]) || 800;
  const minDist = atlasW > 0 ? ((2.6 * 16) / atlasW) * (iw || 800) : 70;
  const placed = spreadPins(stops, minDist);

  function pinPct(px: number, py: number) {
    return placeOnMap(px, py, initVb, atlasW, atlasH);
  }

  function cancelDrive() {
    if (driveRef.current) cancelAnimationFrame(driveRef.current);
    driveRef.current = null;
    if (holdRef.current) clearTimeout(holdRef.current);
    holdRef.current = null;
    setPlaying(false);
  }

  function scrollToStop(el: HTMLElement, bias = 0.4) {
    const sceneH =
      sceneRef.current?.getBoundingClientRect().height ||
      window.innerHeight - HEADER;
    const y = Math.max(
      0,
      window.scrollY +
        el.getBoundingClientRect().top -
        (HEADER + sceneH * bias),
    );
    window.scrollTo(0, y);
  }

  function pick(id: string) {
    cancelDrive();
    const el = chapterRef.current?.querySelector<HTMLElement>(
      `[data-stop="${id}"]`,
    );
    if (el) scrollToStop(el);
  }

  function jumpYear(next: number) {
    cancelDrive();
    const chapter = document.getElementById(`season-${next}`);
    if (!chapter) return;
    const open = chapter.querySelector<HTMLElement>("[data-open]");
    const top = window.scrollY + chapter.getBoundingClientRect().top;
    const skip = open ? open.offsetHeight : 0;
    window.scrollTo(0, Math.max(0, top + skip - 12));
  }

  function playSeason() {
    const chapter = chapterRef.current;
    if (!chapter || route.length < 2) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const sceneH =
      sceneRef.current?.getBoundingClientRect().height ||
      window.innerHeight - HEADER;
    const yOf = (el: HTMLElement, bias = 0.42) =>
      window.scrollY +
      el.getBoundingClientRect().top -
      (HEADER + sceneH * bias);
    const stopEls = [
      ...chapter.querySelectorAll<HTMLElement>("[data-stop]"),
    ];
    const closeEl = chapter.querySelector<HTMLElement>("[data-close]");
    const legs: { y: number; travel: number; hold: number }[] = [];
    stopEls.forEach((el, i) => {
      const miles = i === 0 ? 40 : hopMiles[i - 1] ?? 90;
      legs.push({
        y: Math.max(0, yOf(el, 0.4)),
        travel: i === 0 ? 700 : Math.round(1500 + miles * 2.5),
        hold: 1600,
      });
    });
    if (closeEl) {
      const miles =
        lastVenue && venues.home ? milesBetween(lastVenue, venues.home) : 200;
      legs.push({
        y: Math.max(0, yOf(closeEl, 0.52)),
        travel: Math.round(1400 + miles * 2.1),
        hold: 700,
      });
    }
    if (!legs.length) return;
    if (reduced) {
      window.scrollTo(0, legs[legs.length - 1]!.y);
      return;
    }
    cancelDrive();
    setPlaying(true);
    let cancelled = false;
    const onUser = () => {
      cancelled = true;
      cancelDrive();
    };
    window.addEventListener("wheel", onUser, { passive: true, once: true });
    window.addEventListener("touchmove", onUser, { passive: true, once: true });
    window.addEventListener("keydown", onUser, { once: true });
    let i = 0;
    let fromY = window.scrollY;
    const runLeg = () => {
      if (cancelled) return;
      const leg = legs[i];
      if (!leg) {
        driveRef.current = null;
        setPlaying(false);
        return;
      }
      const start = fromY;
      const dest = leg.y;
      const travel = Math.max(320, leg.travel);
      const t0 = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - t0) / travel);
        const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        window.scrollTo(0, start + (dest - start) * e);
        if (t < 1) {
          driveRef.current = requestAnimationFrame(tick);
        } else {
          fromY = dest;
          i += 1;
          holdRef.current = setTimeout(runLeg, leg.hold);
        }
      };
      driveRef.current = requestAnimationFrame(tick);
    };
    runLeg();
  }

  if (!stops.length) return null;

  const lastStop = stops[stops.length - 1];
  const firstStop = stops[0];
  const leaveMiles =
    venues.home && firstStop
      ? milesBetween(venues.home, venueOf(firstStop.venueId) ?? venues.home)
      : 0;

  return (
    <section
      ref={chapterRef}
      id={`season-${year}`}
      className="journey-chapter"
    >
      {lead && lastStop ? (
        <p className="journey-last">
          <span>Last stop</span>
          {" "}
          {lastStop.headline.place}
          {lastStop.headline.unconfirmed ? "*" : ""} {lastStop.headline.event}
        </p>
      ) : null}
      <div
        ref={worldRef}
        className={cn("journey-world", lead && "is-live")}
        style={{ "--intro": lead ? 1 : 0, "--close": 0 } as CSSProperties}
      >
        <div ref={sceneRef} className="journey-scene">
          <div className="journey-bar">
            <div className="journey-bar-id">
              <h2>
                {year}
                <span> season</span>
              </h2>
            </div>
            <div className="journey-bar-tools">
              <div
                className="journey-years"
                role="navigation"
                aria-label="Season"
              >
                {years.map((y) => (
                  <button
                    key={y}
                    type="button"
                    data-on={y === year}
                    aria-pressed={y === year}
                    aria-current={y === year ? "true" : undefined}
                    aria-label={`${y} season`}
                    onClick={() => jumpYear(y)}
                  >
                    {y}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="journey-play"
                onClick={playSeason}
                disabled={playing || route.length < 2}
              >
                {playing ? "Driving…" : "Drive"}
              </button>
            </div>
            <div
              className="journey-ticks"
              role="navigation"
              aria-label={`${year} stops`}
            >
              <button
                type="button"
                data-tick="home"
                aria-label="Home, Lake Elsinore"
                onClick={() => pick("home")}
              >
                Home
              </button>
              {stops.map((s, i) => (
                <button
                  key={s.venueId}
                  type="button"
                  data-tick={s.venueId}
                  aria-label={`${String(i + 1).padStart(2, "0")} ${s.headline.event}`}
                  onClick={() => pick(s.venueId)}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>

          <div className="journey-dash" aria-live="polite">
            <p className="journey-dash-line" ref={tripRef} />
            <span className="journey-dash-track" aria-hidden>
              <i ref={tripBarRef} />
            </span>
          </div>

          {lead ? <p className="journey-cue">Scroll the season</p> : null}

          {!lead ? (
            <div className="journey-yearmark" aria-hidden>
              <p className="index-kicker">
                <em>{year}</em>
                season
              </p>
              <h2>{year}</h2>
              <p>
                {stops.length} {stops.length === 1 ? "race" : "races"}
                {" · "}~{formatMiles(seasonMiles(year))} mi
              </p>
            </div>
          ) : null}

          <div className="journey-yearend" aria-hidden>
            <p>Back home</p>
            <p>{year} in the books</p>
          </div>

          <div ref={atlasRef} className="season-atlas">
            <svg
              ref={svgRef}
              viewBox={initVb}
              className="season-atlas-svg"
              preserveAspectRatio="xMidYMid slice"
              role="img"
              aria-label={`${year} season map`}
            >
              <image
                href="/media/map/atlas.jpg?v=4k"
                x="0"
                y="0"
                width={AW}
                height={AH}
              />
              {pathD ? (
                <path ref={ghostRef} d={pathD} className="jm-ghost" />
              ) : null}
              <path ref={pathRef} d={pathD} fill="none" stroke="none" />
              <path ref={inkRef} className="jm-drive" fill="none" />
              {returnD ? (
                <path ref={returnRef} d={returnD} fill="none" stroke="none" />
              ) : null}
              <path
                ref={returnInkRef}
                className="jm-drive jm-return"
                fill="none"
              />
              {stops.map((s) => {
                const v = venueOf(s.venueId);
                const p = placed[s.venueId];
                if (!v || !p) return null;
                const pulled = Math.hypot(p.x - v.mx, p.y - v.my) > 14;
                return (
                  <g key={`dot-${s.venueId}`}>
                    <circle
                      cx={v.mx}
                      cy={v.my}
                      r="4.5"
                      className="season-dot"
                    />
                    {pulled ? (
                      <line
                        x1={v.mx}
                        y1={v.my}
                        x2={p.x}
                        y2={p.y}
                        className="season-leader"
                      />
                    ) : null}
                  </g>
                );
              })}
              {venues.home ? (
                <circle
                  cx={venues.home.mx}
                  cy={venues.home.my}
                  r="6"
                  className="season-dot"
                  opacity="0.85"
                />
              ) : null}
            </svg>

            <div ref={pinsRef}>
              {stops.map((s, i) => {
                const v = venueOf(s.venueId);
                const p = placed[s.venueId];
                if (!v || !p) return null;
                return (
                  <button
                    key={s.venueId}
                    type="button"
                    data-pin={s.venueId}
                    data-x={p.x}
                    data-y={p.y}
                    className={cn("season-pin", s.venueId === active && "is-on")}
                    style={pinPct(p.x, p.y)}
                    aria-label={`${String(i + 1).padStart(2, "0")} ${s.headline.place} ${s.headline.event}`}
                    onClick={() => pick(s.venueId)}
                  >
                    <span className="season-pin-face">
                      <img
                        src={`/media/map/stamp-${v.stamp}.png`}
                        alt=""
                        width={80}
                        height={80}
                      />
                    </span>
                    <span className="season-pin-n">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
              {venues.home ? (
                <button
                  type="button"
                  data-pin="home"
                  data-x={venues.home.mx}
                  data-y={venues.home.my}
                  className={cn("season-pin is-home", active === "home" && "is-on")}
                  style={pinPct(venues.home.mx, venues.home.my)}
                  aria-label="Home, Lake Elsinore"
                  onClick={() => pick("home")}
                >
                  <span className="season-pin-face">
                    <img
                      src="/media/map/stamp-home.png"
                      alt=""
                      width={80}
                      height={80}
                    />
                  </span>
                  <span className="season-pin-n">H</span>
                </button>
              ) : null}
            </div>

            <div
              ref={vanRef}
              className="season-van is-live"
              style={pinPct(startAt.mx, startAt.my)}
              aria-hidden
            >
              <img src="/media/map/van.png?v=td1" alt="" width={72} height={72} />
            </div>
          </div>
        </div>

        <ol className="journey-reel">
          {!lead ? <li className="journey-open" data-open /> : null}
          {venues.home ? (
            <li
              data-stop="home"
              className={cn(
                "journey-stop journey-home is-first",
                active === "home" && "is-on",
              )}
              aria-current={active === "home" ? "step" : undefined}
            >
              <article className="journey-stop-card is-home">
                <img
                  className="journey-stop-seal"
                  src="/media/map/stamp-home.png"
                  alt=""
                  width={120}
                  height={120}
                />
                <div className="journey-print is-empty">
                  <img
                    src="/media/map/stamp-home.png"
                    alt=""
                    width={140}
                    height={140}
                  />
                </div>
                <div className="journey-stop-copy">
                  <p className="index-kicker">Home</p>
                  <p className="journey-stop-place">Home</p>
                  <h3 className="journey-stop-event">
                    {venues.home.city}, {venues.home.state}
                  </h3>
                  <p className="journey-stop-meta">
                    Start of the {year} season
                    {leaveMiles > 0 && firstStop
                      ? ` · ~${formatMiles(leaveMiles)} mi toward ${venueOf(firstStop.venueId)?.city ?? ""}`
                      : ""}
                  </p>
                </div>
              </article>
            </li>
          ) : null}
          {venues.home && firstStop ? (
            <li
              className="journey-hop"
              data-hop
              style={{ "--hop-h": `${hopVh(leaveMiles)}vh` } as CSSProperties}
            />
          ) : null}
          {stops.map((s, i) => {
            const toward =
              i < stops.length - 1
                ? venueOf(stops[i + 1]!.venueId)
                : undefined;
            const miles =
              toward && venueOf(s.venueId)
                ? milesBetween(venueOf(s.venueId)!, toward)
                : 0;
            return (
              <Fragment key={s.venueId}>
                <StopLog
                  stop={s}
                  index={i}
                  on={s.venueId === active}
                  toward={toward}
                  miles={miles}
                />
                {toward ? (
                  <li
                    className="journey-hop"
                    data-hop
                    style={{ "--hop-h": `${hopVh(miles)}vh` } as CSSProperties}
                  />
                ) : null}
              </Fragment>
            );
          })}
          {homeMiles > 0 ? (
            <li
              className="journey-hop"
              data-homeward
              style={{ "--hop-h": `${hopVh(homeMiles)}vh` } as CSSProperties}
            />
          ) : null}
          <li className="journey-close" data-close />
        </ol>

        {extras.length ? (
          <p className="journey-extra">
            {extras.map((r) => (
              <span key={r.id}>
                {r.place}
                {r.unconfirmed ? "*" : ""} {r.event} · {r.className}
              </span>
            ))}
          </p>
        ) : null}

        {leftover.length ? (
          <ul className="journey-loose">
            {leftover.map((b) => (
              <li key={b.id}>
                <p className="journey-note">
                  <em>{b.label}.</em> {b.line}
                  {b.videoId ? (
                    <>
                      {" "}
                      <a
                        href={youtubeWatch(b.videoId)}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Watch
                      </a>
                    </>
                  ) : null}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

function StopLog({
  stop: s,
  index: i,
  on,
  toward,
  miles,
}: {
  stop: Stop;
  index: number;
  on: boolean;
  toward?: Venue;
  miles: number;
}) {
  const v = venueOf(s.venueId);
  const film = s.headline.videoId;

  return (
    <li
      data-stop={s.venueId}
      className={cn("journey-stop", on && "is-on")}
      aria-current={on ? "step" : undefined}
    >
      <article className="journey-stop-card">
        <img
          className="journey-stop-seal"
          src={`/media/map/stamp-${v?.stamp ?? "home"}.png`}
          alt=""
          width={120}
          height={120}
        />
        {film ? (
          <a
            href={youtubeWatch(film)}
            rel="noreferrer"
            target="_blank"
            className="journey-print"
            aria-label={`Play ${s.headline.event}`}
          >
            <span className="thumb-wrap">
              <img
                src={youtubeThumb(film)}
                alt=""
                width={320}
                height={180}
              />
              <PlayMark />
            </span>
          </a>
        ) : (
          <div className="journey-print is-empty">
            <img
              src={`/media/map/stamp-${v?.stamp ?? "home"}.png`}
              alt=""
              width={140}
              height={140}
            />
          </div>
        )}
        <div className="journey-stop-copy">
          <p className="index-kicker">
            <em>{String(i + 1).padStart(2, "0")}</em>
            {v ? `${v.city}, ${v.state}` : ""}
          </p>
          <p
            className={cn(
              "journey-stop-place",
              isMuted(s.headline.place) && "is-muted",
            )}
          >
            {s.headline.place}
            {s.headline.unconfirmed ? "*" : ""}
          </p>
          <h3 className="journey-stop-event">{s.headline.event}</h3>
          <p className="journey-stop-meta">
            {s.headline.className}
            {s.headline.time ? ` · ${s.headline.time}` : ""}
            {miles > 0 && toward
              ? ` · ~${formatMiles(miles)} mi toward ${toward.city}`
              : ""}
          </p>
          {s.others.length ? (
            <ul className="journey-others">
              {s.others.map((r) => (
                <li key={r.id}>
                  <span>
                    {r.place}
                    {r.unconfirmed ? "*" : ""}
                  </span>{" "}
                  {r.className}
                </li>
              ))}
            </ul>
          ) : null}
          {s.notes.map((b) => (
            <p key={b.id} className="journey-note">
              <em>{b.label}.</em> {b.line}
              {b.videoId ? (
                <>
                  {" "}
                  <a
                    href={youtubeWatch(b.videoId)}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Watch
                  </a>
                </>
              ) : null}
            </p>
          ))}
        </div>
      </article>
    </li>
  );
}
