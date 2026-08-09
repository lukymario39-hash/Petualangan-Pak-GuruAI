import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export const app = express();

app.use(express.json());

// Initialize GoogleGenAI SDK with server-side GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
}) : null;

// Healthcheck API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiConfigured: !!ai });
});

// AI Question Generator Endpoint for Pak Guru
app.post("/api/ai-generate-questions", async (req, res) => {
  const { subject, grade, topic, count = 3, locationName } = req.body;

  if (!subject || !topic) {
    return res.status(400).json({ error: "Mata pelajaran dan topik wajib diisi." });
  }

  // Attempt Gemini AI Generation first
  if (ai) {
    try {
      const prompt = `Anda adalah asisten pembuat soal kuis edukasi untuk game RPG "Petualangan Pak GuruAI".
Buatkan ${count} soal pilihan ganda interaktif untuk jenjang ${grade || "SD/SMP"}, mata pelajaran ${subject}, topik: "${topic}".
Lokasi level game: ${locationName || "Desa Ilmu"}.
Soal harus mendidik, menarik, relevan dengan lokasi game RPG, dan mudah dipahami siswa.

Format JSON yang wajib dikembalikan:
Array of objects, di mana setiap object memiliki:
- id: string unik
- question: teks pertanyaan
- options: array of 4 string pilihan jawaban (A, B, C, D)
- correctAnswer: number (index pilihan yang benar, 0-3)
- explanation: penjelasan singkat mengapa jawaban tersebut benar
- hint: petunjuk kecil untuk membantu siswa
- expReward: angka exp (contoh: 50)
- goldReward: angka gold (contoh: 25)
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                correctAnswer: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
                hint: { type: Type.STRING },
                expReward: { type: Type.INTEGER },
                goldReward: { type: Type.INTEGER },
              },
              required: ["id", "question", "options", "correctAnswer", "explanation", "hint", "expReward", "goldReward"],
            },
          },
        },
      });

      const questionsText = response.text || "[]";
      const questions = JSON.parse(questionsText);

      if (Array.isArray(questions) && questions.length > 0) {
        return res.json({ success: true, questions, source: 'gemini' });
      }
    } catch (err: any) {
      console.warn("Gemini API call failed, switching to smart pedagogical generator fallback:", err?.message || err);
    }
  }

  // Smart Fallback Pedagogical Question Generator (Guarantees zero-error execution)
  const numCount = Math.min(Math.max(Number(count) || 3, 1), 5);
  const fallbackQuestions = Array.from({ length: numCount }).map((_, idx) => {
    const qNum = idx + 1;
    let questionText = `[Soal ${qNum}] Manakah pernyataan yang paling tepat mengenai konsep ${topic} pada mata pelajaran ${subject} untuk ${grade || 'Siswa'}?`;
    let optionsText = [
      `A. Konsep ${topic} menjelaskan prinsip dasar yang berhubungan dengan ${subject}.`,
      `B. Konsep ${topic} hanya berlaku untuk pelajaran seni dan olah raga.`,
      `C. Konsep ${topic} tidak memiliki penerapan langsung dalam kehidupan sehari-hari.`,
      `D. Konsep ${topic} tidak berhubungan dengan materi ${subject}.`,
    ];
    let correctIdx = 0;
    let hintText = `Fokus pada definisi dasar dan penerapan ${topic} di mata pelajaran ${subject}.`;
    let explanationText = `Jawaban A benar karena konsep ${topic} merupakan prinsip dasar penting pada mata pelajaran ${subject}.`;

    if (qNum === 2) {
      questionText = `[Soal 2] Mengapa pemahaman tentang ${topic} sangat penting dipelajari oleh siswa ${grade || 'sekolah'}?`;
      optionsText = [
        `A. Agar siswa dapat menghafal nama tanpa paham konsepnya.`,
        `B. Agar siswa memahami fenomena dan logika dasar materi ${subject} di kehidupan nyata.`,
        `C. Hanya untuk formalitas ujian sekolah.`,
        `D. Agar materi ${subject} tidak perlu dipelajari lagi.`,
      ];
      correctIdx = 1;
      hintText = `Pertimbangkan manfaat nyata mempelajari ${topic} dalam kehidupan sehari-hari.`;
      explanationText = `Jawaban B benar karena ${topic} melatih berpikir kritis dan pemahaman logis siswa.`;
    } else if (qNum === 3) {
      questionText = `[Soal 3] Di lokasi ${locationName || 'Petualangan RPG'}, tantangan utama yang berhubungan dengan ${topic} adalah...`;
      optionsText = [
        `A. Menerapkan konsep ${topic} untuk menyelesaikan misi dengan benar.`,
        `B. Mengabaikansemua petunjuk kuis dan menyerah.`,
        `C. Menjawab secara acak tanpa membaca soal.`,
        `D. Menolak belajar materi ${subject}.`,
      ];
      correctIdx = 0;
      hintText = `Pilihlah tindakan positif sebagai pahlawan pembelajar di ${locationName || 'Game RPG'}.`;
      explanationText = `Jawaban A benar karena menyelesaikan tantangan dengan pemahaman ${topic} adalah kunci sukses.`;
    }

    return {
      id: `q_gen_${Date.now()}_${idx}`,
      question: questionText,
      options: optionsText,
      correctAnswer: correctIdx,
      explanation: explanationText,
      hint: hintText,
      expReward: 50 + idx * 10,
      goldReward: 20 + idx * 5,
    };
  });

  return res.json({ success: true, questions: fallbackQuestions, source: 'fallback' });
});

// AI Comic Prompt Generator for Pak Guru
app.post("/api/ai-generate-comic-prompt", async (req, res) => {
  const { jenjang, kelas, materi } = req.body;

  if (!jenjang || !materi) {
    return res.status(400).json({ error: "Jenjang dan Materi harus diisi." });
  }

  let languageStyleInstruction = "";
  if (jenjang === "SD") {
    languageStyleInstruction = "Bahasa harus sederhana, komunikatif, menggunakan kalimat pendek, ceria, penuh imajinasi, dan mudah dipahami anak-anak SD.";
  } else if (jenjang === "SMP") {
    languageStyleInstruction = "Bahasa semi-formal namun santai, menggunakan analogi kehidupan sehari-hari remaja, seru, dan mulai logis untuk anak SMP.";
  } else {
    languageStyleInstruction = "Bahasa formal namun tetap menarik, logis, mendalam, dan relevan dengan studi kasus nyata atau persiapan masa depan anak SMA.";
  }

  const systemPrompt = `Anda adalah seorang AI Expert Prompt Engineer dan Asisten Kurikulum Pendidikan "Pak GuruAI".
Tugas Anda adalah menghasilkan sebuah promp (prompt generator) yang akan digunakan di ChatGPT untuk membuat komik pembelajaran.

Input:
1. Jenjang: ${jenjang}
2. Kelas: ${kelas || "1"}
3. Materi Pelajaran: ${materi}

Ketentuan Gaya Penyampaian:
${languageStyleInstruction}

Hasilkan sebuah prompt utuh dalam bahasa Indonesia yang siap di-copy-paste oleh guru ke ChatGPT untuk membuat komik pembelajaran dari Cover hingga Halaman 10.
Setiap halaman harus dibagi menjadi:
- Panel 1: Deskripsi Visual & Dialog/Narasi
- Panel 2: Deskripsi Visual & Dialog/Narasi
(Maksimal 2-3 panel per halaman).

PENTING:
Keluaran HARUS dibungkus persis dalam format berikut:
--- START OF PROMPT ---
[Isi prompt instruksi pembuatan komik ChatGPT yang sangat detail, interaktif, dan sesuai materi]
--- END OF PROMPT ---
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: systemPrompt,
      });

      const promptResult = response.text || "";
      if (promptResult.trim()) {
        return res.json({ success: true, promptResult });
      }
    } catch (err: any) {
      console.warn("Gemini API comic prompt call failed, using template generator fallback:", err?.message || err);
    }
  }

  // Fallback Template Generator
  const fallbackComicPrompt = `--- START OF PROMPT ---
Anda adalah seorang Komikus Edukasi dan Ahli Kurikulum Pendidikan yang bertugas membuat skenario komik pembelajaran interaktif untuk siswa ${jenjang} Kelas ${kelas || '1'} dengan Materi: "${materi}".

Gaya Penyampaian & Bahasa:
- ${languageStyleInstruction}

Instruksi Komik Pembelajaran (Cover s.d Halaman 10):
Buatlah komik dengan alur cerita menarik antara Karakter Utama (Siswa), Karakter Pendamping, dan Pak GuruAI sebagai Pembimbing. Setiap halaman dibagi menjadi 2 Panel (Deskripsi Visual & Dialog/Narasi).

[COVER]
- Judul Komik: Petualangan Hebat Memahami ${materi}
- Visual: Ilustrasi karakter utama yang bersemangat memegang buku materi ${materi} dengan latar yang ceria.
- Teks Cover: "Komik Pembelajaran ${jenjang} Kelas ${kelas || '1'} - ${materi}"

[HALAMAN 1: PENGENALAN MASALAH]
- Panel 1:
  * Visual: Karakter utama tampak bingung ketika menghadapi tantangan materi ${materi}.
  * Dialog: "Wah, materi ${materi} ini terlihat sulit sekali, bagaimana cara memahaminya ya?"
- Panel 2:
  * Visual: Pak GuruAI datang membawa buku panduan ajaib dengan senyum ramah.
  * Dialog: "Jangan khawatir! Bersama Pak GuruAI, belajar ${materi} pasti seru dan mudah!"

[HALAMAN 2 - HALAMAN 9: PENJELASAN KONSEP & ANALOGI]
*(Tuliskan dialog edukatif runtut menjelaskan titik berat materi ${materi} langkah demi langkah untuk siswa ${jenjang} Kelas ${kelas || '1'}).*

[HALAMAN 10: KESIMPULAN & KUIS TANTANGAN]
- Panel 1:
  * Visual: Karakter utama tersenyum bangga karena sudah paham materi ${materi}.
  * Dialog: "Sekarang aku paham! Materi ${materi} ternyata sangat menyenangkan!"
- Panel 2:
  * Visual: Pak GuruAI memberikan bintang penghargaan.
  * Dialog: "Luat biasa! Mari uji pemahamanmu dengan kuis interaktif!"
--- END OF PROMPT ---`;

  return res.json({ success: true, promptResult: fallbackComicPrompt });
});

// Google Apps Script Proxy to prevent CORS issues
app.post("/api/gas-proxy", async (req, res) => {
  try {
    const { webAppUrl, action, data } = req.body;
    if (!webAppUrl) {
      return res.status(400).json({ error: "Google Apps Script Web App URL is required." });
    }

    // Call GAS Web App URL
    const gasRes = await fetch(webAppUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, payload: data }),
    });

    const text = await gasRes.text();
    let jsonResult;
    try {
      jsonResult = JSON.parse(text);
    } catch {
      jsonResult = { rawResponse: text, status: gasRes.status };
    }

    return res.json({ success: true, result: jsonResult });
  } catch (err: any) {
    console.error("GAS proxy error:", err);
    return res.status(500).json({ error: err.message || "Failed to communicate with Google Apps Script URL." });
  }
});
