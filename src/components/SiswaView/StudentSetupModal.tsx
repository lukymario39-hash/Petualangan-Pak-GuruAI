import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { User, CheckCircle2 } from 'lucide-react';

interface StudentSetupModalProps {
  isOpen: boolean;
  student: StudentProfile;
  onClose: () => void;
  onSaveStudent: (updated: Partial<StudentProfile>) => void;
}

const AVATAR_OPTIONS = ['👨‍🎓', '👩‍🎓', '🧙‍♂️', '🧙‍♀️', '👨‍🏫', '👩‍🏫', '🦸‍♂️', '🦸‍♀️', '🤖', '🦊'];

export const StudentSetupModal: React.FC<StudentSetupModalProps> = ({
  isOpen,
  student,
  onClose,
  onSaveStudent,
}) => {
  const [name, setName] = useState(student.name);
  const [classGrade, setClassGrade] = useState(student.classGrade);
  const [selectedAvatar, setSelectedAvatar] = useState(student.avatar);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playCorrect();
    onSaveStudent({
      name: name.trim() || 'Siswa Teladan',
      classGrade: classGrade.trim() || 'Kelas 5 SD',
      avatar: selectedAvatar
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="bg-slate-900 border-2 border-amber-500 rounded-xl max-w-md w-full p-5 text-slate-100 shadow-2xl relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-950 border border-amber-500 rounded-lg text-amber-300">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-amber-300 font-mono">
              PROFIL SISWA PAHLAWAN
            </h2>
            <p className="text-xs text-slate-400">
              Ubah Nama, Kelas, dan Avatar Karakter RPG Anda.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Nama Lengkap Siswa
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Kelas / Jenjang Pendidikan
            </label>
            <input
              type="text"
              value={classGrade}
              onChange={(e) => setClassGrade(e.target.value)}
              placeholder="Contoh: Kelas 5 SD / Kelas VII SMP / Kelas X SMA"
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Pilih Avatar Karakter RPG
            </label>
            <div className="grid grid-cols-5 gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedAvatar(av);
                  }}
                  className={`p-2.5 rounded-lg border text-2xl flex items-center justify-center transition cursor-pointer ${
                    selectedAvatar === av
                      ? 'bg-amber-950/90 border-amber-400 ring-2 ring-amber-400/50 scale-105'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold border border-slate-600 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs border border-amber-400 shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Profil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
