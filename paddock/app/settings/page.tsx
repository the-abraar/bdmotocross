"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { purgeEdgeProfileCache } from "@/app/actions/purgeProfileCache";

function SettingsForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const forceReset = searchParams.get("forceReset") === "true";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [isError, setIsError] = useState(false);

  // Form states
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [racingNumber, setRacingNumber] = useState("");
  const [bikeModel, setBikeModel] = useState("");
  const [bio, setBio] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  // Password reset state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const supabase = createClient();

    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUsername(profile.username || "");
        setFullName(profile.full_name || "");
        setRacingNumber(profile.racing_number || "");
        setBikeModel(profile.bike_model || "");
        setBio(profile.bio || "");
        setWhatsappNumber(profile.whatsapp_number || "");
      }
      setLoading(false);
    }

    loadProfile();
  }, [router]);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      setIsError(true);
      setStatusMsg("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setIsError(true);
      setStatusMsg("Passwords do not match.");
      return;
    }

    setSaving(true);
    setStatusMsg("");
    setIsError(false);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setIsError(true);
      setStatusMsg(error.message);
      setSaving(false);
      return;
    }

    setStatusMsg("Password successfully updated! Unlocking paddock feed...");
    setSaving(false);
    setTimeout(() => {
      router.push("/feed");
    }, 1200);
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatusMsg("");
    setIsError(false);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        racing_number: racingNumber || null,
        bike_model: bikeModel || null,
        bio,
        whatsapp_number: whatsappNumber || null,
      })
      .eq("id", user.id);

    if (error) {
      setIsError(true);
      setStatusMsg(error.message);
      setSaving(false);
      return;
    }

    // Purge edge cache for this profile
    if (username) {
      await purgeEdgeProfileCache(username);
    }

    setIsError(false);
    setStatusMsg("Profile updated and edge cache refreshed!");
    setSaving(false);
  }

  if (loading) {
    return <div className="text-center py-16 text-neutral-500">Loading settings...</div>;
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black italic tracking-wider text-rose-600">
          MEMBER SETTINGS
        </h1>
        <p className="text-neutral-400 text-sm mt-1">
          Manage your BMCA identity and track machine specifications.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold ${
            isError
              ? "bg-rose-950/80 border border-rose-800 text-rose-300"
              : "bg-emerald-950/80 border border-emerald-800 text-emerald-300"
          }`}
        >
          {statusMsg}
        </div>
      )}

      {/* Mandatory Password Reset Gate */}
      {forceReset && (
        <div className="bg-neutral-900 border border-rose-800/60 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h2 className="text-lg font-bold text-rose-400 uppercase tracking-wide">
              Mandatory Password Change Required
            </h2>
          </div>
          <p className="text-neutral-300 text-sm">
            For track security, change your temporary provisioning password to unlock publishing rights.
          </p>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-semibold text-neutral-400 mb-1">
                New Password (min 8 chars)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-neutral-400 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 font-bold uppercase rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? "Updating Password..." : "Set Personal Password"}
            </button>
          </form>
        </div>
      )}

      {/* Profile Details Form */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">
          Rider Profile Details
        </h2>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-semibold text-neutral-400 mb-1">
              Username (Immutable)
            </label>
            <input
              type="text"
              disabled
              value={username}
              className="w-full px-4 py-2.5 bg-neutral-950/60 border border-neutral-800 rounded-lg text-neutral-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-neutral-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-semibold text-neutral-400 mb-1">
                Racing Number
              </label>
              <input
                type="text"
                placeholder="e.g. 99"
                value={racingNumber}
                onChange={(e) => setRacingNumber(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-semibold text-neutral-400 mb-1">
                WhatsApp Hotline
              </label>
              <input
                type="text"
                placeholder="+8801975376114"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-neutral-400 mb-1">
              Track Machine / Bike Model
            </label>
            <input
              type="text"
              placeholder="e.g. 2024 KTM 250 SX-F"
              value={bikeModel}
              onChange={(e) => setBikeModel(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-neutral-400 mb-1">
              Bio / Race Highlights
            </label>
            <textarea
              rows={3}
              placeholder="Tell fans and scouts about your track journey..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 font-bold uppercase rounded-lg transition-colors disabled:opacity-50 mt-2"
          >
            {saving ? "Saving Changes..." : "Save Profile Details"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <Suspense fallback={<div className="text-center py-16 text-neutral-500">Loading settings...</div>}>
        <SettingsForm />
      </Suspense>
    </div>
  );
}
