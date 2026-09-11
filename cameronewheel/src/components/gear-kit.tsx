import { useEffect, useId, useState } from "react";
import { RiderFigure } from "@/components/rider-figure";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { kitPacks, kitPieces, type KitPiece } from "@/lib/site-data";

const whenLabel: Record<KitPiece["when"], string> = {
  always: "Always",
  race: "Race day",
  varies: "Depends",
};

type Node = {
  id: string;
  left: string;
  top: string;
  /** Leader origin on the figure, percent of the stage. */
  fx: number;
  fy: number;
};

const nodes: Node[] = [
  { id: "neck", left: "30%", top: "10%", fx: 50, fy: 18 },
  { id: "main", left: "13%", top: "23%", fx: 50, fy: 30 },
  { id: "jacket", left: "87%", top: "23%", fx: 50, fy: 30 },
  { id: "football", left: "11%", top: "38%", fx: 50, fy: 36 },
  { id: "kidney", left: "89%", top: "38%", fx: 50, fy: 40 },
  { id: "demon", left: "8%", top: "50%", fx: 28, fy: 42 },
  { id: "demon", left: "92%", top: "50%", fx: 72, fy: 42 },
  { id: "hips", left: "13%", top: "58%", fx: 42, fy: 50 },
  { id: "race-shell", left: "87%", top: "58%", fx: 58, fy: 50 },
  { id: "scoyco", left: "8%", top: "69%", fx: 42, fy: 66 },
  { id: "scoyco", left: "92%", top: "69%", fx: 58, fy: 66 },
  { id: "d3o-knees", left: "22%", top: "76%", fx: 44, fy: 70 },
  { id: "d3o-knees", left: "78%", top: "76%", fx: 56, fy: 70 },
  { id: "sleeves", left: "8%", top: "82%", fx: 44, fy: 68 },
  { id: "sleeves", left: "92%", top: "82%", fx: 56, fy: 68 },
  { id: "t2", left: "26%", top: "90%", fx: 44, fy: 84 },
  { id: "t2", left: "74%", top: "90%", fx: 56, fy: 84 },
  { id: "ankle-nice", left: "12%", top: "92%", fx: 44, fy: 86 },
  { id: "ankle-nice", left: "88%", top: "92%", fx: 56, fy: 86 },
  { id: "landed", left: "50%", top: "95%", fx: 50, fy: 90 },
];

function pieceById(id: string): KitPiece {
  const piece = kitPieces.find((p) => p.id === id);
  if (!piece) throw new Error(`Missing kit piece ${id}`);
  return piece;
}

export function GearKit() {
  const [openId, setOpenId] = useState<string | null>(null);
  const titleId = useId();
  const open = kitPieces.find((p) => p.id === openId) ?? null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div>
      <p className="index-kicker mb-3">The kit · tap a piece</p>
      <div className="gear-stage">
        <svg
          className="gear-leaders"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {nodes.map((node, i) => {
            const x = Number.parseFloat(node.left);
            const y = Number.parseFloat(node.top);
            return (
              <line
                key={`${node.id}-${i}`}
                x1={node.fx}
                y1={node.fy}
                x2={x}
                y2={y}
                className={cn(openId === node.id && "is-open")}
              />
            );
          })}
        </svg>
        <RiderFigure className="gear-figure" />
        {nodes.map((node, i) => (
          <KitNode
            key={`${node.id}-${i}`}
            node={node}
            piece={pieceById(node.id)}
            active={openId === node.id}
            onOpen={() =>
              setOpenId((cur) => (cur === node.id ? null : node.id))
            }
          />
        ))}
      </div>

      <section className="mt-14">
        <p className="index-kicker">Index</p>
        <h2 className="mt-2 text-3xl">Everything on the plate</h2>
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {kitPieces.map((piece) => (
            <li key={piece.id}>
              <button
                type="button"
                className="flex w-full items-center gap-4 py-3 text-left"
                onClick={() => setOpenId(piece.id)}
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
        <div className="gear-overlay" onClick={() => setOpenId(null)}>
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
                onClick={() => setOpenId(null)}
                aria-label="Close"
              >
                Close
              </button>
            </div>
            <div className="gear-panel-photo mt-5">
              {open.image ? (
                <img src={open.image} alt="" width={640} height={640} />
              ) : (
                <p className="flex h-48 items-center justify-center text-sm text-subtle">
                  Packshot later. Link still works.
                </p>
              )}
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
              <Button type="button" variant="outline" onClick={() => setOpenId(null)}>
                Reset view
              </Button>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function KitNode({
  node,
  piece,
  active,
  onOpen,
}: {
  node: Node;
  piece: KitPiece;
  active: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className={cn("gear-node", active && "is-open")}
      style={{ left: node.left, top: node.top }}
      onClick={onOpen}
      aria-label={piece.name}
    >
      {piece.image ? (
        <img src={piece.image} alt="" width={160} height={160} />
      ) : (
        <span className="gear-node-empty">{piece.name}</span>
      )}
      <span className="gear-node-name">{piece.name}</span>
    </button>
  );
}
