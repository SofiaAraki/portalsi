"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../contexts/auth-context";
import Link from "next/link";

interface Event {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  local: string;
  link: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const { user, loading } = useAuth();

  async function loadEvents() {
    try {
      const response = await api.get("/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Sincronizando calendário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📅 Mural de Eventos</h1>
          <p className="text-gray-500 dark:text-gray-400">Fique por dentro de workshops, meetups e palestras.</p>
        </div>

        {/* Trava de ADMIN mantida conforme solicitado */}
        {user?.role === "ADMIN" && (
          <Link href="/dashboard/events/new">
            <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">
              + Novo Evento
            </button>
          </Link>
        )}
      </div>

      <hr className="dark:border-gray-800" />

      {/* EMPTY STATE */}
      {events.length === 0 && (
        <div className="text-center py-24 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
          <span className="text-5xl block mb-4">🗓️</span>
          <p className="text-gray-500 font-medium">Nenhum evento agendado para os próximos dias.</p>
        </div>
      )}

      {/* GRID DE EVENTOS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="group bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-2xl">
                  🚀
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md">
                  Confirmado
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                {event.titulo}
              </h2>

              <div className="flex items-center gap-2 mt-2 text-blue-600 font-bold text-sm italic">
                <span>🕒 {event.data}</span>
              </div>

              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                {event.descricao}
              </p>

              {event.local && (
                <div className="flex items-center gap-1.5 mt-4 text-gray-400">
                  <span className="text-xs font-medium">📍 {event.local}</span>
                </div>
              )}
            </div>

            {event.link && (
              <a
                href={event.link}
                target="_blank"
                className="mt-6 w-full inline-block text-center bg-gray-100 dark:bg-gray-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-gray-700 dark:text-gray-300 text-sm font-bold py-3 rounded-2xl transition-all"
              >
                Inscrição / Detalhes →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}