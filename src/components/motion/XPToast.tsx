"use client";

import { motion, AnimatePresence } from "motion/react";

interface XPToastProps {
  amount: number;
  show: boolean;
}

export default function XPToast({ amount, show }: XPToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -40 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <span className="text-amber-500 font-bold text-lg">
            +{amount} XP ⚡
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
