 "use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getApiUrl } from "@/lib/api";

type Song = {
  _id: string;
  title: string;
  primaryLanguage: string;
  categories?: string[];
  difficulty?: string;
};

const languageLabels: Record<string, string> = {
  english: "English",
  tamil: "Tamil / Tanglish",
  kannada: "Kannada / English",
};

function SongsListContent() {
  const searchParams = useSearchParams();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [difficulty, setDifficulty] = useState("");

  const language = searchParams.get("language") || "";

  useEffect(() => {
    async function fetchSongs() {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (language) params.set("language", language);
      if (query) params.set("q", query);
      if (difficulty) params.set("difficulty", difficulty);
      try {
        const res = await fetch(
          `${getApiUrl("/api/songs")}?${params.toString()}`
        );
        if (!res.ok) throw new Error("Failed to load songs");
        const data = await res.json();
        setSongs(data);
      } catch (err: any) {
        setError(err.message || "Failed to load songs");
      } finally {
        setLoading(false);
      }
    }
    fetchSongs();
  }, [language, query, difficulty]);

  const languageLabel =
    languageLabels[language] || (language ? language : "All languages");

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-10 md:py-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/60">
              Arise Worship
            </div>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
              {languageLabel} Songs
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-white/15 bg-white/[0.02] px-3 py-1.5 text-xs text-white/80 hover:border-purple-400/70 hover:bg-purple-500/10 transition-colors"
          >
            Home
          </Link>
        </header>

        <section className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 gap-2">
            <input
              type="text"
              placeholder="Search songs…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-full border border-white/10 bg-black px-4 py-2 text-sm outline-none ring-0 focus:border-purple-400"
            />
          </div>
          <div className="flex gap-2 text-xs">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="rounded-full border border-white/10 bg-black px-3 py-1.5 text-xs outline-none ring-0 focus:border-purple-400"
            >
              <option value="">All difficulty</option>
              <option value="easy">Easy</option>
              <option value="advanced">Advanced</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </section>

        {/* Language Toggle for Tamil Songs */}
        {language === "tamil" && (
          <section className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.02] px-1 py-1">
              <Link
                href="/songs?language=tamil"
                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                  !searchParams.get("script") || searchParams.get("script") === "tamil"
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Tamil
              </Link>
              <Link
                href="/songs?language=tamil&script=tanglish"
                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                  searchParams.get("script") === "tanglish"
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                English (Tanglish)
              </Link>
            </div>
          </section>
        )}

        {/* Language Toggle for Kannada Songs */}
        {language === "kannada" && (
          <section className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.02] px-1 py-1">
              <Link
                href="/songs?language=kannada"
                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                  !searchParams.get("script") || searchParams.get("script") === "kannada"
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Kannada
              </Link>
              <Link
                href="/songs?language=kannada&script=english"
                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                  searchParams.get("script") === "english"
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                English
              </Link>
            </div>
          </section>
        )}

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02]">
          {loading && (
            <div className="px-4 py-4 text-sm text-white/60">Loading…</div>
          )}
          {error && (
            <div className="px-4 py-4 text-sm text-red-400 border-b border-white/10">
              {error}
            </div>
          )}
          {!loading && !error && (
            <ul className="divide-y divide-white/5 text-sm">
              {songs.map((song) => (
                <li key={song._id}>
                  <Link
                    href={`/songs/${song._id}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.03]"
                  >
                    <div>
                      <div className="font-medium">{song.title}</div>
                      <div className="mt-0.5 text-[11px] text-white/60">
                        {languageLabels[song.primaryLanguage] ||
                          song.primaryLanguage}
                        {song.categories?.length
                          ? ` · ${song.categories.join(", ")}`
                          : ""}
                      </div>
                    </div>
                    <div className="text-[11px] text-white/60 uppercase tracking-[0.18em]">
                      {song.difficulty || "MIXED"}
                    </div>
                  </Link>
                </li>
              ))}
              {songs.length === 0 && (
                <li className="px-4 py-4 text-sm text-white/60">
                  No songs found yet.
                </li>
              )}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function SongsListFallback() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-white/60">Loading…</div>
    </div>
  );
}

export default function SongsListPage() {
  return (
    <Suspense fallback={<SongsListFallback />}>
      <SongsListContent />
    </Suspense>
  );
}


