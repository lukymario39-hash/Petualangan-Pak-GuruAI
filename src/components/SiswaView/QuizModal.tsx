import React, { useState } from 'react';
import { LocationLevel, Question, StudentProfile } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { CheckCircle2, XCircle, Lightbulb, Trophy, ArrowRight, ShieldAlert, Sparkles, Award, X, AlertTriangle, LogOut } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  location: LocationLevel | null;
  questions: Question[];
  student: StudentProfile;
  onClose: () => void;
  onCompleteQuiz: (locationId: string, correctCount: number, totalQuestions: number, expEarned: number, goldEarned: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  location,
  questions,
  student,
  onClose,
  onCompleteQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalExpGained, setTotalExpGained] = useState(0);
  const [totalGoldGained, setTotalGoldGained] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  if (!isOpen || !location) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    soundFx.playClick();
    setSelectedOption(idx);
  };

  const handleAttemptExit = () => {
    soundFx.playClick();
    if (quizCompleted) {
      handleFinishQuizModal();
    } else {
      setShowExitConfirm(true);
    }
  };

  const handleConfirmExit = () => {
    soundFx.playClick();
    setShowExitConfirm(false);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    setCorrectCount(0);
    setTotalExpGained(0);
    setTotalGoldGained(0);
    setQuizCompleted(false);
    onClose();
  };

  const handleCancelExit = () => {
    soundFx.playClick();
    setShowExitConfirm(false);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswered || !currentQ) return;

    setIsAnswered(true);
    const isCorrect = selectedOption === currentQ.correctAnswer;

    if (isCorrect) {
      soundFx.playCorrect();
      setCorrectCount((prev) => prev + 1);
      setTotalExpGained((prev) => prev + (currentQ.expReward || 50));
      setTotalGoldGained((prev) => prev + (currentQ.goldReward || 20));
    } else {
      soundFx.playWrong();
    }
  };

  const handleNextQuestion = () => {
    soundFx.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      // Quiz Finished!
      soundFx.playLevelUp();
      setQuizCompleted(true);
    }
  };

  const handleFinishQuizModal = () => {
    soundFx.playClick();
    onCompleteQuiz(
      location.id,
      correctCount,
      questions.length,
      totalExpGained,
      totalGoldGained
    );
    // reset local modal state
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    setCorrectCount(0);
    setTotalExpGained(0);
    setTotalGoldGained(0);
    setQuizCompleted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500 rounded-2xl max-w-2xl w-full p-5 text-slate-100 shadow-2xl relative overflow-hidden font-sans">
        
        {/* Top Header Banner */}
        <div className={`p-4 rounded-xl border mb-4 bg-gradient-to-r ${location.bgGradient} border-amber-500/80 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-slate-950/80 border border-amber-400 rounded-lg shadow-inner">
              {location.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded border border-amber-400/50 font-bold">
                  LEVEL {location.levelNumber} • {location.name}
                </span>
                {location.bossName && (
                  <span className="text-[10px] font-mono uppercase bg-red-500/30 text-red-300 px-2 py-0.5 rounded border border-red-400/50 font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    Tantangan
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5 font-mono">
                {location.subtitle}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-amber-200 font-bold">Soal Pak GuruAI</div>
              <div className="text-sm font-mono font-extrabold text-amber-400">
                {quizCompleted ? 'SELESAI' : `${currentIndex + 1} / ${questions.length}`}
              </div>
            </div>
            
            <button
              onClick={handleAttemptExit}
              className="p-1.5 sm:p-2 bg-slate-950/80 hover:bg-red-950 border border-amber-400/80 hover:border-red-500 text-slate-300 hover:text-red-300 rounded-xl transition cursor-pointer flex items-center gap-1 shadow shrink-0"
              title="Keluar dari Kuis Level"
            >
              <X className="w-5 h-5 text-red-400" />
              <span className="text-xs font-bold text-red-300 hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {!quizCompleted ? (
          /* Question Active State */
          <div>
            {currentQ ? (
              <div className="space-y-4">
                
                {/* Question Text */}
                <div className="bg-slate-950/90 border border-slate-700/80 p-4 rounded-xl shadow-inner">
                  <div className="flex items-center justify-between text-xs text-amber-400 font-mono mb-2">
                    <span>Pertanyaan #{currentIndex + 1}</span>
                    <span className="text-slate-400">Hadiah: +{currentQ.expReward} EXP • +{currentQ.goldReward} Gold</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed font-sans">
                    {currentQ.question}
                  </h3>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentQ.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctAnswer;
                    
                    let btnStyle = 'bg-slate-950 border-slate-700 hover:border-amber-500 text-slate-200';
                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-red-950/90 border-red-500 text-red-200 ring-2 ring-red-500/50';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-amber-950/90 border-amber-400 text-amber-200 ring-2 ring-amber-400/50';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswered}
                        className={`p-3 rounded-xl border-2 text-left text-xs sm:text-sm font-medium transition cursor-pointer flex items-start gap-3 ${btnStyle}`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-amber-400 shrink-0 font-mono text-xs">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1 mt-0.5">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Hint & Explanation Bar */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setShowHint(!showHint);
                    }}
                    className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>{showHint ? 'Sembunyikan Petunjuk AI' : 'Minta Petunjuk AI Buddy'}</span>
                  </button>

                  <span className="text-slate-400 text-[11px]">
                    Siswa: {student.name} ({student.classGrade})
                  </span>
                </div>

                {showHint && currentQ.hint && (
                  <div className="p-3 bg-amber-950/80 border border-amber-500/60 rounded-xl text-xs text-amber-200 animate-fadeIn flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Petunjuk AI Buddy:</strong> {currentQ.hint}
                    </div>
                  </div>
                )}

                {/* Answer Feedback / Explanation */}
                {isAnswered && (
                  <div className={`p-3.5 rounded-xl border text-xs space-y-1 animate-fadeIn ${
                    selectedOption === currentQ.correctAnswer
                      ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                      : 'bg-red-950/90 border-red-500 text-red-200'
                  }`}>
                    <div className="font-bold text-sm flex items-center gap-2">
                      {selectedOption === currentQ.correctAnswer ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span>Jawaban Benar! (+{currentQ.expReward} EXP, +{currentQ.goldReward} Gold)</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-400" />
                          <span>Jawaban Belum Tepat!</span>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-95 pt-1">
                      <strong>Penjelasan Pak GuruAI:</strong> {currentQ.explanation}
                    </p>
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  {!isAnswered ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm cursor-pointer disabled:opacity-50 transition shadow-lg flex items-center gap-2"
                    >
                      <span>Kirim Jawaban</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer transition shadow-lg flex items-center gap-2"
                    >
                      <span>{currentIndex + 1 < questions.length ? 'Pertanyaan Berikutnya' : 'Selesaikan Kuis Level'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                Belum ada pertanyaan untuk lokasi ini. Pak Guru dapat menambahkannya di Mode Guru.
              </div>
            )}
          </div>
        ) : (
          /* Victory / Level Completed Screen */
          <div className="text-center py-6 space-y-4 animate-scaleUp">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full border-4 border-amber-200 flex items-center justify-center mx-auto text-4xl shadow-2xl animate-bounce">
              🏆
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-amber-300 font-mono">
                LEVEL SELESAI! NAIK LEVEL!
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Selamat <strong>{student.name}</strong>, kamu berhasil menyelesaikan tantangan di <strong>{location.name}</strong>!
              </p>
            </div>

            {/* Stats Earned Summary */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto bg-slate-950 p-4 rounded-xl border border-amber-500/60 font-mono text-center">
              <div>
                <div className="text-[10px] text-slate-400">BENAR</div>
                <div className="text-lg font-bold text-emerald-400">{correctCount} / {questions.length}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">EXP Gained</div>
                <div className="text-lg font-bold text-amber-400">+{totalExpGained} XP</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Gold Earned</div>
                <div className="text-lg font-bold text-amber-300">+{totalGoldGained} 💰</div>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-xs text-emerald-200 max-w-md mx-auto">
              ✨ Nilai kuis dan progres kamu telah berhasil dicatat dan disinkronkan ke Database Google Sheets Pak GuruAI!
            </div>

            <div className="pt-2">
              <button
                onClick={handleFinishQuizModal}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-extrabold rounded-xl text-sm shadow-xl hover:scale-105 transition cursor-pointer font-mono"
              >
                LANJUTKAN PETUALANGAN KE LOKASI BARU 🚀
              </button>
            </div>
          </div>
        )}

        {/* Exit Confirmation Dialog Modal */}
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="bg-slate-900 border-2 border-red-500 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative space-y-4 text-center font-sans">
              <div className="w-14 h-14 bg-red-950 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto text-red-400 shadow-inner">
                <AlertTriangle className="w-7 h-7 animate-bounce" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-red-300 font-mono uppercase">
                  PERINGATAN KELUAR KUIS!
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Apakah kamu yakin ingin keluar dari kuis level ini? <strong>Seluruh progres jawaban dan poin kuis kamu akan hilang</strong> dan tidak tersimpan!
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-red-900/50 text-xs text-amber-300 font-mono">
                💡 Kamu sedang menjawab Soal #{currentIndex + 1} dari {questions.length}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleCancelExit}
                  className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-600 transition cursor-pointer shadow"
                >
                  Kembali Kuis
                </button>
                <button
                  onClick={handleConfirmExit}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white rounded-xl text-xs font-extrabold border border-red-400 transition cursor-pointer shadow flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Ya, Keluar Kuis</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
