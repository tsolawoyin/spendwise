import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-store";
import AppProvider from "@/providers/app-provider";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpendWise",
  description: "The one app that helps you track your spending easily",
};

const Dynamic = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data?.user?.id)
    .single();

  let user;

  if (!data.user || !profile) {
    user = null;
  } else {
    user = {
      id: data.user.id,
      profile: profile,
      user: data.user,
    };
  }

  return <AppProvider supabase_user={user}>{children}</AppProvider>;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.className} antialiased`}>
        <ThemeProvider
          attribute={"class"}
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <Dynamic>{children}</Dynamic>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
