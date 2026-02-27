"use client";

import { motion } from "motion/react";
import { INCOME_SOURCES } from "@/lib/categoryConfig";

interface SourceChipsProps {
  selected: string;
  onSelect: (source: string) => void;
}

export default function SourceChips({ selected, onSelect }: SourceChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {INCOME_SOURCES.map((source) => {
        const isSelected = selected === source.name;
        return (
          <motion.button
            key={source.name}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => onSelect(source.name)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isSelected
                ? "bg-emerald-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            {source.emoji} {source.name}
          </motion.button>
        );
      })}
    </div>
  );
}
