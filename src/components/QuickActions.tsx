"use client";

import Link from "next/link";
import { motion } from "motion/react";
import FadeIn from "@/components/motion/FadeIn";

export default function QuickActions() {
  return (
    <FadeIn delay={0.2}>
      <div className="grid grid-cols-2 gap-3">
        <motion.div whileTap={{ scale: 0.95 }}>
          <Link
            href="/income/add"
            className="flex items-center justify-center gap-2 h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            + Income
          </Link>
        </motion.div>
        <motion.div whileTap={{ scale: 0.95 }}>
          <Link
            href="/expenses/add"
            className="flex items-center justify-center gap-2 h-12 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
          >
            + Expense
          </Link>
        </motion.div>
      </div>
    </FadeIn>
  );
}
