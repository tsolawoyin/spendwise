"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useApp, type Profile } from "@/providers/app-provider";
import { useXP } from "@/hooks/useXP";
import type { Budget } from "@/lib/types";
import FadeIn from "@/components/motion/FadeIn";
import LevelBadge from "@/components/LevelBadge";
import XPBadge from "@/components/XPBadge";

interface ProfileContentProps {
  profile: Profile;
  budget: Budget;
}

export default function ProfileContent({
  profile,
  budget,
}: ProfileContentProps) {
  const router = useRouter();
  const { supabase, setUser } = useApp();
  const { xp, level } = useXP();

  const [name, setName] = useState(profile.name);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const initial = profile.name?.charAt(0)?.toUpperCase() ?? "?";

  const memberSince = new Date(profile.created_at).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );

  const formatDate = (dateStr: string) =>
    new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  async function handleSaveName() {
    const trimmed = name.trim();
    if (!trimmed || trimmed === profile.name) {
      setIsEditing(false);
      setName(profile.name);
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ name: trimmed })
      .eq("id", profile.id);

    if (error) {
      toast.error("Failed to update name");
      setSaving(false);
      return;
    }

    toast.success("Name updated!");
    profile.name = trimmed;
    setUser((prev) =>
      prev ? { ...prev, profile: { ...prev.profile, name: trimmed } } : prev
    );
    setIsEditing(false);
    setSaving(false);
  }

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Avatar + Name + Email */}
      <FadeIn className="flex flex-col items-center gap-3 pt-2">
        <div className="h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center text-white text-3xl font-bold">
          {initial}
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold">{profile.name}</h1>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </div>
      </FadeIn>

      {/* Info Cards */}
      <FadeIn delay={0.1} className="flex flex-col gap-3">
        <div className="rounded-xl bg-card border p-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Member since</span>
          <span className="text-sm font-medium">{memberSince}</span>
        </div>

        <div className="rounded-xl bg-card border p-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Budget period</span>
          <span className="text-sm font-medium">
            {formatDate(budget.start_date)} &ndash;{" "}
            {formatDate(budget.end_date)}
          </span>
        </div>

        <div className="rounded-xl bg-card border p-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Level &amp; XP</span>
          <div className="flex items-center gap-2">
            <LevelBadge level={level} />
            <XPBadge xp={xp} />
          </div>
        </div>
      </FadeIn>

      {/* Edit Name */}
      <FadeIn delay={0.2} className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground px-1">
          Settings
        </h2>

        {isEditing ? (
          <div className="rounded-xl bg-card border p-4 flex flex-col gap-3">
            <label className="text-sm font-medium">Display name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveName();
                if (e.key === "Escape") {
                  setIsEditing(false);
                  setName(profile.name);
                }
              }}
            />
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSaveName}
                disabled={saving}
                className="flex-1 h-11 rounded-lg bg-emerald-500 text-white text-sm font-semibold disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setIsEditing(false);
                  setName(profile.name);
                }}
                className="flex-1 h-11 rounded-lg border text-sm font-semibold"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsEditing(true)}
            className="rounded-xl bg-card border p-4 flex items-center justify-between text-left"
          >
            <span className="text-sm">Edit name</span>
            <span className="text-sm text-muted-foreground">
              {profile.name}
            </span>
          </motion.button>
        )}
      </FadeIn>

      {/* Sign Out */}
      <FadeIn delay={0.3}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full h-12 rounded-xl bg-red-500/10 text-red-500 font-semibold text-sm disabled:opacity-50"
        >
          {signingOut ? "Signing out..." : "Sign out"}
        </motion.button>
      </FadeIn>
    </div>
  );
}
