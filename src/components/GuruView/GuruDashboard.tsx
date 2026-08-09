import React, { useState } from 'react';
import { LocationLevel, Question, DatabaseConfig } from '../../types';
import { QuestionManager } from './QuestionManager';
import { AIGeneratorTab } from './AIGeneratorTab';
import { StudentAnalyticsTab } from './StudentAnalyticsTab';
import { soundFx } from '../../utils/soundEffects';
import { Shield, BookOpen, Sparkles, Award, Database, Code2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { CODE_GS_SCRIPT } from '../../data/codeGsTemplate';

interface GuruDashboardProps {
  locations: LocationLevel[];
  questions: Question[];
  dbConfig: DatabaseConfig;
  onAddQuestion: (newQ: Question) => void;
  onUpdateQuestion: (updatedQ: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onAddGeneratedQuestions: (locationId: string, newQuestions: Question[]) => void;
  onSwitchToSiswa: () => void;
  onOpenDbModal: () => void;
}

export const GuruDashboard: React.FC<GuruDashboardProps> = ({
  locations,
  questions,
  dbConfig,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onAddGeneratedQuestions,
  onSwitchToSiswa,
  onOpenDbModal,
}) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'ai' | 'analytics' | 'database'>('questions');

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 font-sans">
      
      {/* Outer Card Container */}
      <div className="bg-slate-900 border-2 border-purple-600 rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-100 relative space-y-5">
        
        {/* Top Header Banner Mode Guru */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-800 to-indigo-900 border-2 border-purple-400 rounded-xl shadow-lg text-purple-200">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-amber-300 font-mono tracking-wide">
                  PANEL KONTROL GURU (MODE GURU)
                </h2>
                <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-500/80 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                  Akses Terotentikasi 🔒
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Kelola Soal Level, AI Generator, Rekap Nilai Siswa, dan Database Google Sheets
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onSwitchToSiswa();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-600 transition cursor-pointer flex items-center gap-2 shadow"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Kembali ke Mode Siswa (Game)</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 overflow-x-auto gap-2 pb-1">
          {[
            { id: 'questions', label: 'Kelola Soal Level', icon: <BookOpen className="w-4 h-4 text-amber-400" /> },
            { id: 'ai', label: 'AI Generator Soal & Komik', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
            { id: 'analytics', label: 'Rekap Nilai Siswa', icon: <Award className="w-4 h-4 text-emerald-400" /> },
            { id: 'database', label: 'Database & Script code.gs', icon: <Database className="w-4 h-4 text-cyan-400" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundFx.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-purple-950 border-2 border-purple-500 text-purple-200 shadow-lg'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Questions Management */}
        {activeTab === 'questions' && (
          <QuestionManager
            locations={locations}
            questions={questions}
            onAddQuestion={onAddQuestion}
            onUpdateQuestion={onUpdateQuestion}
            onDeleteQuestion={onDeleteQuestion}
          />
        )}

        {/* Tab 2: AI Generator */}
        {activeTab === 'ai' && (
          <AIGeneratorTab
            locations={locations}
            onAddGeneratedQuestions={onAddGeneratedQuestions}
          />
        )}

        {/* Tab 3: Student Analytics */}
        {activeTab === 'analytics' && (
          <StudentAnalyticsTab dbConfig={dbConfig} />
        )}

        {/* Tab 4: Database Settings & Script */}
        {activeTab === 'database' && (
          <div className="space-y-4">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-amber-300 font-mono flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  <span>Koneksi Google Sheets Database</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Status: <strong className={dbConfig.isConnected ? 'text-emerald-400' : 'text-amber-400'}>
                    {dbConfig.isConnected ? 'Terhubung' : 'Lokal (Browser Storage)'}
                  </strong>
                </p>
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenDbModal();
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold rounded-lg text-xs cursor-pointer transition shadow"
              >
                Pengaturan URL Web App
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 font-mono flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" />
                  Kode Script Google Apps Script (code.gs)
                </span>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    navigator.clipboard.writeText(CODE_GS_SCRIPT);
                    alert('Kode script code.gs berhasil disalin!');
                  }}
                  className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded text-xs cursor-pointer"
                >
                  Copy Script code.gs
                </button>
              </div>

              <pre className="p-3 bg-slate-900 border border-slate-800 rounded text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-60 leading-relaxed">
                {CODE_GS_SCRIPT}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
