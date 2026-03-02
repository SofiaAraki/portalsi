"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/profile");
      setProfile(res.data);
      setNewName(res.data.nome);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleUpdateName = async () => {
    try {
      await api.patch("/profile/update", { nome: newName });
      setIsEditing(false);
      loadProfile();
    } catch (err) { alert("Erro ao atualizar nome"); }
  };

  if (loading) return <div className="p-20 text-center animate-pulse">Carregando passaporte...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 px-4">
      
      {/* HEADER & AVATAR */}
      <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[3rem] shadow-xl">
        <div className="absolute -bottom-12 left-12 flex items-end gap-6">
          <div className="w-32 h-32 rounded-[2.5rem] bg-white dark:bg-gray-800 p-2 shadow-2xl border-4 border-white dark:border-gray-900">
             <div className="w-full h-full rounded-[2rem] bg-blue-100 flex items-center justify-center text-4xl font-black text-blue-600">
                {profile.nome.charAt(0)}
             </div>
          </div>
        </div>
      </div>

      <div className="pt-16 px-8 flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-2">
          {isEditing ? (
            <div className="flex gap-2">
              <input 
                value={newName} 
                onChange={e => setNewName(e.target.value)}
                className="text-2xl font-black bg-gray-100 dark:bg-gray-800 px-4 py-1 rounded-xl outline-none border-2 border-blue-500"
              />
              <button onClick={handleUpdateName} className="bg-green-500 text-white px-4 rounded-xl font-bold italic">OK</button>
            </div>
          ) : (
            <h1 className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              {profile.nome}
              <button onClick={() => setIsEditing(true)} className="text-sm text-gray-400 hover:text-blue-500 transition-colors">✏️</button>
            </h1>
          )}
          <p className="text-gray-500 font-medium">{profile.email} • <span className="text-blue-600 font-bold uppercase text-xs">{profile.role}</span></p>
        </div>
      </div>

      {/* GRID PRINCIPAL */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* COLUNA DA ESQUERDA: INFOS */}
        <div className="md:col-span-2 space-y-6">
           <div className="grid grid-cols-2 gap-4">
             <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border dark:border-gray-800 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase">Pontos</p>
                <p className="text-2xl font-black text-blue-600">{profile.pontos}</p>
             </div>
             <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border dark:border-gray-800 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase">Projetos</p>
                <p className="text-2xl font-black dark:text-white">{profile?._count?.projetos ?? 0}</p>
             </div>
           </div>

           <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border dark:border-gray-800">
              <h3 className="font-black mb-4 flex items-center gap-2">🏅 Conquistas Ativas</h3>
              <div className="flex flex-wrap gap-2">
                {profile.badges.map((b: any, i: number) => (
                  <span key={i} className={`${b.color} text-black text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-tighter dark:dark:bg-gray-700 dark:text-white`}>{b.label}</span>
                ))}
              </div>
           </div>
        </div>

        {/* COLUNA DA DIREITA: FLIP CARD */}
        <div className="perspective-1000">
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className={`relative w-full h-[350px] transition-all duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
          >
            {/* FRENTE DO CARTÃO */}
            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-600 to-blue-800 rounded-[2.5rem] p-8 text-white shadow-2xl flex flex-col justify-between">
               <div>
                  <h3 className="text-2xl font-black italic">SI PASS</h3>
                  <p className="text-[10px] uppercase opacity-60 font-bold tracking-[0.2em]">Student Identity</p>
               </div>
               <div className="space-y-1">
                  <p className="text-lg font-bold truncate">{profile.nome}</p>
                  <p className="text-[10px] font-mono opacity-50 uppercase tracking-tighter">ID: {profile.id.substring(0, 15)}</p>
               </div>
               <div className="flex justify-between items-end">
                  <div className="w-10 h-10 bg-white/20 rounded-full backdrop-blur-md flex items-center justify-center font-black">SI</div>
                  <p className="text-[10px] font-black animate-pulse">CLIQUE PARA VIRAR</p>
               </div>
            </div>

            {/* VERSO DO CARTÃO (QR CODE) */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 text-center flex flex-col items-center justify-center border-4 border-blue-600 shadow-2xl">
               <p className="text-blue-600 font-black text-sm mb-4 uppercase tracking-widest">Acesso Rápido</p>
               {/* Simulação de QR Code */}
               <div className="w-40 h-40 bg-gray-100 p-2 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="grid grid-cols-4 gap-1 opacity-40">
                    {[...Array(16)].map((_, i) => <div key={i} className="w-6 h-6 bg-black rounded-sm" />)}
                  </div>
               </div>
               <p className="mt-4 text-[10px] text-gray-400 font-medium">Use este QR em eventos presenciais do curso.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}