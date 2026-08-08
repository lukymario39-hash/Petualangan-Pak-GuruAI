import React, { useState } from 'react';
import { LocationLevel, Question } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { Sparkles, Copy, Check, Bot, BookOpen, RefreshCw, Layers, FileText } from 'lucide-react';

interface AIGeneratorTabProps {
  locations: LocationLevel[];
  onAddGeneratedQuestions: (locationId: string, newQuestions: Question[]) => void;
}

export const AIGeneratorTab: React.FC<AIGeneratorTabProps> = ({
  locations,
  onAddGeneratedQuestions,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'quiz' | 'comic'>('quiz');

  // AI Quiz Generator Form
  const [subject, setSubject] = useState('IPA (Sains)');
  const [grade, setGrade] = useState('SMP Kelas 7');
  const [topic, setTopic] = useState('Sistem Tata Surya & Planet');
  const [targetLocationId, setTargetLocationId] = useState(locations[0]?.id || 'desailmu');
  const [questionCount, setQuestionCount] = useState(3);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [quizStatusMessage, setQuizStatusMessage] = useState<string | null>(null);

  // AI Comic Prompt Generator Form
  const [jenjang, setJenjang] = useState<'SD' | 'SMP' | 'SMA'>('SD');
  const [kelas, setKelas] = useState('5');
  const [materi, setMateri] = useState('Siklus Air dan Pelestarian Lingkungan');
  const [generatingComic, setGeneratingComic] = useState(false);
  const [comicPromptOutput, setComicPromptOutput] = useState('');
  const [copiedComic, setCopiedComic] = useState(false);

  // Handle AI Quiz Generation
  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    setGeneratingQuiz(true);
    setQuizStatusMessage(null);

    try {
      const selectedLoc = locations.find((l) => l.id === targetLocationId);
      const res = await fetch('/api/ai-generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          grade,
          topic,
          count: Number(questionCount),
          locationName: selectedLoc?.name || 'Desa Ilmu',
        }),
      });

      const data = await res.json();
      setGeneratingQuiz(false);

      if (data.success && Array.isArray(data.questions)) {
        soundFx.playCorrect();
        const formattedQs: Question[] = data.questions.map((q: any, idx: number) => ({
          id: `q_ai_${targetLocationId}_${Date.now()}_${idx}`,
          locationId: targetLocationId,
          question: q.question,
          options: q.options || ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
          correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
          explanation: q.explanation || 'Penjelasan kuis AI Pak Guru.',
          hint: q.hint || 'Ingat kembali materi pelajaran.',
          expReward: q.expReward || 50,
          goldReward: q.goldReward || 20,
        }));

        onAddGeneratedQuestions(targetLocationId, formattedQs);
        setQuizStatusMessage(`Berhasil membuat ${formattedQs.length} soal AI dan ditambahkan ke ${selectedLoc?.name}!`);
      } else {
        soundFx.playWrong();
        setQuizStatusMessage(`Gagal membuat soal: ${data.error || 'Terjadi kesalahan'}`);
      }
    } catch (err: any) {
      setGeneratingQuiz(false);
      soundFx.playWrong();
      setQuizStatusMessage(`Gagal membuat soal AI: ${err.message || 'Error koneksi server'}`);
    }
  };

  // Handle AI Comic Prompt Generation
  const handleGenerateComicPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    setGeneratingComic(true);

    try {
      const res = await fetch('/api/ai-generate-comic-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jenjang,
          kelas,
          materi,
        }),
      });

      const data = await res.json();
      setGeneratingComic(false);

      if (data.success && data.promptResult) {
        soundFx.playCorrect();
        setComicPromptOutput(data.promptResult);
      } else {
        soundFx.playWrong();
        alert(`Gagal membuat prompt komik: ${data.error || 'Server error'}`);
      }
    } catch (err: any) {
      setGeneratingComic(false);
      soundFx.playWrong();
      alert(`Error koneksi server AI: ${err.message}`);
    }
  };

  const handleCopyComicPrompt = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(comicPromptOutput);
    setCopiedComic(true);
    setTimeout(() => setCopiedComic(false), 2500);
  };

  return (
    <div className="space-y-4 font-sans text-slate-100">
      
      {/* Sub Tabs Navigation */}
      <div className="flex border-b border-slate-800 pb-2 gap-3">
        <button
          onClick={() => {
            soundFx.playClick();
            setActiveSubTab('quiz');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'quiz'
              ? 'bg-amber-950 border border-amber-500 text-amber-300'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>AI Quiz Generator</span>
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            setActiveSubTab('comic');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'comic'
              ? 'bg-purple-950 border border-purple-500 text-purple-300'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4 text-purple-400" />
          <span>AI Prompt Generator Komik (ChatGPT)</span>
        </button>
      </div>

      {/* Sub Tab 1: AI Quiz Generator */}
      {activeSubTab === 'quiz' && (
        <div className="bg-slate-900 border-2 border-amber-600/80 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="p-2.5 bg-amber-950 border border-amber-500 rounded-lg text-amber-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-amber-300 font-mono">
                GENERATOR SOAL KUIS AI (GEMINI 3.6 FLASH)
              </h3>
              <p className="text-xs text-slate-400">
                Buat soal kuis interaktif secara otomatis berdasarkan Mata Pelajaran, Jenjang, dan Topik.
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerateQuiz} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Mata Pelajaran
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Contoh: Matematika / IPA / Bahasa Indonesia"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Jenjang & Kelas
                </label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="Contoh: SD Kelas 5 / SMP Kelas 8"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Topik / Materi Spesifik
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Contoh: Pecahan Campuran, Fotosintesis, Teks Prosedur"
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Target Lokasi Level Game
                </label>
                <select
                  value={targetLocationId}
                  onChange={(e) => setTargetLocationId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} (Level {loc.levelNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Jumlah Soal Dihasilkan
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none"
                >
                  <option value={2}>2 Soal</option>
                  <option value={3}>3 Soal</option>
                  <option value={5}>5 Soal</option>
                </select>
              </div>
            </div>

            {quizStatusMessage && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-lg text-xs text-emerald-200">
                {quizStatusMessage}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={generatingQuiz}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm shadow-xl transition cursor-pointer flex items-center justify-center gap-2 font-mono"
              >
                {generatingQuiz ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{generatingQuiz ? 'Gemini AI Sedang Membuat Soal...' : 'BUAT SOAL AI OTOMATIS'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sub Tab 2: AI Educational Comic Prompt Generator */}
      {activeSubTab === 'comic' && (
        <div className="bg-slate-900 border-2 border-purple-600/80 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="p-2.5 bg-purple-950 border border-purple-500 rounded-lg text-purple-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-purple-300 font-mono">
                GENERATOR PROMPT KOMIK PEMBELAJARAN (CHATGPT)
              </h3>
              <p className="text-xs text-slate-400">
                Hasilkan promp utuh siap di-copy-paste ke ChatGPT untuk membuat komik edukasi dari Cover hingga Halaman 10.
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerateComicPrompt} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Input 1: Jenjang */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  1. Jenjang Pendidikan
                </label>
                <select
                  value={jenjang}
                  onChange={(e) => setJenjang(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none"
                >
                  <option value="SD">SD (Bahasa Ceria & Komunitatif)</option>
                  <option value="SMP">SMP (Bahasa Semi-Formal & Seru)</option>
                  <option value="SMA">SMA (Bahasa Formal & Logis)</option>
                </select>
              </div>

              {/* Input 2: Kelas */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  2. Kelas
                </label>
                <input
                  type="text"
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  placeholder="Contoh: 5 / VII / X"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none"
                  required
                />
              </div>

              {/* Input 3: Materi */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  3. Materi Pelajaran
                </label>
                <input
                  type="text"
                  value={materi}
                  onChange={(e) => setMateri(e.target.value)}
                  placeholder="Contoh: Siklus Air, Pahlawan Nasional"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none"
                  required
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={generatingComic}
              className="w-full py-3 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-700 hover:from-purple-600 hover:to-indigo-600 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-xl transition cursor-pointer flex items-center justify-center gap-2 font-mono"
            >
              {generatingComic ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
              <span>{generatingComic ? 'Memproses Prompt Generator...' : 'GENERATE PROMPT KOMIK CHATGPT'}</span>
            </button>
          </form>

          {/* Generated Prompt Output Box */}
          {comicPromptOutput && (
            <div className="space-y-2 pt-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5 font-mono">
                  <FileText className="w-4 h-4" />
                  HASIL PROMPT SIAP COPY-PASTE UNTUK CHATGPT
                </span>
                <button
                  onClick={handleCopyComicPrompt}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs cursor-pointer transition shadow"
                >
                  {copiedComic ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedComic ? 'Tersalin ke Clipboard!' : 'Copy Entire Prompt'}</span>
                </button>
              </div>

              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-purple-300 overflow-x-auto max-h-80 leading-relaxed whitespace-pre-wrap">
                {comicPromptOutput}
              </pre>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
