"use client";

import { useState } from "react";
import { api } from "../lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/register", {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha
      });

      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao criar conta. Tente outro e-mail.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-mono">Portal SI</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Crie sua conta acadêmica</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-100 dark:border-red-800 text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white outline-none transition-all"
              placeholder="Ex: Fernando Silva"
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white outline-none transition-all"
              placeholder="seu@email.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white outline-none transition-all"
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, senha: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmar</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white outline-none transition-all"
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, confirmarSenha: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 mt-4 rounded-lg transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50"
          >
            {loading ? "Criando conta..." : "Registrar agora"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Já tem uma conta? <Link href="/login" className="text-blue-600 hover:underline font-medium">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}