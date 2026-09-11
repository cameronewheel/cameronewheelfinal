import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  milesBetween,
  seasonMiles,
  seasonRoutes,
  venueOf,
  venues,
  type Venue,
} from "@/lib/venues";

export type MapFocus = { year: number; venue: string };

const DEFAULT: MapFocus = { year: 2026, venue: "nwef" };
const AW = 1600;
const AH = 900;
const YEARS = [2026, 2025, 2024] as const;

function drivePath(ids: string[]) {
  const pts = ids
    .map((id) => venues[id])
    .filter(Boolean) as Venue[];
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

function formatMiles(n: number) {
  return n.toLocaleString("en-US");
}

function viewAround(ids: string[]): string {
  const pts = ids.map((id) => venues[id]).filter(Boolean) as Venue[];
  if (!pts.length) return `0 0 ${AW} ${AH}`;
  let minX = Math.min(...pts.map((p) => p.mx));
  let maxX = Math.max(...pts.map((p) => p.mx));
  let minY = Math.min(...pts.map((p) => p.my));
  let maxY = Math.max(...pts.map((p) => p.my));
  const aspect = AH / AW;
  let w = Math.max(maxX - minX + 320, 820);
  let h = w * aspect;
  if (maxY - minY + 240 > h) {
    h = maxY - minY + 240;
    w = h / aspect;
  }
  let x = (minX + maxX) / 2 - w / 2;
  let y = (minY + maxY) / 2 - h / 2;
  x = Math.max(0, Math.min(AW - w, x));
  y = Math.max(0, Math.min(AH - h, y));
  return `${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`;
}

function lerpView(a: string, b: string, t: number) {
  const pa = a.split(" ").map(Number);
  const pb = b.split(" ").map(Number);
  return pa.map((v, i) => v + ((pb[i] ?? v) - v) * t).join(" ");
}

export function JourneyMap({
  year,
  venue,
  onPick,
  onYear,
  onCue,
}: MapFocus & {
  onPick?: (venue: string) => void;
  onYear?: (year: number) => void;
  onCue?: (venue: string) => void;
}) {
  const route = seasonRoutes[year] ?? ["home"];
  const here = venueOf(venue) ?? venues.home!;
  const idx = Math.max(0, route.indexOf(here.id));
  const traveled = route.slice(0, idx + 1);
  const prev = idx > 0 ? venueOf(route[idx - 1]) : undefined;
  const hop = prev ? milesBetween(prev, here) : 0;
  const pathD = useMemo(() => drivePath(route), [year]);
  const goneD = useMemo(() => drivePath(traveled), [year, venue]);
  const targetVb = useMemo(() => viewAround(route), [year]);

  const pathRef = useRef<SVGPathElement>(null);
  const [vb, setVb] = useState(`0 0 ${AW} ${AH}`);
  const [van, setVan] = useState({ x: here.mx, y: here.my, a: 0 });
  const [hover, setHover] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const playRef = useRef<number | null>(null);

  useEffect(() => {
    let raf = 0;
    const from = vb;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / 700);
      const e = 1 - (1 - t) ** 3;
      setVb(lerpView(from, targetVb, e));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetVb]);

  useEffect(() => {
    if (playing) return;
    const el = pathRef.current;
    if (!el || !pathD) {
      setVan({ x: here.mx, y: here.my, a: 0 });
      return;
    }
    const total = el.getTotalLength();
    const frac = route.length < 2 ? 0 : idx / (route.length - 1);
    const d = total * frac;
    const p = el.getPointAtLength(d);
    const p2 = el.getPointAtLength(Math.min(total, d + 6));
    const a = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
    setVan({ x: p.x, y: p.y, a: Number.isFinite(a) ? a : 0 });
  }, [pathD, idx, here.mx, here.my, route.length, playing]);

  function playSeason() {
    const el = pathRef.current;
    if (!el || !pathD || route.length < 2) return;
    const len = el.getTotalLength();
    if (!len) return;
    setPlaying(true);
    const t0 = performance.now();
    const dur = 3800 + route.length * 320;
    let lastStop = -1;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      const d = e * len;
      const p = el.getPointAtLength(d);
      const p2 = el.getPointAtLength(Math.min(len, d + 10));
      const a = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
      setVan({ x: p.x, y: p.y, a });
      const stop = Math.round(e * (route.length - 1));
      if (stop !== lastStop) {
        lastStop = stop;
        const id = route[stop];
        if (id) (onCue ?? onPick)?.(id);
      }
      if (t < 1) playRef.current = requestAnimationFrame(step);
      else setPlaying(false);
    };
    if (playRef.current) cancelAnimationFrame(playRef.current);
    playRef.current = requestAnimationFrame(step);
  }

  useEffect(
    () => () => {
      if (playRef.current) cancelAnimationFrame(playRef.current);
    },
    [],
  );

  const shown = hover ? venueOf(hover) ?? here : here;

  return (
    <figure className="journey-map">
      <div className="journey-map-stage">
        <svg
          viewBox={vb}
          className="journey-map-svg"
          role="img"
          aria-label={`${here.short}, ${here.city}`}
        >
          <image
            href="/media/map/atlas.jpg"
            x="0"
            y="0"
            width={AW}
            height={AH}
            preserveAspectRatio="xMidYMid slice"
          />
          {pathD ? (
            <path d={pathD} className="jm-ghost" />
          ) : null}
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="none"
            pointerEvents="none"
          />
          {goneD ? <path d={goneD} className="jm-drive" /> : null}

          {route.map((id) => {
            const v = venues[id];
            if (!v) return null;
            const on = v.id === here.id;
            const hot = v.id === hover;
            const done = route.indexOf(id) <= idx;
            const size = on ? 92 : hot ? 78 : 62;
            return (
              <g
                key={`${year}-${id}`}
                transform={`translate(${v.mx} ${v.my})`}
                className="jm-hit"
                role="button"
                tabIndex={0}
                onMouseEnter={() => setHover(id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onPick?.(id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onPick?.(id);
                }}
              >
                <circle
                  r={size / 2 + 6}
                  className={
                    on ? "jm-ring is-on" : done ? "jm-ring is-done" : "jm-ring"
                  }
                />
                <image
                  href={`/media/map/stamp-${v.stamp}.png`}
                  x={-size / 2}
                  y={-size / 2}
                  width={size}
                  height={size}
                />
              </g>
            );
          })}

          <g
            className={playing ? "jm-van is-live" : "jm-van"}
            style={{
              transform: `translate(${van.x}px, ${van.y}px) rotate(${van.a}deg)`,
            }}
          >
            <image
              href="/media/map/van.png"
              x="-28"
              y="-28"
              width="56"
              height="56"
            />
          </g>
        </svg>

        <div className="journey-map-hud">
          <div className="journey-years">
            {YEARS.map((y) => (
              <button
                key={y}
                type="button"
                data-on={y === year}
                onClick={() => onYear?.(y)}
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
            {playing ? "Driving…" : "Drive season"}
          </button>
        </div>
      </div>

      <figcaption className="journey-map-cap">
        <div className="journey-map-stamp">
          <img
            src={`/media/map/stamp-${shown.stamp}.png`}
            alt=""
            width={72}
            height={72}
          />
        </div>
        <div>
          <p className="index-kicker">
            {year === 2022 ? "Earlier" : year} · {shown.short}
          </p>
          <p className="journey-map-where">
            {prev && shown.id === here.id ? (
              <>
                {prev.city} → {shown.city}
              </>
            ) : (
              shown.city
            )}
          </p>
          <p className="journey-map-meta">
            {shown.name} · {shown.state}
            {hop > 0 && shown.id === here.id
              ? ` · ~${formatMiles(hop)} mi hop`
              : ""}
            {" · "}
            ~{formatMiles(seasonMiles(year))} mi season
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

export function JourneyTrack({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<MapFocus>(DEFAULT);

  useEffect(() => {
    const wrap = root.current;
    if (!wrap) return;
    const nodes = [...wrap.querySelectorAll<HTMLElement>("[data-journey]")];
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0]?.target as HTMLElement | undefined;
        if (!top?.dataset.journey) return;
        const [year, venue] = top.dataset.journey.split(":");
        if (!year || !venue) return;
        setFocus({ year: Number(year), venue });
      },
      { rootMargin: "-18% 0px -58% 0px", threshold: [0.15, 0.4, 0.7] },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  function pick(id: string, year = focus.year) {
    setFocus({ year, venue: id });
    const el = root.current?.querySelector(`[data-journey="${year}:${id}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function pickYear(year: number) {
    const route = seasonRoutes[year] ?? ["home"];
    const venue = route[route.length - 1] ?? "home";
    pick(venue, year);
  }

  return (
    <div ref={root} className="journey-shell">
      <div className="journey-map-col">
        <JourneyMap
          year={focus.year}
          venue={focus.venue}
          onPick={(id) => pick(id)}
          onCue={(id) => setFocus((f) => ({ ...f, venue: id }))}
          onYear={pickYear}
        />
      </div>
      <div className="journey-copy">{children}</div>
    </div>
  );
}
