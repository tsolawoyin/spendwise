export default function MainLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <div className="h-8 w-8 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}
