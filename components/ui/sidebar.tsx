"use client";

import { motion, Variants } from "framer-motion"; // Importe o tipo 'Variants'

// Tipos para as propriedades do componente
interface SidebarProps {
  pageId: string;
  prompt: string;
  pageTitle: string;
}

// Ícones (sem alterações)
const Icons = {
  lightbulb: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a7.5 7.5 0 01-7.5 0c-1.453 0-2.824-.22-4.121-.622M12 18V7.5a6 6 0 00-6-6H6a6 6 0 00-6 6v7.5a6 6 0 006 6h2a6 6 0 006-6z" /></svg>,
  sparkles: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-violet-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.567L16.5 21.75l-.398-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.398a2.25 2.25 0 001.423-1.423L16.5 15.75l.398 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.398a2.25 2.25 0 00-1.423 1.423z" /></svg>,
  file: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-sky-400"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
};

// Adicionando a tipagem explícita 'Variants'
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Adicionando a tipagem explícita 'Variants'
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export function Sidebar({ pageId, prompt, pageTitle }: SidebarProps) {
  // O restante do componente permanece exatamente o mesmo
  return (
    <motion.aside 
      className="w-[380px] flex-shrink-0 bg-[#181818] border-r border-gray-800 flex flex-col p-6 h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <a href="/" className="font-bold text-xl text-white tracking-tight">LP Gen</a>
        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">Editor</span>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-8">
        <h2 className="text-lg font-semibold text-white truncate">{pageTitle}</h2>
        <p className="text-xs text-gray-500 font-mono mt-1">ID: {pageId}</p>
      </motion.div>
      
      <motion.div variants={itemVariants} className="mt-8 flex-grow flex flex-col gap-4 text-sm">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Processo da IA</h3>

        <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
          <div className="flex-shrink-0 mt-1">{Icons.lightbulb}</div>
          <div>
            <h4 className="font-semibold text-white">Prompt Original</h4>
            <p className="text-gray-400 mt-1 line-clamp-3">{prompt}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3">
          <div className="flex-shrink-0">{Icons.sparkles}</div>
          <p>Analisando inspiração de design...</p>
        </div>

        <div className="flex items-center gap-3 p-3">
          <div className="flex-shrink-0">{Icons.file}</div>
          <p>Gerando código HTML & CSS...</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex-shrink-0 mt-6 text-center">
         <button className="w-full bg-violet-600 text-white font-semibold py-3 rounded-lg hover:bg-violet-700 transition-colors">
            Regerar Página
         </button>
         <p className="text-xs text-gray-600 mt-3">Isso usará 1 crédito.</p>
      </motion.div>
    </motion.aside>
  );
}