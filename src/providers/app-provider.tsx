"use client";

import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

import { createClient } from "@/lib/supabase/client";
import {
  RequiredClaims,
  SupabaseClient,
  User as SupabaseUser,
} from "@supabase/supabase-js";
import { Toaster } from "@/components/ui/sonner";

export interface Profile {
  id: string;
  email: string;
  //   phone: string; // don't mind me ehn. issa mistake. omase o...
  avatar_url: string;
  name: string;
  created_at: string;
}

export interface User {
  id: string;
  profile: Profile;
  user: RequiredClaims | SupabaseUser;
}

interface App {
  supabase: SupabaseClient;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export const AppContext = createContext<App | null>(null);

export default function AppProvider({
  children,
  supabase_user,
}: {
  children: React.ReactNode;
  supabase_user: User | null;
}) {
  const supabase = createClient();
  const [user, setUser] = useState(supabase_user);
  
  const app = {
    supabase,
    user,
    setUser,
  };

  return (
    <AppContext.Provider value={app}>
      {children}
      <Toaster />
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("AppContext must be used with AppProvider");
  return ctx;
}
