import { Skeleton } from "@/components/ui/skeleton";

export default function EditFormSkeleton() {
  return (
    <div className="space-y-5">
      {/* Drag handle */}
      <div className="flex justify-center">
        <Skeleton className="h-1.5 w-12 rounded-full" />
      </div>

      {/* Title */}
      <Skeleton className="h-7 w-36" />

      {/* Amount */}
      <Skeleton className="h-12 w-full rounded-xl" />

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-full" />
        ))}
      </div>

      {/* Date */}
      <Skeleton className="h-12 w-full rounded-xl" />

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-11 flex-1 rounded-xl" />
        <Skeleton className="h-11 flex-1 rounded-xl" />
      </div>
    </div>
  );
}
