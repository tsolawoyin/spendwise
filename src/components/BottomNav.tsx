"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

const tabs = [
  { href: "/dashboard", icon: "🏠", label: "Home" },
  { href: "/history", icon: "📋", label: "History" },
  { href: "/summary", icon: "📊", label: "Summary" },
  { href: "/profile", icon: "👤", label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-[430px] mx-auto flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center gap-1 w-16 h-full relative"
            >
              <span className="text-xl">{tab.icon}</span>
              <span
                className={`text-[10px] font-medium ${
                  isActive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute -top-0.5 w-1 h-1 rounded-full bg-emerald-500"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
