 "use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { getApiUrl } from "@/lib/api";

export default function NewSongPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [primaryLanguage, setPrimaryLanguage] = useState("english");
  const [categories, setCategories] = useState("worship");
  const [difficulty, setDifficulty] = useState("mixed");
  const [isTamilWithTanglish, setIsTamilWithTanglish] = useState(false);
  const [isKannadaWithEnglish, setIsKannadaWithEnglish] = useState(false);

  const [lyricsMain, setLyricsMain] = useState("");
  const [lyricsTanglish, setLyricsTanglish] = useState("");
  const [lyricsKannadaEnglish, setLyricsKannadaEnglish] = useState("");

  // Simplified chord fields
  const [primaryChords, setPrimaryChords] = useState("");
  const [englishChords, setEnglishChords] = useState("");
  const [chordKey, setChordKey] = useState("C");

  // PPT URL fields
  const [pptEnglishUrl, setPptEnglishUrl] = useState("");
  const [pptTamilUrl, setPptTamilUrl] = useState("");
  const [pptKannadaUrl, setPptKannadaUrl] = useState("");

  const [youtubeUrl, setYoutubeUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = window.localStorage.getItem("arise_token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const token = window.localStorage.getItem("arise_token");
    if (!token) {
      setError("Not authenticated.");
      setSaving(false);
      return;
    }

    const lyricVariants: any[] = [];
    if (lyricsMain.trim()) {
      lyricVariants.push({
        language: primaryLanguage === "tamil" ? "tamil" : primaryLanguage,
        script: "original",
        body: lyricsMain,
      });
    }
    if (primaryLanguage === "tamil" && isTamilWithTanglish && lyricsTanglish.trim()) {
      lyricVariants.push({
        language: "tamil",
        script: "transliteration",
        body: lyricsTanglish,
      });
    }
    if (primaryLanguage === "kannada" && isKannadaWithEnglish && lyricsKannadaEnglish.trim()) {
      lyricVariants.push({
        language: "kannada",
        script: "transliteration",
        body: lyricsKannadaEnglish,
      });
    }

    const chordSets: any[] = [];

    // Primary language chords
    if (primaryChords.trim()) {
      chordSets.push({
        difficulty: "easy",
        key: chordKey,
        body: primaryChords,
        language: primaryLanguage
      });
    }

    // English chords (for transliteration/script switching)
    if (englishChords.trim() && (isTamilWithTanglish || isKannadaWithEnglish)) {
      chordSets.push({
        difficulty: "easy",
        key: chordKey,
        body: englishChords,
        language: primaryLanguage === "tamil" ? "tanglish" : "english"
      });
    }

    try {
      const res = await fetch(getApiUrl("/api/songs"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          artist,
          primaryLanguage,
          categories: categories
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean),
          difficulty,
          isTamilWithTanglish: primaryLanguage === "tamil" && isTamilWithTanglish,
          isKannadaWithEnglish: primaryLanguage === "kannada" && isKannadaWithEnglish,
          youtubeUrl: youtubeUrl.trim() || undefined,
          pptUrls: {
            english: pptEnglishUrl.trim() || undefined,
            tamil: pptTamilUrl.trim() || undefined,
            kannada: pptKannadaUrl.trim() || undefined,
          },
          lyricVariants,
          chordSets,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to create song");
      }
      router.push("/admin/songs");
    } catch (err: any) {
      setError(err.message || "Failed to create song");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight text-white">
        New Song
      </h1>
      <p className="mt-1 text-xs text-white/60">
        Add multilingual lyrics and chord sets. Use Tamil + Tanglish when needed.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6 text-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-xs text-white/60">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm outline-none focus:border-purple-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs text-white/60">Artist</label>
            <input
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm outline-none focus:border-purple-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs text-white/60">YouTube URL (optional)</label>
            <input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm outline-none focus:border-purple-400"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white/80">PPT Download Links (optional)</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <label className="block text-xs text-white/60">English PPT URL</label>
              <input
                value={pptEnglishUrl}
                onChange={(e) => setPptEnglishUrl(e.target.value)}
                placeholder="https://example.com/english-ppt.pptx"
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm outline-none focus:border-purple-400"
              />
            </div>
            {(primaryLanguage === "tamil" && isTamilWithTanglish) && (
              <div className="space-y-1.5">
                <label className="block text-xs text-white/60">Tamil PPT URL</label>
                <input
                  value={pptTamilUrl}
                  onChange={(e) => setPptTamilUrl(e.target.value)}
                  placeholder="https://example.com/tamil-ppt.pptx"
                  className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm outline-none focus:border-purple-400"
                />
              </div>
            )}
            {(primaryLanguage === "kannada" && isKannadaWithEnglish) && (
              <div className="space-y-1.5">
                <label className="block text-xs text-white/60">Kannada PPT URL</label>
                <input
                  value={pptKannadaUrl}
                  onChange={(e) => setPptKannadaUrl(e.target.value)}
                  placeholder="https://example.com/kannada-ppt.pptx"
                  className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm outline-none focus:border-purple-400"
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <label className="block text-xs text-white/60">Primary language</label>
            <select
              value={primaryLanguage}
              onChange={(e) => setPrimaryLanguage(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm outline-none focus:border-purple-400"
            >
              <option value="english">English</option>
              <option value="tamil">Tamil</option>
              <option value="kannada">Kannada</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs text-white/60">Categories</label>
            <input
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm outline-none focus:border-purple-400"
              placeholder="worship,praise,slow"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs text-white/60">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm outline-none focus:border-purple-400"
            >
              <option value="easy">Easy</option>
              <option value="advanced">Advanced</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </div>

        {primaryLanguage === "tamil" && (
          <label className="inline-flex items-center gap-2 text-xs text-white/70">
            <input
              type="checkbox"
              checked={isTamilWithTanglish}
              onChange={(e) => setIsTamilWithTanglish(e.target.checked)}
              className="h-3 w-3 rounded border-white/40 bg-black"
            />
            Tamil + Tanglish lyrics
          </label>
        )}

        {primaryLanguage === "kannada" && (
          <label className="inline-flex items-center gap-2 text-xs text-white/70">
            <input
              type="checkbox"
              checked={isKannadaWithEnglish}
              onChange={(e) => setIsKannadaWithEnglish(e.target.checked)}
              className="h-3 w-3 rounded border-white/40 bg-black"
            />
            Kannada + English lyrics
          </label>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-xs text-white/60">
              {primaryLanguage === "tamil" ? "Tamil lyrics" : "Lyrics"}
            </label>
            <textarea
              value={lyricsMain}
              onChange={(e) => setLyricsMain(e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm outline-none focus:border-purple-400"
            />
          </div>
          {primaryLanguage === "tamil" && isTamilWithTanglish && (
            <div className="space-y-1.5">
              <label className="block text-xs text-white/60">
                Tanglish lyrics
              </label>
              <textarea
                value={lyricsTanglish}
                onChange={(e) => setLyricsTanglish(e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm outline-none focus:border-purple-400"
              />
            </div>
          )}
          {primaryLanguage === "kannada" && isKannadaWithEnglish && (
            <div className="space-y-1.5">
              <label className="block text-xs text-white/60">
                English lyrics
              </label>
              <textarea
                value={lyricsKannadaEnglish}
                onChange={(e) => setLyricsKannadaEnglish(e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm outline-none focus:border-purple-400"
              />
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-xs text-white/60">
              {primaryLanguage === "tamil" ? "Tamil Chords" : primaryLanguage === "kannada" ? "Kannada Chords" : "Chords"}
            </label>
            <div className="flex gap-2">
              <input
                value={chordKey}
                onChange={(e) => setChordKey(e.target.value)}
                className="w-16 rounded-lg border border-white/10 bg-black px-2 py-2 text-xs outline-none focus:border-purple-400"
                placeholder="Key"
              />
              <textarea
                value={primaryChords}
                onChange={(e) => setPrimaryChords(e.target.value)}
                rows={5}
                placeholder={`${primaryLanguage} lyrics with chords...`}
                className="flex-1 rounded-lg border border-white/10 bg-black px-3 py-2 text-sm outline-none focus:border-purple-400"
              />
            </div>
          </div>

          {(primaryLanguage === "tamil" && isTamilWithTanglish) ||
          (primaryLanguage === "kannada" && isKannadaWithEnglish) ? (
            <div className="space-y-1.5">
              <label className="block text-xs text-white/60">
                English Chords
              </label>
              <textarea
                value={englishChords}
                onChange={(e) => setEnglishChords(e.target.value)}
                rows={5}
                placeholder="English lyrics with chords..."
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm outline-none focus:border-purple-400"
              />
            </div>
          ) : null}
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/songs")}
            className="rounded-full border border-white/20 bg-black px-4 py-2 text-xs text-white/80 hover:border-white/40"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-white px-5 py-2 text-xs font-medium text-black hover:bg-purple-200 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save song"}
          </button>
        </div>
      </form>
    </div>
  );
}


