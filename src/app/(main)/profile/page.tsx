"use client";

import { useApp } from "@/providers/app-provider";
import { useBudgetData } from "@/hooks/useBudgetData";
import ProfileContent from "@/components/ProfileContent";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";

export default function ProfilePage() {
  const { user } = useApp();
  const { data, isLoading } = useBudgetData({ budgetOnly: true });

  if (isLoading || !data || !user) return <ProfileSkeleton />;

  return <ProfileContent profile={user.profile} budget={data.budget} />;
}
