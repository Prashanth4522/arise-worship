"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

const BIBLE_VERSIONS = [
  { id: "kjv", label: "KJV" },
  { id: "esv", label: "ESV" },
  { id: "niv", label: "NIV" },
];

type Song = {
  _id: string;
  title: string;
  artist?: string;
  primaryLanguage: string;
  categories?: string[];
  views?: number;
  createdAt?: string;
};

type BibleResult = {
  reference: string;
  verses: Array<{ book_name: string; chapter: number; verse: number; text: string }>;
  text?: string;
};

const languageBlocks = [
  { id: "english", label: "English", description: "Modern and classic English worship for bands and teams." },
  { id: "tamil", label: "Tamil / Tanglish", description: "Tamil lyrics with instant Tanglish transliteration toggle." },
  { id: "kannada", label: "Kannada", description: "Regional Kannada worship songs with clear chords." },
];

export default function Home() {
  // Homepage state
  const [latestSongs, setLatestSongs] = useState<Song[]>([]);
  const [popularSongs, setPopularSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  // Unified search state
  const [searchTab, setSearchTab] = useState<"songs" | "bible">("songs");
  const [songQuery, setSongQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [bibleQuery, setBibleQuery] = useState("");
  const [bibleVersion, setBibleVersion] = useState("kjv");
  const [bibleResult, setBibleResult] = useState<BibleResult | null>(null);
  const [bibleLoading, setBibleLoading] = useState(false);
  const [bibleError, setBibleError] = useState<string | null>(null);

  // Load initial lists
  useEffect(() => {
    async function fetchSongs() {
      try {
        const [latestRes, popularRes] = await Promise.all([
          fetch(`${getApiUrl("/api/latest")}?limit=5`),
          fetch(`${getApiUrl("/api/popular")}?limit=5`),
        ]);
        if (latestRes.ok) {
          const latest = await latestRes.json();
          setLatestSongs(latest);
        }
        if (popularRes.ok) {
          const popular = await popularRes.json();
          setPopularSongs(popular);
        }
      } catch (err) {
        console.error("Failed to load songs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSongs();
  }, []);

  // Filter songs for search
  useEffect(() => {
    if (!songQuery.trim()) {
      setFilteredSongs([]);
      return;
    }
    // On any new query, filter both lists together (title/artist/lyric fuzzy search would be best, but just title/artist here)
    const all = [...latestSongs, ...popularSongs];
    const uniq: { [id: string]: Song } = {};
    for (const s of all) uniq[s._id] = s;
    const allUnique = Object.values(uniq);
    const q = songQuery.toLowerCase();
    setFilteredSongs(
      allUnique.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          (s.artist && s.artist.toLowerCase().includes(q))
      )
    );
  }, [songQuery, latestSongs, popularSongs]);

  function handleSongSearch(e: React.FormEvent) {
    e.preventDefault();
    // The filtering is live, so form submit does nothing
  }

  // Bible search
  async function handleBibleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!bibleQuery.trim()) return;
    setBibleLoading(true);
    setBibleError(null);
    setBibleResult(null);
    let query = bibleQuery.trim();
    try {
      if (bibleVersion === "kjv") {
        // bible-api.com
        const url = `https://bible-api.com/${encodeURIComponent(query)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setBibleResult({ reference: data.reference, verses: data.verses });
      } else {
        // Not available in free public API; fallback to KJV
        setBibleError("Only KJV is available for free public Bible search. Showing KJV:");
        const url = `https://bible-api.com/${encodeURIComponent(query)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setBibleResult({ reference: data.reference, verses: data.verses });
      }
    } catch (err: any) {
      setBibleError("Verse not found or unsupported query.");
      setBibleResult(null);
    } finally {
      setBibleLoading(false);
    }
  }

  // Reset when tab changes
  useEffect(() => {
    setSongQuery("");
    setFilteredSongs([]);
    setBibleQuery("");
    setBibleResult(null);
    setBibleError(null);
    setBibleLoading(false);
  }, [searchTab]);

  const languageLabels: Record<string, string> = {
    english: "English",
    tamil: "Tamil",
    kannada: "Kannada",
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 md:px-10 md:py-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/60">
              Arise Worship
            </div>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
              Multilingual Worship Chords
            </h1>
          </div>
          <Link
            href="/admin/login"
            className="rounded-full border border-white/15 bg-white/[0.02] px-3 py-1.5 text-xs text-white/80 hover:border-purple-400/70 hover:bg-purple-500/10 transition-colors"
          >
            Admin
          </Link>
        </header>

        {/* Search Bar */}
        <section className="mt-6 mb-8 w-full flex flex-col items-center">
          <div className="flex justify-center gap-1">
            <button
              className={`px-3 py-1 rounded-t-lg text-xs tracking-wider ${searchTab === "songs" ? "bg-white/10 text-purple-200 font-semibold" : "bg-black text-white/50"}`}
              onClick={() => setSearchTab("songs")}
            >
              Songs
            </button>
            <button
              className={`px-3 py-1 rounded-t-lg text-xs tracking-wider ${searchTab === "bible" ? "bg-white/10 text-purple-200 font-semibold" : "bg-black text-white/50"}`}
              onClick={() => setSearchTab("bible")}
            >
              Bible
            </button>
          </div>
          {searchTab === "songs" && (
            <form onSubmit={handleSongSearch} className="flex items-center gap-2 w-full max-w-md mt-2">
              <input
                type="text"
                placeholder="Search songs by title or artist..."
                value={songQuery}
                onChange={(e) => setSongQuery(e.target.value)}
                className="flex-1 rounded-full border border-white/10 bg-black px-4 py-2 text-sm outline-none ring-0 focus:border-purple-400"
                autoFocus
              />
            </form>
          )}
          {searchTab === "bible" && (
            <form onSubmit={handleBibleSearch} className="flex flex-col items-center gap-2 w-full max-w-md mt-2">
              <div className="flex w-full gap-2">
                <input
                  type="text"
                  placeholder="e.g., John 3:16"
                  value={bibleQuery}
                  onChange={(e) => setBibleQuery(e.target.value)}
                  className="flex-1 rounded-full border border-white/10 bg-black px-4 py-2 text-sm outline-none ring-0 focus:border-purple-400"
                  autoFocus
                />
                <select
                  value={bibleVersion}
                  onChange={(e) => setBibleVersion(e.target.value)}
                  className="rounded-full border border-white/10 bg-black px-3 py-2 text-xs outline-none ring-0 focus:border-purple-400"
                >
                  {BIBLE_VERSIONS.map((v) => (
                    <option key={v.id} value={v.id}>{v.label}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-full bg-purple-700 hover:bg-purple-600 px-4 py-2 text-xs font-semibold text-white"
                  disabled={bibleLoading}
                >
                  {bibleLoading ? "Searching..." : "Search"}
                </button>
              </div>
            </form>
          )}
          {/* Song & Bible search results */}
          <div className="w-full max-w-md mt-2">
            {searchTab === "songs" && songQuery.trim() && (
              <div className="rounded-xl border border-white/5 bg-white/[0.04] divide-y divide-white/10 text-sm mt-2">
                {filteredSongs.length === 0 && (
                  <div className="px-4 py-3 text-xs text-white/60">No matching songs found.</div>
                )}
                {filteredSongs.map((song) => (
                  <Link
                    key={song._id}
                    href={`/songs/${song._id}`}
                    className="block px-4 py-3 hover:bg-purple-800/10 transition-colors"
                  >
                    <div className="font-medium text-sm">{song.title}</div>
                    <div className="mt-0.5 text-[11px] text-white/60">
                      {song.artist && <span>{song.artist} · </span>}
                      {languageLabels[song.primaryLanguage] || song.primaryLanguage}
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {searchTab === "bible" && bibleQuery.trim() && (
              <div className="rounded-xl border border-white/5 bg-white/[0.04] text-sm mt-2 px-4 py-4">
                {bibleLoading && <div className="text-xs text-white/60">Searching...</div>}
                {bibleError && (
                  <div className="text-xs text-red-400 mb-2">{bibleError}</div>
                )}
                {bibleResult && (
                  <div>
                    <div className="text-xs font-medium text-purple-300 mb-1">{bibleResult.reference}</div>
                    {bibleResult.verses
                      ? bibleResult.verses.map((v, i) => (
                          <div key={i} className="text-xs mb-0.5 text-white/95">
                            <span className="text-white/60 mr-1">{v.verse}</span>
                            {v.text.trim()}
                          </div>
                        ))
                      : null}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Latest & Popular Songs */}
        <main className="flex flex-1 flex-col gap-10">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Latest Songs */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                  Latest Songs
                </h2>
                <Link
                  href="/songs"
                  className="text-[10px] text-white/60 hover:text-purple-300 transition-colors"
                >
                  View all →
                </Link>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] divide-y divide-white/5">
                {loading ? (
                  <div className="px-4 py-3 text-xs text-white/60">Loading...</div>
                ) : latestSongs.length > 0 ? (
                  latestSongs.map((song) => (
                    <Link
                      key={song._id}
                      href={`/songs/${song._id}`}
                      className="block px-4 py-3 hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="font-medium text-sm">{song.title}</div>
                      <div className="mt-0.5 text-[11px] text-white/60">
                        {song.artist && <span>{song.artist} · </span>}
                        {languageLabels[song.primaryLanguage] || song.primaryLanguage}
                        {song.categories?.length
                          ? ` · ${song.categories[0]}`
                          : ""}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-3 text-xs text-white/60">
                    No songs yet
                  </div>
                )}
              </div>
            </section>

            {/* Popular Songs */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                  Popular Songs
                </h2>
                <Link
                  href="/songs"
                  className="text-[10px] text-white/60 hover:text-purple-300 transition-colors"
                >
                  View all →
                </Link>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] divide-y divide-white/5">
                {loading ? (
                  <div className="px-4 py-3 text-xs text-white/60">Loading...</div>
                ) : popularSongs.length > 0 ? (
                  popularSongs.map((song) => (
                    <Link
                      key={song._id}
                      href={`/songs/${song._id}`}
                      className="block px-4 py-3 hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{song.title}</div>
                          <div className="mt-0.5 text-[11px] text-white/60">
                            {song.artist && <span>{song.artist} · </span>}
                            {languageLabels[song.primaryLanguage] ||
                              song.primaryLanguage}
                            {song.categories?.length
                              ? ` · ${song.categories[0]}`
                              : ""}
                          </div>
                        </div>
                        {song.views !== undefined && (
                          <div className="text-[10px] text-white/50">
                            {song.views} {song.views === 1 ? "view" : "views"}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-3 text-xs text-white/60">
                    No songs yet
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Language Blocks */}
          <section className="space-y-4 mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
              Browse by Language
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {languageBlocks.map((lang) => (
                <Link
                  key={lang.id}
                  href={`/songs?language=${lang.id}`}
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 hover:border-purple-400/70 hover:bg-purple-500/5 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">
                        {lang.label}
                      </div>
                      <p className="mt-1 text-xs text-white/65">
                        {lang.description}
                      </p>
                    </div>
                    <div className="text-[11px] rounded-full border border-white/10 px-3 py-1 text-white/70 group-hover:border-purple-300/80 group-hover:text-purple-100">
                      Browse
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

