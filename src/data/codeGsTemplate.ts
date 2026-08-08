export const CODE_GS_SCRIPT = `/**
 * ============================================================================
 * SCRIPT GOOGLE APPS SCRIPT (code.gs) - DATABASE GAME "PETUALANGAN PAK GURUAI"
 * ============================================================================
 * 
 * CARA PEMASANGAN DI GOOGLE SHEETS:
 * 1. Buka Google Sheets (https://sheets.google.com) dan buat Spreadsheet Baru.
 * 2. Beri nama Spreadsheet, contoh: "Database Game Pak GuruAI".
 * 3. Di menu atas, klik "Ekstensi" > "Apps Script".
 * 4. Hapus semua kode bawaan di editor Apps Script, lalu PASTE SELURUH KODE DI BAWAH INI.
 * 5. Klik tombol Simpan (ikon Disket / Ctrl+S).
 * 6. Klik tombol "Terapkan" (Deploy) > "Terapkan Baru" (New Deployment).
 * 7. Pada ikon Gerigi (Pilih jenis), pilih "Aplikasi Web" (Web app).
 * 8. Isikan detail:
 *    - Deskripsi: Database Game Pak GuruAI
 *    - Jalankan sebagai (Execute as): Saya (Me)
 *    - Yang memiliki akses (Who has access): Siapa saja (Anyone) -> SANGAT PENTING!
 * 9. Klik "Terapkan" (Deploy), lalu setujui Izin / Otorisasi Google.
 * 10. Salin "URL Aplikasi Web" (Web App URL) yang dihasilkan, lalu masukkan ke dalam Game!
 */

function doGet(e) {
  try {
    var sheet = getOrCreateSheet("NilaiSiswa");
    var data = sheet.getDataRange().getValues();
    
    // Header check
    if (data.length <= 1) {
      return createJsonResponse({ status: "success", data: [], message: "Belum ada data siswa" });
    }
    
    var headers = data[0];
    var result = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      result.push({
        timestamp: row[0],
        studentName: row[1],
        classGrade: row[2],
        level: row[3],
        locationName: row[4],
        score: row[5],
        correctCount: row[6],
        totalQuestions: row[7]
      });
    }
    
    return createJsonResponse({ status: "success", data: result });
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

function doPost(e) {
  try {
    var rawContents = e.postData ? e.postData.contents : "";
    var body = {};
    if (rawContents) {
      try {
        body = JSON.parse(rawContents);
      } catch (ex) {
        body = e.parameter;
      }
    }
    
    var action = body.action || "submitScore";
    var payload = body.payload || body;
    
    if (action === "testConnection") {
      return createJsonResponse({ status: "success", message: "Koneksi Google Sheets Berhasil!", timestamp: new Date().toISOString() });
    }
    
    if (action === "submitScore" || action === "saveScore") {
      var sheet = getOrCreateSheet("NilaiSiswa");
      var now = new Date();
      var formattedDate = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
      
      sheet.appendRow([
        formattedDate,
        payload.studentName || "Siswa Anonim",
        payload.classGrade || "Umum",
        payload.level || 1,
        payload.locationName || "Desa Ilmu",
        payload.score || 0,
        payload.correctCount || 0,
        payload.totalQuestions || 0
      ]);
      
      return createJsonResponse({ status: "success", message: "Skor berhasil disimpan ke Google Sheets!" });
    }
    
    return createJsonResponse({ status: "success", message: "Aksi diproses" });
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

function getOrCreateSheet(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // Tambah Header
    sheet.appendRow(["Timestamp", "Nama Siswa", "Kelas", "Level", "Lokasi Level", "Skor (%)", "Benar", "Total Soal"]);
    // Style Header
    var headerRange = sheet.getRange("A1:H1");
    headerRange.setBackground("#1e293b");
    headerRange.setFontColor("#f8fafc");
    headerRange.setFontWeight("bold");
  }
  return sheet;
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
