"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Ícone para o botão de envio
const ArrowUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.28 9.68a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l5.25 5.25a.75.75 0 11-1.06 1.06L10.75 5.612V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
  </svg>
);

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Falha ao iniciar a criação da página.");
      }

      const newPage = await res.json();
      router.push(`/editor/${newPage.id}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-gray-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Camada de Fundo com Degradê e Textura */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#4c1d95] grainy-background"
        style={{ opacity: 0.9 }}
      ></div>
      
      {/* Navbar */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center max-w-7xl mx-auto z-10">
        <h1 className="text-2xl font-bold tracking-tight">LP Gen</h1>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Comunidade</a>
          <a href="#" className="hover:text-white transition-colors">Preços</a>
          <a href="#" className="hover:text-white transition-colors">Empresarial</a>
        </nav>
        <div className="flex items-center gap-2">
          <button className="text-gray-400 hover:text-white transition-colors px-4 py-2 text-sm">Login</button>
          <button className="bg-white text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors">Começar</button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="w-full max-w-3xl flex flex-col items-center text-center z-10 mt-20">
        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
          Crie sua Landing Page
        </h2>
        <p className="text-lg md:text-xl text-gray-400 mt-4 max-w-xl">
          Desenvolva sites completos e funcionais apenas conversando com a nossa IA.
        </p>

        <form onSubmit={handleCreatePage} className="w-full mt-10">
          <div className="relative w-full bg-black/30 border border-gray-700 rounded-xl shadow-2xl p-2 flex items-center backdrop-blur-sm focus-within:ring-2 focus-within:ring-violet-500 transition-all">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Peça para criar uma landing page sobre..."
              className="w-full bg-transparent text-lg p-3 focus:outline-none placeholder-gray-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!prompt || isLoading}
              className="bg-gray-200 text-gray-800 rounded-lg p-3 hover:bg-white disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading 
                ? <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                : <ArrowUpIcon />
              }
            </button>
          </div>
        </form>
        {error && <p className="mt-4 text-red-400">{error}</p>}
      </main>
    </div>
  );
}