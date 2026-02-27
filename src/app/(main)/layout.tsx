import BottomNav from "@/components/BottomNav";
import PageTransition from "@/components/motion/PageTransition";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="max-w-[430px] mx-auto px-4 pt-4 pb-24">
        <PageTransition>{children}</PageTransition>
      </main>
      <BottomNav />
    </>
  );
}
