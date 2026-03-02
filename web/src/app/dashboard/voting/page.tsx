"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../contexts/auth-context";
import Link from "next/link";

interface Voting {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
} 

export default function VotingPage() {
  const [voting, setVotings] = useState<Voting[]>([]);
  const { user, loading } = useAuth();

  async function loadVotings() {
    try {
      const response = await api.get("/voting");
      setVotings(response.data);
    } catch (error) {
      console.error("Erro ao carregar votações:", error);
    }
  }

  useEffect(() => {
    loadVotings();
  }, []);

  const getStatus = (inicio: string, fim: string) => {
    const agora = new Date();
    const dataI = new Date(inicio);
    const dataF = new Date(fim);

    if (agora < dataI) return { label: "Futura", color: "bg-gray-100 text-gray-600" };
    if (agora > dataF) return { label: "Encerrada", color: "bg-red-100 text-red-600" };
    return { label: "Ativa", color: "bg-green-100 text-green-600 shadow-sm shadow-green-200" };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Carregando assembleia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🗳️ Mural de Votações</h1>
          <p className="text-gray-500 dark:text-gray-400">Sua voz ajuda a construir nossa comunidade.</p>
        </div>

        {user?.role === "ADMIN" && (
          <Link href="/dashboard/voting/new">
            <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">
              + Nova Votação
            </button>
          </Link>
        )}
      </div>

      <hr className="dark:border-gray-800" />

      {/* EMPTY STATE */}
      {voting.length === 0 && (
        <div className="text-center py-24 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
          <span className="text-5xl block mb-4">📢</span>
          <p className="text-gray-500 font-medium">Nenhuma votação em andamento no momento.</p>
        </div>
      )}

      {/* GRID DE VOTAÇÕES */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {voting.map((voting) => {
          const status = getStatus(voting.dataInicio, voting.dataFim);
          
          return (
            <div
              key={voting.id}
              className="group bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-2xl">
                    ⚖️
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                  {voting.titulo}
                </h2>

                <p className="mt-2 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                  {new Date(voting.dataInicio).toLocaleDateString()} — {new Date(voting.dataFim).toLocaleDateString()}
                </p>

                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                  {voting.descricao}
                </p>
              </div>

              <Link 
                href={`/dashboard/voting/${voting.id}`}
                className="mt-6 w-full inline-block text-center bg-gray-100 dark:bg-gray-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-gray-700 dark:text-gray-300 text-sm font-bold py-3 rounded-2xl transition-all"
              >
                {status.label === "Encerrada" ? "Ver Resultados →" : "Participar →"}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}