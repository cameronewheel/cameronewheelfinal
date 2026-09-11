import { cn } from "@/lib/utils";

export function PhotoPrint({
  src,
  alt,
  caption,
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={cn(className)}>
      <div className="photo-card">
        <img src={src} alt={alt} width={2400} height={1600} />
      </div>
      {caption ? (
        <figcaption className="paper-caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
