"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useApp } from "@/providers/app-provider";
import { useXP } from "@/hooks/useXP";
import AmountInput from "@/components/AmountInput";
import XPToast from "@/components/motion/XPToast";
import type { SavingsGoalWithProgress } from "@/lib/types";

interface SavingsTransactionFormProps {
  goal: SavingsGoalWithProgress;
  type: "deposit" | "withdraw";
}

export default function SavingsTransactionForm({
  goal,
  type,
}: SavingsTransactionFormProps) {
  const { supabase, user } = useApp();
  const { addXP } = useXP();
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [showXP, setShowXP] = useState(false);

  const isDeposit = type === "deposit";
  const remaining = Number(goal.target_amount) - goal.totalSaved;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!isDeposit && numAmount > goal.totalSaved) {
      toast.error(`Can't withdraw more than ₦${goal.totalSaved.toLocaleString()}`);
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("savings_transactions").insert({
      goal_id: goal.id,
      user_id: user!.id,
      type,
      amount: numAmount,
      date,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (isDeposit) {
      addXP(5);
      setShowXP(true);
      setTimeout(() => {
        toast.success("Deposit saved!");
        setLoading(false);
        router.back();
      }, 800);
    } else {
      toast.success("Withdrawal recorded!");
      setLoading(false);
      router.back();
    }
  };

  return (
    <>
      {isDeposit && <XPToast amount={5} show={showXP} />}

      <div className="flex justify-center mb-6">
        <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-2"
      >
        {isDeposit ? "Deposit 🐷" : "Withdraw 💱"}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="text-sm text-muted-foreground mb-8"
      >
        {goal.name} · {isDeposit
          ? `₦${remaining.toLocaleString()} to go`
          : `₦${goal.totalSaved.toLocaleString()} available`}
      </motion.p>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSave}
        className="space-y-6"
      >
        <div className="py-4">
          <AmountInput value={amount} onChange={setAmount} color="teal" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-foreground outline-none"
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.97 }}
          className={`w-full h-12 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 ${
            isDeposit
              ? "bg-teal-500 hover:bg-teal-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {loading
            ? "Saving..."
            : isDeposit
              ? "Save Deposit"
              : "Withdraw"}
        </motion.button>
      </motion.form>
    </>
  );
}
