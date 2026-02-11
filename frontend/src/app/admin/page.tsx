"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminHome() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = window.localStorage.getItem("arise_token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
        Admin Dashboard
      </h1>
      <p className="mt-3 text-sm text-white/60">
        Manage multilingual worship songs, chords, and Tamil/Tanglish lyrics
        for Arise Worship.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          href="/admin/songs"
          className="group rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 text-sm text-white/80 hover:border-purple-400/60 hover:bg-purple-500/5 transition-colors"
        >
          <div className="text-xs uppercase tracking-[0.25em] text-white/50">
            Songs
          </div>
          <div className="mt-2 text-base font-medium">Browse & Edit Songs</div>
          <p className="mt-1 text-xs text-white/60">
            Add new songs, update chords, and manage language variants.
          </p>
        </Link>
      </div>
    </div>
  );
}






