import { Skeleton } from "@/components/ui/skeleton";

export default function LoanDetailSkeleton() {
  return (
    <div className="space-y-5">
      {/* Nav */}
      <div className="flex justify-between">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-10" />
      </div>

      {/* Hero card */}
      <Skeleton className="h-48 w-full rounded-2xl" />

      {/* Action buttons */}
      <div className="flex gap-3">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <Skeleton className="h-12 flex-1 rounded-xl" />
      </div>

      {/* Info card */}
      <Skeleton className="h-24 w-full rounded-xl" />

      {/* Repayments */}
      <div>
        <Skeleton className="h-6 w-28 mb-2" />
        <div className="divide-y divide-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
