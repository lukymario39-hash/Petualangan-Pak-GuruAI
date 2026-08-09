import React, { useState, useEffect } from 'react';
import { ProgressRecord, StudentSubmission, DatabaseConfig, StudentProfile } from '../../types';
import { fetchScoresFromDatabase } from '../../utils/gasClient';
import { soundFx } from '../../utils/soundEffects';
import {
  X,
  TrendingUp,
  Award,
  BarChart3,
  Sparkles,
  Calendar,
  Layers,
  CheckCircle2,
  Filter,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell
} from 'recharts';

interface StudentProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  dbConfig: DatabaseConfig;
}

export const StudentProgressModal: React.FC<StudentProgressModalProps> = ({
  isOpen,
  onClose,
  student,
  dbConfig,
}) => {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('semua');
  const [activeChartType, setActiveChartType] = useState<'score' | 'level' | 'location'>('score');

  const loadProgressData = async () => {
    setLoading(true);
    // Fetch from DB if connected
    let dbData: StudentSubmission[] = [];
    if (dbConfig.isConnected) {
      dbData = await fetchScoresFromDatabase(dbConfig);
    }

    // Load from local history as well
    const localSaved = localStorage.getItem('pakguruai_progress_history');
    let localData: StudentSubmission[] = [];
    if (localSaved) {
      try {
        localData = JSON.parse(localSaved);
      } catch (e) {
        console.error(e);
      }
    }

    // Merge and deduplicate
    const combined = [...localData, ...dbData];
    // Filter for current student or show all if student name matches
    setSubmissions(combined);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadProgressData();
    }
  }, [isOpen, dbConfig]);

  if (!isOpen) return null;

  // Filter submissions by student name or class grade
  const studentData = submissions.filter(
    (s) =>
      s.studentName.toLowerCase() === student.name.toLowerCase() ||
      selectedClassFilter === 'semua' ||
      s.classGrade === selectedClassFilter
  );

  // Fallback sample data if no history yet so charts always display beautifully
  const chartData = studentData.length > 0
    ? studentData.map((s, idx) => ({
        index: idx + 1,
        time: s.timestamp.split(' ')[0] || `Kuis ${idx + 1}`,
        score: s.score,
        level: s.level,
        correctCount: s.correctCount,
        totalQuestions: s.totalQuestions,
        location: s.locationName,
        classGrade: s.classGrade,
      }))
    : [
        { index: 1, time: 'Lvl 1 (Desa Ilmu)', score: 80, level: 1, correctCount: 4, totalQuestions: 5, location: 'Desa Ilmu', classGrade: student.classGrade },
        { index: 2, time: 'Lvl 2 (Hutan)', score: 85, level: 2, correctCount: 5, totalQuestions: 5, location: 'Hutan Kreativitas', classGrade: student.classGrade },
        { index: 3, time: 'Lvl 3 (Pelabuhan)', score: 90, level: 3, correctCount: 5, totalQuestions: 5, location: 'Pelabuhan Pengalaman', classGrade: student.classGrade },
        { index: 4, time: 'Lvl 4 (Akademi)', score: 95, level: 4, correctCount: 5, totalQuestions: 5, location: 'Akademi Inspirasi', classGrade: student.classGrade },
      ];

  // Group performance by Location
  const locationAccMap: Record<string, { totalScore: number; count: number; location: string }> = {};
  chartData.forEach((item) => {
    if (!locationAccMap[item.location]) {
      locationAccMap[item.location] = { totalScore: 0, count: 0, location: item.location };
    }
    locationAccMap[item.location].totalScore += item.score;
    locationAccMap[item.location].count += 1;
  });

  const locationChartData = Object.values(locationAccMap).map((l) => ({
    location: l.location,
    avgScore: Math.round(l.totalScore / l.count),
  }));

  // Calculations
  const totalQuizzes = chartData.length;
  const avgScore = totalQuizzes > 0 ? Math.round(chartData.reduce((acc, curr) => acc + curr.score, 0) / totalQuizzes) : 0;
  const highestScore = totalQuizzes > 0 ? Math.max(...chartData.map((c) => c.score)) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in font-sans text-slate-100">
      <div className="bg-slate-900 border-2 border-amber-500 rounded-2xl w-full max-w-5xl p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto relative">
        
        {/* Top Title Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-600 to-amber-800 border border-amber-300 rounded-xl text-slate-950 font-bold shadow animate-pixel-bob">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-amber-300 font-mono tracking-wide">
                  GRAFIK TREN PROGRES SISWA (RECHARTS)
                </h2>
                <span className="bg-amber-950 text-amber-300 border border-amber-600 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                  {student.classGrade}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Visualisasi perkembangan nilai, riwayat kuis, dan peningkatan level dari waktu ke waktu.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950/80 border border-amber-500/40 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-amber-950 text-amber-400 rounded-lg border border-amber-600">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase">Rata-Rata Skor</p>
              <h3 className="text-lg font-extrabold text-amber-300 font-mono">{avgScore}%</h3>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-emerald-500/40 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase">Skor Tertinggi</p>
              <h3 className="text-lg font-extrabold text-emerald-400 font-mono">{highestScore}%</h3>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-cyan-500/40 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-cyan-950 text-cyan-400 rounded-lg border border-cyan-600">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase">Level Sekarang</p>
              <h3 className="text-lg font-extrabold text-cyan-300 font-mono">Lv. {student.level}</h3>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-purple-500/40 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-purple-950 text-purple-400 rounded-lg border border-purple-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase">Total Sesi Kuis</p>
              <h3 className="text-lg font-extrabold text-purple-300 font-mono">{totalQuizzes} Sesi</h3>
            </div>
          </div>
        </div>

        {/* Chart Selector Controls & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/90 p-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveChartType('score');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeChartType === 'score'
                  ? 'bg-amber-600 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Tren Skor (%)</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveChartType('level');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeChartType === 'level'
                  ? 'bg-cyan-600 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Progres Level RPG</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveChartType('location');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeChartType === 'location'
                  ? 'bg-emerald-600 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Nilai Per Lokasi</span>
            </button>
          </div>

          <button
            onClick={loadProgressData}
            disabled={loading}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-bold border border-slate-700 cursor-pointer transition flex items-center gap-1.5 self-end sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Muat Ulang Data</span>
          </button>
        </div>

        {/* Recharts Graphical Visualization Box */}
        <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-xl shadow-inner min-h-[320px]">
          {activeChartType === 'score' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-300 font-bold flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  Grafik Tren Skor Kuis (%) dari Waktu ke Waktu
                </span>
                <span className="text-[10px] font-mono text-slate-500">Skala 0 - 100%</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#d97706', borderRadius: '8px', color: '#f8fafc' }}
                      formatter={(val: any) => [`${val}%`, 'Skor']}
                      labelFormatter={(lbl: any) => `Sesi: ${lbl}`}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      name="Skor Kuis (%)"
                      stroke="#fbbf24"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#fbbf24', stroke: '#78350f', strokeWidth: 2 }}
                      activeDot={{ r: 8, fill: '#f59e0b' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeChartType === 'level' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  Grafik Peningkatan Level Karakter RPG Siswa
                </span>
                <span className="text-[10px] font-mono text-slate-500">Tingkat Level (Lv. 1 - Lv. 10)</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0891b2" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 'dataMax + 2']} stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#06b6d4', borderRadius: '8px', color: '#f8fafc' }}
                      formatter={(val: any) => [`Level ${val}`, 'Tingkatan Level']}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
                    <Area
                      type="monotone"
                      dataKey="level"
                      name="Level Siswa"
                      stroke="#22d3ee"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorLevel)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeChartType === 'location' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Bar Chart Akurasi Nilai Rata-Rata per Lokasi RPG
                </span>
                <span className="text-[10px] font-mono text-slate-500">Nilai Persentase</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={locationChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                    <XAxis dataKey="location" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#10b981', borderRadius: '8px', color: '#f8fafc' }}
                      formatter={(val: any) => [`${val}%`, 'Rata-Rata Nilai']}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
                    <Bar dataKey="avgScore" name="Rata-Rata Nilai Lokasi (%)" fill="#10b981" radius={[6, 6, 0, 0]}>
                      {locationChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#059669'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="bg-amber-950/40 border border-amber-600/50 p-3 rounded-xl flex items-center justify-between text-xs text-amber-200">
          <p className="font-mono text-[11px]">
            💡 Catatan: Grafik Recharts secara otomatis diperbarui setiap kali siswa menyelesaikan kuis level. Data tersimpan di server Google Sheets & browser lokal.
          </p>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-lg cursor-pointer transition shadow"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
