"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";

type User = {
  email: string;
  sub: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function getMe() {
    try {
      const res = await api.get("/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMe();
  }, []);

  async function signIn(email: string, senha: string) {
    await api.post("/login", { email, senha });

    await getMe();

    router.push("/dashboard");
  }

  async function logout() {
    await api.post("/logout");

    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);