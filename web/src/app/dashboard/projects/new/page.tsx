"use client";

import { useState, useEffect } from "react";
import { api } from "../../../lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/auth-context";

export default function NewProjectPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    githubUrl: "",
    status: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/projects", form);
      router.push("/dashboard/projects");
      router.refresh();
    } catch (err) {
      alert("Falha ao salvar o projeto. Verifique se os campos obrigatórios estão preenchidos.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) return (
    <div className="flex justify-center p-10">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🚀 Publicar Projeto</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Mostre para a comunidade o que você está construindo.
        </p>
      </div>

      {/* FORMULÁRIO */}
      <form 
        onSubmit={handleSubmit} 
        className="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-3xl border dark:border-gray-800 shadow-sm"
      >
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Título do Projeto *
          </label>
          <input
            required
            placeholder="Ex: Plataforma de Estudos com Next.js"
            className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Descrição *
          </label>
          <textarea
            required
            rows={4}
            placeholder="Quais tecnologias usou? Qual o objetivo do projeto?"
            className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Link do GitHub
            </label>
            <input
              type="url"
              placeholder="https://github.com/..."
              className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Status do Projeto *
            </label>
            <select
              required
              className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none bg-no-repeat bg-right"
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="">Selecione...</option>
              <option value="EM_ANDAMENTO">🛠️ Em desenvolvimento</option>
              <option value="CONCLUIDO">✅ Concluído</option>
            </select>
          </div>
        </div>

        {/* BOTÕES */}
        <div className="flex flex-col md:flex-row gap-3 pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            {isSubmitting ? "Publicando..." : "Publicar Projeto"}
          </button>
          
          <button 
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}