"use client";

import { motion, type HTMLMotionProps } from "motion/react";

interface FadeInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
}

export default function FadeIn({
  children,
  delay = 0,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
