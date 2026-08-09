import React, { useState } from 'react';
import { Lock, Shield, KeyRound, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface TeacherAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showHint, setShowHint] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'bajuri39') {
      soundFx.playCorrect();
      setError('');
      setPassword('');
      onAuthenticated();
    } else {
      soundFx.playWrong();
      setError('Password Mode Guru salah! Silakan coba lagi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-600/80 rounded-xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative overflow-hidden font-sans">
        
        {/* Top Decorative Banner */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-purple-600 to-amber-600" />
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-950 border border-purple-500/80 rounded-lg text-purple-300">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-amber-300 font-mono">
              OTENTIKASI MODE GURU
            </h2>
            <p className="text-xs text-slate-400">
              Masukkan password guru untuk mengakses Fitur Kelola Soal, AI Generator, & Nilai Siswa.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Password Mode Guru</span>
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-[11px] text-amber-400 hover:underline cursor-pointer"
              >
                {showHint ? 'Sembunyikan Petunjuk' : 'Butuh Petunjuk?'}
              </button>
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Masukkan password..."
                className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-500 rounded-lg px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none transition pr-10 font-mono"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {showHint && (
              <div className="mt-2 text-xs bg-amber-950/80 border border-amber-600/60 text-amber-200 p-2.5 rounded-lg flex items-start gap-2">
                <KeyRound className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Petunjuk Mode Guru:</strong> Password ini hanya dimiliki oleh Guru Pengampu. Silakan hubungi Administrator Sekolah atau Pak Guru jika memerlukan akses.
                </span>
              </div>
            )}

            {error && (
              <div className="mt-2 text-xs bg-red-950/80 border border-red-600 text-red-300 p-2.5 rounded-lg flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold border border-slate-600 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-purple-700 to-amber-700 hover:from-purple-600 hover:to-amber-600 text-white rounded-lg text-xs font-bold border border-amber-400 shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Masuk Mode Guru</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
