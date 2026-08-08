import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

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
  try {
    if (!ai) {
      return res.status(500).json({ error: "Gemini API key is not configured on the server." });
    }

    const { subject, grade, topic, count = 3, locationName } = req.body;

    if (!subject || !topic) {
      return res.status(400).json({ error: "Subject and topic are required." });
    }

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
      model: "gemini-3.6-flash",
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

    return res.json({ success: true, questions });
  } catch (err: any) {
    console.error("Error generating AI questions:", err);
    return res.status(500).json({ error: err.message || "Failed to generate questions" });
  }
});

// AI Comic Prompt Generator for Pak Guru
app.post("/api/ai-generate-comic-prompt", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({ error: "Gemini API key is not configured on the server." });
    }

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

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: systemPrompt,
    });

    const promptResult = response.text || "";
    return res.json({ success: true, promptResult });
  } catch (err: any) {
    console.error("Error generating comic prompt:", err);
    return res.status(500).json({ error: err.message || "Failed to generate comic prompt" });
  }
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

async function startServer() {
  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
