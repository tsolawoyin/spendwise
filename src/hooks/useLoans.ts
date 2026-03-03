"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/providers/app-provider";
import type { Loan, LoanRepayment, LoanWithRepayments } from "@/lib/types";
import { enrichLoan } from "@/lib/calculations";

export function useLoans() {
  const { supabase, user } = useApp();
  const router = useRouter();
  const [loans, setLoans] = useState<LoanWithRepayments[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    let cancelled = false;

    async function fetchLoans() {
      const [loansResult, repaymentsResult] = await Promise.all([
        supabase
          .from("loans")
          .select("*")
          .eq("user_id", user!.id)
          .order("date", { ascending: false }),
        supabase
          .from("loan_repayments")
          .select("*")
          .eq("user_id", user!.id)
          .order("date", { ascending: false }),
      ]);

      if (cancelled) return;

      const rawLoans: Loan[] = loansResult.data ?? [];
      const rawRepayments: LoanRepayment[] = repaymentsResult.data ?? [];

      const enriched = rawLoans.map((loan) => enrichLoan(loan, rawRepayments));
      setLoans(enriched);
      setIsLoading(false);
    }

    fetchLoans();

    return () => {
      cancelled = true;
    };
  }, [user, supabase, router]);

  return { loans, isLoading };
}
