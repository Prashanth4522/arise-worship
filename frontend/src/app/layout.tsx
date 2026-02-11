import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arise Worship",
  description:
    "Minimalist multilingual worship chords and lyrics for English, Tamil, Tanglish, Kannada and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* Footer with social + disclaimer */}
        <footer className="mt-8 w-full border-t border-white/10 bg-black px-4 py-8 text-white/70 text-xs flex flex-col items-center">
          <div className="flex gap-5 mb-2">
            <a aria-label="Facebook" href="https://facebook.com/arise-worship" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.596 0 0 .592 0 1.326v21.348C0 23.408.596 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.716-1.797 1.766v2.314h3.587l-.467 3.622h-3.12V24h6.116C23.404 24 24 23.408 24 22.674V1.326C24 .592 23.404 0 22.675 0"/></svg>
            </a>
            <a aria-label="Instagram" href="https://instagram.com/arise-worship" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.849.07 1.366.062 2.633.344 3.608 1.32.976.976 1.258 2.243 1.32 3.608.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.062 1.366-.344 2.633-1.32 3.608-.976.976-2.243 1.258-3.608 1.32-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07c-1.366-.062-2.633-.344-3.608-1.32-.976-.976-1.258-2.243-1.32-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.849c.062-1.366.344-2.633 1.32-3.608.976-.976 2.243-1.258 3.608-1.32C8.415 2.175 8.795 2.163 12 2.163zm0-2.163C8.736 0 8.332.013 7.052.07 5.773.127 4.606.408 3.68 1.334 2.754 2.26 2.474 3.427 2.417 4.707 2.36 5.987 2.348 6.392 2.348 12c0 5.607.012 6.013.069 7.293.057 1.28.337 2.447 1.263 3.373.926.926 2.093 1.207 3.373 1.264C8.332 23.987 8.736 24 12 24c3.264 0 3.668-.013 4.948-.07 1.28-.057 2.447-.338 3.373-1.264.926-.926 1.206-2.093 1.263-3.373.057-1.28.069-1.684.069-7.293 0-5.608-.012-6.013-.069-7.293-.057-1.28-.337-2.447-1.263-3.373C19.395.408 18.228.127 16.948.07 15.668.013 15.264 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.997 3.999 3.999 0 0 1 0 7.997zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
            </a>
            <a aria-label="YouTube" href="https://youtube.com/@arise-worship" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.499 6.203a2.81 2.81 0 0 0-1.979-1.98C19.695 4 12 4 12 4s-7.695 0-9.521.223a2.81 2.81 0 0 0-1.98 1.98C0 8.03 0 12 0 12s0 3.969.499 5.797a2.81 2.81 0 0 0 1.98 1.98C4.305 20 12 20 12 20s7.695 0 9.521-.223a2.81 2.81 0 0 0 1.979-1.98C24 15.969 24 12 24 12s0-3.969-.501-5.797zM9.545 15.568V8.432l7.273 3.568-7.273 3.568z"/></svg>
            </a>
          </div>
          <div className="text-[11px] text-center leading-relaxed max-w-2xl mx-auto mt-2">
            <span className="block mb-1 font-semibold text-white/90">Disclaimer</span>
            All music and lyrics belong to original owners. Only for personal worship and educational use.
            <br />
            <span className="italic text-white/60">Acts 1:8</span> <span className="text-white/80">You will receive power when the Holy Spirit comes on you; and you will be my witnesses...to the ends of the earth.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
