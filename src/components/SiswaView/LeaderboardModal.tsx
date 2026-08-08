import React, { useEffect, useState } from 'react';
import { StudentSubmission, DatabaseConfig } from '../../types';
import { fetchScoresFromDatabase } from '../../utils/gasClient';
import { soundFx } from '../../utils/soundEffects';
import { Trophy, Medal, RefreshCw, UserCheck, Star } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  dbConfig: DatabaseConfig;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  dbConfig,
  onClose,
}) => {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchScoresFromDatabase(dbConfig);
    setSubmissions(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="bg-slate-900 border-2 border-amber-500 rounded-xl max-w-xl w-full p-5 text-slate-100 shadow-2xl relative max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-950 border border-amber-500 rounded-lg text-amber-300">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-amber-300 font-mono">
                PAPAN PERINGKAT PAHLAWAN ILMU
              </h2>
              <p className="text-xs text-slate-400">
                Data Nilai Kuis Siswa {dbConfig.isConnected ? '(Tersinkronisasi Google Sheets)' : '(Tersimpan Lokal)'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playClick();
                loadData();
              }}
              disabled={loading}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer transition"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
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
        </div>

        {/* List Content */}
        <div className="overflow-y-auto pr-1 flex-1 py-3 space-y-2">
          {submissions.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Belum ada data nilai kuis yang terekam. Selesaikan tantangan kuis di setiap level untuk masuk ke papan peringkat!
            </div>
          ) : (
            submissions.map((sub, idx) => {
              let badgeColor = 'bg-slate-800 border-slate-700 text-slate-300';
              let icon = <span className="font-mono font-bold text-slate-400">#{idx + 1}</span>;

              if (idx === 0) {
                badgeColor = 'bg-amber-950/80 border-amber-500 text-amber-300';
                icon = <Medal className="w-4 h-4 text-amber-400 shrink-0" />;
              } else if (idx === 1) {
                badgeColor = 'bg-slate-800/90 border-slate-400 text-slate-200';
                icon = <Medal className="w-4 h-4 text-slate-300 shrink-0" />;
              } else if (idx === 2) {
                badgeColor = 'bg-amber-950/40 border-amber-700 text-amber-400';
                icon = <Medal className="w-4 h-4 text-amber-600 shrink-0" />;
              }

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition ${badgeColor}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center font-bold">
                      {icon}
                    </div>
                    <div>
                      <div className="font-bold text-amber-200 text-sm flex items-center gap-2">
                        <span>{sub.studentName}</span>
                        <span className="text-[10px] bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                          {sub.classGrade}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Lokasi: <span className="text-amber-300 font-semibold">{sub.locationName}</span> • Level {sub.level}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-base font-extrabold text-emerald-400">
                      {sub.score}%
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {sub.correctCount}/{sub.totalQuestions} Soal Benar
                    </div>
                  </div>
                </div>
              );
            })
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
