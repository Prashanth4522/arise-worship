 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/api";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(getApiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Login failed");
      }
      const data = await res.json();
      window.localStorage.setItem("arise_token", data.token);
      router.push("/admin/songs");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-7">
        <div className="text-xs font-semibold tracking-[0.3em] uppercase text-white/60">
          Arise Worship
        </div>
        <h1 className="mt-3 text-xl font-semibold tracking-tight">
          Admin Login
        </h1>
        <p className="mt-1 text-xs text-white/60">
          Secure access for worship admins and leaders.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-sm">
          <div className="space-y-1.5">
            <label className="block text-xs text-white/60">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm outline-none ring-0 focus:border-purple-400 focus:bg-black"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs text-white/60">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm outline-none ring-0 focus:border-purple-400 focus:bg-black"
            />
          </div>
          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-white text-black px-4 py-2.5 text-sm font-medium transition hover:bg-purple-200 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}



