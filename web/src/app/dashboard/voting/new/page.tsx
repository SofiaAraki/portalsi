"use client";

import { useState, useEffect } from "react";
import { api } from "../../../lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/auth-context";

export default function NewVotingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
  });

  const [opcoes, setOpcoes] = useState<string[]>(["", ""]); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      router.push("/dashboard/voting");
    }
  }, [user, loading, router]);

  const addOpcao = () => setOpcoes([...opcoes, ""]);
  
  const removeOpcao = (index: number) => {
    if (opcoes.length > 2) {
      setOpcoes(opcoes.filter((_, i) => i !== index));
    }
  };

  const handleOpcaoChange = (index: number, value: string) => {
    const newOpcoes = [...opcoes];
    newOpcoes[index] = value;
    setOpcoes(newOpcoes);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        dataInicio: new Date(form.dataInicio).toISOString(),
        dataFim: new Date(form.dataFim).toISOString(),
        opcoes: opcoes.filter(op => op.trim() !== ""),
      };

      await api.post("/voting", payload);
      router.push("/dashboard/voting");
      router.refresh();
    } catch (err) {
      alert("Falha ao salvar. Verifique se as datas e opções estão corretas.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) return <div className="p-10 text-center">Carregando...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🗳️ Nova Votação</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Defina o tema, o prazo e as opções para a comunidade.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-3xl border dark:border-gray-800 shadow-sm">
        
        {/* TÍTULO */}
        <div>
          <label className="block text-sm font-semibold mb-2">Título da Votação *</label>
          <input
            required
            placeholder="Ex: Escolha do novo representante"
            className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />
        </div>

        {/* DATAS */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Início *</label>
            <input
              required
              type="datetime-local"
              className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, dataInicio: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Fim *</label>
            <input
              required
              type="datetime-local"
              className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, dataFim: e.target.value })}
            />
          </div>
        </div>

        {/* DESCRIÇÃO */}
        <div>
          <label className="block text-sm font-semibold mb-2">Descrição / Contexto</label>
          <textarea
            rows={3}
            placeholder="Explique os detalhes desta votação..."
            className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
        </div>

        {/* SEÇÃO DE OPÇÕES DINÂMICAS */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-blue-600 uppercase tracking-wider">Opções de Voto</label>
          {opcoes.map((opcao, index) => (
            <div key={index} className="flex gap-2">
              <input
                required
                placeholder={`Opção ${index + 1}`}
                value={opcao}
                className="flex-1 border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleOpcaoChange(index, e.target.value)}
              />
              {opcoes.length > 2 && (
                <button 
                  type="button" 
                  onClick={() => removeOpcao(index)}
                  className="px-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            onClick={addOpcao}
            className="text-sm font-bold text-blue-600 hover:underline pt-2"
          >
            + Adicionar outra opção
          </button>
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="flex flex-col md:flex-row gap-3 pt-6 border-t dark:border-gray-800">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-2xl shadow-lg shadow-blue-500/20 transition-all"
          >
            {isSubmitting ? "Criando..." : "Lançar Votação"}
          </button>
          <button 
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}