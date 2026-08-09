import React, { useState } from 'react';
import { soundFx } from '../../utils/soundEffects';
import {
  Users,
  Play,
  UserPlus,
  Crown,
  Key,
  Sparkles,
  CheckCircle,
  Clock,
  LogOut,
  RefreshCw,
  Trophy,
  ShieldAlert,
  Zap,
  Gamepad2,
  Copy,
  Check
} from 'lucide-react';
import { MultiplayerRoom, MultiplayerPlayer, StudentProfile } from '../../types';

interface MultiplayerLobbyProps {
  room: MultiplayerRoom;
  student: StudentProfile;
  isAdmin: boolean;
  onUpdateRoom: (updatedRoom: MultiplayerRoom) => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  onToggleAdmin: () => void;
}

export const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({
  room,
  student,
  isAdmin,
  onUpdateRoom,
  onStartGame,
  onLeaveRoom,
  onToggleAdmin,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(room.roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAddBotPlayer = () => {
    soundFx.playClick();
    const botNames = [
      { name: 'Budi Kurniawan', avatar: '👨‍🎓', classGrade: student.classGrade || 'Kelas 8A' },
      { name: 'Siti Rahma', avatar: '👩‍🎓', classGrade: student.classGrade || 'Kelas 8A' },
      { name: 'Doni Pratama', avatar: '👦', classGrade: student.classGrade || 'Kelas 8A' },
      { name: 'Anisa Putri', avatar: '👧', classGrade: student.classGrade || 'Kelas 8A' },
      { name: 'Rizky Febrian', avatar: '🧙‍♂️', classGrade: student.classGrade || 'Kelas 8A' },
    ];

    const currentNames = room.players.map((p) => p.name);
    const availableBots = botNames.filter((b) => !currentNames.includes(b.name));

    if (availableBots.length === 0) return;

    const chosenBot = availableBots[Math.floor(Math.random() * availableBots.length)];
    const newBotPlayer: MultiplayerPlayer = {
      id: `bot_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: chosenBot.name,
      classGrade: chosenBot.classGrade,
      avatar: chosenBot.avatar,
      level: Math.floor(Math.random() * 3) + 1,
      score: (Math.floor(Math.random() * 5) + 1) * 20,
      gold: (Math.floor(Math.random() * 10) + 1) * 10,
      status: room.isGameStarted ? 'Sedang Berpetualang 🎮' : 'Siap Bermain 🟢',
      isHost: false,
      joinedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    onUpdateRoom({
      ...room,
      players: [...room.players, newBotPlayer],
    });
  };

  const handleRemovePlayer = (playerId: string) => {
    soundFx.playClick();
    onUpdateRoom({
      ...room,
      players: room.players.filter((p) => p.id !== playerId),
    });
  };

  return (
    <div className="bg-slate-950/95 border-2 border-amber-500/90 rounded-2xl p-4 sm:p-5 text-slate-100 shadow-2xl space-y-4 font-sans relative overflow-hidden">
      
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Lobby Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-indigo-700 border-2 border-amber-300 rounded-xl flex items-center justify-center text-2xl shadow-md animate-pulse">
            🎮
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-amber-300 font-mono tracking-wide">
                MODE MULTIPLAYER: {room.roomName}
              </h2>
              {room.isGameStarted ? (
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-500 text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                  BERLANGSUNG 🚀
                </span>
              ) : (
                <span className="bg-amber-950 text-amber-300 border border-amber-500 text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full">
                  LOBBY PERSIAPAN ⏳
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              Host / Admin Ruangan: <span className="text-amber-300 font-bold">{room.hostName}</span>
            </p>
          </div>
        </div>

        {/* Room Code & Action Badges */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          
          {/* Room Code Display */}
          <div className="flex items-center bg-slate-900 border border-amber-600/80 rounded-xl px-3 py-1.5 gap-2 shadow">
            <Key className="w-4 h-4 text-amber-400" />
            <div className="text-xs">
              <span className="text-[10px] text-slate-400 block font-mono">KODE ROOM:</span>
              <span className="font-extrabold text-amber-300 font-mono text-sm tracking-wider">
                {room.roomCode}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="p-1 bg-amber-950 hover:bg-amber-900 border border-amber-600 text-amber-300 rounded-lg transition cursor-pointer ml-1"
              title="Salin Kode Room"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Admin Role Toggle */}
          <button
            onClick={onToggleAdmin}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer shadow ${
              isAdmin
                ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400/50'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
            title="Klik untuk simulasi menjadi Admin/Host Ruangan"
          >
            <Crown className={`w-3.5 h-3.5 ${isAdmin ? 'text-slate-950' : 'text-amber-400'}`} />
            <span>{isAdmin ? 'Status: ADMIN 👑' : 'Status: SISWA 🎓'}</span>
          </button>

          {/* Leave Room Button */}
          <button
            onClick={onLeaveRoom}
            className="p-2 bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-300 border border-slate-700 hover:border-red-700 rounded-xl transition cursor-pointer"
            title="Keluar dari Ruang Multiplayer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Admin Control Banner (Start Game & Add Bot Controls) */}
      <div className="bg-slate-900/90 border-2 border-amber-600/80 p-3.5 rounded-2xl shadow-inner relative space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          <div className="space-y-0.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-extrabold text-amber-300 font-mono uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-4 h-4 text-amber-400" />
                KONTROL KELAS MULTIPLAYER (DIPEGANG ADMIN / GURU)
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {isAdmin
                ? 'Sebagai Admin, tekan START untuk memulai permainan bersama seluruh siswa yang telah bergabung!'
                : 'Menunggu Admin / Pak Guru menekan tombol START untuk memulai petualangan bersama.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end w-full md:w-auto">
            {isAdmin && (
              <button
                onClick={handleAddBotPlayer}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-amber-500/80 text-amber-300 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                <span>+ Simulasi Siswa Bot</span>
              </button>
            )}

            {/* START GAME BUTTON - Admin Exclusive */}
            {isAdmin ? (
              <button
                onClick={() => {
                  soundFx.playLevelUp();
                  onStartGame();
                }}
                className="py-2.5 px-6 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition cursor-pointer shadow-lg border border-amber-200 flex items-center gap-2 animate-pulse transform hover:scale-105"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>🚀 MULAI PERMAINAN BERSAMA (START)</span>
              </button>
            ) : (
              <div className="py-2 px-4 bg-amber-950/90 border border-amber-600 text-amber-300 text-xs font-bold rounded-xl flex items-center gap-2 animate-pulse">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Menunggu Host Memulai (START)...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOARD PEMAIN (Lobby Board Joined Students) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 font-mono text-xs font-extrabold text-amber-300 uppercase tracking-wider">
            <Users className="w-4 h-4 text-amber-400" />
            <span>BOARD PEMAIN YANG BERGABUNG ({room.players.length} SISWA)</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Ruang Kelas: {room.roomCode}
          </span>
        </div>

        {/* Players Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
          {room.players.map((p) => {
            const isMe = p.name === student.name;

            return (
              <div
                key={p.id}
                className={`p-3 rounded-xl border transition relative flex items-center justify-between gap-3 shadow ${
                  isMe
                    ? 'bg-amber-950/80 border-amber-400 shadow-amber-900/30 ring-2 ring-amber-500/40'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 bg-slate-950 border border-slate-700 rounded-lg flex items-center justify-center text-xl shrink-0">
                    {p.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-amber-200 truncate">
                        {p.name} {isMe && '(Kamu)'}
                      </span>
                      {p.isHost && (
                        <Crown className="w-3 h-3 text-amber-400 shrink-0" title="Host/Admin" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 font-mono">
                      <span>{p.classGrade}</span>
                      <span>•</span>
                      <span>Lv. {p.level}</span>
                      <span>•</span>
                      <span className="text-amber-300 font-bold">{p.score} EXP</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge & Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                      p.status.includes('Siap') || p.status.includes('Selesai')
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                        : 'bg-amber-950 text-amber-300 border-amber-600'
                    }`}
                  >
                    {p.status}
                  </span>

                  {isAdmin && !p.isHost && !isMe && (
                    <button
                      onClick={() => handleRemovePlayer(p.id)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded transition cursor-pointer"
                      title="Keluarkan dari room"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
