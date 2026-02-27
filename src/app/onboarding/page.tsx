import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OnboardingFlow from "@/components/OnboardingFlow";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user already has a budget
  const { data: budget } = await supabase
    .from("budgets")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (budget) {
    redirect("/dashboard");
  }

  return <OnboardingFlow />;
}
