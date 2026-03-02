"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "../components/theme-toggle";
import { ThemeProvider } from "../components/theme-provider";
import { useAuth } from "../contexts/auth-context";

export default function DashboardLayout({ children }: any) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Proteção simples de rota no front
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const menu = [
    { name: "Home", href: "/dashboard", icon: "🏠" },
    { name: "Eventos", href: "/dashboard/events", icon: "📅" },
    { name: "Vagas", href: "/dashboard/jobs", icon: "💼" },
    { name: "Projetos", href: "/dashboard/projects", icon: "🎓" },
    { name: "Votação", href: "/dashboard/voting", icon: "🗳️" },
    { name: "Rank", href: "/dashboard/ranking", icon: "🏆" },
    { name: "Perfil", href: "/dashboard/profile", icon: "👤" },
  ];

  if (user?.role === "ADMIN") {
    menu.push({ name: "Administração", href: "/dashboard/admin", icon: "⚙️" });
  }

  // Se estiver carregando, mostra um estado de skeleton ou vazio para evitar flash de tela
  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-[#05070a]" />;

  // Função para fechar o menu ao clicar em um link no mobile
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <ThemeProvider>
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#05070a] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* OVERLAY MOBILE */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeMenu}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-50 transition-all duration-300
        w-72 bg-white dark:bg-gray-900/90 border-r border-gray-200 dark:border-gray-800/50 backdrop-blur-xl p-6
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        <div className="flex flex-col h-full">
          {/* LOGO */}
          <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/40">
                SI
              </div>
              <h2 className="text-xl font-black tracking-tighter uppercase italic">Portal SI</h2>
            </div>
            <button onClick={closeMenu} className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors">✕</button>
          </div>

          {/* NAV LINKS */}
          <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
            {menu.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all group
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  <span className={`text-lg transition-transform group-hover:scale-110 ${isActive ? "scale-110" : ""}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* FOOTER DA SIDEBAR (User & Settings) */}
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-3">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Preferências</span>
              <ThemeToggle />
            </div>

            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-2xl border border-gray-100 dark:border-gray-800/50">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold truncate dark:text-gray-200">{user?.email}</p>
                <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter">{user?.role}</p>
              </div>
            </div>

            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all active:scale-[0.98] group"
            >
              <span>🚪</span>
              Sair da conta
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0">
        {/* HEADER MOBILE */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-30">
           <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
           >
              <span className="text-xl">☰</span>
           </button>
           <div className="font-black text-blue-600 tracking-tighter italic">PORTAL SI</div>
           <div className="w-10"></div>
        </div>

        <div className="p-4 md:p-8 lg:p-10 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
    </ThemeProvider>
  );
}