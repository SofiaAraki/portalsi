"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../contexts/auth-context";
import Link from "next/link";

interface Project {
  id: string;
  titulo: string;
  descricao: string;
  githubUrl: string;
  status: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const { loading } = useAuth();

  async function loadProjects() {
    try {
      const response = await api.get("/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Buscando portfólios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🎓 Mural de Projetos</h1>
          <p className="text-gray-500 dark:text-gray-400">Exiba suas criações ou inspire-se com o que a galera está desenvolvendo.</p>
        </div>

        {/* Agora liberado para qualquer usuário autenticado */}
        <Link href="/dashboard/projects/new">
          <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">
            + Novo Projeto
          </button>
        </Link>
      </div>

      <hr className="dark:border-gray-800" />

      {/* EMPTY STATE */}
      {projects.length === 0 && (
        <div className="text-center py-24 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
          <span className="text-5xl block mb-4">🚀</span>
          <p className="text-gray-500 font-medium">Ninguém compartilhou um projeto ainda.</p>
          <p className="text-sm text-gray-400">Seja o primeiro a mostrar seu código!</p>
        </div>
      )}

      {/* GRID DE PROJETOS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group bg-white border dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-2xl">
                  💻
                </span>
                {project.status && (
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                    project.status === 'CONCLUIDO' 
                    ? 'bg-green-50 text-green-600 dark:bg-green-900/30' 
                    : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30'
                  }`}>
                    {project.status}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                {project.titulo}
              </h2>

              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                {project.descricao}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-bold py-3 rounded-2xl transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                  GitHub
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}