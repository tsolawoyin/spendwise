"use client";

import FadeIn from "@/components/motion/FadeIn";

interface XPBadgeProps {
  xp: number;
}

export default function XPBadge({ xp }: XPBadgeProps) {
  return (
    <FadeIn delay={0.1}>
      <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
        ⚡ {xp} XP
      </span>
    </FadeIn>
  );
}
