import type { ReactNode } from "react";
import Link from "next/link";
import AdminLogoutButton from "./logout-button";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-white/5 px-6 py-6">
        <div className="text-xs font-semibold tracking-[0.3em] uppercase text-white/60">
          Arise Worship
        </div>
        <div className="mt-2 text-lg font-semibold">Admin Panel</div>
        <nav className="mt-8 space-y-3 text-sm">
          <Link href="/" className="block text-white/80 hover:text-white">
            ← Home
          </Link>
          <Link href="/admin" className="block text-white/80 hover:text-white">
            Dashboard
          </Link>
          <Link
            href="/admin/songs"
            className="block text-white/80 hover:text-white"
          >
            Songs
          </Link>
        </nav>
        <div className="mt-auto">
          <AdminLogoutButton />
        </div>
      </aside>
      <main className="flex-1 px-4 py-6 md:px-10 md:py-10 bg-black">
        {children}
      </main>
    </div>
  );
}






