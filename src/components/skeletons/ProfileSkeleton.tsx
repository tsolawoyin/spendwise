import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-2 pt-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-44" />
      </div>

      {/* Info cards */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-2xl" />
        ))}
      </div>

      {/* Settings */}
      <Skeleton className="h-12 w-full rounded-2xl" />

      {/* Danger zone */}
      <Skeleton className="h-12 w-full rounded-2xl" />

      {/* Sign out */}
      <Skeleton className="h-11 w-full rounded-xl" />
    </div>
  );
}
