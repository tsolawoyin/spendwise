import { Skeleton } from "@/components/ui/skeleton";

export default function SummarySkeleton() {
  return (
    <div className="space-y-4">
      {/* Title */}
      <Skeleton className="h-8 w-36" />

      {/* Streak + dots */}
      <Skeleton className="h-14 w-full rounded-2xl" />
      <Skeleton className="h-8 w-full rounded-xl" />

      {/* Category bars */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
          </div>
        ))}
      </div>

      {/* XP card */}
      <Skeleton className="h-20 w-full rounded-2xl" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
      </div>
    </div>
  );
}
