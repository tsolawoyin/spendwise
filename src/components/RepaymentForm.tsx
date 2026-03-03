"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useApp } from "@/providers/app-provider";
import { useXP } from "@/hooks/useXP";
import AmountInput from "@/components/AmountInput";
import XPToast from "@/components/motion/XPToast";
import type { LoanWithRepayments } from "@/lib/types";

interface RepaymentFormProps {
  loan: LoanWithRepayments;
}

export default function RepaymentForm({ loan }: RepaymentFormProps) {
  const { supabase, user } = useApp();
  const { addXP } = useXP();
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [showXP, setShowXP] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (numAmount > loan.remaining) {
      toast.error(`Amount exceeds remaining balance of ₦${loan.remaining.toLocaleString()}`);
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("loan_repayments").insert({
      loan_id: loan.id,
      user_id: user!.id,
      amount: numAmount,
      date,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Auto-settle if fully repaid
    if (numAmount >= loan.remaining) {
      await supabase
        .from("loans")
        .update({ is_settled: true })
        .eq("id", loan.id);
    }

    addXP(5);
    setShowXP(true);
    setTimeout(() => {
      toast.success("Repayment recorded!");
      setLoading(false);
      router.replace(`/wallet/loans/${loan.id}`);
    }, 800);
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
        className="text-2xl font-bold mb-2"
      >
        Record Repayment 💱
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="text-sm text-muted-foreground mb-8"
      >
        {loan.type === "lent" ? `${loan.person_name} paying you back` : `Paying back ${loan.person_name}`}
        {" · "}₦{loan.remaining.toLocaleString()} remaining
      </motion.p>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSave}
        className="space-y-6"
      >
        <div className="py-4">
          <AmountInput value={amount} onChange={setAmount} color="blue" />
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

        <div className="flex gap-3">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => setAmount(String(loan.remaining))}
            className="flex-1 h-12 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold rounded-xl transition-colors"
          >
            Full Amount
          </motion.button>
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </motion.button>
        </div>
      </motion.form>
    </>
  );
}
