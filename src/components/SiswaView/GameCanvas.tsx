import React, { useState } from 'react';
import { LocationLevel, StudentProfile, Question } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { 
  ShieldAlert, BookOpen, Laptop, Backpack, Award, Settings, Save, LogOut, 
  Sparkles, MapPin, Map as MapIcon, ChevronRight, MessageSquare, Compass, Scroll
} from 'lucide-react';

interface GameCanvasProps {
  student: StudentProfile;
  locations: LocationLevel[];
  questions: Question[];
  onSelectLocation: (loc: LocationLevel) => void;
  onOpenInventory: () => void;
  onOpenLeaderboard: () => void;
  onOpenStudentSetup: () => void;
  onOpenDbModal: () => void;
  onOpenTeacherAuth: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  student,
  locations,
  questions,
  onSelectLocation,
  onOpenInventory,
  onOpenLeaderboard,
  onOpenStudentSetup,
  onOpenDbModal,
  onOpenTeacherAuth,
}) => {
  const [activeMenuTab, setActiveMenuTab] = useState<string | null>(null);

  // Find current location details
  const currentLoc = locations.find((l) => l.id === student.currentLocationId) || locations[0];

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 font-mono select-none">
      
      {/* Outer Retro Pixel Frame Container */}
      <div className="bg-slate-950 border-4 border-amber-800 rounded-2xl shadow-2xl overflow-hidden relative text-slate-100 flex flex-col min-h-[640px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
        
        {/* Top Header Section */}
        <div className="p-3 sm:p-4 bg-slate-950/90 border-b-2 border-amber-800 flex flex-col md:flex-row justify-between items-center gap-3 relative z-10">
          
          {/* Top Left: Character Profile Status Frame */}
          <div className="flex items-center gap-3 bg-slate-900/90 border-2 border-amber-700/80 p-2.5 rounded-xl shadow-lg w-full md:w-auto">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-amber-900 border-2 border-amber-400 rounded-lg flex items-center justify-center text-3xl shadow-inner">
                {student.avatar}
              </div>
              <span className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-amber-300 font-mono">
                Lv. {student.level}
              </span>
            </div>

            <div className="flex-1 space-y-1 min-w-[150px]">
              <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                <span className="truncate max-w-[110px]">{student.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{student.classGrade}</span>
              </div>

              {/* HP Bar */}
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="text-red-400 font-bold w-4">HP</span>
                <div className="flex-1 h-2.5 bg-slate-950 border border-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-300"
                    style={{ width: `${(student.hp / student.maxHp) * 100}%` }}
                  />
                </div>
                <span className="text-slate-300 w-14 text-right">{student.hp}/{student.maxHp}</span>
              </div>

              {/* MP Bar */}
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="text-blue-400 font-bold w-4">MP</span>
                <div className="flex-1 h-2.5 bg-slate-950 border border-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-300"
                    style={{ width: `${(student.mp / student.maxMp) * 100}%` }}
                  />
                </div>
                <span className="text-slate-300 w-14 text-right">{student.mp}/{student.maxMp}</span>
              </div>

              {/* Energy Bar */}
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="text-amber-400 font-bold w-4">EN</span>
                <div className="flex-1 h-2.5 bg-slate-950 border border-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all duration-300"
                    style={{ width: `${(student.energy / student.maxEnergy) * 100}%` }}
                  />
                </div>
                <span className="text-slate-300 w-14 text-right">{student.energy}/{student.maxEnergy}</span>
              </div>

              {/* EXP Bar */}
              <div className="flex items-center gap-1.5 text-[10px] pt-0.5">
                <span className="text-emerald-400 font-bold w-6">EXP</span>
                <div className="flex-1 h-2 bg-slate-950 border border-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${(student.currentExp / student.maxExp) * 100}%` }}
                  />
                </div>
                <span className="text-emerald-300 font-bold w-10 text-right">
                  {Math.round((student.currentExp / student.maxExp) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Top Center: Main Game Banner Title */}
          <div className="text-center space-y-1">
            <h1 className="text-xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] tracking-widest uppercase">
              PETUALANGAN PAK GURUAI
            </h1>
            <div className="text-[11px] sm:text-xs text-amber-200/90 tracking-widest font-sans font-bold flex items-center justify-center gap-2">
              <span>BELAJAR</span>
              <span>◆</span>
              <span>BERKARYA</span>
              <span>◆</span>
              <span>MENGINSPIRASI</span>
            </div>
            
            {/* Quote Banner */}
            <div className="mt-1 inline-flex items-center gap-2 bg-slate-900/90 border border-amber-600/60 px-3 py-1 rounded-full text-[11px] text-amber-300 font-sans shadow-md">
              <BookOpen className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Setiap ilmu adalah senjata, setiap siswa adalah pahlawan.</span>
            </div>
          </div>

          {/* Top Right: World Map Widget ("PETA DUNIA") */}
          <div className="bg-slate-900/90 border-2 border-amber-700/80 p-2 rounded-xl shadow-lg w-full md:w-56 text-center">
            <div className="text-xs font-bold text-amber-300 mb-1 flex items-center justify-center gap-1.5 uppercase border-b border-amber-800 pb-1">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>PETA DUNIA</span>
            </div>

            {/* Thumbnail map box */}
            <div className="h-20 bg-emerald-950/80 border border-amber-800 rounded relative overflow-hidden flex items-center justify-center group cursor-pointer"
                 onClick={() => {
                   soundFx.playTravel();
                   onSelectLocation(currentLoc);
                 }}>
              {/* Fake Pixel Map Scenery background */}
              <div className="absolute inset-0 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:8px_8px] opacity-40" />
              <div className="text-[10px] text-amber-200 z-10 bg-slate-950/80 px-2 py-1 rounded border border-amber-600/50 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-400 animate-bounce" />
                <span className="font-bold">{currentLoc.name}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 mt-1 font-bold flex items-center justify-between px-1">
              <span className="text-slate-400">Lokasi:</span>
              <span className="text-amber-400 truncate">{currentLoc.name}</span>
            </div>
          </div>

        </div>

        {/* Main Center Playground View Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 p-3 relative z-10">
          
          {/* Left Column (3 cols): Quest Panel */}
          <div className="md:col-span-3 space-y-3">
            <div className="bg-slate-900/90 border-2 border-amber-700/80 rounded-xl p-3 shadow-lg">
              <div className="text-xs font-extrabold text-amber-300 mb-2 border-b border-amber-800 pb-1.5 flex items-center gap-1.5 uppercase">
                <Scroll className="w-4 h-4 text-amber-400" />
                <span>QUEST AKTIF</span>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Misi Utama */}
                <div className="bg-slate-950/90 p-2.5 rounded-lg border border-amber-600/60 space-y-1">
                  <div className="flex items-center justify-between font-bold text-amber-300">
                    <span className="flex items-center gap-1">
                      ⭐ Misi Utama
                    </span>
                    <span className="text-[10px] font-mono text-amber-400">
                      {student.completedLocations.length}/6
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans">
                    Kalahkan Kebodohan di Menara Malas
                  </p>
                </div>

                {/* Misi Sampingan */}
                <div className="bg-slate-950/90 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between font-bold text-blue-300">
                    <span className="flex items-center gap-1">
                      💬 Misi Sampingan
                    </span>
                    <span className="text-[10px] font-mono text-blue-400">
                      2/3
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans">
                    Bantu siswa yang kesulitan belajar
                  </p>
                </div>

                {/* Misi Harian */}
                <div className="bg-slate-950/90 p-2.5 rounded-lg border border-emerald-800 space-y-1">
                  <div className="flex items-center justify-between font-bold text-emerald-300">
                    <span className="flex items-center gap-1">
                      🍃 Misi Harian
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      1/1 ✓
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans">
                    Selesaikan kuis 1 lokasi level hari ini
                  </p>
                </div>
              </div>
            </div>

            {/* Quote Box Bottom Left */}
            <div className="bg-slate-900/90 border border-amber-800/80 p-3 rounded-xl text-center shadow-lg">
              <p className="text-xs text-amber-200 font-sans italic font-medium">
                "Ilmu adalah petualangan tanpa akhir."
              </p>
              <span className="text-[10px] text-amber-400/80 block mt-1 font-mono">
                — Pak GuruAI
              </span>
            </div>
          </div>

          {/* Center Column (6 cols): RPG World Pixel Interactive Canvas */}
          <div className="md:col-span-6 bg-slate-900 border-2 border-amber-700/80 rounded-xl p-3 relative overflow-hidden flex flex-col justify-between min-h-[380px] shadow-2xl bg-gradient-to-b from-amber-950/40 via-emerald-950/30 to-slate-950">
            
            {/* Interactive Location Level Pins Map Overlay */}
            <div className="absolute inset-0 p-4">
              
              {/* Background Fantasy Map Visual Elements */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Render Location Pins */}
              {locations.map((loc) => {
                const isCurrent = loc.id === student.currentLocationId;
                const questionCount = questions.filter((q) => q.locationId === loc.id).length;

                return (
                  <div
                    key={loc.id}
                    style={{ left: `${loc.mapX}%`, top: `${loc.mapY}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group z-20"
                  >
                    <button
                      onClick={() => {
                        soundFx.playTravel();
                        onSelectLocation(loc);
                      }}
                      className={`relative p-2 rounded-xl border-2 shadow-2xl transition transform hover:scale-110 cursor-pointer flex items-center justify-center ${
                        isCurrent
                          ? 'bg-amber-500 text-slate-950 border-amber-200 ring-4 ring-amber-400/50 animate-bounce'
                          : loc.isUnlocked
                          ? 'bg-slate-900/90 text-amber-300 border-amber-500 hover:bg-amber-900'
                          : 'bg-slate-950/90 text-slate-500 border-slate-800 opacity-60'
                      }`}
                      title={`${loc.name} - Level ${loc.levelNumber} (${questionCount} Soal)`}
                    >
                      <span className="text-2xl">{loc.icon}</span>
                      
                      {/* Level Badge Pin */}
                      <span className="absolute -top-2 -right-2 bg-slate-950 text-amber-300 border border-amber-500 text-[9px] font-mono px-1 rounded font-bold">
                        Lv.{loc.levelNumber}
                      </span>
                    </button>

                    {/* Tooltip Label */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-slate-950/90 border border-amber-500/80 text-amber-200 text-[10px] font-sans px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-30 shadow-xl">
                      {loc.name} ({questionCount} Soal)
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Character & AI Buddy Center Sprite Area */}
            <div className="relative z-10 flex items-center justify-center py-10 space-x-6">
              <div className="text-center group cursor-pointer" onClick={onOpenStudentSetup}>
                <div className="text-6xl drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] animate-pulse">
                  {student.avatar}
                </div>
                <div className="mt-2 bg-slate-950/90 border border-amber-500/80 px-2 py-0.5 rounded text-[10px] font-bold text-amber-300 shadow">
                  {student.name}
                </div>
              </div>

              {/* Pet Slime / Helper */}
              <div className="text-3xl animate-bounce">
                💧
              </div>
            </div>

            {/* AI Buddy Chat Tooltip Box */}
            <div className="relative z-10 bg-slate-950/95 border-2 border-amber-600/80 p-3 rounded-xl shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-800 border border-cyan-400 rounded-lg flex items-center justify-center text-xl shrink-0 shadow">
                🤖
              </div>
              <div className="flex-1 font-sans">
                <div className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                  <span>AI Buddy</span>
                  <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-700 px-1 rounded">Asisten RPG</span>
                </div>
                <p className="text-xs text-slate-200 mt-0.5 leading-snug">
                  Hai <strong>{student.name}</strong>! Klik lokasi level pada peta di atas untuk memulai kuis. Setiap lokasi adalah level baru! 💪
                </p>
              </div>
            </div>

            {/* Quick Action Hotbar (1-7) */}
            <div className="relative z-10 flex items-center justify-center gap-1.5 pt-3 border-t border-amber-800/60">
              {[
                { num: '1', name: 'Buku', icon: '📖', action: () => onSelectLocation(currentLoc) },
                { num: '2', name: 'Kuis', icon: '💡', action: () => onSelectLocation(currentLoc) },
                { num: '3', name: 'Laptop AI', icon: '💻', action: onOpenTeacherAuth },
                { num: '4', name: 'Siswa', icon: '👨‍🎓', action: onOpenLeaderboard },
                { num: '5', name: 'Inventori', icon: '🎒', action: onOpenInventory },
                { num: '6', name: 'Quest', icon: '📜', action: () => {} },
                { num: '7', name: 'Opsi', icon: '⚙️', action: onOpenDbModal },
              ].map((item) => (
                <button
                  key={item.num}
                  onClick={() => {
                    soundFx.playClick();
                    item.action();
                  }}
                  className="w-10 h-11 bg-slate-950/90 border border-amber-600/60 hover:border-amber-300 rounded-lg flex flex-col items-center justify-between p-1 transition transform hover:-translate-y-1 cursor-pointer text-slate-200 group"
                  title={item.name}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-[9px] font-mono text-amber-400 font-bold">{item.num}</span>
                </button>
              ))}
            </div>

          </div>

          {/* Right Column (3 cols): Main Menu ("MENU UTAMA") */}
          <div className="md:col-span-3 space-y-3">
            <div className="bg-slate-900/90 border-2 border-amber-700/80 rounded-xl p-3 shadow-lg">
              <div className="text-xs font-extrabold text-amber-300 mb-2 border-b border-amber-800 pb-1.5 flex items-center justify-between uppercase">
                <span>MENU UTAMA</span>
                <span className="text-[10px] text-slate-400 font-normal">Game RPG</span>
              </div>

              <div className="space-y-1.5 text-xs font-sans">
                
                {/* Inventori */}
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenInventory();
                  }}
                  className="w-full text-left p-2 rounded-lg bg-slate-950/80 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-600 text-amber-200 font-bold transition flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Backpack className="w-4 h-4 text-amber-400" />
                    Inventori
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Skill */}
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenInventory();
                  }}
                  className="w-full text-left p-2 rounded-lg bg-slate-950/80 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-600 text-amber-200 font-bold transition flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Skill & Lencana
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Siswa / Leaderboard */}
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenLeaderboard();
                  }}
                  className="w-full text-left p-2 rounded-lg bg-slate-950/80 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-600 text-amber-200 font-bold transition flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    Peringkat Siswa
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Database Settings */}
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenDbModal();
                  }}
                  className="w-full text-left p-2 rounded-lg bg-slate-950/80 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-600 text-amber-200 font-bold transition flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-purple-400" />
                    Database Google Sheets
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Mode Guru */}
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenTeacherAuth();
                  }}
                  className="w-full text-left p-2 rounded-lg bg-gradient-to-r from-purple-900/80 to-indigo-900/80 hover:from-purple-800 hover:to-indigo-800 border border-purple-500/80 text-purple-200 font-bold transition flex items-center justify-between cursor-pointer shadow mt-2"
                >
                  <span className="flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-amber-300" />
                    Mode Guru (bajuri39)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                </button>

              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
