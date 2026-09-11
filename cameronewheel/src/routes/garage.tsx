import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { PartList } from "@/components/part-list";
import { PhotoPrint } from "@/components/photo-print";
import { Button } from "@/components/ui/button";
import { boards, site, youtubeThumb, youtubeWatch } from "@/lib/site-data";

export const Route = createFileRoute("/garage")({ component: GaragePage });

function GaragePage() {
  return (
    <main className="page-wrap py-10 sm:py-16">
      <PageHero index="02" kicker="Garage" title="Boards I have now">
        Race setup is current. Daily and experiments are stubs until photos and
        specs land. As of {site.updated}.
      </PageHero>

      <div className="mt-12 space-y-8">
        {boards.map((board) => (
          <article key={board.id} className="work-card p-5 sm:p-7">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
              <div>
                {board.photo ? (
                  <PhotoPrint src={board.photo} alt="" />
                ) : board.videoId ? (
                  <a
                    href={youtubeWatch(board.videoId)}
                    rel="noreferrer"
                    target="_blank"
                    className="block overflow-hidden rounded-lg"
                  >
                    <img
                      src={youtubeThumb(board.videoId)}
                      alt=""
                      className="aspect-video w-full object-cover"
                    />
                  </a>
                ) : (
                  <div className="empty-photo">Photo later</div>
                )}
              </div>
              <div>
                <p className="index-kicker">{board.kind}</p>
                <h2 className="mt-3 text-3xl">
                  {board.name}
                  {board.placeholder ? (
                    <span className="ml-2 text-sm font-normal text-subtle">
                      placeholder
                    </span>
                  ) : null}
                </h2>
                <p className="mt-1 text-sm text-subtle">{board.status}</p>
                <p className="mt-4 text-muted">{board.summary}</p>
                {board.how ? (
                  <p className="mt-3 text-sm text-muted">{board.how}</p>
                ) : null}
                {board.videoId ? (
                  <div className="mt-5">
                    <Button asChild variant="outline">
                      <a
                        href={youtubeWatch(board.videoId)}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Watch
                      </a>
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
            {board.parts ? (
              <div className="mt-8 border-t border-border pt-2">
                <PartList parts={board.parts} />
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <p className="mt-12 text-sm text-muted">
        Protective gear lives on{" "}
        <Link
          to="/gear"
          className="font-medium text-fg underline decoration-border underline-offset-4 hover:decoration-fg"
        >
          Gear
        </Link>
        .
      </p>
    </main>
  );
}
