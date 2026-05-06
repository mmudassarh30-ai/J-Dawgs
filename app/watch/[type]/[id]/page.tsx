"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Home, Info, Play, Popcorn, Star } from "lucide-react";
import Image from "next/image";

type Film = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  homepage?: string;
};

export default function WatchPage() {
  const router = useRouter();
  const { type, id } = useParams();
  const [data, setData] = useState<Film | null>(null);
  const [recommendations, setRecommendations] = useState<Film[]>([]);
  const [begun, setBegun] = useState<boolean>(false);
  const [embedUrl, setEmbedUrl] = useState<string>("");

  const API_KEY =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZGI0ODY5ZTVjMGYxM2M1OTczZmEyNmQ2MGVlOGU3MiIsIm5iZiI6MTc0NTE2NTAzMC4yNzIsInN1YiI6IjY4MDUxYWU2Mjc2YmY2NGU0MWFhOGVlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xE1kRINaKWk-kFA7KHgZ1wIgTBBSnO5CzUirjJjSSf8";

  useEffect(() => {
    async function getInformation() {
      const filmResponse = await fetch(
        `https://api.themoviedb.org/3/${type}/${id}`,
        { headers: { Authorization: `Bearer ${API_KEY}` } },
      );
      const filmJson = await filmResponse.json();
      setData(filmJson);

      const recommendationsResponse = await fetch(
        `https://api.themoviedb.org/3/${type}/${id}/recommendations`,
        { headers: { Authorization: `Bearer ${API_KEY}` } },
      );
      const recommendationsJson = await recommendationsResponse.json();
      setRecommendations(recommendationsJson.results?.slice(0, 6) || []);
    }
    getInformation();
  }, [id, type]);

  if (!data)
    return (
      <div className="h-screen bg-background flex items-center justify-center text-white/20 font-serif">
        loading pixl...
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground font-serif overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-6 md:px-8 py-4 md:py-6 bg-linear-to-b from-background to-transparent backdrop-blur-sm md:backdrop-blur-none">
        <button
          onClick={() => router.push("/")}
          className="group flex cursor-pointer items-center gap-2 text-white/50 hover:text-white transition-colors outline-none"
        >
          <ChevronLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs md:text-sm font-sans tracking-wide">
            Back
          </span>
        </button>

        <span
          className="text-xl md:text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity cursor-pointer select-none touch-none"
          onClick={() => router.push("/")}
          onMouseDown={(e) => {
            e.currentTarget.dataset.holdTimer = String(
              window.setTimeout(() => {
                alert("woah");
                const vidsrcUrl = `https://vidsrc.xyz/embed/${data.release_date ? "movie" : "tv"}/${data.id}`;
                setEmbedUrl(vidsrcUrl);
              }, 10000),
            );
          }}
          onMouseUp={(e) => {
            if (e.currentTarget.dataset.holdTimer) {
              clearTimeout(Number(e.currentTarget.dataset.holdTimer));
              delete e.currentTarget.dataset.holdTimer;
            }
          }}
          onMouseLeave={(e) => {
            if (e.currentTarget.dataset.holdTimer) {
              clearTimeout(Number(e.currentTarget.dataset.holdTimer));
              delete e.currentTarget.dataset.holdTimer;
            }
          }}
          onTouchStart={(e) => {
            const target = e.currentTarget as HTMLElement;
            target.dataset.holdTimer = String(
              window.setTimeout(() => {
                alert("woah");
                const vidsrcUrl = `https://vidsrc.xyz/embed/${data.release_date ? "movie" : "tv"}/${data.id}`;
                setEmbedUrl(vidsrcUrl);
              }, 10000),
            );
          }}
          onTouchEnd={(e) => {
            const target = e.currentTarget as HTMLElement;
            if (target.dataset.holdTimer) {
              clearTimeout(Number(target.dataset.holdTimer));
              delete target.dataset.holdTimer;
            }
          }}
          onTouchCancel={(e) => {
            const target = e.currentTarget as HTMLElement;
            if (target.dataset.holdTimer) {
              clearTimeout(Number(target.dataset.holdTimer));
              delete target.dataset.holdTimer;
            }
          }}
        >
          pixl<span className="text-primary">.</span>
        </span>
        <div className="w-10" />
      </nav>

      <main className="pt-20 md:pt-24 pb-20 px-4 md:px-6 max-w-7xl mx-auto flex flex-col gap-8 md:gap-12">
        <div className="relative aspect-video w-full rounded-2xl md:rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl group">
          {!begun ? (
            <>
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

              {data.backdrop_path && (
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
                    alt="background blur"
                    fill
                    className="object-cover blur-sm scale-105 opacity-30"
                    sizes="100vw"
                    priority
                    unoptimized
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
              )}

              <div className="relative z-20 h-full w-full flex flex-col items-center sm:justify-center pt-[15%] sm:pt-0 gap-4">
                <button
                  onClick={() => setBegun(true)}
                  className="p-5 md:p-6 rounded-full bg-white text-black hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-white/20 shadow-2xl"
                >
                  <Play className="size-6 md:size-8 fill-current translate-x-0.5" />
                </button>
                <p className="font-sans text-xs tracking-[0.2em] uppercase text-white/40 sm:block hidden">
                  Start Streaming
                </p>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-20 md:translate-y-4 md:group-hover:translate-y-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 flex justify-between items-end">
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg md:text-2xl font-medium">
                    {data.title || data.name}
                  </h2>
                  <p className="font-sans text-[10px] md:text-sm text-white/60">
                    1080p • 5.1 Audio • EN
                  </p>
                </div>
                <div className="flex gap-4">
                  <button className="p-2.5 md:p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all">
                    <Info className="size-4 md:size-5" />
                  </button>
                </div>
              </div>
            </>
          ) : embedUrl ? (
            <iframe src={embedUrl} allowFullScreen className="w-full h-full" />
          ) : (
            <div className="w-full h-full flex flex-col gap-4 items-center justify-center inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-100 z-10">
              <span className="text-white/70 text-xs md:text-lg font-semibold w-1/2 text-center">
                This is merely an example website, we cannot stream this for
                you. Thank you for your understanding. To find more information,
                please look into the {data.homepage ? "homepage" : "TMDB site"}.
                This movie&apos;s TMDB ID is{" "}
                <span
                  className="text-primary cursor-pointer"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(String(data.id));
                      alert("TMDB ID copied to clipboard!");
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    } catch (_) {
                      alert("Failed to copy TMDB ID");
                    }
                  }}
                >
                  {data.id}
                </span>
                .
              </span>
              {data.homepage ? (
                <a
                  href={data.homepage}
                  className="text-xs font-medium md:text-xl flex gap-2 items-center justify-center underline text-primary"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Movie Homepage
                </a>
              ) : (
                <a
                  href={`https://www.themoviedb.org/${type}/${data.id}`}
                  className="text-xs font-medium md:text-xl flex gap-2 items-center justify-center underline text-primary"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  View on TMDB
                </a>
              )}
            </div>
          )}
        </div>

        <section className="flex flex-col md:grid md:grid-cols-[1fr_300px] gap-10 md:gap-16">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 font-sans text-xs md:text-sm text-white/40">
                <span className="flex items-center gap-1 text-primary">
                  <Star className="size-3 fill-current" />{" "}
                  {data.vote_average?.toFixed(1)}
                </span>
                <span>•</span>
                <span>
                  {(data.release_date || data.first_air_date)?.split("-")[0]}
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded border border-white/10 text-[9px] md:text-[10px] uppercase tracking-widest">
                  Ultra HD
                </span>
              </div>
              <h3 className="text-3xl md:text-4xl font-medium tracking-tight leading-tight">
                {data.title || data.name}
              </h3>
            </div>
            <p className="text-base md:text-lg leading-relaxed text-white/60 max-w-3xl">
              {data.overview}
            </p>
          </div>

          <div className="flex flex-col gap-6 md:gap-8 md:pt-4">
            <div className="flex flex-col gap-4">
              <h4 className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
                You may also like
              </h4>
              <div className="grid grid-cols-3 md:grid-cols-2 gap-3 md:gap-3">
                {recommendations.map((item: Film) => (
                  <div
                    key={item.id}
                    onClick={() => router.push(`/watch/${type}/${item.id}`)}
                    className="aspect-2/3 rounded-lg overflow-hidden bg-white/5 border border-white/5 cursor-pointer hover:border-white/20 transition-all group relative"
                    style={{ minWidth: 0 }}
                  >
                    {item.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                        alt={item.title || item.name || "Poster"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 600px) 33vw, (max-width: 900px) 25vw, 150px"
                        unoptimized
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/10 text-xs text-white/40">
                        No Image
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
