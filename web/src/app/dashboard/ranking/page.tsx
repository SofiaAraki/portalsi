"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function RankingPage() {
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/ranking")
      .then(res => setRanking(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium animate-pulse">Calculando pontuações...</p>
    </div>
  );

  const getPodiumColor = (index: number) => {
    if (index === 0) return "from-yellow-400 to-amber-600";
    if (index === 1) return "from-slate-300 to-slate-500";
    return "from-orange-400 to-rose-700";
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-12">
      
      {/* HEADER */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          🏆 Hall da Fama
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Reconhecendo os alunos que mais impulsionam a nossa comunidade de SI.
        </p>
      </div>

      {/* PODIUM SECTION */}
      <div className="flex flex-col md:flex-row justify-center items-center md:items-end gap-6 md:gap-2 px-4 py-8">
        
        {/* 2º LUGAR */}
        {ranking[1] && (
          <div className="order-2 md:order-1 flex flex-col items-center group">
            <div className="mb-3 text-center">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">2º Lugar</p>
              <p className="font-bold dark:text-white group-hover:text-blue-500 transition-colors">{ranking[1].nome}</p>
            </div>
            <div className="bg-gradient-to-b from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-900 w-32 h-36 rounded-t-[2rem] flex flex-col items-center justify-center shadow-lg border-x border-t border-white/20">
              <span className="text-4xl mb-2">🥈</span>
              <span className="text-sm font-black text-slate-800 dark:text-slate-200">{ranking[1].pontos} pts</span>
            </div>
          </div>
        )}

        {/* 1º LUGAR */}
        {ranking[0] && (
          <div className="order-1 md:order-2 flex flex-col items-center group z-10 scale-110 md:scale-125">
            <div className="mb-4 text-center">
              <span className="inline-block bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase mb-1 shadow-sm">MVP</span>
              <p className="font-black text-gray-900 dark:text-white group-hover:text-yellow-500 transition-colors">{ranking[0].nome}</p>
            </div>
            <div className="bg-gradient-to-b from-yellow-300 to-amber-500 w-36 h-52 rounded-t-[2.5rem] flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(234,179,8,0.3)] border-x border-t border-white/40">
              <span className="text-5xl mb-2 drop-shadow-md">👑</span>
              <span className="text-lg font-black text-amber-950">{ranking[0].pontos} pts</span>
            </div>
          </div>
        )}

        {/* 3º LUGAR */}
        {ranking[2] && (
          <div className="order-3 flex flex-col items-center group">
            <div className="mb-3 text-center">
              <p className="text-xs font-black text-orange-400 uppercase tracking-widest">3º Lugar</p>
              <p className="font-bold dark:text-white group-hover:text-orange-500 transition-colors">{ranking[2].nome}</p>
            </div>
            <div className="bg-gradient-to-b from-orange-200 to-orange-400 dark:from-orange-800/50 dark:to-orange-950 w-32 h-28 rounded-t-[2rem] flex flex-col items-center justify-center shadow-lg border-x border-t border-white/10">
              <span className="text-4xl mb-1">🥉</span>
              <span className="text-sm font-black text-orange-900 dark:text-orange-200">{ranking[2].pontos} pts</span>
            </div>
          </div>
        )}
      </div>

      {/* FULL LIST */}
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
        <div className="px-8 py-6 border-b dark:border-gray-800 flex justify-between items-center">
          <h2 className="font-black text-xl text-gray-800 dark:text-white">Classificação Geral</h2>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{ranking.length} Participantes</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b dark:border-gray-800">
                <th className="px-8 py-5">Rank</th>
                <th className="px-8 py-5">Estudante</th>
                <th className="px-8 py-5 text-right">Engajamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {ranking.map((item, index) => (
                <tr key={item.id} className="group hover:bg-gray-50 dark:hover:bg-blue-500/5 transition-all">
                  <td className="px-8 py-5">
                    <span className={`
                      inline-flex items-center justify-center w-8 h-8 rounded-lg font-black text-sm
                      ${index === 0 ? "bg-yellow-400 text-yellow-900" : 
                        index === 1 ? "bg-slate-200 text-slate-600" :
                        index === 2 ? "bg-orange-100 text-orange-700" : 
                        "text-gray-400"}
                    `}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${index < 3 ? 'animate-pulse bg-green-500' : 'bg-gray-300'}`} />
                      <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-blue-600 transition-colors">
                        {item.nome}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="font-black text-blue-600 dark:text-blue-400">
                      {item.pontos.toLocaleString()}
                      <span className="ml-1 text-[10px] uppercase opacity-60">pts</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30 text-center">
        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
          💡 <strong>Dica:</strong> Ganhe pontos postando vagas, criando projetos e participando de votações!
        </p>
      </div>
    </div>
  );
}