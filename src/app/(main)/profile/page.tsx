import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileContent from "@/components/ProfileContent";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  // Fetch most recent budget
  const { data: budget } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!budget) {
    redirect("/onboarding");
  }

  return <ProfileContent profile={profile} budget={budget} />;
}
