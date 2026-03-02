"use client";
import { ProtectedRoute } from "../components/protected-route";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import Link from "next/link";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  async function loadData() {
    try {
      const response = await api.get("/dashboard");
      setData(response.data);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-medium text-gray-500 animate-pulse">Sincronizando portal...</p>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto space-y-10 pb-12">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Olá, {data.userName?.split(' ')[0] || 'Estudante'}! 👋
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
              Confira os destaques do curso de <span className="text-blue-600 font-semibold">Sistemas de Informação</span>.
            </p>
          </div>
          <div className="hidden md:block text-right text-sm text-gray-400 font-medium">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </header>

        {/* TOP METRICS GRID - Agora com 2 colunas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/dashboard/ranking" className="group">
            <div className="h-full bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-500/20 transform transition-all hover:-translate-y-1 active:scale-95">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-white/20 p-2 rounded-lg backdrop-blur-md text-xl">🏆</span>
                <span className="text-xs font-bold uppercase tracking-widest opacity-70">Sua Pontuação</span>
              </div>
              <p className="text-4xl font-black">{data.pontosUsuario} <span className="text-lg font-normal opacity-80">pts</span></p>
              <div className="mt-4 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/voting" className="group">
            <div className="h-full bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-xl text-orange-600">🗳️</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Votações Acadêmicas</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold text-gray-900 dark:text-white">{data.votacoesAtivas?.length || 0}</p>
                <span className="text-orange-500 font-bold text-sm">Ativas no momento</span>
              </div>
              <p className="text-sm text-gray-400 mt-2 italic">Sua voz faz a diferença no curso.</p>
            </div>
          </Link>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* OPORTUNIDADES - Coluna mais larga */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-end px-2">
              <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                💼 Vagas e Estágios
              </h2>
              <Link href="/dashboard/jobs" className="text-blue-600 text-sm font-bold hover:underline bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-full">
                Ver todas
              </Link>
            </div>
            <div className="grid gap-4">
              {data.vagas?.slice(0, 4).map((vaga: any) => (
                <div key={vaga.id} className="group bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex justify-between items-center hover:border-blue-500 transition-all shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center font-bold text-blue-600 text-xl">
                      {vaga.empresa?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">{vaga.titulo}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{vaga.empresa} • <span className="text-green-600 font-medium">{vaga.localizacao || 'Remoto'}</span></p>
                    </div>
                  </div>
                  <span className="hidden sm:block text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest">Nova</span>
                </div>
              ))}
              {data.vagas?.length === 0 && <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-gray-400 italic">Nenhuma vaga postada ultimamente.</div>}
            </div>
          </section>

          {/* CALENDÁRIO - Coluna Lateral */}
          <section className="bg-rose-50/50 dark:bg-rose-900/10 p-8 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/30 flex flex-col">
            <h2 className="font-bold text-xl mb-6 flex items-center gap-2 dark:text-white">
              📆 Próximos Eventos
            </h2>
            <div className="space-y-6 flex-1">
              {data.eventos?.slice(0, 3).map((event: any) => (
                <div key={event.id} className="flex gap-4 items-start group">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-xl text-center min-w-[55px] border border-rose-200 dark:border-rose-900/50 shadow-sm transition-transform group-hover:scale-105">
                    <p className="text-[10px] font-bold text-rose-500 uppercase">{new Date(event.data).toLocaleDateString('pt-BR', { month: 'short' })}</p>
                    <p className="text-xl font-black text-gray-800 dark:text-gray-200">{new Date(event.data).getDate()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight">{event.titulo}</p>
                    <p className="text-[10px] text-rose-500 font-bold uppercase mt-1 flex items-center gap-1">
                      📍 {event.local || 'Local a definir'}
                    </p>
                  </div>
                </div>
              ))}
              {(!data.eventos || data.eventos.length === 0) && <p className="text-sm text-gray-400 italic">Sem eventos para esta semana.</p>}
            </div>
            <Link href="/dashboard/events" className="mt-8 block text-center text-xs font-bold text-rose-600 bg-white dark:bg-gray-900 py-3 rounded-xl border border-rose-100 dark:border-rose-900/30 hover:bg-rose-100 transition">
              Ver agenda completa
            </Link>
          </section>
        </div>

        {/* PROJETOS - Seção Horizontal Final */}
        <section className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
              🚀 Projetos da Comunidade
            </h2>
            <Link href="/dashboard/projects" className="text-blue-600 text-sm font-bold hover:underline bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-full">
              Explorar todos
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.projetos?.slice(0, 3).map((project: any) => (
              <div key={project.id} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded uppercase">{project.status}</span>
                    <span className="text-xl opacity-0 group-hover:opacity-100 transition-opacity">🔗</span>
                  </div>
                  <p className="mt-4 font-bold text-lg leading-tight dark:text-white group-hover:text-blue-600 transition-colors">{project.titulo}</p>
                </div>
                <div className="mt-6 pt-4 border-t dark:border-gray-800 flex items-center gap-2 text-xs">
                  <div className="w-6 h-6 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                    {project.criador?.nome?.charAt(0)}
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Por {project.criador?.nome}</span>
                </div>
              </div>
            ))}
            {data.projetos?.length === 0 && <div className="col-span-full text-center py-10 text-gray-400 italic">Ainda não há projetos por aqui.</div>}
          </div>
        </section>
        
      </div>
    </ProtectedRoute>
  );
}