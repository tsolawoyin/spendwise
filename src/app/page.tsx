import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user has a budget
  const { data: budget } = await supabase
    .from("budgets")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  redirect(budget ? "/dashboard" : "/onboarding");
}
