"use client";

import { useState, useEffect } from "react";
import { api } from "../../../lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/auth-context";

export default function NewEventPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    data: "",
    local: "",
    link: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Mantém a trava de ADMIN: apenas administradores podem criar eventos
    if (!loading && user?.role !== "ADMIN") {
      router.push("/dashboard/events");
    }
  }, [user, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        data: form.data ? new Date(form.data).toISOString() : null,
      };

      await api.post("/events", payload);
      
      router.push("/dashboard/events");
      router.refresh();
    } catch (err: any) {
      console.error("Erro completo da API:", err.response?.data);
      alert("Falha ao salvar. Verifique se a data foi preenchida corretamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) return <div className="flex justify-center p-10 font-medium text-gray-500">Verificando permissões...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🗓️ Organizar Evento</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Crie um novo evento oficial para a comunidade acadêmica.
        </p>
      </div>

      {/* FORMULÁRIO */}
      <form 
        onSubmit={handleSubmit} 
        className="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-3xl border dark:border-gray-800 shadow-sm"
      >
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Título do Evento *
          </label>
          <input
            required
            placeholder="Ex: Workshop de React e Next.js"
            className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Data do Evento *
            </label>
            <input
              required
              type="date"
              className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setForm({ ...form, data: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Local / Plataforma
            </label>
            <input
              placeholder="Ex: Auditório B ou Google Meet"
              className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setForm({ ...form, local: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Descrição do Evento
          </label>
          <textarea
            rows={4}
            placeholder="Detalhes sobre o que será abordado, palestrantes, etc."
            className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Link para Inscrição / Transmissão
          </label>
          <input
            type="url"
            placeholder="https://..."
            className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />
        </div>

        {/* BOTÕES */}
        <div className="flex flex-col md:flex-row gap-3 pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            {isSubmitting ? "Criando Evento..." : "Publicar Evento"}
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