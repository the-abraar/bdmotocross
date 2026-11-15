"use client";

import { useState } from "react";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

export function YouTubeEmbed({ videoId, title = "BMCA Motocross Track Video" }: YouTubeEmbedProps) {
  const validId = /^[A-Za-z0-9_-]{11}$/.test(videoId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbSrc, setThumbSrc] = useState(
    `https://i.ytimg.com/vi_webp/${videoId}/maxresdefault.webp`
  );

  // videoId comes from user-written DB rows: never interpolate an unvalidated value into a URL.
  if (!validId) return null;

  if (isPlaying) {
    return (
      <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsPlaying(true)}
      className="relative aspect-video w-full rounded-xl overflow-hidden group cursor-pointer bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-600"
      aria-label={`Play: ${title}`}
    >
      <img
        src={thumbSrc}
        alt={title}
        loading="lazy"
        onError={() => setThumbSrc(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`)}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-rose-600 transition-all">
          <svg className="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  );
}
