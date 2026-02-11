"use client";

import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear the authentication token
    window.localStorage.removeItem("arise_token");
    // Redirect to login page
    router.push("/admin/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full rounded-lg border border-red-400/60 bg-red-500/10 px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 transition-colors"
    >
      Logout
    </button>
  );
}
