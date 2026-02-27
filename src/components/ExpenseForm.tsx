"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useApp } from "@/providers/app-provider";
import { useXP } from "@/hooks/useXP";
import AmountInput from "@/components/AmountInput";
import CategoryChips from "@/components/CategoryChips";
import XPToast from "@/components/motion/XPToast";
import type { Expense } from "@/lib/types";

interface ExpenseFormProps {
  mode: "add" | "edit";
  initialData?: Expense;
}

export default function ExpenseForm({ mode, initialData }: ExpenseFormProps) {
  const { supabase, user } = useApp();
  const { addXP } = useXP();
  const router = useRouter();

  const [amount, setAmount] = useState(
    initialData ? String(initialData.amount) : ""
  );
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [note, setNote] = useState(initialData?.note ?? "");
  const [date, setDate] = useState(
    initialData?.date ?? new Date().toISOString().split("T")[0]
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
    if (!category) {
      toast.error("Select a category");
      return;
    }

    setLoading(true);

    if (mode === "add") {
      const { error } = await supabase.from("expenses").insert({
        user_id: user!.id,
        amount: numAmount,
        category,
        note: note || null,
        date,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      addXP(10);
      setShowXP(true);
      setTimeout(() => {
        toast.success("Expense added!");
        router.back();
      }, 800);
    } else {
      const { error } = await supabase
        .from("expenses")
        .update({ amount: numAmount, category, note: note || null, date })
        .eq("id", initialData!.id);

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      toast.success("Expense updated!");
      router.back();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this expense?")) return;

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", initialData!.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Expense deleted");
    router.back();
  };

  return (
    <>
      <XPToast amount={10} show={showXP} />

      <div className="flex justify-center mb-6">
        <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-8"
      >
        {mode === "add" ? "Add Expense 💸" : "Edit Expense 💸"}
      </motion.h1>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSave}
        className="space-y-6"
      >
        <div className="py-4">
          <AmountInput value={amount} onChange={setAmount} color="red" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Category
          </label>
          <CategoryChips selected={category} onSelect={setCategory} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Note (optional)
          </label>
          <input
            type="text"
            placeholder="What was this for?"
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
          className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : mode === "add"
              ? "Save Expense"
              : "Update Expense"}
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
