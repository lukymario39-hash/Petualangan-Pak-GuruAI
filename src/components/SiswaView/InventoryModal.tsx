import React from 'react';
import { InventoryItem, Badge, StudentProfile } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { Backpack, Shield, Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface InventoryModalProps {
  isOpen: boolean;
  student: StudentProfile;
  onClose: () => void;
  onUsePotion: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  student,
  onClose,
  onUsePotion,
}) => {
  const [activeTab, setActiveTab] = React.useState<'inventory' | 'badges'>('inventory');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="bg-slate-900 border-2 border-amber-600 rounded-xl max-w-xl w-full p-5 text-slate-100 shadow-2xl relative max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-950 border border-amber-500 rounded-lg text-amber-300">
              <Backpack className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-amber-300 font-mono">
                INVENTORI & GELAR PAHLAWAN
              </h2>
              <p className="text-xs text-slate-400">
                Peralatan, Perlengkapan Sihir Ilmu, dan Lencana Prestasi {student.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-white text-lg font-bold p-1 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 my-3">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('inventory');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 cursor-pointer transition ${
              activeTab === 'inventory'
                ? 'border-amber-400 text-amber-300 bg-amber-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Backpack className="w-4 h-4" />
            <span>Peralatan & Barang ({student.inventory.length})</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('badges');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 cursor-pointer transition ${
              activeTab === 'badges'
                ? 'border-amber-400 text-amber-300 bg-amber-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Lencana Prestasi ({student.badges.length})</span>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto pr-1 flex-1 py-1 space-y-3">
          {activeTab === 'inventory' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {student.inventory.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border flex items-start gap-3 transition ${
                    item.isEquipped
                      ? 'bg-amber-950/60 border-amber-500/80 shadow-md'
                      : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <span className="text-3xl p-2 bg-slate-900 border border-slate-700 rounded-lg shrink-0">
                    {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-amber-200 truncate">
                        {item.name}
                      </h4>
                      {item.isEquipped && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded font-mono uppercase">
                          Dipakai
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="text-[10px] font-mono font-bold text-emerald-400 mt-1">
                      {item.statBonus}
                    </div>

                    {item.type === 'potion' && (
                      <button
                        onClick={() => {
                          soundFx.playCorrect();
                          onUsePotion();
                        }}
                        className="mt-2 text-[11px] bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-2.5 py-1 rounded cursor-pointer transition shadow flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Gunakan Ramuan (+50 Energy)</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {student.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-3 rounded-xl border bg-slate-950/80 border-amber-600/50 flex items-start gap-3"
                >
                  <span className="text-3xl p-2 bg-amber-950/60 border border-amber-500/60 rounded-lg shrink-0">
                    {badge.icon}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-amber-300">
                      {badge.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {badge.description}
                    </p>
                    {badge.unlockedAt && (
                      <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                        Terbuka: {badge.unlockedAt}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold border border-slate-600 transition cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
