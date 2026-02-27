"use client";

import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function StaggerList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.ul>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.li variants={itemVariants} className={className}>
      {children}
    </motion.li>
  );
}
