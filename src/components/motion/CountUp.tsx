"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, animate, useTransform, motion } from "motion/react";

interface CountUpProps {
  to: number;
  duration?: number;
  className?: string;
}

export default function CountUp({
  to,
  duration = 0.8,
  className,
}: CountUpProps) {
  const motionValue = useMotionValue(0);
  const ref = useRef<HTMLSpanElement>(null);

  const formatted = useTransform(motionValue, (v) =>
    `₦${Math.round(v).toLocaleString()}`
  );

  useEffect(() => {
    const controls = animate(motionValue, to, {
      duration,
      ease: "easeOut",
    });
    return controls.stop;
  }, [to, duration, motionValue]);

  useEffect(() => {
    const unsubscribe = formatted.on("change", (v) => {
      if (ref.current) ref.current.textContent = v;
    });
    return unsubscribe;
  }, [formatted]);

  return <motion.span ref={ref} className={className}>₦0</motion.span>;
}
