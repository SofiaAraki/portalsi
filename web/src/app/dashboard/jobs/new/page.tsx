"use client";

import { useState, useEffect } from "react";
import { api } from "../../../lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/auth-context";

export default function NewJobPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [form, setForm] = useState({
    titulo: "",
    empresa: "",
    descricao: "",
    localizacao: "",
    link: "",
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
      await api.post("/jobs", form);
      router.push("/dashboard/jobs");
      router.refresh();
    } catch (err) {
      alert("Falha ao salvar. Verifique se os campos obrigatórios estão preenchidos.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) return <p className="text-center p-10">Carregando...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🚀 Indicar Oportunidade</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Compartilhe uma vaga com a comunidade e ajude seus colegas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-gray-900 p-8 rounded-3xl border dark:border-gray-800 shadow-sm">
        
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Título da Vaga *</label>
          <input
            required
            placeholder="Ex: Desenvolvedor Frontend Jr."
            className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Empresa *</label>
            <input
              required
              placeholder="Nome da empresa"
              className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setForm({ ...form, empresa: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Localização</label>
            <input
              placeholder="Ex: Remoto ou São Paulo - SP"
              className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setForm({ ...form, localizacao: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Descrição Detalhada</label>
          <textarea
            rows={4}
            placeholder="Conte um pouco sobre os requisitos ou a vaga..."
            className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Link da Vaga / Inscrição</label>
          <input
            type="url"
            placeholder="https://..."
            className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3 pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-blue-500/20"
          >
            {isSubmitting ? "Salvando..." : "Publicar Vaga"}
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