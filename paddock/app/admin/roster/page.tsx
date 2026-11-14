"use client";

import { useState } from "react";
import { provisionRiderAccount } from "@/app/actions/provisionRider";

export default function AdminRosterPage() {
  const [statusMsg, setStatusMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleProvision(formData: FormData) {
    setLoading(true);
    setStatusMsg("");
    setIsError(false);

    try {
      const res = await provisionRiderAccount(formData);
      setStatusMsg(`Rider @${res.username} provisioned! Temp Pass: ${res.tempPassword}`);
    } catch (err: any) {
      setIsError(true);
      setStatusMsg(err.message || "Failed to provision account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-xl mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h1 className="text-2xl font-black italic tracking-wide text-rose-600 mb-2">
          TRACKSIDE RIDER PROVISIONING
        </h1>
        <p className="text-sm text-neutral-400 mb-6">
          Executive authority: Instant mobile account issuance.
        </p>

        {statusMsg && (
          <div
            className={`mb-6 p-4 rounded-lg text-sm font-semibold ${
              isError
                ? "bg-rose-950/80 border border-rose-800 text-rose-300"
                : "bg-emerald-950/80 border border-emerald-800 text-emerald-300"
            }`}
          >
            {statusMsg}
          </div>
        )}

        <form action={handleProvision} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-semibold text-neutral-400 mb-1">
              Username (Lowercase, No Spaces)
            </label>
            <input
              name="username"
              type="text"
              required
              placeholder="e.g. shuvo_77"
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-neutral-400 mb-1">
              Full Name
            </label>
            <input
              name="fullName"
              type="text"
              required
              placeholder="e.g. Shuvo Chowdhury"
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-neutral-400 mb-1">
              Club Role
            </label>
            <select
              name="role"
              defaultValue="rider"
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white"
            >
              <option value="cadet">Cadet (Academy Student)</option>
              <option value="rider">Rider (Club Member)</option>
              <option value="pro_racer">Pro Category Racer</option>
              <option value="mentor">Mentor / Track Coach</option>
              <option value="exec">Executive / Track Marshal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-neutral-400 mb-1">
              Temporary Password
            </label>
            <input
              name="tempPassword"
              type="text"
              required
              defaultValue="BMCA2026!"
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 font-bold uppercase rounded-lg transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? "Issuing Credentials..." : "Issue Credentials"}
          </button>
        </form>
      </div>
    </div>
  );
}
