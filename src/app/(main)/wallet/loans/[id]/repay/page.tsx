"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/providers/app-provider";
import { enrichLoan } from "@/lib/calculations";
import type { Loan, LoanRepayment, LoanWithRepayments } from "@/lib/types";
import RepaymentForm from "@/components/RepaymentForm";
import EditFormSkeleton from "@/components/skeletons/EditFormSkeleton";

export default function RepayLoanPage() {
  const { id } = useParams<{ id: string }>();
  const { supabase } = useApp();
  const router = useRouter();
  const [loan, setLoan] = useState<LoanWithRepayments | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      const [loanResult, repaymentsResult] = await Promise.all([
        supabase.from("loans").select("*").eq("id", id).single(),
        supabase
          .from("loan_repayments")
          .select("*")
          .eq("loan_id", id)
          .order("date", { ascending: false }),
      ]);

      if (cancelled) return;

      if (!loanResult.data) {
        router.replace("/wallet/loans");
        return;
      }

      const enriched = enrichLoan(
        loanResult.data as Loan,
        (repaymentsResult.data ?? []) as LoanRepayment[],
      );
      setLoan(enriched);
      setIsLoading(false);
    }

    fetch();
    return () => { cancelled = true; };
  }, [supabase, id, router]);

  if (isLoading || !loan) return <EditFormSkeleton />;

  return <RepaymentForm loan={loan} />;
}
