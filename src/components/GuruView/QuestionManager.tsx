import React, { useState } from 'react';
import { LocationLevel, Question } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { Plus, Trash2, Edit2, CheckCircle2, Save, X, HelpCircle, BookOpen, Filter, Download, Upload } from 'lucide-react';

interface QuestionManagerProps {
  locations: LocationLevel[];
  questions: Question[];
  onAddQuestion: (newQ: Question) => void;
  onUpdateQuestion: (updatedQ: Question) => void;
  onDeleteQuestion: (id: string) => void;
}

const CLASS_GRADE_OPTIONS = [
  'Semua Kelas',
  'Kelas 1 SD',
  'Kelas 2 SD',
  'Kelas 3 SD',
  'Kelas 4 SD',
  'Kelas 5 SD',
  'Kelas 6 SD',
  'Kelas 7 SMP',
  'Kelas 8 SMP',
  'Kelas 9 SMP',
  'Kelas 10 SMA',
  'Kelas 11 SMA',
  'Kelas 12 SMA',
];

export const QuestionManager: React.FC<QuestionManagerProps> = ({
  locations,
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>(locations[0]?.id || 'desailmu');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('Semua Kelas');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [qClassGrade, setQClassGrade] = useState<string>('Kelas 5 SD');
  const [qText, setQText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [explanation, setExplanation] = useState('');
  const [hint, setHint] = useState('');
  const [expReward, setExpReward] = useState<number>(50);
  const [goldReward, setGoldReward] = useState<number>(20);

  const filteredQuestions = questions.filter((q) => {
    const matchesLoc = q.locationId === selectedLocationId;
    const matchesClass = selectedClassFilter === 'Semua Kelas' || !q.classGrade || q.classGrade === selectedClassFilter || q.classGrade === 'Semua Kelas';
    return matchesLoc && matchesClass;
  });

  const selectedLocation = locations.find((l) => l.id === selectedLocationId);

  const resetForm = () => {
    setQClassGrade('Kelas 5 SD');
    setQText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectAnswer(0);
    setExplanation('');
    setHint('');
    setExpReward(50);
    setGoldReward(20);
    setEditingQuestion(null);
    setIsAdding(false);
  };

  const handleStartAdd = () => {
    soundFx.playClick();
    resetForm();
    setIsAdding(true);
  };

  const handleStartEdit = (q: Question) => {
    soundFx.playClick();
    setEditingQuestion(q);
    setIsAdding(false);
    setQClassGrade(q.classGrade || 'Kelas 5 SD');
    setQText(q.question);
    setOptionA(q.options[0] || '');
    setOptionB(q.options[1] || '');
    setOptionC(q.options[2] || '');
    setOptionD(q.options[3] || '');
    setCorrectAnswer(q.correctAnswer);
    setExplanation(q.explanation);
    setHint(q.hint);
    setExpReward(q.expReward || 50);
    setGoldReward(q.goldReward || 20);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !optionA.trim() || !optionB.trim()) {
      alert('Harap isi pertanyaan dan minimal Pilihan A dan B!');
      return;
    }

    soundFx.playCorrect();

    const qPayload: Question = {
      id: editingQuestion ? editingQuestion.id : `q_${selectedLocationId}_${Date.now()}`,
      locationId: selectedLocationId,
      classGrade: qClassGrade,
      question: qText.trim(),
      options: [optionA.trim(), optionB.trim(), optionC.trim() || 'Choice C', optionD.trim() || 'Choice D'],
      correctAnswer,
      explanation: explanation.trim() || 'Penjelasan kuis dari Pak GuruAI.',
      hint: hint.trim() || 'Ingat kembali materi pelajaran.',
      expReward: Number(expReward) || 50,
      goldReward: Number(goldReward) || 20,
    };

    if (editingQuestion) {
      onUpdateQuestion(qPayload);
    } else {
      onAddQuestion(qPayload);
    }

    resetForm();
  };

  // Export Bank Soal per Kelas
  const handleExportClassBank = () => {
    soundFx.playClick();
    const bankQuestions = selectedClassFilter === 'Semua Kelas'
      ? questions
      : questions.filter((q) => q.classGrade === selectedClassFilter || q.classGrade === 'Semua Kelas');

    if (bankQuestions.length === 0) {
      alert(`Tidak ada soal terdaftar untuk kategori ${selectedClassFilter}`);
      return;
    }

    const dataStr = JSON.stringify(bankQuestions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bank_soal_${selectedClassFilter.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import Bank Soal JSON
  const handleImportClassBank = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          imported.forEach((q: Question) => {
            if (q.question && q.options) {
              onAddQuestion({
                ...q,
                id: `imp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              });
            }
          });
          soundFx.playCorrect();
          alert(`Berhasil mengimpor ${imported.length} soal ke dalam Bank Soal Pak Guru!`);
        }
      } catch (err) {
        alert('Format file JSON bank soal tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4 font-sans text-slate-100">
      
      {/* Top Bar Filter & Bank Soal Quick Manager */}
      <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="p-2 bg-purple-950 border border-purple-500 rounded-lg text-purple-300">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-300 font-mono block">
              FILTER & SIMPAN BANK SOAL PER KELAS
            </span>
            <span className="text-[11px] text-slate-400">
              Panggil dan mainkan soal khusus berdasarkan tingkatan kelas siswa.
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={selectedClassFilter}
            onChange={(e) => {
              soundFx.playClick();
              setSelectedClassFilter(e.target.value);
            }}
            className="bg-slate-900 border-2 border-purple-500/80 rounded-lg px-3 py-1.5 text-xs text-amber-300 font-bold focus:outline-none cursor-pointer"
          >
            {CLASS_GRADE_OPTIONS.map((cg) => (
              <option key={cg} value={cg} className="bg-slate-950 text-slate-100">
                📌 {cg}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportClassBank}
            className="px-3 py-1.5 bg-indigo-900 hover:bg-indigo-800 border border-indigo-500 text-indigo-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
            title="Simpan/Ekspor Bank Soal per Kelas"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Simpan File Soal</span>
          </button>

          <label className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 border border-emerald-400 text-emerald-100 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Panggil File Soal</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportClassBank}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Location Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {locations.map((loc) => {
          const count = questions.filter((q) => q.locationId === loc.id).length;
          const isSelected = loc.id === selectedLocationId;

          return (
            <button
              key={loc.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedLocationId(loc.id);
                resetForm();
              }}
              className={`px-3 py-2 rounded-lg border text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-amber-950 border-amber-500 text-amber-300 ring-2 ring-amber-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{loc.icon}</span>
              <span>{loc.name}</span>
              <span className="px-1.5 py-0.2 bg-slate-950 border border-slate-700 text-[10px] rounded font-mono">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        
        {/* Left Side: Question List for Selected Location */}
        <div className="w-full md:w-1/2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-300 font-mono flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Daftar Soal {selectedLocation?.name} ({filteredQuestions.length})</span>
            </h3>

            {!isAdding && !editingQuestion && (
              <button
                onClick={handleStartAdd}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Soal</span>
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredQuestions.length === 0 ? (
              <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-xl text-center text-xs text-slate-400 space-y-2">
                <p>Belum ada soal kuis untuk lokasi {selectedLocation?.name}.</p>
                <button
                  onClick={handleStartAdd}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded text-xs transition cursor-pointer inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Soal Pertama</span>
                </button>
              </div>
            ) : (
              filteredQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-xl border transition ${
                    editingQuestion?.id === q.id
                      ? 'bg-amber-950/80 border-amber-500 ring-2 ring-amber-500/40'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        Soal #{idx + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/80 text-purple-200 text-[10px] font-mono font-bold">
                        {q.classGrade || 'Semua Kelas'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(q)}
                        className="p-1 text-slate-400 hover:text-amber-300 transition cursor-pointer"
                        title="Edit Soal"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Yakin ingin menghapus soal ini?')) {
                            soundFx.playClick();
                            onDeleteQuestion(q.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-red-400 transition cursor-pointer"
                        title="Hapus Soal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 font-medium mb-2 leading-relaxed">
                    {q.question}
                  </p>

                  <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-400 mb-2">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`px-2 py-0.5 rounded border truncate ${
                          oIdx === q.correctAnswer
                            ? 'bg-emerald-950 border-emerald-600 text-emerald-300 font-bold'
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}. {opt}
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-800 pt-1.5">
                    <span>Hadiah: +{q.expReward} EXP • +{q.goldReward} Gold</span>
                    <span className="text-amber-400/80">Kunci: pilihan {String.fromCharCode(65 + q.correctAnswer)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Add / Edit Question Form */}
        <div className="w-full md:w-1/2">
          {(isAdding || editingQuestion) ? (
            <div className="bg-slate-900 border-2 border-amber-600/80 rounded-xl p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-amber-300 font-mono">
                  {editingQuestion ? 'EDIT SOAL' : 'TAMBAH SOAL BARU'} - {selectedLocation?.name}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-slate-400 hover:text-slate-200 text-xs font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Target Kelas / Tingkatan
                  </label>
                  <select
                    value={qClassGrade}
                    onChange={(e) => setQClassGrade(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg p-2 text-xs text-amber-300 font-bold focus:outline-none"
                  >
                    {CLASS_GRADE_OPTIONS.map((cg) => (
                      <option key={cg} value={cg}>{cg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Teks Pertanyaan Soal
                  </label>
                  <textarea
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    placeholder="Tuliskan pertanyaan di sini..."
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg p-2.5 text-xs text-slate-100 font-sans focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-slate-300">
                    Pilihan Jawaban (Pilih Lingkaran untuk Jawaban Benar)
                  </label>
                  
                  {[
                    { label: 'A', val: optionA, setVal: setOptionA, index: 0 },
                    { label: 'B', val: optionB, setVal: setOptionB, index: 1 },
                    { label: 'C', val: optionC, setVal: setOptionC, index: 2 },
                    { label: 'D', val: optionD, setVal: setOptionD, index: 3 },
                  ].map((opt) => (
                    <div key={opt.label} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswerRadio"
                        checked={correctAnswer === opt.index}
                        onChange={() => setCorrectAnswer(opt.index)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer shrink-0"
                      />
                      <span className="w-5 font-bold font-mono text-amber-400">{opt.label}.</span>
                      <input
                        type="text"
                        value={opt.val}
                        onChange={(e) => opt.setVal(e.target.value)}
                        placeholder={`Jawaban Pilihan ${opt.label}`}
                        className="flex-1 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none"
                        required
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Penjelasan Pak Guru (Muncul jika siswa menjawab)
                  </label>
                  <input
                    type="text"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Mengapa jawaban tersebut benar..."
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Petunjuk AI Buddy
                  </label>
                  <input
                    type="text"
                    value={hint}
                    onChange={(e) => setHint(e.target.value)}
                    placeholder="Petunjuk bantuan untuk siswa..."
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">EXP Reward</label>
                    <input
                      type="number"
                      value={expReward}
                      onChange={(e) => setExpReward(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Gold Reward</label>
                    <input
                      type="number"
                      value={goldReward}
                      onChange={(e) => setGoldReward(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded font-bold hover:bg-slate-700 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded shadow transition cursor-pointer flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Soal</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs space-y-2">
              <HelpCircle className="w-8 h-8 text-slate-600 mx-auto" />
              <p>Pilih "Tambah Soal Baru" atau klik tombol edit pada soal di sebelah kiri untuk mengubah data.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
