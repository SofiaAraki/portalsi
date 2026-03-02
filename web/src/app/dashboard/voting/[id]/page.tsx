"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "./../../../lib/api";

interface Opcao {
  id: string;
  titulo: string;
  _count?: { votos: number };
}

interface VotingDetails {
  id: string;
  titulo: string;
  descricao: string;
  dataFim: string;
  opcoes: Opcao[];
  userHasVoted: boolean;
}

export default function VotingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [voting, setVoting] = useState<VotingDetails | null>(null);
  const [selectedOpcao, setSelectedOpcao] = useState("");
  const [loading, setLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);

  const loadVoting = async () => {
    try {
      const response = await api.get(`/voting/${id}`);
      setVoting(response.data);
    } catch (error) {
      console.error("Erro", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadVoting(); }, [id]);

  const handleVote = async () => {
    if (!selectedOpcao) return alert("Selecione uma opção!");
    setIsVoting(true);
    try {
      await api.post(`/voting/${id}/vote`, { opcaoId: selectedOpcao });
      alert("Voto computado! +1 ponto no ranking.");
      loadVoting();
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao votar");
    } finally {
      setIsVoting(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse">Carregando...</div>;
  if (!voting) return <div className="p-20 text-center">Votação não encontrada.</div>;

  const totalVotos = voting.opcoes.reduce((acc, op) => acc + (op._count?.votos || 0), 0);
  const isEncerrada = new Date() > new Date(voting.dataFim);
  const showResults = voting.userHasVoted || isEncerrada;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button onClick={() => router.back()} className="mb-6 text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2">
        ← Voltar para o mural
      </button>

      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-12 border dark:border-gray-800 shadow-2xl">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              {isEncerrada ? "Resultado Final" : "Votação em Curso"}
            </span>
            <span className="text-gray-400 text-xs">• {totalVotos} votos totais</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white leading-tight">{voting.titulo}</h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400 leading-relaxed">{voting.descricao}</p>
        </header>

        <div className="space-y-6">
          {voting.opcoes.map((opcao) => {
            const votosOpcao = opcao._count?.votos || 0;
            const porcentagem = totalVotos > 0 ? Math.round((votosOpcao / totalVotos) * 100) : 0;

            if (showResults) {
              return (
                <div key={opcao.id} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold dark:text-white">
                    <span>{opcao.titulo}</span>
                    <span className="text-blue-600">{porcentagem}%</span>
                  </div>
                  <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${porcentagem}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{votosOpcao} votos</p>
                </div>
              );
            }

            return (
              <label key={opcao.id} className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedOpcao === opcao.id ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "border-gray-100 dark:border-gray-800 hover:border-gray-300"}`}>
                <input type="radio" name="option" value={opcao.id} className="hidden" onChange={(e) => setSelectedOpcao(e.target.value)} />
                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${selectedOpcao === opcao.id ? "border-blue-600" : "border-gray-300"}`}>
                  {selectedOpcao === opcao.id && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                </div>
                <span className="font-bold text-gray-700 dark:text-gray-200">{opcao.titulo}</span>
              </label>
            );
          })}
        </div>

        {!showResults && (
          <button
            onClick={handleVote}
            disabled={isVoting || !selectedOpcao}
            className="w-full mt-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95"
          >
            {isVoting ? "Processando..." : "Confirmar meu Voto"}
          </button>
        )}

        {showResults && !isEncerrada && (
          <div className="mt-10 p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-2xl text-center">
            <p className="text-green-600 dark:text-green-400 text-sm font-bold">✨ Seu voto foi registrado. Obrigado por participar!</p>
          </div>
        )}
      </div>
    </div>
  );
}