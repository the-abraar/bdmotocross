import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="inline-block px-3 py-1 bg-rose-950/80 border border-rose-800 text-rose-400 text-xs font-bold tracking-widest uppercase rounded-full">
          BMCA Paddock Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-black italic tracking-wider text-white">
          BANGLADESH <span className="text-rose-600">MOTOCROSS</span> CLUB & ACADEMY
        </h1>

        <p className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto">
          The official zero-latency community platform for verified racers, cadets, and track coaches. Showcase your race setup, read track updates, and connect with mentors.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/feed"
            className="px-6 py-3 bg-rose-600 hover:bg-rose-500 font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-rose-900/30"
          >
            Explore Paddock Feed
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 font-bold uppercase tracking-wider rounded-xl transition-all"
          >
            Member Login
          </Link>
          <a
            href="https://bdmotocross.com"
            className="px-6 py-3 text-neutral-400 hover:text-white font-medium text-sm transition-colors"
          >
            ← Back to Main Website
          </a>
        </div>
      </div>
    </div>
  );
}
