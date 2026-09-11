const zones: { id: string; title: string; d: string }[] = [
  { id: "neck", title: "Neck", d: "M108 72h24v28h-24z" },
  { id: "main", title: "Chest", d: "M88 100h64v70H88z" },
  { id: "jacket", title: "Jacket", d: "M48 108h36v80H48z" },
  { id: "football", title: "Shirt", d: "M156 108h36v80h-36z" },
  { id: "kidney", title: "Kidney belt", d: "M90 168h60v36H90z" },
  { id: "demon", title: "Elbows", d: "M28 168h36v48H28zm148 0h36v48h-36z" },
  { id: "hips", title: "Hips", d: "M88 210h64v50H88z" },
  { id: "d3o-knees", title: "D3O knees", d: "M78 330h36v48H78z" },
  { id: "scoyco", title: "Scoyco", d: "M126 330h36v48h-36z" },
  { id: "t2", title: "Ankles", d: "M80 455h32v40H80zm48 0h32v40h-32z" },
  { id: "landed", title: "Shoes", d: "M72 500h96v28H72z" },
];

export function RiderFigure({
  className,
  activeId,
  onZone,
}: {
  className?: string;
  activeId?: string | null;
  onZone?: (id: string) => void;
}) {
  return (
    <svg
      viewBox="0 0 240 540"
      className={className}
      role="img"
      aria-label="Rider, tap a region"
    >
      {/* skin */}
      <g className="rf-skin">
        <ellipse cx="120" cy="44" rx="20" ry="24" />
        <path d="M110 66c2 12 4 18 10 22 6-4 8-10 10-22" />
        {/* arms 25° */}
        <path d="M78 108c-16 12-30 34-38 58-4 12 6 18 14 12 10-22 22-44 32-58z" />
        <path d="M162 108c16 12 30 34 38 58 4 12-6 18-14 12-10-22-22-44-32-58z" />
        <path d="M42 164c-10 18-16 36-14 52 8 4 16 0 20-10 6-16 12-32 16-44z" />
        <path d="M198 164c10 18 16 36 14 52-8 4-16 0-20-10-6-16-12-32-16-44z" />
        <ellipse cx="30" cy="228" rx="10" ry="13" />
        <ellipse cx="210" cy="228" rx="10" ry="13" />
        {/* legs */}
        <path d="M96 262c-6 28-10 70-8 118 0 36 2 70 6 108 8 4 20 2 24-6-4-40-6-80-4-122 2-36 4-70 4-98z" />
        <path d="M144 262c6 28 10 70 8 118 0 36-2 70-6 108-8 4-20 2-24-6 4-40 6-80 4-122-2-36-4-70-4-98z" />
      </g>

      {/* garment */}
      <path
        className="rf-shirt"
        d="M86 102c10-14 22-22 34-24 12 2 24 10 34 24 8 12 12 40 10 68-2 18-8 32-14 38-8 4-20 6-30 6s-22-2-30-6c-6-6-12-20-14-38-2-28 2-56 10-68Z"
      />
      <path
        className="rf-shorts"
        d="M90 230c6 8 12 22 16 34 7 4 14 6 14 6s7-2 14-6c4-12 10-26 16-34-8-8-22-12-30-12s-22 4-30 12Z"
      />

      {/* ink contour */}
      <g className="rf-ink">
        <ellipse cx="120" cy="44" rx="20" ry="24" />
        <path d="M104 38c6-12 14-16 20-16 8 0 16 6 18 16" />
        <path d="M110 68c2 12 4 16 10 20 6-4 8-8 10-20" />
        <path d="M86 108c-18 14-34 38-42 64" />
        <path d="M154 108c18 14 34 38 42 64" />
        <path d="M46 168c-10 20-16 38-14 54" />
        <path d="M194 168c10 20 16 38 14 54" />
        <ellipse cx="30" cy="228" rx="10" ry="13" />
        <ellipse cx="210" cy="228" rx="10" ry="13" />
        <path d="M96 108c8-16 16-24 24-26 8 2 16 10 24 26" />
        <path d="M88 170c2 28 4 48 2 70" />
        <path d="M152 170c-2 28-4 48-2 70" />
        <path d="M96 262c-6 40-8 90-6 150" />
        <path d="M144 262c6 40 8 90 6 150" />
        <path d="M88 378c6 6 14 8 20 4" />
        <path d="M152 378c-6 6-14 8-20 4" />
        <path d="M90 488c8 4 16 6 22 0" />
        <path d="M150 488c-8 4-16 6-22 0" />
        <path d="M82 518h32" />
        <path d="M126 518h32" />
      </g>

      {/* short hair — not a helmet */}
      <path
        className="rf-hair"
        d="M102 28c6-10 12-14 18-14 8 0 16 5 20 14-8 2-14 2-22 0-6 2-12 2-16 0Z"
      />

      {onZone
        ? zones.map((zone) => (
            <path
              key={zone.id}
              d={zone.d}
              className={activeId === zone.id ? "rider-zone is-on" : "rider-zone"}
              onClick={(e) => {
                e.stopPropagation();
                onZone(zone.id);
              }}
              role="button"
              tabIndex={0}
              aria-label={zone.title}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onZone(zone.id);
                }
              }}
            />
          ))
        : null}
    </svg>
  );
}
