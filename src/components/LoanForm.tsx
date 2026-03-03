"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useApp } from "@/providers/app-provider";
import { useXP } from "@/hooks/useXP";
import AmountInput from "@/components/AmountInput";
import LoanTypeChips from "@/components/LoanTypeChips";
import XPToast from "@/components/motion/XPToast";
import type { Loan } from "@/lib/types";

interface LoanFormProps {
  mode: "add" | "edit";
  initialData?: Loan;
}

export default function LoanForm({ mode, initialData }: LoanFormProps) {
  const { supabase, user } = useApp();
  const { addXP } = useXP();
  const router = useRouter();

  const [amount, setAmount] = useState(
    initialData ? String(initialData.amount) : "",
  );
  const [loanType, setLoanType] = useState(initialData?.type ?? "");
  const [personName, setPersonName] = useState(initialData?.person_name ?? "");
  const [note, setNote] = useState(initialData?.note ?? "");
  const [date, setDate] = useState(
    initialData?.date ?? new Date().toISOString().split("T")[0],
  );
  const [loading, setLoading] = useState(false);
  const [showXP, setShowXP] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!loanType) {
      toast.error("Select loan type");
      return;
    }
    if (!personName.trim()) {
      toast.error("Enter a person's name");
      return;
    }

    setLoading(true);

    if (mode === "add") {
      const { error } = await supabase.from("loans").insert({
        user_id: user!.id,
        amount: numAmount,
        type: loanType,
        person_name: personName.trim(),
        note: note || null,
        date,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      addXP(5);
      setShowXP(true);
      setTimeout(() => {
        toast.success("Loan added!");
        setLoading(false);
        router.back();
      }, 800);
    } else {
      const { error } = await supabase
        .from("loans")
        .update({
          amount: numAmount,
          type: loanType,
          person_name: personName.trim(),
          note: note || null,
          date,
        })
        .eq("id", initialData!.id);

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      toast.success("Loan updated!");
      setLoading(false);
      router.back();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this loan? All repayments will also be deleted.")) return;

    const { error } = await supabase
      .from("loans")
      .delete()
      .eq("id", initialData!.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Loan deleted");
    router.replace("/wallet/loans");
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
        {mode === "add" ? "Add Loan 🤝" : "Edit Loan 🤝"}
      </motion.h1>

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
            Loan Type
          </label>
          <LoanTypeChips selected={loanType} onSelect={setLoanType} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Person
          </label>
          <input
            type="text"
            placeholder="Who did you lend to / borrow from?"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Note (optional)
          </label>
          <input
            type="text"
            placeholder="What's this for?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-foreground placeholder:text-muted-foreground outline-none"
          />
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
          className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : mode === "add"
              ? "Save Loan"
              : "Update Loan"}
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
