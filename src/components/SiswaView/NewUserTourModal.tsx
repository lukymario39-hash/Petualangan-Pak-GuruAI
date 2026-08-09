import React, { useState } from 'react';
import { soundFx } from '../../utils/soundEffects';
import {
  MapPin,
  Backpack,
  TrendingUp,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Trophy,
  Compass,
  Zap
} from 'lucide-react';

interface NewUserTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInventory: () => void;
  onOpenProgressModal: () => void;
  onOpenStudentSetup: () => void;
}

export const NewUserTourModal: React.FC<NewUserTourModalProps> = ({
  isOpen,
  onClose,
  onOpenInventory,
  onOpenProgressModal,
  onOpenStudentSetup,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      id: 'location-selection',
      stepNumber: 1,
      title: '📍 Pemilihan Lokasi & Level Game',
      badge: 'Fitur Utama #1',
      icon: '🗺️',
      color: 'from-amber-500 to-amber-700',
      borderColor: 'border-amber-400',
      description:
        'Peta RPG interaktif terdiri dari 6 Lokasi Level (dari Desa Ilmu hingga Menara Malas). Klik ikon pin lokasi mana pun di peta atau tombol nomor di bagian bawah untuk memilih level kuis!',
      details: [
        'Setiap lokasi berisi kuis interaktif dari Pak Guru.',
        'Selesaikan level untuk membuka lokasi berikutnya.',
        'Dapatkan EXP, Koin Emas, dan kalahkan Bos Kebodohan di Menara Malas!'
      ],
      actionLabel: 'Paham Fitur Lokasi!',
      actionIcon: MapPin,
    },
    {
      id: 'inventory',
      stepNumber: 2,
      title: '🎒 Inventori & Perlengkapan Senjata',
      badge: 'Fitur Utama #2',
      icon: '🎒',
      color: 'from-amber-600 to-yellow-600',
      borderColor: 'border-yellow-400',
      description:
        'Kelola barang bawaan karaktermu di Ransel Inventori! Kamu bisa melihat senjata, perlengkapan, serta ramuan HP, MP, dan Energi.',
      details: [
        'Kumpulkan item dari reward menyelesaikan kuis level.',
        'Gunakan ramuan untuk memulihkan statistik HP & Energi.',
        'Pakaikan peralatan terbaik untuk memperkuat karakter RPG milikmu.'
      ],
      actionLabel: 'Buka Ransel Inventori',
      actionIcon: Backpack,
      onAction: () => {
        onClose();
        onOpenInventory();
      }
    },
    {
      id: 'progress-tracking',
      stepNumber: 3,
      title: '📊 Grafik Progres & Lencana Pencapaian',
      badge: 'Fitur Utama #3',
      icon: '📈',
      color: 'from-cyan-600 to-blue-700',
      borderColor: 'border-cyan-400',
      description:
        'Pantau perkembangan nilaimu melalui Grafik Recharts interaktif dan kumpulkan Lencana Pencapaian (Achievements) bergengsi!',
      details: [
        'Lihat grafik tren peningkatan nilai dari setiap kuis yang kamu kerjakan.',
        'Pantau riwayat progres yang tersimpan aman di Google Sheets.',
        'Buka 9 Lencana Pencapaian untuk mengklaim bonus EXP & Koin Emas!'
      ],
      actionLabel: 'Lihat Grafik Progres',
      actionIcon: TrendingUp,
      onAction: () => {
        onClose();
        onOpenProgressModal();
      }
    },
    {
      id: 'character-quests',
      stepNumber: 4,
      title: '👤 Profil Karakter & Misi Petualangan',
      badge: 'Fitur Utama #4',
      icon: '⭐',
      color: 'from-purple-600 to-indigo-700',
      borderColor: 'border-purple-400',
      description:
        'Pantau status vital karaktermu (HP, MP, Energi, EXP) dan jalankan Misi Harian di panel sebelah kiri.',
      details: [
        'Klik avatar karaktermu kapan saja untuk mengubah nama & gaya avatar piksel.',
        'Pantau bar EXP untuk melihat seberapa dekat kamu dengan Level Up berikutnya.',
        'Selesaikan Misi Utama & Misi Harian untuk menjadi Pahlawan Pembelajar!'
      ],
      actionLabel: 'Atur Profil Karakter',
      actionIcon: UserCheck,
      onAction: () => {
        onClose();
        onOpenStudentSetup();
      }
    }
  ];

  const activeStepData = steps[currentStep];

  const handleNext = () => {
    soundFx.playClick();
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleCompleteTour();
    }
  };

  const handlePrev = () => {
    soundFx.playClick();
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleCompleteTour = () => {
    soundFx.playClick();
    localStorage.setItem('pakguruai_tour_completed', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-slate-900 border-4 border-amber-500/90 rounded-3xl max-w-xl w-full p-6 text-slate-100 shadow-2xl relative space-y-5 overflow-hidden">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 border-2 border-amber-300 rounded-xl flex items-center justify-center text-xl shadow animate-pixel-bob">
              💡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-amber-300 font-mono tracking-wide">
                  PANDUAN PEMULA (PETUANGBARU)
                </h2>
                <span className="bg-amber-950 text-amber-300 border border-amber-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  {currentStep + 1} / {steps.length}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pengenalan fitur utama game Petualangan Kelas Pak Guru
              </p>
            </div>
          </div>

          <button
            onClick={handleCompleteTour}
            className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 rounded-xl transition cursor-pointer"
            title="Lewati Panduan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-between gap-2 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800">
          {steps.map((step, idx) => {
            const isActive = idx === currentStep;
            const isPassed = idx < currentStep;

            return (
              <button
                key={step.id}
                onClick={() => {
                  soundFx.playClick();
                  setCurrentStep(idx);
                }}
                className={`flex-1 py-1.5 rounded-xl border text-xs font-mono font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow ring-2 ring-amber-400/50'
                    : isPassed
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/80'
                    : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                }`}
              >
                <span>{step.icon}</span>
                <span className="hidden sm:inline">Langkah {step.stepNumber}</span>
              </button>
            );
          })}
        </div>

        {/* Current Step Display Card */}
        <div className="bg-slate-950 border-2 border-amber-700/80 rounded-2xl p-5 shadow-inner relative space-y-4 overflow-hidden">
          
          {/* Top Banner Tag */}
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full border bg-slate-900 ${activeStepData.borderColor} text-amber-300 shadow`}>
              {activeStepData.badge}
            </span>
            <span className="text-3xl animate-bounce">
              {activeStepData.icon}
            </span>
          </div>

          {/* Title & Description */}
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-amber-300 font-mono">
              {activeStepData.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {activeStepData.description}
            </p>
          </div>

          {/* Bullet Point Highlights */}
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-2 text-xs text-slate-300 font-pixelify">
            <div className="font-bold text-amber-400 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Poin Penting Fitur Ini:</span>
            </div>
            <ul className="space-y-1.5">
              {activeStepData.details.map((detail, dIdx) => (
                <li key={dIdx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Action Button if step has interactive launcher */}
          {activeStepData.onAction && (
            <button
              onClick={activeStepData.onAction}
              className="w-full py-2 px-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl text-xs transition cursor-pointer shadow flex items-center justify-center gap-2 border border-amber-200"
            >
              {React.createElement(activeStepData.actionIcon || Sparkles, { className: 'w-4 h-4' })}
              <span>Coba {activeStepData.actionLabel} Sekarang!</span>
            </button>
          )}

        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
              currentStep === 0
                ? 'bg-slate-950 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600 shadow'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          <button
            onClick={handleCompleteTour}
            className="text-xs text-slate-400 hover:text-slate-200 font-mono underline transition cursor-pointer"
          >
            Lewati Tur
          </button>

          <button
            onClick={handleNext}
            className="py-2.5 px-5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs transition cursor-pointer shadow flex items-center gap-1.5 border border-amber-200"
          >
            <span>{currentStep === steps.length - 1 ? 'Selesai & Mulai Bermain!' : 'Lanjut'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
