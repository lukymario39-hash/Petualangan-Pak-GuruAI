import React from 'react';
import { Volume2, VolumeX, Shield, Database, Trophy, User } from 'lucide-react';
import { GameMode, StudentProfile, DatabaseConfig } from '../types';
import { soundFx } from '../utils/soundEffects';

interface HeaderProps {
  gameMode: GameMode;
  dbConfig: DatabaseConfig;
  student: StudentProfile;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenDbModal: () => void;
  onOpenTeacherAuth: () => void;
  onSwitchToSiswa: () => void;
  onOpenStudentSetup: () => void;
  onOpenLeaderboard: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  gameMode,
  dbConfig,
  student,
  soundEnabled,
  onToggleSound,
  onOpenDbModal,
  onOpenTeacherAuth,
  onSwitchToSiswa,
  onOpenStudentSetup,
  onOpenLeaderboard,
}) => {
  return (
    <header className="bg-slate-950/95 border-b-2 border-amber-800/80 px-3 py-2 sm:px-6 sm:py-2.5 text-slate-100 shadow-xl relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-4">
        
        {/* Logo Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gradient-to-br from-amber-600 to-amber-900 border-2 border-amber-400 flex items-center justify-center text-xl shadow-md">
            🎓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wide font-mono">
                PETUALANGAN KELAS PAK GURU
              </h1>
              <span className="text-[10px] sm:text-xs bg-amber-500/20 text-amber-300 border border-amber-500/50 px-1.5 py-0.5 rounded font-mono uppercase font-bold">
                RPG AI
              </span>
            </div>
            <p className="text-[11px] text-amber-200/80 hidden sm:block tracking-wider">
              BELAJAR • BERKARYA • MENGINSPIRASI
            </p>
          </div>
        </div>

        {/* Player Status Bar & Mode Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center md:justify-end w-full md:w-auto">
          
          {/* Student Profile Quick Badge */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenStudentSetup();
            }}
            className="flex items-center gap-2 bg-slate-900/90 border border-amber-700/60 hover:border-amber-400 px-2.5 py-1 rounded-md text-xs transition cursor-pointer shadow-inner"
            title="Ubah Nama/Avatar Siswa"
          >
            <span className="text-lg">{student.avatar}</span>
            <div className="text-left">
              <div className="font-bold text-amber-300 truncate max-w-[100px] sm:max-w-[130px]">
                {student.name}
              </div>
              <div className="text-[10px] text-slate-400">
                Lv. {student.level} • {student.gold} Gold 💰
              </div>
            </div>
            <User className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenLeaderboard();
            }}
            className="flex items-center gap-1.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-600/80 text-amber-300 px-2.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition shadow-md"
            title="Lihat Peringkat Siswa"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Peringkat</span>
          </button>

          {/* Database Setup Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenDbModal();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-semibold transition cursor-pointer shadow-md ${
              dbConfig.isConnected
                ? 'bg-emerald-950/90 border-emerald-600 text-emerald-300 hover:bg-emerald-900'
                : 'bg-amber-950/90 border-amber-600 text-amber-300 hover:bg-amber-900 animate-pulse'
            }`}
            title="Pengaturan URL Google Sheets Database"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{dbConfig.isConnected ? 'Database Connected' : 'Set Database URL'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              soundFx.playClick();
              onToggleSound();
            }}
            className="p-1.5 rounded-md bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 cursor-pointer transition"
            title={soundEnabled ? 'Matikan Suara' : 'Aktifkan Suara'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Mode Switcher Button */}
          {gameMode === 'siswa' ? (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenTeacherAuth();
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-3 py-1.5 rounded-md text-xs border border-purple-400 shadow-lg cursor-pointer transition transform hover:scale-105"
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>Mode Guru</span>
            </button>
          ) : (
            <button
              onClick={() => {
                soundFx.playClick();
                onSwitchToSiswa();
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-3 py-1.5 rounded-md text-xs border border-emerald-400 shadow-lg cursor-pointer transition"
            >
              <User className="w-3.5 h-3.5 text-amber-300" />
              <span>Kembali ke Mode Siswa</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
