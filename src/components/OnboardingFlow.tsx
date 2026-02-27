"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "@/providers/app-provider";
import { toast } from "sonner";

export default function OnboardingFlow() {
  const { supabase, user } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const firstName = user?.profile?.name?.split(" ")[0] ?? "there";

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both dates");
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      toast.error("End date must be after start date");
      return;
    }

    setLoading(true);

    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      toast.error("Session expired. Please log in again.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("budgets").insert({
      user_id: authUser.id,
      start_date: startDate,
      end_date: endDate,
    });

    if (error) {
      toast.error(error.message);
      console.log(error);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-90">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl p-4 mb-6"
              >
                <span className="text-5xl block">👋</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold mb-2"
              >
                Hey, {firstName}!
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground mb-8"
              >
                Let&apos;s set up your first budget period to start tracking
                your spending.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(2)}
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
              >
                Let&apos;s Go →
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-amber-100 dark:bg-amber-900/30 rounded-2xl p-4 mb-6"
              >
                <span className="text-5xl block">📅</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold mb-2 text-center"
              >
                Budget Period
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-muted-foreground mb-6 text-center"
              >
                When does your budget start and end?
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full space-y-4 mb-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-12 rounded-xl border border-input bg-background px-3 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-12 rounded-xl border border-input bg-background px-3 text-sm"
                  />
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={loading}
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? "Setting up..." : "Get Started 🎯"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {[1, 2].map((dot) => (
            <div key={dot} className="relative w-2 h-2">
              <div className="w-2 h-2 rounded-full bg-muted" />
              {step === dot && (
                <motion.div
                  layoutId="onboarding-dot"
                  className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
