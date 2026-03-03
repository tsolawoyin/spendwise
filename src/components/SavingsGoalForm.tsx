"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useApp } from "@/providers/app-provider";
import { useXP } from "@/hooks/useXP";
import AmountInput from "@/components/AmountInput";
import XPToast from "@/components/motion/XPToast";
import type { SavingsGoal } from "@/lib/types";

interface SavingsGoalFormProps {
  mode: "add" | "edit";
  initialData?: SavingsGoal;
}

export default function SavingsGoalForm({ mode, initialData }: SavingsGoalFormProps) {
  const { supabase, user } = useApp();
  const { addXP } = useXP();
  const router = useRouter();

  const [name, setName] = useState(initialData?.name ?? "");
  const [targetAmount, setTargetAmount] = useState(
    initialData ? String(initialData.target_amount) : "",
  );
  const [deadline, setDeadline] = useState(initialData?.deadline ?? "");
  const [loading, setLoading] = useState(false);
  const [showXP, setShowXP] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Enter a goal name");
      return;
    }
    const numTarget = parseFloat(targetAmount);
    if (!numTarget || numTarget <= 0) {
      toast.error("Enter a valid target amount");
      return;
    }

    setLoading(true);

    if (mode === "add") {
      const { error } = await supabase.from("savings_goals").insert({
        user_id: user!.id,
        name: name.trim(),
        target_amount: numTarget,
        deadline: deadline || null,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      addXP(5);
      setShowXP(true);
      setTimeout(() => {
        toast.success("Savings goal created!");
        setLoading(false);
        router.replace("/wallet/savings");
      }, 800);
    } else {
      const { error } = await supabase
        .from("savings_goals")
        .update({
          name: name.trim(),
          target_amount: numTarget,
          deadline: deadline || null,
        })
        .eq("id", initialData!.id);

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      toast.success("Goal updated!");
      setLoading(false);
      router.replace(`/wallet/savings/${initialData!.id}`);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this savings goal? All deposits will also be deleted.")) return;

    const { error } = await supabase
      .from("savings_goals")
      .delete()
      .eq("id", initialData!.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Goal deleted");
    router.replace("/wallet/savings");
  };

  return (
    <>
      <XPToast amount={5} show={showXP} />

      <div className="flex justify-center mb-6">
        <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-8"
      >
        {mode === "add" ? "New Savings Goal 🎯" : "Edit Goal 🎯"}
      </motion.h1>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSave}
        className="space-y-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Goal Name
          </label>
          <input
            type="text"
            placeholder="e.g. New phone, Emergency fund"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>

        <div className="py-4">
          <label className="text-sm font-medium text-muted-foreground block mb-2">
            Target Amount
          </label>
          <AmountInput value={targetAmount} onChange={setTargetAmount} color="teal" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Deadline (optional)
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-foreground outline-none"
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.97 }}
          className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : mode === "add"
              ? "Create Goal"
              : "Update Goal"}
        </motion.button>

        {mode === "edit" && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={handleDelete}
            className="w-full h-12 bg-red-500/10 text-red-500 font-semibold rounded-xl transition-colors"
          >
            Delete
          </motion.button>
        )}
      </motion.form>
    </>
  );
}
