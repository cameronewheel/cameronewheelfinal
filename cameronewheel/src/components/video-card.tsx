import { PlayMark } from "@/components/play-mark";
import { youtubeThumb, youtubeWatch, type Video } from "@/lib/site-data";

const tags: Record<Video["category"], string> = {
  races: "Race",
  tests: "Board test",
  first: "First ride",
  vesc: "VESC",
};

export function VideoCard({ video }: { video: Video }) {
  return (
    <a
      href={youtubeWatch(video.id)}
      rel="noreferrer"
      target="_blank"
      className="work-card block"
    >
      <div className="thumb-wrap">
        <img
          src={youtubeThumb(video.id)}
          alt=""
          width={640}
          height={360}
        />
        <PlayMark />
        <span className="views-pill">{video.views} views</span>
      </div>
      <div className="p-4">
        <p className="index-kicker">{tags[video.category]}</p>
        <p className="mt-2 font-display text-lg font-semibold leading-snug text-fg">
          {video.title}
        </p>
        <p className="mt-1.5 text-sm text-muted">{video.blurb}</p>
      </div>
    </a>
  );
}
