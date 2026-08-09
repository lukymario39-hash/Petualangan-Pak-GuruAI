import React, { useState } from 'react';
import { LocationLevel, StudentProfile, Question, PlayMode, MultiplayerRoom } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { 
  ShieldAlert, BookOpen, Laptop, Backpack, Award, Settings, Save, LogOut, 
  Sparkles, MapPin, Map as MapIcon, ChevronRight, MessageSquare, Compass, Scroll, Lock, CheckCircle2, Star, TrendingUp,
  Gamepad2, Users, Key, Crown, Play
} from 'lucide-react';
import { MultiplayerLobby } from './MultiplayerLobby';

interface GameCanvasProps {
  student: StudentProfile;
  locations: LocationLevel[];
  questions: Question[];
  playMode: PlayMode;
  multiplayerRoom: MultiplayerRoom;
  isMultiplayerAdmin: boolean;
  onChangePlayMode: (mode: PlayMode) => void;
  onUpdateMultiplayerRoom: (updatedRoom: MultiplayerRoom) => void;
  onStartMultiplayerGame: () => void;
  onOpenJoinMultiplayerModal: () => void;
  onToggleMultiplayerAdmin: () => void;
  onSelectLocation: (loc: LocationLevel) => void;
  onOpenInventory: () => void;
  onOpenLeaderboard: () => void;
  onOpenProgressModal: () => void;
  onOpenStudentSetup: () => void;
  onOpenDbModal: () => void;
  onOpenTeacherAuth: () => void;
  onOpenTour: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  student,
  locations,
  questions,
  playMode,
  multiplayerRoom,
  isMultiplayerAdmin,
  onChangePlayMode,
  onUpdateMultiplayerRoom,
  onStartMultiplayerGame,
  onOpenJoinMultiplayerModal,
  onToggleMultiplayerAdmin,
  onSelectLocation,
  onOpenInventory,
  onOpenLeaderboard,
  onOpenProgressModal,
  onOpenStudentSetup,
  onOpenDbModal,
  onOpenTeacherAuth,
  onOpenTour,
}) => {
  // Sort locations by level number 1 to 6
  const sortedLocations = [...locations].sort((a, b) => a.levelNumber - b.levelNumber);

  // Find current location details
  const currentLoc = locations.find((l) => l.id === student.currentLocationId) || locations[0];

  return (
    <div className="w-full max-w-[1750px] mx-auto px-2 sm:px-6 py-3 font-pixelify select-none">
      
      {/* Outer Retro Pixel Frame Container */}
      <div className="bg-slate-950 border-4 border-amber-800 rounded-2xl shadow-[0_0_40px_rgba(217,119,6,0.3)] overflow-hidden relative text-slate-100 flex flex-col min-h-[760px] lg:min-h-[820px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
        
        {/* Top Header Section */}
        <div className="p-3 sm:p-4 bg-slate-950/95 border-b-2 border-amber-800 flex flex-col md:flex-row justify-between items-center gap-3 relative z-10">
          
          {/* Top Left: Character Profile Status Frame */}
          <div className="flex items-center gap-3 bg-slate-900/90 border-2 border-amber-700/80 p-2.5 rounded-2xl shadow-lg w-full md:w-auto">
            <div className="relative group cursor-pointer" onClick={onOpenStudentSetup}>
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-950 border-2 border-amber-400 rounded-xl flex items-center justify-center text-4xl shadow-inner transform group-hover:scale-105 transition animate-pixel-bob">
                {student.avatar}
              </div>
              <span className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border border-amber-200 font-silkscreen shadow">
                Lv.{student.level}
              </span>
            </div>

            <div className="flex-1 space-y-1 min-w-[160px]">
              <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                <span className="truncate max-w-[120px] font-silkscreen">{student.name}</span>
                <span className="text-[10px] text-amber-200/80 font-mono bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-700/50">{student.classGrade}</span>
              </div>

              {/* HP Bar */}
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="text-red-400 font-bold w-5 font-silkscreen">HP</span>
                <div className="flex-1 h-3 bg-slate-950 border border-slate-700 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 rounded-full transition-all duration-300"
                    style={{ width: `${(student.hp / student.maxHp) * 100}%` }}
                  />
                </div>
                <span className="text-slate-300 w-14 text-right font-mono">{student.hp}/{student.maxHp}</span>
              </div>

              {/* MP Bar */}
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="text-blue-400 font-bold w-5 font-silkscreen">MP</span>
                <div className="flex-1 h-3 bg-slate-950 border border-slate-700 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 rounded-full transition-all duration-300"
                    style={{ width: `${(student.mp / student.maxMp) * 100}%` }}
                  />
                </div>
                <span className="text-slate-300 w-14 text-right font-mono">{student.mp}/{student.maxMp}</span>
              </div>

              {/* Energy Bar */}
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="text-amber-400 font-bold w-5 font-silkscreen">EN</span>
                <div className="flex-1 h-3 bg-slate-950 border border-slate-700 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-300"
                    style={{ width: `${(student.energy / student.maxEnergy) * 100}%` }}
                  />
                </div>
                <span className="text-slate-300 w-14 text-right font-mono">{student.energy}/{student.maxEnergy}</span>
              </div>

              {/* EXP Bar */}
              <div className="flex items-center gap-1.5 text-[10px] pt-0.5">
                <span className="text-emerald-400 font-bold w-6 font-silkscreen">EXP</span>
                <div className="flex-1 h-2 bg-slate-950 border border-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${(student.currentExp / student.maxExp) * 100}%` }}
                  />
                </div>
                <span className="text-emerald-300 font-bold w-10 text-right font-mono">
                  {Math.round((student.currentExp / student.maxExp) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Top Center: Main Game Banner Title */}
          <div className="text-center space-y-1">
            <h1 className="text-xl sm:text-3xl font-extrabold font-silkscreen text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_4px_6px_rgba(0,0,0,1)] tracking-wider uppercase">
              PETUALANGAN KELAS PAK GURU
            </h1>
            <div className="text-xs text-amber-200/90 tracking-widest font-silkscreen font-bold flex items-center justify-center gap-2">
              <span>BELAJAR</span>
              <span className="text-amber-500">◆</span>
              <span>BERKARYA</span>
              <span className="text-amber-500">◆</span>
              <span>MENGINSPIRASI</span>
            </div>
            
            {/* Quote Banner */}
            <div className="mt-1 inline-flex items-center gap-2 bg-slate-900/90 border border-amber-600/70 px-3 py-1 rounded-full text-xs text-amber-300 font-pixelify shadow-md">
              <BookOpen className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Setiap ilmu adalah senjata, setiap siswa adalah pahlawan.</span>
            </div>
          </div>

          {/* Top Right: World Map Status & Quick Stats */}
          <div className="bg-slate-900/90 border-2 border-amber-700/80 p-2.5 rounded-2xl shadow-lg w-full md:w-60 text-center">
            <div className="text-xs font-bold text-amber-300 mb-1.5 flex items-center justify-center gap-1.5 font-silkscreen uppercase border-b border-amber-800 pb-1">
              <Compass className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
              <span>PETA DUNIA RPG</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300 mb-1 font-pixelify">
              <div className="bg-slate-950 border border-slate-800 p-1 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-silkscreen">LOKASI</span>
                <span className="text-amber-400 font-bold truncate block">{currentLoc.name}</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-1 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-silkscreen">PROGRESS</span>
                <span className="text-emerald-400 font-bold block">{student.completedLocations.length}/6 LEVEL</span>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playTravel();
                onSelectLocation(currentLoc);
              }}
              className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-lg text-xs font-silkscreen uppercase tracking-wider shadow transition cursor-pointer flex items-center justify-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Mulai Kuis Level</span>
            </button>
          </div>

        </div>

        {/* Mode Selection Bar: Solo vs Multiplayer */}
        <div className="bg-slate-950/95 border-y-2 border-amber-800/80 px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 z-10 shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold font-mono text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              MODE PERMAINAN:
            </span>
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 gap-1 text-xs font-mono font-bold">
              <button
                onClick={() => {
                  soundFx.playClick();
                  onChangePlayMode('solo');
                }}
                className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  playMode === 'solo'
                    ? 'bg-amber-500 text-slate-950 shadow ring-1 ring-amber-300 font-extrabold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>👤 Bermain Sendiri (Solo)</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onChangePlayMode('multiplayer');
                }}
                className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  playMode === 'multiplayer'
                    ? 'bg-gradient-to-r from-amber-500 to-indigo-500 text-slate-950 shadow ring-1 ring-amber-300 font-extrabold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>👥 Bermain Bersama (Multiplayer)</span>
              </button>
            </div>
          </div>

          {playMode === 'multiplayer' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-200 font-mono">
                Ruang Kelas: <strong className="text-amber-400">{multiplayerRoom.roomCode}</strong> ({multiplayerRoom.players.length} Siswa)
              </span>
              <button
                onClick={onOpenJoinMultiplayerModal}
                className="px-2.5 py-1 bg-amber-950 hover:bg-amber-900 border border-amber-600/80 text-amber-300 font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1 shadow"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Ubah / Buat Room</span>
              </button>
            </div>
          )}
        </div>

        {/* When playMode === 'multiplayer', show the MultiplayerLobby Component */}
        {playMode === 'multiplayer' && (
          <div className="p-3 pb-0 z-10">
            <MultiplayerLobby
              room={multiplayerRoom}
              student={student}
              isAdmin={isMultiplayerAdmin}
              onUpdateRoom={onUpdateMultiplayerRoom}
              onStartGame={onStartMultiplayerGame}
              onLeaveRoom={() => onChangePlayMode('solo')}
              onToggleAdmin={onToggleMultiplayerAdmin}
            />
          </div>
        )}

        {/* Main Center Playground View Grid (2 Columns: Left Quest/Menu, Right WIDE RPG Playground) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 relative z-10">
          
          {/* Left Column (3 cols): Quests & Menu */}
          <div className="lg:col-span-3 space-y-3 flex flex-col justify-between">
            
            {/* Quest Panel */}
            <div className="bg-slate-900/90 border-2 border-amber-700/80 rounded-2xl p-3 shadow-lg">
              <div className="text-xs font-extrabold text-amber-300 mb-2 border-b border-amber-800 pb-1.5 flex items-center gap-1.5 font-silkscreen uppercase">
                <Scroll className="w-4 h-4 text-amber-400" />
                <span>QUEST & MISI</span>
              </div>

              <div className="space-y-2 text-xs font-pixelify">
                {/* Misi Utama */}
                <div className="bg-slate-950/90 p-2.5 rounded-xl border border-amber-600/60 space-y-1">
                  <div className="flex items-center justify-between font-bold text-amber-300">
                    <span className="flex items-center gap-1">
                      ⭐ Misi Utama
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-1 rounded">
                      {student.completedLocations.length}/6 Level
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Kalahkan Kebodohan di Menara Malas!
                  </p>
                </div>

                {/* Misi Sampingan */}
                <div className="bg-slate-950/90 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between font-bold text-cyan-300">
                    <span className="flex items-center gap-1">
                      💬 Misi Sampingan
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-1 rounded">
                      2/3 Soal
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Bantu siswa yang kesulitan belajar
                  </p>
                </div>

                {/* Misi Harian */}
                <div className="bg-slate-950/90 p-2.5 rounded-xl border border-emerald-800 space-y-1">
                  <div className="flex items-center justify-between font-bold text-emerald-300">
                    <span className="flex items-center gap-1">
                      🍃 Misi Harian
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1 rounded">
                      Selesai ✓
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Selesaikan kuis 1 lokasi level hari ini
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Navigation Menu */}
            <div className="bg-slate-900/90 border-2 border-amber-700/80 rounded-2xl p-3 shadow-lg">
              <div className="text-xs font-extrabold text-amber-300 mb-2 border-b border-amber-800 pb-1.5 flex items-center justify-between font-silkscreen uppercase">
                <span>MENU UTAMA</span>
                <span className="text-[10px] text-amber-400 font-mono">RPG</span>
              </div>

              <div className="space-y-1.5 text-xs font-pixelify">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenInventory();
                  }}
                  className="w-full text-left p-2 rounded-xl bg-slate-950/80 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-600 text-amber-200 font-bold transition flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Backpack className="w-4 h-4 text-amber-400" />
                    Inventori & Senjata
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenTour();
                  }}
                  className="w-full text-left p-2 rounded-xl bg-amber-950/90 hover:bg-amber-900/90 border border-amber-500/80 text-amber-300 font-bold transition flex items-center justify-between cursor-pointer shadow animate-pulse"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Panduan Pemula (Tur Feature)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenLeaderboard();
                  }}
                  className="w-full text-left p-2 rounded-xl bg-slate-950/80 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-600 text-amber-200 font-bold transition flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    Peringkat Siswa
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenProgressModal();
                  }}
                  className="w-full text-left p-2 rounded-xl bg-slate-950/80 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-600 text-amber-200 font-bold transition flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    Grafik Progres (Recharts)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenDbModal();
                  }}
                  className="w-full text-left p-2 rounded-xl bg-slate-950/80 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-600 text-amber-200 font-bold transition flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-purple-400" />
                    Database Google Sheets
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenTeacherAuth();
                  }}
                  className="w-full text-left p-2 rounded-xl bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-950 hover:from-purple-900 hover:to-indigo-900 border-2 border-purple-500/80 text-purple-200 font-bold transition flex items-center justify-between cursor-pointer shadow mt-2"
                >
                  <span className="flex items-center gap-2 font-silkscreen uppercase text-[11px]">
                    <Laptop className="w-4 h-4 text-amber-300" />
                    Mode Guru (Terproteksi 🔒)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>

            {/* Pak Guru Quote */}
            <div className="bg-slate-900/90 border border-amber-800/80 p-2.5 rounded-xl text-center shadow-lg">
              <p className="text-xs text-amber-200 italic">
                "Ilmu adalah petualangan tanpa akhir."
              </p>
              <span className="text-[10px] text-amber-400 font-silkscreen block mt-0.5">
                — Pak Guru
              </span>
            </div>

          </div>

          {/* Right Column (9 cols): EXPANDED WIDE RPG PLAYGROUND CANVAS MAP */}
          <div className="lg:col-span-9 bg-slate-900 border-4 border-amber-700/80 rounded-2xl p-4 sm:p-6 relative overflow-hidden flex flex-col justify-between min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] shadow-2xl bg-gradient-to-b from-amber-950/30 via-emerald-950/30 to-slate-950">
            
            {/* Pixel Grid Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:20px_20px]" />

            {/* Animated Connecting Road Lines between all 6 level pins */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <defs>
                <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="25%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="75%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>

                <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Outer Wide Road Glow Track */}
              <polyline
                points={sortedLocations.map(l => `${l.mapX}%,${l.mapY}%`).join(' ')}
                fill="none"
                stroke="#78350f"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.7"
              />

              {/* Inner Dark Road Base */}
              <polyline
                points={sortedLocations.map(l => `${l.mapX}%,${l.mapY}%`).join(' ')}
                fill="none"
                stroke="#0f172a"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Animated Glowing Dashed Road Trail */}
              <polyline
                points={sortedLocations.map(l => `${l.mapX}%,${l.mapY}%`).join(' ')}
                fill="none"
                stroke="url(#roadGradient)"
                strokeWidth="4"
                strokeDasharray="10 8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-dash-road"
              />

              {/* Glowing Waypoint Node Rings at each level coordinate */}
              {sortedLocations.map((loc) => (
                <g key={`waypoint-${loc.id}`}>
                  <circle
                    cx={`${loc.mapX}%`}
                    cy={`${loc.mapY}%`}
                    r="10"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    className="animate-ping opacity-40"
                  />
                  <circle
                    cx={`${loc.mapX}%`}
                    cy={`${loc.mapY}%`}
                    r="5"
                    fill="#fbbf24"
                  />
                </g>
              ))}
            </svg>

            {/* Interactive Location Pins Overlay */}
            <div className="absolute inset-0 p-4">
              {sortedLocations.map((loc, idx) => {
                const isCurrent = loc.id === student.currentLocationId;
                const isCompleted = student.completedLocations.includes(loc.id);
                const questionCount = questions.filter((q) => q.locationId === loc.id).length;

                // Alternate animation styles & staggered delays for alive game-like feel
                const animStyle = isCurrent
                  ? 'animate-pixel-float animate-pin-glow'
                  : isCompleted
                  ? 'animate-pixel-bob'
                  : loc.isUnlocked
                  ? 'animate-pixel-float'
                  : '';

                return (
                  <div
                    key={loc.id}
                    style={{ 
                      left: `${loc.mapX}%`, 
                      top: `${loc.mapY}%`,
                      animationDelay: `${idx * 0.4}s`
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group z-20 ${animStyle}`}
                  >
                    {/* Floor Shadow Pulse */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/60 rounded-full blur-[1px] pointer-events-none animate-shadow-pulse" />

                    <button
                      onClick={() => {
                        soundFx.playTravel();
                        onSelectLocation(loc);
                      }}
                      className={`relative p-3 rounded-2xl border-4 shadow-2xl transition transform hover:scale-125 cursor-pointer flex flex-col items-center justify-center ${
                        isCurrent
                          ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-slate-950 border-amber-100 ring-4 ring-amber-400/80'
                          : isCompleted
                          ? 'bg-gradient-to-b from-emerald-800 to-emerald-950 text-emerald-200 border-emerald-400'
                          : loc.isUnlocked
                          ? 'bg-slate-900/95 text-amber-300 border-amber-500 hover:bg-amber-950 hover:border-amber-300'
                          : 'bg-slate-950/95 text-slate-500 border-slate-800 opacity-60'
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] transition-transform group-hover:scale-110">
                        {loc.icon}
                      </span>

                      {/* Level Badge Header */}
                      <span className={`absolute -top-3 -right-2 px-1.5 py-0.5 rounded-md border text-[10px] font-silkscreen font-bold shadow ${
                        isCompleted
                          ? 'bg-emerald-400 text-slate-950 border-emerald-200'
                          : isCurrent
                          ? 'bg-slate-950 text-amber-300 border-amber-300'
                          : 'bg-slate-950 text-slate-300 border-slate-700'
                      }`}>
                        Lv.{loc.levelNumber}
                      </span>

                      {/* Status Icon Indicator */}
                      {isCompleted ? (
                        <span className="absolute -bottom-2 bg-emerald-500 text-slate-950 p-0.5 rounded-full border border-emerald-200 shadow">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      ) : !loc.isUnlocked ? (
                        <span className="absolute -bottom-2 bg-slate-950 text-slate-400 p-0.5 rounded-full border border-slate-700">
                          <Lock className="w-3.5 h-3.5" />
                        </span>
                      ) : null}
                    </button>

                    {/* Permanent Pixel Location Tag */}
                    <div className="mt-2 bg-slate-950/90 border-2 border-amber-500/80 px-2 py-0.5 rounded-lg text-[10px] font-silkscreen text-amber-300 shadow-xl whitespace-nowrap text-center transform group-hover:scale-105 transition">
                      {loc.name}
                      <span className="text-amber-400/80 block text-[9px] font-mono font-normal">
                        ({questionCount} Soal)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Center RPG Character Sprite & Mascot Display */}
            <div className="relative z-10 flex items-center justify-between px-6 pt-6">
              
              {/* Player Character Avatar Card */}
              <div className="bg-slate-950/90 border-2 border-amber-500/80 p-3 rounded-2xl flex items-center gap-3 shadow-xl hover:border-amber-300 transition cursor-pointer group" onClick={onOpenStudentSetup}>
                <div className="relative">
                  <div className="w-14 h-14 bg-slate-900 border-2 border-amber-400 rounded-xl flex items-center justify-center text-4xl shadow-inner animate-pixel-float">
                    {student.avatar}
                  </div>
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-black/60 rounded-full blur-[1px] animate-shadow-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-amber-300 font-silkscreen uppercase group-hover:text-amber-200">
                    {student.name}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Posisi: <strong className="text-emerald-400">{currentLoc.name}</strong>
                  </p>
                  <span className="text-[10px] text-amber-400 font-mono">Klik untuk ganti karakter pixel!</span>
                </div>
              </div>

              {/* World Boss Preview Badge */}
              <div className="bg-slate-950/90 border-2 border-red-600/80 p-3 rounded-2xl text-right shadow-xl hidden sm:block">
                <div className="text-[10px] text-red-400 font-silkscreen uppercase">
                  Puncak RPG (Level 6)
                </div>
                <h4 className="text-sm font-bold text-red-300 font-silkscreen">
                  ⚡ Menara Malas
                </h4>
                <p className="text-xs text-slate-400">
                  Bos: <span className="text-red-400 font-bold">Raja Kebodohan</span>
                </p>
              </div>

            </div>

            {/* AI Buddy Chat Box Footer Overlay */}
            <div className="relative z-10 mt-auto pt-4">
              <div className="bg-slate-950/95 border-2 border-amber-600/80 p-3.5 rounded-2xl shadow-2xl flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-900 border-2 border-cyan-400 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-lg animate-pulse">
                  🤖
                </div>
                <div className="flex-1 font-pixelify">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 font-silkscreen uppercase flex items-center gap-1.5">
                      <span>AI Buddy Assistant</span>
                      <span className="text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-700 px-1.5 py-0.5 rounded font-mono">RPG Bot</span>
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">Map Area Terbuka Leluasa</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                    Halo <strong>{student.name}</strong>! Peta bermain kini lebih lebar! Klik ikon lokasi level (1-6) di peta untuk menjawab soal kuis dari Pak Guru dan menaikkan level RPG Anda. 🚀
                  </p>
                </div>
              </div>

              {/* Quick Action Hotbar Buttons (1-7) */}
              <div className="flex items-center justify-center gap-2 pt-3">
                {[
                  { num: '1', name: 'Desa Ilmu', icon: '🏠', action: () => onSelectLocation(locations[0]) },
                  { num: '2', name: 'Hutan Kreatif', icon: '🌲', action: () => onSelectLocation(locations[1]) },
                  { num: '3', name: 'Pelabuhan', icon: '⛵', action: () => onSelectLocation(locations[2]) },
                  { num: '4', name: 'Akademi', icon: '🏰', action: () => onSelectLocation(locations[3]) },
                  { num: '5', name: 'Gunung', icon: '🏔️', action: () => onSelectLocation(locations[4]) },
                  { num: '6', name: 'Menara Malas', icon: '⚡', action: () => onSelectLocation(locations[5]) },
                  { num: '7', name: 'Mode Guru', icon: '💻', action: onOpenTeacherAuth },
                ].map((item) => (
                  <button
                    key={item.num}
                    onClick={() => {
                      soundFx.playClick();
                      item.action();
                    }}
                    className="h-12 bg-slate-950/95 border-2 border-amber-600/70 hover:border-amber-300 rounded-xl flex flex-col items-center justify-center px-2 py-1 transition transform hover:-translate-y-1 cursor-pointer text-slate-200 shadow group"
                    title={item.name}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="text-[9px] font-silkscreen text-amber-400 font-bold">{item.num}. {item.name}</span>
                  </button>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

