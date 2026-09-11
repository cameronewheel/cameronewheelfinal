import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { kitPacks, kitPieces, type KitPiece } from "@/lib/site-data";

const whenLabel: Record<KitPiece["when"], string> = {
  always: "Always",
  race: "Race day",
  varies: "Depends",
};

type Mode = "suit" | "explode";
type Zone =
  | "neck"
  | "chest"
  | "waist"
  | "elbows"
  | "hips"
  | "knees"
  | "ankles"
  | "feet";

type Layer = {
  key: string;
  pieceId: string;
  zone: Zone;
  worn: string;
  plate: string;
  z: number;
  home: { x: string; y: string; w: string; flip?: boolean };
  peel: { x: number; y: number };
  orbit: { x: string; y: string; w: string } | null;
};

const layers: Layer[] = [
  { key: "shirt", pieceId: "football", zone: "chest", worn: "/kit-worn/shirt.png", plate: "/kit-plate/shirt.png", z: 2, home: { x: "50%", y: "28%", w: "42%" }, peel: { x: 0, y: 10 }, orbit: { x: "16%", y: "36%", w: "22%" } },
  { key: "jacket", pieceId: "jacket", zone: "chest", worn: "/kit-worn/jacket.png", plate: "/kit-plate/jacket.png", z: 3, home: { x: "50%", y: "30%", w: "70%" }, peel: { x: 0, y: -26 }, orbit: { x: "84%", y: "20%", w: "24%" } },
  { key: "bionic", pieceId: "main", zone: "chest", worn: "/kit-worn/chest.png", plate: "/kit-plate/chest.png", z: 4, home: { x: "50%", y: "26%", w: "46%" }, peel: { x: 0, y: -22 }, orbit: { x: "16%", y: "20%", w: "24%" } },
  { key: "neck", pieceId: "neck", zone: "neck", worn: "/kit-worn/neck.png", plate: "/kit-plate/neck.png", z: 8, home: { x: "50%", y: "11%", w: "30%" }, peel: { x: 0, y: -28 }, orbit: { x: "50%", y: "8%", w: "20%" } },
  { key: "kidney", pieceId: "kidney", zone: "waist", worn: "/kit-worn/kidney.png", plate: "/kit-plate/kidney.png", z: 5, home: { x: "50%", y: "40%", w: "48%" }, peel: { x: 18, y: 0 }, orbit: { x: "84%", y: "36%", w: "24%" } },
  { key: "hips", pieceId: "hips", zone: "hips", worn: "/kit-worn/hips.png", plate: "/kit-plate/hips.png", z: 4, home: { x: "50%", y: "50%", w: "36%" }, peel: { x: 0, y: 16 }, orbit: { x: "86%", y: "50%", w: "22%" } },
  { key: "elbow-l", pieceId: "demon", zone: "elbows", worn: "/kit-worn/elbow.png", plate: "/kit-plate/elbow.png", z: 6, home: { x: "22%", y: "36%", w: "16%", flip: true }, peel: { x: -28, y: 0 }, orbit: null },
  { key: "elbow-r", pieceId: "demon", zone: "elbows", worn: "/kit-worn/elbow.png", plate: "/kit-plate/elbow.png", z: 6, home: { x: "78%", y: "36%", w: "16%" }, peel: { x: 28, y: 0 }, orbit: { x: "14%", y: "50%", w: "18%" } },
  { key: "d3o-l", pieceId: "d3o-knees", zone: "knees", worn: "/kit-worn/knees_d3o.png", plate: "/kit-plate/knees_d3o.png", z: 5, home: { x: "37%", y: "66%", w: "18%", flip: true }, peel: { x: -14, y: 0 }, orbit: { x: "16%", y: "66%", w: "18%" } },
  { key: "d3o-r", pieceId: "d3o-knees", zone: "knees", worn: "/kit-worn/knees_d3o.png", plate: "/kit-plate/knees_d3o.png", z: 5, home: { x: "63%", y: "66%", w: "18%" }, peel: { x: 14, y: 0 }, orbit: null },
  { key: "scoyco-l", pieceId: "scoyco", zone: "knees", worn: "/kit-worn/knees_race.png", plate: "/kit-plate/knees_race.png", z: 7, home: { x: "35%", y: "70%", w: "20%", flip: true }, peel: { x: -32, y: 4 }, orbit: null },
  { key: "scoyco-r", pieceId: "scoyco", zone: "knees", worn: "/kit-worn/knees_race.png", plate: "/kit-plate/knees_race.png", z: 7, home: { x: "65%", y: "70%", w: "20%" }, peel: { x: 32, y: 4 }, orbit: { x: "84%", y: "66%", w: "18%" } },
  { key: "ankle-l", pieceId: "t2", zone: "ankles", worn: "/kit-worn/ankles.png", plate: "/kit-plate/ankles.png", z: 6, home: { x: "38%", y: "84%", w: "14%", flip: true }, peel: { x: -12, y: -18 }, orbit: null },
  { key: "ankle-r", pieceId: "t2", zone: "ankles", worn: "/kit-worn/ankles.png", plate: "/kit-plate/ankles.png", z: 6, home: { x: "62%", y: "84%", w: "14%" }, peel: { x: 12, y: -18 }, orbit: { x: "30%", y: "88%", w: "16%" } },
  { key: "shoe-l", pieceId: "landed", zone: "feet", worn: "/kit-worn/shoes.png", plate: "/kit-plate/shoes.png", z: 8, home: { x: "36%", y: "92%", w: "22%", flip: true }, peel: { x: -10, y: 12 }, orbit: null },
  { key: "shoe-r", pieceId: "landed", zone: "feet", worn: "/kit-worn/shoes.png", plate: "/kit-plate/shoes.png", z: 8, home: { x: "64%", y: "92%", w: "22%" }, peel: { x: 10, y: 12 }, orbit: { x: "70%", y: "88%", w: "18%" } },
];

const zoneHits: { zone: Zone; x: string; y: string; w: string; h: string; label: string }[] = [
  { zone: "neck", x: "50%", y: "11%", w: "28%", h: "10%", label: "Neck" },
  { zone: "chest", x: "50%", y: "28%", w: "40%", h: "20%", label: "Chest" },
  { zone: "elbows", x: "18%", y: "34%", w: "18%", h: "14%", label: "Left elbow" },
  { zone: "elbows", x: "82%", y: "34%", w: "18%", h: "14%", label: "Right elbow" },
  { zone: "waist", x: "50%", y: "40%", w: "42%", h: "10%", label: "Waist" },
  { zone: "hips", x: "50%", y: "50%", w: "34%", h: "12%", label: "Hips" },
  { zone: "knees", x: "50%", y: "68%", w: "42%", h: "16%", label: "Knees" },
  { zone: "ankles", x: "50%", y: "84%", w: "36%", h: "8%", label: "Ankles" },
  { zone: "feet", x: "50%", y: "92%", w: "44%", h: "10%", label: "Shoes" },
];

const zoneOrder: Record<Zone, string[]> = {
  neck: ["neck"],
  chest: ["jacket", "main", "football"],
  waist: ["kidney"],
  elbows: ["demon"],
  hips: ["hips"],
  knees: ["scoyco", "d3o-knees"],
  ankles: ["t2"],
  feet: ["landed"],
};

const chipLabel: Record<string, string> = {
  jacket: "Jacket",
  main: "Bionic",
  football: "Shirt",
  neck: "Neck",
  kidney: "Belt",
  demon: "Elbows",
  hips: "Hips",
  scoyco: "Scoyco",
  "d3o-knees": "D3O",
  t2: "Brace",
  landed: "Shoes",
};

function pieceById(id: string): KitPiece {
  const piece = kitPieces.find((p) => p.id === id);
  if (!piece) throw new Error(`Missing kit piece ${id}`);
  return piece;
}

export function KitExploded() {
  const [mode, setMode] = useState<Mode>("suit");
  const [zone, setZone] = useState<Zone | null>(null);
  const [chip, setChip] = useState<string | null>(null);
  const [detail, setDetail] = useState<string | null>(null);
  const titleId = useId();
  const open = kitPieces.find((p) => p.id === detail) ?? null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (detail) setDetail(null);
      else closePeek();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detail]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function closePeek() {
    setZone(null);
    setChip(null);
  }

  function peek(next: Zone) {
    if (mode === "explode") {
      setZone(next);
      setChip(zoneOrder[next][0] ?? null);
      return;
    }
    setMode("suit");
    setZone(next);
    setChip(zoneOrder[next][0] ?? null);
  }

  function explode() {
    setMode("explode");
    closePeek();
  }

  function suitUp() {
    setMode("suit");
    closePeek();
  }

  const inspectorIds = zone ? zoneOrder[zone] : [];

  return (
    <div>
      <p className="index-kicker mb-3">The kit · tap a zone</p>

      <div
        className={cn("gear-stage", mode === "explode" && "is-explode")}
      >
        <GhostScaffold explode={mode === "explode"} />

        {layers.map((layer) => {
          const exploding = mode === "explode";
          const hidden = exploding && !layer.orbit;
          const inZone = zone === layer.zone;
          const dim = Boolean(zone) && !inZone;
          const peeled = mode === "suit" && inZone;
          const lit = chip === layer.pieceId;
          const pos = exploding && layer.orbit ? layer.orbit : layer.home;
          const tx = peeled ? layer.peel.x : 0;
          const ty = peeled ? layer.peel.y : 0;
          return (
            <img
              key={layer.key}
              src={exploding ? layer.plate : layer.worn}
              alt=""
              className={cn(
                "gear-piece",
                hidden && "is-hidden",
                dim && "is-dim",
                lit && "is-lit",
                layer.home.flip && !exploding && "is-flip",
              )}
              style={{
                left: pos.x,
                top: pos.y,
                width: pos.w,
                zIndex: lit ? 12 : layer.z,
                transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px) scaleX(${
                  layer.home.flip && !exploding ? -1 : 1
                })`,
              }}
            />
          );
        })}

        {mode === "suit"
          ? zoneHits.map((hit, i) => (
              <button
                key={`${hit.zone}-${i}`}
                type="button"
                className="gear-hit"
                style={{
                  left: hit.x,
                  top: hit.y,
                  width: hit.w,
                  height: hit.h,
                }}
                aria-label={hit.label}
                onClick={() => peek(hit.zone)}
              />
            ))
          : layers
              .filter((l) => l.orbit)
              .map((layer) => (
                <button
                  key={`orb-${layer.key}`}
                  type="button"
                  className="gear-hit"
                  style={{
                    left: layer.orbit!.x,
                    top: layer.orbit!.y,
                    width: layer.orbit!.w,
                    height: layer.orbit!.w,
                  }}
                  aria-label={pieceById(layer.pieceId).name}
                  onClick={() => peek(layer.zone)}
                />
              ))}
      </div>

      <div className="gear-modes">
        <button
          type="button"
          data-on={mode === "suit"}
          onClick={suitUp}
        >
          Suit up
        </button>
        <button
          type="button"
          data-on={mode === "explode"}
          onClick={explode}
        >
          Explode kit
        </button>
      </div>

      {zone ? (
        <Inspector
          ids={inspectorIds}
          chip={chip}
          onChip={setChip}
          onClose={closePeek}
          onDetail={setDetail}
        />
      ) : null}

      <section className="mt-14">
        <p className="index-kicker">Index</p>
        <h2 className="mt-2 text-3xl">Everything on the plate</h2>
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {kitPieces.map((piece) => (
            <li key={piece.id}>
              <button
                type="button"
                className="flex w-full items-center gap-4 py-3 text-left"
                onClick={() => setDetail(piece.id)}
              >
                {piece.image ? (
                  <img
                    src={piece.image}
                    alt=""
                    width={72}
                    height={72}
                    className="size-14 shrink-0 rounded-md object-contain"
                  />
                ) : (
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-md bg-tint text-[0.65rem] text-subtle">
                    Photo later
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block font-display font-semibold">
                    {piece.name}
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-muted">
                    {piece.covers} · {whenLabel[piece.when]}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <p className="index-kicker">How I pack it</p>
        <h2 className="mt-2 text-3xl">Race / trail / casual</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {kitPacks.map((pack) => (
            <article key={pack.id} className="work-card p-5">
              <p className="index-kicker">{pack.title}</p>
              <p className="mt-2 text-sm text-muted">{pack.line}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-subtle">
          Personal kit, not medical advice.
        </p>
      </section>

      {open ? (
        <div className="gear-overlay" onClick={() => setDetail(null)}>
          <aside
            className="gear-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="index-kicker">{open.brand}</p>
                <h3 id={titleId} className="mt-1 text-2xl">
                  {open.name}
                </h3>
              </div>
              <button
                type="button"
                className="menu-toggle"
                onClick={() => setDetail(null)}
                aria-label="Close"
              >
                Close
              </button>
            </div>
            <div className="gear-panel-photo mt-5">
              <img
                src={
                  layers.find((l) => l.pieceId === open.id)?.plate ??
                  open.image
                }
                alt=""
                width={640}
                height={640}
              />
            </div>
            <dl className="mt-5 grid gap-3 text-sm">
              <div>
                <dt className="index-kicker">Protects</dt>
                <dd className="mt-1">{open.covers}</dd>
              </div>
              <div>
                <dt className="index-kicker">When</dt>
                <dd className="mt-1">{whenLabel[open.when]}</dd>
              </div>
              <div>
                <dt className="index-kicker">Why I run it</dt>
                <dd className="mt-1 text-muted">{open.why}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <a href={open.href} rel="noreferrer sponsored" target="_blank">
                  View product
                </a>
              </Button>
              <Button type="button" variant="outline" onClick={() => setDetail(null)}>
                Close
              </Button>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function Inspector({
  ids,
  chip,
  onChip,
  onClose,
  onDetail,
}: {
  ids: string[];
  chip: string | null;
  onChip: (id: string) => void;
  onClose: () => void;
  onDetail: (id: string) => void;
}) {
  return (
    <div className="gear-inspect" role="dialog" aria-label="Zone kit">
      <div className="flex items-center justify-between gap-3">
        <p className="index-kicker">On this zone</p>
        <button type="button" className="menu-toggle" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {ids.map((id) => (
          <button
            key={id}
            type="button"
            className="gear-chip"
            data-on={chip === id}
            onClick={() => onChip(id)}
          >
            {chipLabel[id] ?? pieceById(id).name}
          </button>
        ))}
      </div>
      <ul className="mt-4 grid gap-3">
        {ids.map((id) => {
          const piece = pieceById(id);
          const layer = layers.find((l) => l.pieceId === id);
          return (
            <li key={id}>
              <button
                type="button"
                className="gear-inspect-row"
                onClick={() => onDetail(id)}
              >
                <img
                  src={layer?.plate ?? piece.image}
                  alt=""
                  width={160}
                  height={160}
                />
                <span>
                  <span className="block font-display font-semibold">
                    {piece.name}
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    {piece.covers} · {whenLabel[piece.when]}
                  </span>
                </span>
              </button>
              <a
                className="mt-2 inline-block text-sm text-action"
                href={piece.href}
                rel="noreferrer sponsored"
                target="_blank"
              >
                View product
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function GhostScaffold({ explode }: { explode: boolean }) {
  return (
    <svg
      viewBox="0 0 200 560"
      className={cn("gear-ghost", explode && "is-explode")}
      aria-hidden
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="100" cy="36" rx="16" ry="20" />
        <path d="M100 56v18" />
        <path d="M78 90c8-10 14-14 22-16 8 2 14 6 22 16" />
        <path d="M64 108c18-8 28-10 36-10s18 2 36 10c8 40 6 70-4 96H68c-10-26-12-56-4-96Z" />
        <path d="M64 118c-16 14-28 36-34 58" />
        <path d="M136 118c16 14 28 36 34 58" />
        <path d="M78 204c4 12 8 24 10 36 6 4 16 6 24 0 2-12 6-24 10-36" />
        <path d="M86 248c-2 48-4 96-2 150" />
        <path d="M114 248c2 48 4 96 2 150" />
        <path d="M80 500h16" />
        <path d="M104 500h16" />
      </g>
    </svg>
  );
}
