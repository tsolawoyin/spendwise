"use client";

import { motion } from "motion/react";
import { LOAN_TYPES } from "@/lib/categoryConfig";

interface LoanTypeChipsProps {
  selected: string;
  onSelect: (type: string) => void;
}

export default function LoanTypeChips({
  selected,
  onSelect,
}: LoanTypeChipsProps) {
  return (
    <div className="flex gap-3">
      {LOAN_TYPES.map((lt) => {
        const isSelected = selected === lt.name;
        return (
          <motion.button
            key={lt.name}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => onSelect(lt.name)}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors ${
              isSelected
                ? "bg-blue-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            {lt.emoji} {lt.label}
          </motion.button>
        );
      })}
    </div>
  );
}
