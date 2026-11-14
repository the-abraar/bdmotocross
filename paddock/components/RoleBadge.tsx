import React from "react";

export type UserRole = "exec" | "mentor" | "pro_racer" | "cadet" | "rider";

const BADGE_MAP: Record<UserRole, { label: string; className: string }> = {
  exec: { label: "DIRECTOR", className: "bg-rose-900/60 text-rose-300 border-rose-700" },
  mentor: { label: "HEAD COACH", className: "bg-amber-900/60 text-amber-300 border-amber-700" },
  pro_racer: { label: "PRO RACER", className: "bg-emerald-900/60 text-emerald-300 border-emerald-700" },
  cadet: { label: "CADET", className: "bg-sky-900/60 text-sky-300 border-sky-700" },
  rider: { label: "MEMBER", className: "bg-neutral-800 text-neutral-300 border-neutral-700" },
};

export function RoleBadge({ role }: { role: UserRole }) {
  const badge = BADGE_MAP[role] || BADGE_MAP.rider;
  return (
    <span
      className={`px-2 py-0.5 text-xs font-bold tracking-wider uppercase rounded border ${badge.className}`}
    >
      {badge.label}
    </span>
  );
}
