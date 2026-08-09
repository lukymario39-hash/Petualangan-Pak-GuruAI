import React, { useState, useEffect } from 'react';
import { StudentSubmission, DatabaseConfig } from '../../types';
import { fetchScoresFromDatabase } from '../../utils/gasClient';
import { soundFx } from '../../utils/soundEffects';
import { Award, RefreshCw, Download, Search, CheckCircle2, TrendingUp, Filter, BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell
} from 'recharts';

interface StudentAnalyticsTabProps {
  dbConfig: DatabaseConfig;
}

export const StudentAnalyticsTab: React.FC<StudentAnalyticsTabProps> = ({ dbConfig }) => {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('semua');
  const [showCharts, setShowCharts] = useState(true);

  const loadData = async () => {
    setLoading(true);
    // Fetch from Google Sheets if connected
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

    const combined = [...localData, ...dbData];
    setSubmissions(combined);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [dbConfig]);

  // Unique classes for filter
  const availableClasses = Array.from(new Set(submissions.map((s) => s.classGrade).filter(Boolean)));

  const filtered = submissions.filter((s) => {
    const matchesSearch =
      s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.classGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.locationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClassFilter === 'semua' || s.classGrade === selectedClassFilter;
    return matchesSearch && matchesClass;
  });

  // Recharts Chart Data Preparation
  const chartData = filtered.length > 0
    ? filtered.map((s, idx) => ({
        index: idx + 1,
        time: s.timestamp ? s.timestamp.split(' ')[0] : `Sesi ${idx + 1}`,
        student: s.studentName,
        score: s.score,
        level: s.level,
        location: s.locationName,
        classGrade: s.classGrade,
      }))
    : [
        { index: 1, time: 'Lvl 1', student: 'Siswa A', score: 80, level: 1, location: 'Desa Ilmu', classGrade: 'Kelas 5 SD' },
        { index: 2, time: 'Lvl 2', student: 'Siswa A', score: 85, level: 2, location: 'Hutan Kreativitas', classGrade: 'Kelas 5 SD' },
        { index: 3, time: 'Lvl 3', student: 'Siswa A', score: 95, level: 3, location: 'Pelabuhan Pengalaman', classGrade: 'Kelas 5 SD' },
      ];

  // Group by Class Grade for Bar Chart
  const classAvgMap: Record<string, { totalScore: number; count: number }> = {};
  submissions.forEach((s) => {
    const cg = s.classGrade || 'Umum';
    if (!classAvgMap[cg]) {
      classAvgMap[cg] = { totalScore: 0, count: 0 };
    }
    classAvgMap[cg].totalScore += s.score;
    classAvgMap[cg].count += 1;
  });

  const classChartData = Object.entries(classAvgMap).map(([cg, val]) => ({
    classGrade: cg,
    avgScore: Math.round(val.totalScore / val.count),
    totalSubmissions: val.count,
  }));

  const handleExportCsv = () => {
    soundFx.playClick();
    if (submissions.length === 0) {
      alert('Belum ada data untuk diekspor!');
      return;
    }

    const headers = ['Timestamp', 'Nama Siswa', 'Kelas', 'Level', 'Lokasi Level', 'Skor (%)', 'Jawaban Benar', 'Total Soal'];
    const rows = submissions.map((s) => [
      `"${s.timestamp}"`,
      `"${s.studentName}"`,
      `"${s.classGrade}"`,
      s.level,
      `"${s.locationName}"`,
      s.score,
      s.correctCount,
      s.totalQuestions,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_nilai_siswa_pakguruai_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 font-sans text-slate-100">
      
      {/* Top Header Control Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow">
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="p-2 bg-emerald-950 border border-emerald-500 rounded-lg text-emerald-300">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-300 font-mono">
              REKAP NILAI & PROGRES SISWA (RECHARTS ANALYTICS)
            </h3>
            <p className="text-xs text-slate-400">
              Total {submissions.length} Rekaman Kuis {dbConfig.isConnected ? '(Google Sheets)' : '(Lokal Browser)'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Filter per Kelas */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="semua" className="bg-slate-900 text-slate-200">Semua Kelas</option>
              {availableClasses.map((cg) => (
                <option key={cg} value={cg} className="bg-slate-900 text-slate-200">{cg}</option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-44">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari siswa..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              setShowCharts(!showCharts);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
              showCharts ? 'bg-amber-950 border-amber-500 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{showCharts ? 'Sembunyikan Grafik' : 'Tampilkan Grafik'}</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              loadData();
            }}
            disabled={loading}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold border border-slate-600 cursor-pointer transition flex items-center gap-1.5"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer transition flex items-center gap-1.5 shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Recharts Visualizations */}
      {showCharts && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Chart 1: Recharts Line Chart - Tren Skor */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold font-mono text-amber-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>Tren Skor Kuis Siswa (%)</span>
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">Skala 0 - 100%</span>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#d97706', borderRadius: '8px', color: '#f8fafc', fontSize: '11px' }}
                    formatter={(val: any) => [`${val}%`, 'Skor']}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', color: '#cbd5e1' }} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    name="Skor (%)"
                    stroke="#fbbf24"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#fbbf24' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Recharts Bar Chart - Rata-Rata Skor per Kelas */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold font-mono text-emerald-300 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Rata-Rata Skor Berdasarkan Kelas</span>
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">Nilai Rata-Rata</span>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classChartData.length > 0 ? classChartData : [{ classGrade: 'Kelas 5 SD', avgScore: 85, totalSubmissions: 1 }]} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                  <XAxis dataKey="classGrade" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#10b981', borderRadius: '8px', color: '#f8fafc', fontSize: '11px' }}
                    formatter={(val: any) => [`${val}%`, 'Rata-Rata Kelas']}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', color: '#cbd5e1' }} />
                  <Bar dataKey="avgScore" name="Rata-Rata Skor Kelas (%)" fill="#10b981" radius={[4, 4, 0, 0]}>
                    {classChartData.map((_, idx) => (
                      <Cell key={`c-${idx}`} fill={idx % 2 === 0 ? '#10b981' : '#059669'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="p-3">Waktu</th>
                <th className="p-3">Nama Siswa</th>
                <th className="p-3">Kelas</th>
                <th className="p-3">Lokasi Level</th>
                <th className="p-3 text-center">Soal Benar</th>
                <th className="p-3 text-right">Skor (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    Tidak ditemukan data nilai siswa untuk filter ini.
                  </td>
                </tr>
              ) : (
                filtered.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/60 transition">
                    <td className="p-3 font-mono text-[11px] text-slate-400">{sub.timestamp}</td>
                    <td className="p-3 font-bold text-amber-300">{sub.studentName}</td>
                    <td className="p-3 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-purple-300 text-[10px] font-mono">
                        {sub.classGrade || 'Umum'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-amber-200 text-[11px] font-mono">
                        {sub.locationName} (Lv.{sub.level})
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-300">
                      {sub.correctCount} / {sub.totalQuestions}
                    </td>
                    <td className="p-3 text-right font-mono font-extrabold text-emerald-400 text-sm">
                      {sub.score}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

