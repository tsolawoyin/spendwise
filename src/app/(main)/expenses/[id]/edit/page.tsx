import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ExpenseForm from "@/components/ExpenseForm";

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: expense } = await supabase
    .from("expenses")
    .select("*")
    .eq("id", id)
    .single();

  if (!expense) notFound();

  return <ExpenseForm mode="edit" initialData={expense} />;
}
