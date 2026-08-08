import { StudentSubmission, DatabaseConfig } from '../types';

const DB_CONFIG_KEY = 'pakguruai_db_config';
const LOCAL_SUBMISSIONS_KEY = 'pakguruai_local_submissions';

export function getStoredDbConfig(): DatabaseConfig {
  const saved = localStorage.getItem(DB_CONFIG_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return {
    webAppUrl: '',
    isConnected: false,
  };
}

export function saveStoredDbConfig(config: DatabaseConfig) {
  localStorage.setItem(DB_CONFIG_KEY, JSON.stringify(config));
}

export function getLocalSubmissions(): StudentSubmission[] {
  const saved = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return [
    {
      studentName: 'Siswa Contoh',
      classGrade: 'Kelas 5 SD',
      level: 1,
      locationName: 'Desa Ilmu',
      score: 100,
      totalQuestions: 3,
      correctCount: 3,
      timestamp: new Date().toLocaleString('id-ID')
    }
  ];
}

export function saveLocalSubmission(sub: StudentSubmission) {
  const current = getLocalSubmissions();
  current.unshift(sub);
  localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(current));
}

export async function testGasConnection(webAppUrl: string): Promise<{ success: boolean; message: string }> {
  if (!webAppUrl) {
    return { success: false, message: 'URL Web App Google Apps Script belum diisi.' };
  }

  try {
    // Attempt backend proxy first
    const proxyRes = await fetch('/api/gas-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        webAppUrl,
        action: 'testConnection',
        data: {}
      })
    });

    if (proxyRes.ok) {
      const json = await proxyRes.json();
      if (json.success && json.result?.status === 'success') {
        return { success: true, message: json.result.message || 'Koneksi ke Google Sheets berhasil!' };
      }
    }

    // Direct fallback fetch
    const directRes = await fetch(webAppUrl, {
      method: 'GET',
      mode: 'cors'
    });
    if (directRes.ok) {
      return { success: true, message: 'Koneksi ke Google Sheets terverifikasi!' };
    }

    return { success: false, message: 'Gagal menghubungkan ke Google Sheets. Pastikan akses set ke "Anyone" saat Deploy.' };
  } catch (err: any) {
    return { success: false, message: `Gagal tes koneksi: ${err.message || 'Network Error'}` };
  }
}

export async function submitScoreToDatabase(config: DatabaseConfig, submission: StudentSubmission): Promise<boolean> {
  // Always save locally first
  saveLocalSubmission(submission);

  if (!config.webAppUrl || !config.isConnected) {
    console.log('Database URL not connected, saved locally.');
    return true; // saved locally
  }

  try {
    const res = await fetch('/api/gas-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        webAppUrl: config.webAppUrl,
        action: 'submitScore',
        data: submission
      })
    });
    if (res.ok) {
      const data = await res.json();
      return data.success;
    }
  } catch (e) {
    console.error('Error submitting score to GAS:', e);
  }
  return true;
}

export async function fetchScoresFromDatabase(config: DatabaseConfig): Promise<StudentSubmission[]> {
  const localList = getLocalSubmissions();

  if (!config.webAppUrl || !config.isConnected) {
    return localList;
  }

  try {
    const proxyRes = await fetch('/api/gas-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        webAppUrl: config.webAppUrl,
        action: 'getScores',
        data: {}
      })
    });

    if (proxyRes.ok) {
      const json = await proxyRes.json();
      if (json.result?.data && Array.isArray(json.result.data)) {
        return json.result.data;
      }
    }
  } catch (e) {
    console.error('Error fetching scores from GAS:', e);
  }

  return localList;
}
