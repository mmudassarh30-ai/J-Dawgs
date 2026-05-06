"use client";

import { ChevronDown, Dice5, Search, TrendingUp, X } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const API_KEY =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZGI0ODY5ZTVjMGYxM2M1OTczZmEyNmQ2MGVlOGU3MiIsIm5iZiI6MTc0NTE2NTAzMC4yNzIsInN1YiI6IjY4MDUxYWU2Mjc2YmY2NGU0MWFhOGVlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xE1kRINaKWk-kFA7KHgZ1wIgTBBSnO5CzUirjJjSSf8";

  type Movie = {
    id: number;
    title?: string;
    original_name?: string;
    poster_path?: string;
    backdrop_path?: string;
    overview?: string;
    release_date?: string;
    first_air_date?: string;
    vote_average?: number;
  };
  type DisplayList = { movies: Movie[]; tv: Movie[] };
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);
  const [displayList, setDisplayList] = useState<DisplayList>({
    movies: [],
    tv: [],
  });
  const [trending, setTrending] = useState<DisplayList>({ movies: [], tv: [] });
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [dropdownSelection, setDropdownSelection] = useState<
    "Movies" | "TV Shows"
  >("Movies");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [trailerUrl, setTrailerUrl] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedMovie) {
      return;
    }
    const isMovie = !!selectedMovie.title;
    const type = isMovie ? "movie" : "tv";
    fetch(`https://api.themoviedb.org/3/${type}/${selectedMovie.id}/videos`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const trailer = (data.results || []).find(
          (v: { site: string; type: string }) =>
            v.site === "YouTube" && v.type === "Trailer",
        );
        setTrailerUrl(
          trailer ? `https://www.youtube.com/embed/${trailer.key}` : "",
        );
      });
  }, [selectedMovie, API_KEY]);

  useEffect(() => {
    async function getDisplayList() {
      const [mRes, tRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/trending/movie/week`, {
          headers: { Authorization: `Bearer ${API_KEY}` },
        }),
        fetch(`https://api.themoviedb.org/3/trending/tv/week`, {
          headers: { Authorization: `Bearer ${API_KEY}` },
        }),
      ]);
      const mJson = await mRes.json();
      const tJson = await tRes.json();
      setTrending({ movies: mJson.results, tv: tJson.results });
      setDisplayList({ movies: mJson.results, tv: tJson.results });
    }
    getDisplayList();
  }, [API_KEY]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSideMenuOpen(true);
    setSelectedMovie(null);
    setIsSearching(true);
    const query = (e.target as HTMLFormElement)
      .querySelector("input")
      ?.value.trim();
    if (!query) return;

    const [mRes, tRes] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${API_KEY}` } },
      ),
      fetch(
        `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${API_KEY}` } },
      ),
    ]);
    const mData = await mRes.json();
    const tData = await tRes.json();
    const combined = [...(mData.results || []), ...(tData.results || [])];
    setDisplayList({ movies: combined, tv: combined });
  };

  const handleRandomMovie = async () => {
    const randomPage = Math.floor(Math.random() * 25) + 1;
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?page=${randomPage}`,
      { headers: { Authorization: `Bearer ${API_KEY}` } },
    );
    const data = await res.json();
    const movies = data.results || [];
    if (movies.length === 0) return;
    const randomMovie = movies[Math.floor(Math.random() * movies.length)];
    setSelectedMovie(randomMovie);
    setSideMenuOpen(true);
  };

  const desktopWidth = selectedMovie ? "md:mr-[700px]" : "md:mr-[450px]";
  const isPanelOpen = sideMenuOpen || selectedMovie;

  return (
    <div className="flex font-serif w-screen h-screen bg-background text-foreground overflow-hidden relative polka-bg">
      <span className="absolute m-4 opacity-15 bottom-0 text-xl md:text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity cursor-pointer">
        pixl<span className="text-primary">.</span>
      </span>

      {isPanelOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => {
            setSideMenuOpen(false);
            setSelectedMovie(null);
          }}
        />
      )}

      <div
        className={`flex flex-col items-center justify-center flex-1 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isPanelOpen ? desktopWidth : "mr-0"}`}
      >
        <div className="flex flex-col items-center justify-center gap-8 w-full max-w-2xl px-6">
          <h1 className="text-3xl md:text-5xl tracking-tight text-white/90 italic text-center">
            What do you <span className="text-primary">want to</span> watch?
          </h1>

          <div className="w-full bg-border/40 backdrop-blur-md rounded-2xl p-1 shadow-2xl border border-white/10">
            <form onSubmit={handleSearch} className="flex flex-col p-4 gap-4">
              <input
                type="text"
                className="font-sans w-full bg-transparent outline-none text-lg px-2 py-1 placeholder:text-white/20"
                placeholder="Iron Man 3"
              />
              <div className="w-full border-y border-border"></div>
              <div className="flex justify-between items-center w-full px-2">
                <div className="flex gap-5">
                  <button
                    type="button"
                    className="text-white/40 hover:text-white transition-colors cursor-pointer"
                    onClick={handleRandomMovie}
                  >
                    <Dice5 className="size-5" />
                  </button>
                  <button
                    type="button"
                    className={`transition-colors ${sideMenuOpen ? "text-primary" : "text-white/40 hover:text-white"} cursor-pointer`}
                    onClick={() => {
                      setSideMenuOpen(!sideMenuOpen);
                      setSelectedMovie(null);
                    }}
                  >
                    <TrendingUp className="size-5" />
                  </button>
                </div>
                <button
                  type="submit"
                  className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-xl border border-white/5 transition-all cursor-pointer"
                >
                  <Search className="size-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <aside
        className={`
          fixed inset-y-0 right-0 z-50 flex flex-col bg-layer1 border-l border-white/5 
          transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-2xl
          ${isPanelOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
          w-[95%] ${selectedMovie ? "md:w-[750px]" : "md:w-[450px]"}
        `}
      >
        {selectedMovie && sideMenuOpen ? (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-12 zoom-in-95 duration-500 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between px-10 py-6">
              <button
                onClick={() => {
                  setSelectedMovie(null);
                  setTrailerUrl("");
                }}
                className="flex items-center gap-2 text-sm font-sans text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                ← Back to List
              </button>
              <button
                onClick={() => {
                  setSelectedMovie(null);
                  setTrailerUrl("");
                  setSideMenuOpen(false);
                }}
                className="md:hidden text-white/40 cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <div className="px-10 flex flex-col gap-8 pb-16">
              <div className="aspect-video w-full bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden relative shadow-2xl">
                {trailerUrl ? (
                  <iframe
                    src={trailerUrl}
                    title="Trailer"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  <>
                    {selectedMovie.backdrop_path ||
                    selectedMovie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path || selectedMovie.poster_path}`}
                        alt={
                          selectedMovie.title ??
                          selectedMovie.original_name ??
                          "Poster"
                        }
                        fill
                        className="absolute inset-0 w-full h-full object-cover"
                        sizes="(max-width: 750px) 100vw, 750px"
                        priority
                        unoptimized
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
                    <span className="relative z-10 text-xs font-sans text-white/30 uppercase tracking-widest">
                      No Trailer Available
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-6">
                <div className="space-y-2">
                  <h2 className="text-4xl md:text-4xl font-medium tracking-tight leading-tight">
                    {selectedMovie.title ?? selectedMovie.original_name}
                  </h2>
                  <div className="flex items-center gap-4 text-base font-sans text-white/40">
                    <span className="bg-white/10 px-2 py-0.5 rounded-sm text-white/60 text-sm">
                      {
                        (
                          selectedMovie.release_date ??
                          selectedMovie.first_air_date
                        )?.split("-")[0]
                      }
                    </span>
                    <span className="text-yellow-500 opacity-80 -mt-0.5 font-bold">
                      ★ {selectedMovie.vote_average?.toFixed(1)}
                    </span>
                  </div>
                </div>

                <p className="font-sans text-base leading-relaxed text-white/80 max-w-2xl">
                  {selectedMovie.overview}
                </p>

                <a
                  role="button"
                  href={`/watch/${selectedMovie.release_date ? "movie" : "tv"}/${selectedMovie.id}`}
                  className="mt-4 w-full text-center bg-white text-black font-sans font-semibold py-3 rounded-xl hover:bg-white/90 transition-all cursor-pointer shadow-lg active:scale-[0.98]"
                >
                  Watch Now
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="p-8 pb-4 flex justify-between items-start">
              <div className="flex flex-col gap-2">
                {isSearching && (
                  <button
                    onClick={() => {
                      setIsSearching(false);
                      setDisplayList(trending);
                    }}
                    className="text-xs font-sans text-white/40 hover:text-white cursor-pointer"
                  >
                    ← Back to Trending
                  </button>
                )}
                <h2 className="text-2xl font-medium flex gap-2">
                  {isSearching ? "Results" : "Trending"}
                  {!isSearching && (
                    <div className="relative">
                      <span
                        className="text-white/50 flex gap-1 items-center cursor-pointer"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      >
                        {dropdownSelection}{" "}
                        <ChevronDown
                          size={16}
                          className={
                            dropdownOpen
                              ? "rotate-180 transition-transform"
                              : ""
                          }
                        />
                      </span>
                      {dropdownOpen && (
                        <div className="absolute left-0 mt-2 w-40 bg-layer2 border border-white/10 backdrop-blur-sm rounded-lg shadow-2xl z-20 text-xl">
                          {["Movies", "TV Shows"].map((opt) => (
                            <div
                              key={opt}
                              className="px-4 py-2 hover:bg-white/5 cursor-pointer text-white/80"
                              onClick={() => {
                                setDropdownSelection(
                                  opt as "Movies" | "TV Shows",
                                );
                                setDropdownOpen(false);
                              }}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </h2>
              </div>
              <button
                onClick={() => setSideMenuOpen(false)}
                className="md:hidden text-white/40 cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 custom-scrollbar pb-8">
              <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                {(
                  displayList[
                    dropdownSelection === "Movies" ? "movies" : "tv"
                  ] || []
                ).map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => setSelectedMovie(movie)}
                    className="group cursor-pointer flex flex-col gap-3"
                  >
                    <div className="relative overflow-hidden rounded-lg aspect-2/3 border border-white/5 group-hover:border-white/20 transition-all shadow-lg">
                      {movie.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title ?? movie.original_name ?? "Poster"}
                          fill
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 225px) 100vw, 225px"
                          unoptimized
                        />
                      ) : null}
                    </div>
                    <p className="font-sans text-[13px] font-semibold line-clamp-1 text-white/90">
                      {movie.title ?? movie.original_name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
