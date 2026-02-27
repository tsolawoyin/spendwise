"use client";

import { motion } from "motion/react";
import { EXPENSE_CATEGORIES } from "@/lib/categoryConfig";

interface CategoryChipsProps {
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryChips({
  selected,
  onSelect,
}: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {EXPENSE_CATEGORIES.map((cat) => {
        const isSelected = selected === cat.name;
        return (
          <motion.button
            key={cat.name}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => onSelect(cat.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isSelected
                ? "bg-red-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            {cat.emoji} {cat.name}
          </motion.button>
        );
      })}
    </div>
  );
}
