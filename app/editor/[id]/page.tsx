"use client";

import { useState, useCallback, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { useParams } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar";

// Novas importações para a funcionalidade de download
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Ícones para a interface
const Icons = {
  eye: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  code: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
  download: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>,
};

type ViewMode = "preview" | "code";

export default function EditorPage() {
  const [prompt, setPrompt] = useState("");
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("preview");

  const params = useParams();
  const pageId = params.id as string;

  useEffect(() => {
    if (!pageId) return;
    const fetchPageData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/pages/${pageId}`);
        if (!res.ok) throw new Error("Página não encontrada ou falha ao carregar.");
        const data = await res.json();
        setPrompt(data.prompt || "");
        setHtmlContent(data.html);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPageData();
  }, [pageId]);

  const onCodeChange = useCallback((value: string) => { setHtmlContent(value); }, []);

  // NOVA FUNÇÃO PARA GERAR E BAIXAR O ZIP
  const handleDownload = async () => {
    if (!htmlContent) return;

    const zip = new JSZip();
    
    // Adiciona o arquivo HTML ao zip
    zip.file("index.html", htmlContent);
    
    // Gera o conteúdo do zip de forma assíncrona
    const content = await zip.generateAsync({ type: "blob" });
    
    // Usa o file-saver para iniciar o download
    saveAs(content, `landing-page-${pageId}.zip`);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#111] text-white">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium mt-4">Carregando seu editor...</p>
      </div>
    );
  }
  
  if (error) {
     return <div className="w-full h-screen flex items-center justify-center bg-red-900/50 text-white text-xl">{error}</div>;
  }
  
  return (
    <div className="font-sans h-screen bg-[#111] text-gray-300 flex overflow-hidden">
      <Sidebar 
        pageId={pageId}
        prompt={prompt}
        pageTitle={prompt.substring(0, 30) + '...'}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* BARRA DE FERRAMENTAS ATUALIZADA */}
        <div className="flex-shrink-0 h-14 bg-[#181818] border-b border-gray-800 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
                <button onClick={() => setView("preview")} className={`p-2 rounded-md ${view === 'preview' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}>{Icons.eye}</button>
                <button onClick={() => setView("code")} className={`p-2 rounded-md ${view === 'code' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}>{Icons.code}</button>
            </div>
            
            {/* BOTÃO DE DOWNLOAD ADICIONADO */}
            <div className="flex items-center">
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {Icons.download}
                  Baixar LP
                </button>
            </div>
        </div>

        <div className="flex-1 w-full bg-[#1e1e1e] relative overflow-hidden">
          {view === 'preview' && (
            <iframe 
              srcDoc={htmlContent} 
              title="Preview" 
              className="w-full h-full border-0 bg-white" 
              sandbox="allow-scripts allow-same-origin"
            />
          )}
          {view === 'code' && (
            <CodeMirror
              value={htmlContent || ""}
              height="100%"
              extensions={[html()]}
              onChange={onCodeChange}
              theme={vscodeDark}
              style={{ height: '100%' }}
            />
          )}
        </div>
      </main>
    </div>
  );
}