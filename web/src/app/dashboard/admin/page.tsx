"use client";

import { useEffect, useState } from "react";
import { api } from "./../../lib/api";

const TABS = [
  { id: "users", label: "Usuários", icon: "👤", color: "text-blue-600" },
  { id: "events", label: "Eventos", icon: "📅", color: "text-purple-600" },
  { id: "vagas", label: "Vagas", icon: "💼", color: "text-emerald-600" },
  { id: "projects", label: "Projetos", icon: "🚀", color: "text-emerald-600" },
  { id: "votes", label: "Votações", icon: "🗳️", color: "text-red-600" },
  { id: "ranking", label: "Rank", icon: "🏆", color: "text-indigo-600" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  
  // Estados de Paginação
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, lRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get(`/admin/list/${activeTab}?page=${page}&limit=10`)
      ]);
      setStats(sRes.data);
      setData(lRes.data.items); // Note o .items vindo do backend
      setTotalPages(lRes.data.pages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, page]);

  const startEdit = (item: any) => {
    setEditingItem(item);
    setEditForm(item); // Copia os dados atuais para o formulário
  };

  const handleUpdate = async () => {
    try {
      await api.patch(`/admin/${activeTab}/${editingItem.id}`, editForm);
      setEditingItem(null);
      fetchData(); // Atualiza a lista
      alert("Atualizado com sucesso!");
    } catch (e) {
      alert("Erro ao atualizar.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Confirmar exclusão?")) return;
    try {
      await api.delete(`/admin/${activeTab}/${id}`);
      // Ao deletar, recarregamos tudo para atualizar os números (stats) e a lista
      fetchData(); 
    } catch (e) { alert("Erro ao excluir."); }
  };

  // Reseta a página ao trocar de aba
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setPage(1);
  };

  if (loading && !stats) return <div className="p-20 text-center animate-pulse font-black text-blue-600">SINCRONIZANDO COM A CENTRAL...</div>;

  if (!stats) return (
    <div className="p-20 text-center space-y-4">
      <p className="text-red-500 font-bold">ERRO: API de Administração offline.</p>
      <button onClick={() => fetchData()} className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold">Tentar Novamente</button>
    </div>
  );

  return (
    <div className="space-y-8 p-6">
      {/* GRID DE STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`p-4 rounded-[2rem] border transition-all flex flex-col items-center justify-center gap-2
              ${activeTab === tab.id 
                ? "bg-white dark:bg-gray-800 border-blue-500 shadow-lg scale-105" 
                : "bg-gray-50 dark:bg-gray-900 border-transparent opacity-60 hover:opacity-100"}`}
          >
            <span className="text-2xl">{tab.icon}</span>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-tighter text-gray-400">{tab.label}</p>
              <p className={`font-black ${tab.color}`}>{stats?.[tab.id] || 0}</p>
            </div>
          </button>
        ))}
      </div>

      {/* TABELA */}
      <div className="bg-white dark:bg-gray-900 rounded-[3rem] border dark:border-gray-800 shadow-2xl overflow-hidden">
        <div className="px-8 py-6 border-b dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-black italic uppercase tracking-tighter">
            Gerenciar {TABS.find(t => t.id === activeTab)?.label}
          </h2>
          
          {/* CONTROLES DE PAGINAÇÃO */}
          <div className="flex items-center gap-4">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full disabled:opacity-30"
            >
              ⬅️
            </button>
            <span className="text-xs font-black">PÁGINA {page} DE {totalPages}</span>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full disabled:opacity-30"
            >
              ➡️
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-[10px] font-black text-gray-400 uppercase">
              <tr>
                <th className="px-8 py-4 text-left">Título / Nome</th>
                <th className="px-8 py-4 text-left">Informações Extra</th>
                <th className="px-8 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan={3} className="p-20 text-center animate-pulse font-bold text-gray-300">Atualizando lista...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={3} className="p-20 text-center text-gray-400">Nenhum registro nesta página.</td></tr>
              ) : data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-blue-900/5 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold dark:text-white truncate max-w-[200px]">{item.nome || item.titulo || item.descricao}</p>
                    <p className="text-[10px] font-mono text-gray-400 uppercase">{item.id.substring(0, 8)}</p>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-500">
                    {item.email || item.empresa || (item.valor ? `R$ ${item.valor}` : "---")}
                  </td>
                  <td className="px-8 py-5 text-right space-x-2">
                    <button 
                      onClick={() => startEdit(item)} 
                      className="text-blue-600 font-black text-xs hover:underline p-2"
                    >
                      EDITAR
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="text-red-500 font-black text-xs hover:underline p-2"
                    >
                      EXCLUIR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* MODAL DE EDIÇÃO */}
      {editingItem && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border dark:border-gray-800">
          <h3 className="text-2xl font-black italic mb-6 uppercase tracking-tighter">Editar Registro</h3>
          
          <div className="space-y-4">
            {Object.keys(editForm).map((key) => {
              // Esconde campos que não devem ser editados via input simples
              if (["id", "createdAt", "updatedAt", "authorId", "userId"].includes(key)) return null;
              
              return (
                <div key={key}>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">{key}</label>
                  <input
                    className="w-full bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-bold"
                    value={editForm[key] || ""}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 mt-8">
            <button 
              onClick={handleUpdate}
              className="flex-1 bg-blue-600 text-white py-3 rounded-2xl font-black hover:bg-blue-700 transition-colors"
            >
              SALVAR ALTERAÇÕES
            </button>
            <button 
              onClick={() => setEditingItem(null)}
              className="px-6 bg-gray-100 dark:bg-gray-800 text-gray-500 py-3 rounded-2xl font-black"
            >
              CANCELAR
            </button>
          </div>
        </div>
      </div>
    )}
      
    </div>
  );
}