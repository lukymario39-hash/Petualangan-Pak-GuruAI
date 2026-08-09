import React, { useState } from 'react';
import { soundFx } from '../../utils/soundEffects';
import { Users, Key, Sparkles, X, Plus, LogIn, Crown, Shield } from 'lucide-react';
import { StudentProfile, MultiplayerRoom, MultiplayerPlayer } from '../../types';

interface JoinMultiplayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  onCreateRoom: (roomCode: string, roomName: string) => void;
  onJoinRoom: (roomCode: string) => void;
}

export const JoinMultiplayerModal: React.FC<JoinMultiplayerModalProps> = ({
  isOpen,
  onClose,
  student,
  onCreateRoom,
  onJoinRoom,
}) => {
  const [tab, setTab] = useState<'join' | 'create'>('join');
  const [roomCodeInput, setRoomCodeInput] = useState('KELAS-8A');
  const [roomNameInput, setRoomNameInput] = useState('Petualangan Bersama Kelas 8A');

  if (!isOpen) return null;

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    if (!roomCodeInput.trim()) return;
    onJoinRoom(roomCodeInput.trim().toUpperCase());
    onClose();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    if (!roomCodeInput.trim() || !roomNameInput.trim()) return;
    onCreateRoom(roomCodeInput.trim().toUpperCase(), roomNameInput.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-slate-900 border-4 border-amber-500/90 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-indigo-700 border-2 border-amber-300 rounded-xl flex items-center justify-center text-xl shadow">
              🎮
            </div>
            <div>
              <h2 className="text-base font-extrabold text-amber-300 font-mono tracking-wide">
                MODE MULTIPLAYER
              </h2>
              <p className="text-xs text-slate-400">
                Bermain & Kuis Bersama Teman Sekelas
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-700 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 gap-1 font-mono text-xs font-bold">
          <button
            onClick={() => {
              soundFx.playClick();
              setTab('join');
            }}
            className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'join'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Gabung Room</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setTab('create');
            }}
            className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'create'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Buat Room (Host)</span>
          </button>
        </div>

        {tab === 'join' ? (
          <form onSubmit={handleJoin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1">
                <Key className="w-3.5 h-3.5" />
                MASUKKAN KODE ROOM RUANG KELAS:
              </label>
              <input
                type="text"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                placeholder="Contoh: KELAS-8A"
                className="w-full bg-slate-950 border-2 border-amber-600/80 rounded-xl px-3 py-2 text-sm text-amber-200 font-mono uppercase font-bold focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-1">
              <div className="font-bold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Profil Bergabung:
              </div>
              <p>
                Nama: <span className="text-amber-200 font-bold">{student.name}</span> ({student.classGrade || 'Siswa'})
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase font-mono tracking-wider transition cursor-pointer shadow flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>MASUK KE RUANG MULTIPLAYER</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1">
                <Key className="w-3.5 h-3.5" />
                KODE ROOM RUANG KELAS BARU:
              </label>
              <input
                type="text"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                placeholder="Contoh: KELAS-8A"
                className="w-full bg-slate-950 border-2 border-amber-600/80 rounded-xl px-3 py-2 text-sm text-amber-200 font-mono uppercase font-bold focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-300 font-mono">
                NAMA RUANGAN KELAS:
              </label>
              <input
                type="text"
                value={roomNameInput}
                onChange={(e) => setRoomNameInput(e.target.value)}
                placeholder="Contoh: Petualangan Bersama Kelas 8A"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-1">
              <div className="font-bold text-amber-400 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                Status Host / Admin:
              </div>
              <p>
                Kamu akan menjadi <span className="text-amber-300 font-bold">Admin / Host Ruangan</span> dan memegang kendali tombol START!
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-black rounded-xl text-xs uppercase font-mono tracking-wider transition cursor-pointer shadow flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>BUAT RUANG MULTIPLAYER BARU</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
