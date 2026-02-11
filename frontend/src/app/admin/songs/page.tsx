 "use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/api";
import Link from "next/link";

type Song = {
  _id: string;
  title: string;
  primaryLanguage: string;
  categories?: string[];
  difficulty?: string;
};

export default function AdminSongs() {
  const router = useRouter();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadSongs() {
    const token = window.localStorage.getItem("arise_token");
    if (!token) {
      setError("Not authenticated. Please log in.");
      setLoading(false);
      return;
    }
    try {
        const res = await fetch(getApiUrl("/api/songs"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to load songs");
      }
      const data = await res.json();
      setSongs(data);
    } catch (err: any) {
      setError(err.message || "Failed to load songs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = window.localStorage.getItem("arise_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    loadSongs();
  }, [router]);

  async function handleDelete(id: string) {
    const token = window.localStorage.getItem("arise_token");
    if (!token) return;
    if (!window.confirm("Delete this song? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(getApiUrl(`/api/songs/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete song");
      }
      setSongs((prev) => prev.filter((s) => s._id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete song");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Songs
          </h1>
          <p className="mt-1 text-xs text-white/60">
            View and manage multilingual worship songs.
          </p>
        </div>
        <Link
          href="/admin/songs/new"
          className="rounded-full bg-white px-4 py-2 text-xs font-medium text-black hover:bg-purple-200"
        >
          New song
        </Link>
      </div>
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02]">
        {loading && (
          <div className="px-4 py-4 text-sm text-white/60">Loading songs…</div>
        )}
        {error && (
          <div className="px-4 py-4 text-sm text-red-400 border-b border-white/10">
            {error}
          </div>
        )}
        {!loading && !error && (
          <table className="w-full text-xs md:text-sm">
            <thead className="border-b border-white/10 text-white/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium">Language</th>
                <th className="px-4 py-3 text-left font-medium">Categories</th>
                <th className="px-4 py-3 text-left font-medium">Difficulty</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song) => (
                <tr
                  key={song._id}
                  className="border-t border-white/5 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3">{song.title}</td>
                  <td className="px-4 py-3 capitalize">
                    {song.primaryLanguage}
                  </td>
                  <td className="px-4 py-3 text-white/70">
                    {song.categories && song.categories.length
                      ? song.categories.join(", ")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {song.difficulty || "mixed"}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(song._id)}
                      disabled={deletingId === song._id}
                      className="rounded-full border border-red-400/60 px-3 py-1 text-[11px] text-red-300 hover:bg-red-500/10 disabled:opacity-60"
                    >
                      {deletingId === song._id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
              {songs.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-4 text-center text-white/60"
                  >
                    No songs yet. Click “New song” to add your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}



