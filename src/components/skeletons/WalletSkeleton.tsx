import { Skeleton } from "@/components/ui/skeleton";

export default function WalletSkeleton() {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48 mt-1" />
      </div>

      {/* Quick add buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
      </div>

      {/* Loan card */}
      <Skeleton className="h-28 w-full rounded-xl" />

      {/* Savings card */}
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  );
}
