import React, { useState } from 'react';
import { Database, CheckCircle2, Copy, Check, ExternalLink, RefreshCw, AlertTriangle, Code2, BookOpen } from 'lucide-react';
import { DatabaseConfig } from '../types';
import { testGasConnection, saveStoredDbConfig } from '../utils/gasClient';
import { CODE_GS_SCRIPT } from '../data/codeGsTemplate';
import { soundFx } from '../utils/soundEffects';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  dbConfig: DatabaseConfig;
  onUpdateDbConfig: (newConfig: DatabaseConfig) => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  dbConfig,
  onUpdateDbConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'script'>('url');
  const [urlInput, setUrlInput] = useState(dbConfig.webAppUrl || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!urlInput.trim()) {
      setTestResult({ success: false, message: 'Harap masukkan Web App URL Google Apps Script!' });
      return;
    }
    soundFx.playClick();
    setTesting(true);
    setTestResult(null);

    const res = await testGasConnection(urlInput.trim());
    setTesting(false);
    setTestResult(res);

    if (res.success) {
      soundFx.playCorrect();
      const updatedConfig: DatabaseConfig = {
        webAppUrl: urlInput.trim(),
        isConnected: true,
        lastTested: new Date().toLocaleString('id-ID')
      };
      saveStoredDbConfig(updatedConfig);
      onUpdateDbConfig(updatedConfig);
    } else {
      soundFx.playWrong();
    }
  };

  const handleDisconnect = () => {
    soundFx.playClick();
    const updatedConfig: DatabaseConfig = {
      webAppUrl: '',
      isConnected: false
    };
    setUrlInput('');
    setTestResult(null);
    saveStoredDbConfig(updatedConfig);
    onUpdateDbConfig(updatedConfig);
  };

  const handleCopyCode = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(CODE_GS_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-600 rounded-xl max-w-2xl w-full p-5 text-slate-100 shadow-2xl relative max-h-[90vh] flex flex-col font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-950 border border-amber-500 rounded-lg text-amber-300">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-amber-300 font-mono">
                PENGATURAN DATABASE GOOGLE SHEETS
              </h2>
              <p className="text-xs text-slate-400">
                Sambungkan game ke Google Sheets via Apps Script (<code className="text-amber-300 font-mono">code.gs</code>)
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 my-3">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('url');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 cursor-pointer transition ${
              activeTab === 'url'
                ? 'border-amber-400 text-amber-300 bg-amber-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Koneksi URL Web App</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('script');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 cursor-pointer transition ${
              activeTab === 'script'
                ? 'border-amber-400 text-amber-300 bg-amber-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Kode Script code.gs & Tutorial</span>
          </button>
        </div>

        {/* Tab 1: URL Connection */}
        {activeTab === 'url' && (
          <div className="space-y-4 overflow-y-auto pr-1 py-1">
            
            {/* Connection Status Box */}
            <div className={`p-3.5 rounded-lg border text-xs flex items-start gap-3 ${
              dbConfig.isConnected
                ? 'bg-emerald-950/60 border-emerald-600/80 text-emerald-200'
                : 'bg-amber-950/60 border-amber-600/80 text-amber-200'
            }`}>
              {dbConfig.isConnected ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-bold text-sm">
                  {dbConfig.isConnected ? 'Terhubung dengan Google Sheets!' : 'Database Belum Terhubung (Menggunakan Storage Lokal)'}
                </div>
                <p className="mt-1 text-[11px] opacity-90 leading-relaxed">
                  {dbConfig.isConnected
                    ? `Setiap jawaban kuis dan nilai siswa akan otomatis tersimpan ke Spreadsheet Google Anda.`
                    : `Data nilai siswa sementara tersimpan di browser (Local Storage). Untuk merekap nilai ke Google Sheets, silakan masukkan URL Apps Script di bawah.`}
                </p>
              </div>
            </div>

            {/* URL Input Form */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                URL Aplikasi Web Google Apps Script (Web App URL)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="flex-1 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none"
                />
                <button
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold rounded-lg text-xs cursor-pointer disabled:opacity-50 transition flex items-center justify-center gap-1.5 shrink-0"
                >
                  {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                  <span>{testing ? 'Menghubungkan...' : 'Tes & Hubungkan'}</span>
                </button>
              </div>
            </div>

            {/* Test Result Alert */}
            {testResult && (
              <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                  : 'bg-red-950/80 border-red-500 text-red-200'
              }`}>
                {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                <span>{testResult.message}</span>
              </div>
            )}

            {dbConfig.isConnected && (
              <div className="flex justify-end">
                <button
                  onClick={handleDisconnect}
                  className="text-xs text-red-400 hover:text-red-300 underline cursor-pointer"
                >
                  Putuskan Koneksi Google Sheets
                </button>
              </div>
            )}

            {/* Steps overview */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Ringkasan Cara Menghubungkan Google Sheets:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-400">
                <li>Buka tab <strong>"Kode Script code.gs & Tutorial"</strong> di atas.</li>
                <li>Salin seluruh kode script <code className="text-amber-300">code.gs</code>.</li>
                <li>Buka Google Sheets &rarr; Ekstensi &rarr; Apps Script &rarr; Paste Kode.</li>
                <li>Klik <strong>Deploy (Terapkan) &rarr; Web app</strong> (Access: <strong>Anyone / Siapa Saja</strong>).</li>
                <li>Copy URL Web App lalu paste ke kolom di atas dan klik <strong>Tes & Hubungkan</strong>!</li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 2: code.gs Script & Tutorial */}
        {activeTab === 'script' && (
          <div className="space-y-3 overflow-y-auto pr-1 py-1 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Code2 className="w-4 h-4" />
                Kode Google Apps Script (code.gs)
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs cursor-pointer transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Copy Script code.gs'}</span>
              </button>
            </div>

            <pre className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-60 leading-relaxed">
              {CODE_GS_SCRIPT}
            </pre>

            <div className="bg-amber-950/40 border border-amber-600/50 p-3 rounded-lg text-xs space-y-1.5">
              <div className="font-bold text-amber-300">Tips Penting Otorisasi Google Apps Script:</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Saat Deploy sebagai <strong>Web app</strong>, pastikan bagian <em>"Who has access"</em> diubah menjadi <strong>"Anyone" (Siapa Saja)</strong> agar siswa dapat mengirimkan nilai kuis tanpa perlu login Google secara manual.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center mt-3">
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold border border-slate-600 transition cursor-pointer"
          >
            Tutup
          </button>
          
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs border border-emerald-400 shadow-md cursor-pointer transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simpan & Lanjutkan Game</span>
          </button>
        </div>

      </div>
    </div>
  );
};
