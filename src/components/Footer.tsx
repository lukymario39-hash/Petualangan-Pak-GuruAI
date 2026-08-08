import React from 'react';
import { Database, Shield, Sparkles } from 'lucide-react';
import { DatabaseConfig, GameMode } from '../types';

interface FooterProps {
  dbConfig: DatabaseConfig;
  gameMode: GameMode;
  onOpenDbModal: () => void;
  onOpenTeacherAuth: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  dbConfig,
  gameMode,
  onOpenDbModal,
  onOpenTeacherAuth,
}) => {
  return (
    <footer className="bg-slate-950/90 border-t-2 border-amber-800/60 text-slate-300 py-3 px-4 sm:px-6 mt-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm shadow-2xl relative z-20">
      <div className="flex items-center gap-3">
        <span className="font-extrabold tracking-wider text-amber-400 flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          @Copyright by. Pak GuruAI
        </span>
        <span className="text-slate-600 hidden sm:inline">|</span>
        <span className="text-slate-400 text-xs hidden sm:inline">
          Game Edukasi RPG Pixel - Petualangan Pengetahuan
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
        {/* Database Status Button */}
        <button
          onClick={onOpenDbModal}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-semibold transition-all cursor-pointer ${
            dbConfig.isConnected
              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-600/80 hover:bg-emerald-900/80'
              : 'bg-amber-950/80 text-amber-300 border-amber-600/80 hover:bg-amber-900/80'
          }`}
          title="Klik untuk mengatur Database Google Sheets (code.gs)"
        >
          <Database className="w-3.5 h-3.5" />
          <span>
            {dbConfig.isConnected ? 'Database: Connected (Sheets)' : 'Database: Local Storage'}
          </span>
          <span className={`w-2 h-2 rounded-full ${dbConfig.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
        </button>

        {/* Mode Indicator & Switcher */}
        <button
          onClick={onOpenTeacherAuth}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-semibold transition-all cursor-pointer ${
            gameMode === 'guru'
              ? 'bg-purple-950/80 text-purple-300 border-purple-500 hover:bg-purple-900/80'
              : 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>{gameMode === 'guru' ? 'Mode: Guru (Aktif)' : 'Mode: Siswa (Klik utk Guru)'}</span>
        </button>
      </div>
    </footer>
  );
};
