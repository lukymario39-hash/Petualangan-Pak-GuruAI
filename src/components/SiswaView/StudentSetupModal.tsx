import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { User, CheckCircle2, Sparkles, Shield, Wand2, Bot, Compass, Crown } from 'lucide-react';

interface StudentSetupModalProps {
  isOpen: boolean;
  student: StudentProfile;
  onClose: () => void;
  onSaveStudent: (updated: Partial<StudentProfile>) => void;
}

interface PixelAvatarSprite {
  id: string;
  emoji: string;
  title: string;
  classType: string;
  perk: string;
}

const PIXEL_AVATAR_SPRITES: PixelAvatarSprite[] = [
  { id: '1', emoji: '🧙‍♂️', title: 'Penyihir Ilmu', classType: 'Mage', perk: '+15 MP Bonus' },
  { id: '2', emoji: '🦸‍♂️', title: 'Kesatria Logika', classType: 'Knight', perk: '+20 HP Bonus' },
  { id: '3', emoji: '👩‍🎓', title: 'Cendekia Cerdas', classType: 'Scholar', perk: '+10% EXP Bonus' },
  { id: '4', emoji: '🥷', title: 'Ninja Pengetahuan', classType: 'Rogue', perk: '+10 Speed' },
  { id: '5', emoji: '🤖', title: 'Robot AI Buddy', classType: 'Cyborg', perk: '+25 Energy' },
  { id: '6', emoji: '🦊', title: 'Rubah Ajaib', classType: 'Beast', perk: 'Auto Hint' },
  { id: '7', emoji: '👩‍🚀', title: 'Penjelajah Antariksa', classType: 'Astronaut', perk: '+15 Gold' },
  { id: '8', emoji: '🧙‍♀️', title: 'Penyihir Bintang', classType: 'Sorceress', perk: '+20 MP Bonus' },
  { id: '9', emoji: '🕵️‍♂️', title: 'Detektif Sains', classType: 'Detective', perk: '+15% EXP' },
  { id: '10', emoji: '👸', title: 'Puteri Cendekia', classType: 'Royal', perk: '+30 HP Bonus' },
];

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

  const currentSprite = PIXEL_AVATAR_SPRITES.find(s => s.emoji === selectedAvatar) || PIXEL_AVATAR_SPRITES[0];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-pixelify">
      <div className="bg-slate-900 border-4 border-amber-600 rounded-2xl max-w-lg w-full p-5 text-slate-100 shadow-[0_0_30px_rgba(217,119,6,0.3)] relative max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-amber-700/60">
          <div className="p-2.5 bg-amber-950 border-2 border-amber-400 rounded-xl text-amber-300 shadow-md">
            <User className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-amber-300 font-silkscreen uppercase tracking-wider drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
              PROFIL SISWA PAHLAWAN
            </h2>
            <p className="text-xs text-amber-100/80 font-sans">
              Pilih karakter pixel-art, ubah nama, dan jenjang kelas untuk petualangan RPG!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
          
          {/* Name & Class inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1 font-silkscreen uppercase">
                Nama Lengkap Siswa
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs font-pixelify text-slate-100 focus:outline-none shadow-inner"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1 font-silkscreen uppercase">
                Kelas / Jenjang
              </label>
              <input
                type="text"
                value={classGrade}
                onChange={(e) => setClassGrade(e.target.value)}
                placeholder="Contoh: Kelas 5 SD / VII SMP"
                className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs font-pixelify text-slate-100 focus:outline-none shadow-inner"
                required
              />
            </div>
          </div>

          {/* Pixel Avatar Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-amber-300 font-silkscreen uppercase">
                Pilih Karakter Pixel-Art ({PIXEL_AVATAR_SPRITES.length} Pilihan)
              </label>
              <span className="text-[11px] text-amber-400 font-mono font-bold bg-amber-950/80 border border-amber-600/60 px-2 py-0.5 rounded-full">
                {currentSprite.title}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 bg-slate-950/90 border-2 border-slate-800 p-2.5 rounded-xl">
              {PIXEL_AVATAR_SPRITES.map((sprite) => {
                const isSelected = selectedAvatar === sprite.emoji;
                return (
                  <button
                    key={sprite.id}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedAvatar(sprite.emoji);
                    }}
                    className={`group relative p-2 rounded-xl border-2 transition-all transform hover:scale-105 cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-800 to-amber-950 border-amber-300 ring-2 ring-amber-400/80 scale-105 shadow-lg'
                        : 'bg-slate-900 border-slate-800 hover:border-amber-600/60'
                    }`}
                  >
                    <span className="text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {sprite.emoji}
                    </span>
                    <span className={`text-[9px] font-pixelify mt-1 truncate max-w-full font-bold ${isSelected ? 'text-amber-200' : 'text-slate-400'}`}>
                      {sprite.classType}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Sprite Card Preview */}
          <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border-2 border-amber-500/80 p-3 rounded-xl flex items-center gap-3 shadow-md">
            <div className="w-14 h-14 bg-slate-950 border-2 border-amber-400 rounded-xl flex items-center justify-center text-4xl shadow-inner shrink-0">
              {currentSprite.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-amber-300 font-silkscreen uppercase">
                  {currentSprite.title}
                </h4>
                <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded font-silkscreen uppercase">
                  {currentSprite.classType}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                Bonus Karakter: <strong className="text-emerald-400">{currentSprite.perk}</strong>
              </p>
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-600 transition cursor-pointer font-silkscreen"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold rounded-xl text-xs border-2 border-amber-300 shadow-xl transition cursor-pointer flex items-center gap-2 font-silkscreen uppercase tracking-wider"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Profil RPG</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

