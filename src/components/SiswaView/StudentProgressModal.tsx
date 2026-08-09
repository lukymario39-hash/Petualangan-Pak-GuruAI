import React, { useState, useEffect } from 'react';
import { ProgressRecord, StudentSubmission, DatabaseConfig, StudentProfile, Achievement } from '../../types';
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
  RefreshCw,
  Trophy,
  Medal,
  Target,
  ShieldCheck,
  Flame,
  Coins,
  Lock,
  ChevronRight,
  BookOpen
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
  const [activeChartType, setActiveChartType] = useState<'score' | 'level' | 'location' | 'achievements'>('score');
  const [achievementCategory, setAchievementCategory] = useState<string>('semua');

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

  // Dynamic Calculations
  const totalQuizzes = chartData.length;
  const avgScore = totalQuizzes > 0 ? Math.round(chartData.reduce((acc, curr) => acc + curr.score, 0) / totalQuizzes) : 0;
  const highestScore = totalQuizzes > 0 ? Math.max(...chartData.map((c) => c.score)) : 0;
  const totalCorrectAnswers = chartData.reduce((acc, curr) => acc + (curr.correctCount || 0), 0);

  // Dynamic Achievements List Calculation
  const achievementsList: Achievement[] = [
    {
      id: 'ach-1',
      title: '🌟 Langkah Pertama',
      description: 'Selesaikan 1 kuis level pertama dalam petualangan.',
      icon: '🚀',
      category: 'soal',
      currentValue: totalQuizzes > 0 ? 1 : 0,
      targetValue: 1,
      isUnlocked: totalQuizzes >= 1,
      rewardExp: 50,
      rewardGold: 20,
    },
    {
      id: 'ach-2',
      title: '🎯 Penjawab Handal (10 Soal)',
      description: 'Jawab total 10 pertanyaan kuis dengan benar.',
      icon: '🎯',
      category: 'soal',
      currentValue: Math.min(totalCorrectAnswers, 10),
      targetValue: 10,
      isUnlocked: totalCorrectAnswers >= 10,
      rewardExp: 100,
      rewardGold: 50,
    },
    {
      id: 'ach-3',
      title: '📚 Siswa Cerdas (25 Soal)',
      description: 'Jawab total 25 pertanyaan kuis dengan benar.',
      icon: '📖',
      category: 'soal',
      currentValue: Math.min(totalCorrectAnswers, 25),
      targetValue: 25,
      isUnlocked: totalCorrectAnswers >= 25,
      rewardExp: 200,
      rewardGold: 100,
    },
    {
      id: 'ach-4',
      title: '🗺️ Penjelajah Nusantara',
      description: 'Buka & selesaikan minimal 3 Lokasi Level di Peta RPG.',
      icon: '🏕️',
      category: 'peta',
      currentValue: student.completedLocations.length,
      targetValue: 3,
      isUnlocked: student.completedLocations.length >= 3,
      rewardExp: 150,
      rewardGold: 75,
    },
    {
      id: 'ach-5',
      title: '👑 Master Seluruh Level',
      description: 'Selesaikan semua 6 Lokasi Level dari Desa hingga Menara Malas.',
      icon: '👑',
      category: 'peta',
      currentValue: student.completedLocations.length,
      targetValue: 6,
      isUnlocked: student.completedLocations.length >= 6,
      rewardExp: 500,
      rewardGold: 300,
    },
    {
      id: 'ach-6',
      title: '⚡ Level Up RPG 3',
      description: 'Tingkatkan karakter RPG kamu hingga mencapai Level 3.',
      icon: '⚔️',
      category: 'level',
      currentValue: Math.min(student.level, 3),
      targetValue: 3,
      isUnlocked: student.level >= 3,
      rewardExp: 100,
      rewardGold: 50,
    },
    {
      id: 'ach-7',
      title: '🔥 Nilai Sempurna (100%)',
      description: 'Raih nilai 100% tanpa salah dalam minimal 1 kuis level.',
      icon: '💯',
      category: 'soal',
      currentValue: highestScore >= 100 ? 1 : 0,
      targetValue: 1,
      isUnlocked: highestScore >= 100,
      rewardExp: 150,
      rewardGold: 80,
    },
    {
      id: 'ach-8',
      title: '🪙 Pengumpul Emas (100 Koin)',
      description: 'Miliki saldo koin emas minimal 100 Gold di ransel.',
      icon: '🪙',
      category: 'koin',
      currentValue: Math.min(student.gold, 100),
      targetValue: 100,
      isUnlocked: student.gold >= 100,
      rewardExp: 80,
      rewardGold: 50,
    },
    {
      id: 'ach-9',
      title: '🎒 Kolektor Peralatan',
      description: 'Miliki minimal 3 barang / perlengkapan di Ransel Inventori.',
      icon: '🛡️',
      category: 'khusus',
      currentValue: Math.min(student.inventory.length, 3),
      targetValue: 3,
      isUnlocked: student.inventory.length >= 3,
      rewardExp: 120,
      rewardGold: 60,
    },
  ];

  const unlockedCount = achievementsList.filter((a) => a.isUnlocked).length;
  const filteredAchievements = achievementCategory === 'semua'
    ? achievementsList
    : achievementsList.filter((a) => a.category === achievementCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in font-sans text-slate-100">
      <div className="bg-slate-900 border-2 border-amber-500 rounded-2xl w-full max-w-5xl p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto relative">
        
        {/* Top Title Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-600 to-amber-800 border border-amber-300 rounded-xl text-slate-950 font-bold shadow animate-pixel-bob">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-amber-300 font-mono tracking-wide">
                  GRAFIK TREN PROGRES & PENCAPAIAN SISWA
                </h2>
                <span className="bg-amber-950 text-amber-300 border border-amber-600 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                  {student.classGrade}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Visualisasi perkembangan nilai, riwayat kuis, serta sistem lencana pencapaian (achievements).
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
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase">Pencapaian Unlocked</p>
              <h3 className="text-lg font-extrabold text-purple-300 font-mono">{unlockedCount} / {achievementsList.length}</h3>
            </div>
          </div>
        </div>

        {/* Tab Selector Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/90 p-2.5 rounded-xl border border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
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

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveChartType('achievements');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer ${
                activeChartType === 'achievements'
                  ? 'bg-gradient-to-r from-purple-600 to-amber-500 text-slate-950 shadow-lg ring-2 ring-amber-300'
                  : 'bg-purple-950/80 text-purple-300 hover:bg-purple-900 border border-purple-600/60'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>Pencapaian / Achievements 🏆</span>
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

        {/* Content Box (Charts or Achievements) */}
        <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-xl shadow-inner min-h-[340px]">
          
          {/* TAB 1: SCORE TREND CHART */}
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

          {/* TAB 2: LEVEL PROGRESS CHART */}
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

          {/* TAB 3: LOCATION SCORE CHART */}
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

          {/* TAB 4: ACHIEVEMENTS & MILESTONES SYSTEM */}
          {activeChartType === 'achievements' && (
            <div className="space-y-4">
              
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <span className="text-slate-400">Kategori:</span>
                  {[
                    { id: 'semua', label: 'Semua' },
                    { id: 'soal', label: '🎯 Soal & Kuis' },
                    { id: 'peta', label: '🗺️ Peta Level' },
                    { id: 'level', label: '⚡ Level RPG' },
                    { id: 'koin', label: '🪙 Koin Emas' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setAchievementCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        achievementCategory === cat.id
                          ? 'bg-amber-500 text-slate-950 shadow'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="text-xs font-mono text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-600/50">
                  Terkumpul: <strong>{unlockedCount} / {achievementsList.length} Lencana</strong>
                </div>
              </div>

              {/* Achievements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredAchievements.map((ach) => {
                  const pct = Math.min(100, Math.round((ach.currentValue / ach.targetValue) * 100));

                  return (
                    <div
                      key={ach.id}
                      className={`p-3.5 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between ${
                        ach.isUnlocked
                          ? 'bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-950 border-amber-500/80 shadow-lg shadow-amber-950/30 ring-1 ring-amber-400/40'
                          : 'bg-slate-950/80 border-slate-800 opacity-75'
                      }`}
                    >
                      {/* Top Header Row */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-2xl shadow shrink-0 ${
                            ach.isUnlocked
                              ? 'bg-amber-500 text-slate-950 border-amber-300 animate-pixel-bob'
                              : 'bg-slate-900 text-slate-500 border-slate-700'
                          }`}>
                            {ach.icon}
                          </div>
                          <div>
                            <h4 className={`text-xs font-extrabold font-mono uppercase ${
                              ach.isUnlocked ? 'text-amber-300' : 'text-slate-400'
                            }`}>
                              {ach.title}
                            </h4>
                            <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
                              {ach.description}
                            </p>
                          </div>
                        </div>

                        {ach.isUnlocked ? (
                          <span className="bg-emerald-950 border border-emerald-500 text-emerald-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Terbuka</span>
                          </span>
                        ) : (
                          <span className="bg-slate-900 border border-slate-700 text-slate-500 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                            <Lock className="w-3 h-3" />
                            <span>Terkunci</span>
                          </span>
                        )}
                      </div>

                      {/* Progress Bar & Numeric Status */}
                      <div className="space-y-1 mt-2">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-400">Kemajuan:</span>
                          <span className={ach.isUnlocked ? 'text-amber-300 font-bold' : 'text-slate-400'}>
                            {ach.currentValue} / {ach.targetValue} ({pct}%)
                          </span>
                        </div>

                        <div className="h-2 bg-slate-900 border border-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              ach.isUnlocked
                                ? 'bg-gradient-to-r from-amber-500 to-emerald-400'
                                : 'bg-amber-600/60'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      {/* Rewards Footer */}
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400">Hadiah:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">+{ach.rewardExp} EXP</span>
                          <span className="text-amber-400 font-bold">+{ach.rewardGold} Gold</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

        {/* Footer Note */}
        <div className="bg-amber-950/40 border border-amber-600/50 p-3 rounded-xl flex items-center justify-between text-xs text-amber-200">
          <p className="font-mono text-[11px]">
            💡 Catatan: Grafik Recharts & Milestone Pencapaian secara otomatis diperbarui setiap kali siswa menyelesaikan kuis level.
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

