 "use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { transposeChordLine, highlightChords } from "@/lib/chords";
import { getApiUrl } from "@/lib/api";

type LyricVariant = {
  language: string;
  script: "original" | "transliteration";
  body: string;
};

type ChordSet = {
  difficulty: "easy" | "advanced";
  key: string;
  body: string;
  language?: string;
};

type Song = {
  _id: string;
  title: string;
  artist?: string;
  primaryLanguage: string;
  categories?: string[];
  difficulty?: string;
  isTamilWithTanglish?: boolean;
  isKannadaWithEnglish?: boolean;
  youtubeUrl?: string;
  pptUrls?: {
    english?: string;
    tamil?: string;
    kannada?: string;
  };
  lyricVariants: LyricVariant[];
  chordSets: ChordSet[];
};

const languageLabels: Record<string, string> = {
  english: "English",
  tamil: "Tamil",
  kannada: "Kannada",
};

export default function SongPage() {
  const params = useParams<{ id: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transpose, setTranspose] = useState(0);
  const [fontSize, setFontSize] = useState(1); // scale: 0.9, 1, 1.1, 1.25
  const [tamilMode, setTamilMode] = useState<"tamil" | "tanglish">("tamil");
  const [kannadaMode, setKannadaMode] = useState<"kannada" | "english">("kannada");

  useEffect(() => {
    async function fetchSong() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          getApiUrl(`/api/songs/${params.id}`)
        );
        if (!res.ok) throw new Error("Song not found");
        const data = await res.json();
        setSong(data);
      } catch (err: any) {
        setError(err.message || "Failed to load song");
      } finally {
        setLoading(false);
      }
    }
    fetchSong();
  }, [params.id]);


  const activeChordSet = useMemo(() => {
    if (!song) return null;

    // For multilingual songs (Tamil/Tanglish or Kannada/English)
    if ((song.primaryLanguage === "tamil" && song.isTamilWithTanglish) ||
        (song.primaryLanguage === "kannada" && song.isKannadaWithEnglish)) {

      const targetLanguage = song.primaryLanguage === "tamil"
        ? (tamilMode === "tanglish" ? "tanglish" : "tamil")
        : (kannadaMode === "english" ? "english" : "kannada");

      // First try to find chords with the specific language
      const languageChord = song.chordSets.find(c => c.language === targetLanguage);
      if (languageChord) return languageChord;

      // Fallback: for legacy songs with multiple chord sets but no language tags,
      // use first chord set for primary language, second for secondary language
      const untaggedChords = song.chordSets.filter(c => !c.language);
      if (untaggedChords.length >= 2) {
        const isSecondary = (song.primaryLanguage === "tamil" && tamilMode === "tanglish") ||
                           (song.primaryLanguage === "kannada" && kannadaMode === "english");
        return untaggedChords[isSecondary ? 1 : 0];
      }

      // If only one chord set exists, use it
      if (untaggedChords.length > 0) return untaggedChords[0];
    }

    // Default behavior for single-language songs
    return song.chordSets[0] || null;
  }, [song, tamilMode, kannadaMode]);

  const displayedChordBody = useMemo(() => {
    if (!activeChordSet) return "";
    if (transpose === 0) return activeChordSet.body;
    return activeChordSet.body
      .split("\n")
      .map((line) => transposeChordLine(line, transpose))
      .join("\n");
  }, [activeChordSet, transpose]);

  const activeLyrics = useMemo(() => {
    if (!song) return "";
    if (song.primaryLanguage === "tamil" && song.isTamilWithTanglish) {
      const targetScript =
        tamilMode === "tanglish" ? "transliteration" : "original";
      const variant = song.lyricVariants.find(
        (v) => v.language === "tamil" && v.script === targetScript
      );
      if (variant) return variant.body;
    }
    if (song.primaryLanguage === "kannada" && song.isKannadaWithEnglish) {
      const targetScript =
        kannadaMode === "english" ? "transliteration" : "original";
      const variant = song.lyricVariants.find(
        (v) => v.language === "kannada" && v.script === targetScript
      );
      if (variant) return variant.body;
    }
    const variant =
      song.lyricVariants.find((v) => v.language === song.primaryLanguage) ||
      song.lyricVariants[0];
    return variant?.body || "";
  }, [song, tamilMode, kannadaMode]);

  const fontScale =
    fontSize === 0.9 ? "text-[13px]" : fontSize === 1.1 ? "text-[17px]" : fontSize === 1.25 ? "text-[19px]" : "text-[15px]";

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-10 md:py-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/60">
              Arise Worship
            </div>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
              {song ? song.title : "Loading…"}
            </h1>
            {song && (
              <p className="mt-1 text-xs text-white/60">
                {song.artist && <span>{song.artist} · </span>}
                {languageLabels[song.primaryLanguage] ||
                  song.primaryLanguage}
                {song.categories?.length
                  ? ` · ${song.categories.join(", ")}`
                  : ""}
              </p>
            )}
          </div>
          <Link
            href="/songs"
            className="rounded-full border border-white/15 bg-white/[0.02] px-3 py-1.5 text-xs text-white/80 hover:border-purple-400/70 hover:bg-purple-500/10 transition-colors"
          >
            All songs
          </Link>
        </header>

        {loading && (
          <p className="mt-10 text-sm text-white/60">Loading song…</p>
        )}
        {error && (
          <p className="mt-10 text-sm text-red-400">
            {error}
          </p>
        )}

        {song && !loading && !error && (
          <>
            {/* Language Toggle for Tamil Songs */}
            {song.primaryLanguage === "tamil" && song.isTamilWithTanglish && (
              <div className="mt-6 flex justify-center">
                <div className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.02] px-1 py-1">
                  <button
                    type="button"
                    onClick={() => setTamilMode("tamil")}
                    className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                      tamilMode === "tamil"
                        ? "bg-white text-black"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    Tamil
                  </button>
                  <button
                    type="button"
                    onClick={() => setTamilMode("tanglish")}
                    className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                      tamilMode === "tanglish"
                        ? "bg-white text-black"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    English (Tanglish)
                  </button>
                </div>
              </div>
            )}

            {/* Language Toggle for Kannada Songs */}
            {song.primaryLanguage === "kannada" && song.isKannadaWithEnglish && (
              <div className="mt-6 flex justify-center">
                <div className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.02] px-1 py-1">
                  <button
                    type="button"
                    onClick={() => setKannadaMode("kannada")}
                    className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                      kannadaMode === "kannada"
                        ? "bg-white text-black"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    Kannada
                  </button>
                  <button
                    type="button"
                    onClick={() => setKannadaMode("english")}
                    className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                      kannadaMode === "english"
                        ? "bg-white text-black"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <section className="space-y-3" id="chords-section">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/60">
                    Chords & Lyrics
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => document.getElementById('lyrics-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="rounded-full border border-white/15 bg-white/[0.02] px-3 py-1 text-xs text-white/60 hover:border-purple-400/70 hover:bg-purple-500/10 transition-colors"
                    >
                      Lyrics ↓
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.02] px-3 py-1">
                  <span className="text-white/60 text-[11px] uppercase tracking-[0.18em]">
                    Transpose
                  </span>
                  <button
                    type="button"
                    onClick={() => setTranspose((t) => t - 1)}
                    className="h-6 w-6 rounded-full bg-white text-black text-xs flex items-center justify-center"
                  >
                    -
                  </button>
                  <div className="text-xs text-white/70 w-10 text-center">
                    {transpose > 0 ? `+${transpose}` : transpose}
                  </div>
                  <button
                    type="button"
                    onClick={() => setTranspose((t) => t + 1)}
                    className="h-6 w-6 rounded-full bg-white text-black text-xs flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.02] px-3 py-1">
                  <span className="text-white/60 text-[11px] uppercase tracking-[0.18em]">
                    Font
                  </span>
                  <button
                    type="button"
                    onClick={() => setFontSize(0.9)}
                    className="h-6 w-6 rounded-full bg-white text-black text-xs flex items-center justify-center"
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize(1)}
                    className="h-6 w-6 rounded-full bg-white text-black text-xs flex items-center justify-center"
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize(1.25)}
                    className="h-6 w-6 rounded-full bg-white text-black text-xs flex items-center justify-center"
                  >
                    A
                  </button>
                </div>

                {/* PPT Download Button */}
                {song.pptUrls && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.02] px-3 py-1">
                    <span className="text-white/60 text-[11px] uppercase tracking-[0.18em]">
                      PPT
                    </span>
                    {song.primaryLanguage === "tamil" && song.isTamilWithTanglish && (
                      <>
                        {song.pptUrls.tamil && (
                          <a
                            href={song.pptUrls.tamil}
                            download
                            className="h-6 w-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center hover:bg-purple-600 transition"
                            title="Download Tamil PPT"
                          >
                            T
                          </a>
                        )}
                        {song.pptUrls.english && (
                          <a
                            href={song.pptUrls.english}
                            download
                            className="h-6 w-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center hover:bg-purple-600 transition"
                            title="Download English PPT"
                          >
                            E
                          </a>
                        )}
                      </>
                    )}
                    {song.primaryLanguage === "kannada" && song.isKannadaWithEnglish && (
                      <>
                        {song.pptUrls.kannada && (
                          <a
                            href={song.pptUrls.kannada}
                            download
                            className="h-6 w-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center hover:bg-purple-600 transition"
                            title="Download Kannada PPT"
                          >
                            K
                          </a>
                        )}
                        {song.pptUrls.english && (
                          <a
                            href={song.pptUrls.english}
                            download
                            className="h-6 w-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center hover:bg-purple-600 transition"
                            title="Download English PPT"
                          >
                            E
                          </a>
                        )}
                      </>
                    )}
                    {song.primaryLanguage === "english" && song.pptUrls.english && (
                      <a
                        href={song.pptUrls.english}
                        download
                        className="h-6 w-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center hover:bg-purple-600 transition"
                        title="Download English PPT"
                      >
                        E
                      </a>
                    )}
                  </div>
                )}
                {song.primaryLanguage === "tamil" &&
                  song.isTamilWithTanglish && (
                    <button
                      type="button"
                      onClick={() =>
                        setTamilMode((m) =>
                          m === "tamil" ? "tanglish" : "tamil"
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-purple-400/60 bg-purple-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-purple-100"
                    >
                      {tamilMode === "tamil" ? "Tamil" : "Tanglish"}
                    </button>
                  )}
              </div>

              <div
                className={`mt-4 whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 leading-relaxed font-mono ${fontScale}`}
              >
                {displayedChordBody ? (
                  displayedChordBody.split("\n").map((line, idx) => (
                    <div key={idx} className="whitespace-pre">
                      {highlightChords(line, `line-${idx}`)}
                    </div>
                  ))
                ) : (
                  <span className="text-white/60">No chords available yet.</span>
                )}
              </div>
            </section>

            <section id="lyrics-section">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/60">
                    Lyrics Only
                  </div>
                  <button
                    onClick={() => document.getElementById('chords-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="rounded-full border border-white/15 bg-white/[0.02] px-3 py-1 text-xs text-white/60 hover:border-purple-400/70 hover:bg-purple-500/10 transition-colors"
                  >
                    Chords ↑
                  </button>
                </div>
                <pre
                  className={`whitespace-pre-wrap leading-relaxed text-white/80 font-medium ${fontScale}`}
                >
                  {activeLyrics || "Lyrics coming soon."}
                </pre>
              </div>
            </section>
          </div>

          {/* YouTube Video Section - at bottom */}
          {song.youtubeUrl && (
            <div className="mt-12">
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/60 mb-3">
                Official Video
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                <iframe
                  src={song.youtubeUrl.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allowFullScreen
                  title={`${song.title} - Official Video`}
                />
              </div>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  );
}



