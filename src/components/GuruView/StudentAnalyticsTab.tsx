import React, { useState, useEffect } from 'react';
import { StudentSubmission, DatabaseConfig } from '../../types';
import { fetchScoresFromDatabase } from '../../utils/gasClient';
import { soundFx } from '../../utils/soundEffects';
import { Award, RefreshCw, Download, Search, CheckCircle2 } from 'lucide-react';

interface StudentAnalyticsTabProps {
  dbConfig: DatabaseConfig;
}

export const StudentAnalyticsTab: React.FC<StudentAnalyticsTabProps> = ({ dbConfig }) => {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    setLoading(true);
    const data = await fetchScoresFromDatabase(dbConfig);
    setSubmissions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [dbConfig]);

  const filtered = submissions.filter(
    (s) =>
      s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.classGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.locationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              REKAP NILAI & PROGRES SISWA
            </h3>
            <p className="text-xs text-slate-400">
              Total {submissions.length} Rekaman Kuis {dbConfig.isConnected ? '(Google Sheets)' : '(Lokal Browser)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari siswa/kelas..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

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
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer transition flex items-center gap-1.5 shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

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
                    Tidak ditemukan data nilai siswa.
                  </td>
                </tr>
              ) : (
                filtered.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/60 transition">
                    <td className="p-3 font-mono text-[11px] text-slate-400">{sub.timestamp}</td>
                    <td className="p-3 font-bold text-amber-300">{sub.studentName}</td>
                    <td className="p-3 text-slate-300">{sub.classGrade}</td>
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
