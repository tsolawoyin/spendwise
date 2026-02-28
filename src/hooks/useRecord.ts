"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/providers/app-provider";

export function useRecord<T>(table: string, id: string) {
  const { supabase } = useApp();
  const router = useRouter();
  const [record, setRecord] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchRecord() {
      const { data } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .single();

      if (cancelled) return;

      if (!data) {
        router.replace("/dashboard");
        return;
      }

      setRecord(data as T);
      setIsLoading(false);
    }

    fetchRecord();

    return () => {
      cancelled = true;
    };
  }, [supabase, table, id, router]);

  return { record, isLoading };
}
