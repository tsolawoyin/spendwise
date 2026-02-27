import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import IncomeForm from "@/components/IncomeForm";

export default async function EditIncomePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: income } = await supabase
    .from("income")
    .select("*")
    .eq("id", id)
    .single();

  if (!income) notFound();

  return <IncomeForm mode="edit" initialData={income} />;
}
