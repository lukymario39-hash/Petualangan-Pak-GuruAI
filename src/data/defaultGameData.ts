import { LocationLevel, Question, Quest, InventoryItem, Badge, StudentProfile } from '../types';

export const INITIAL_LOCATIONS: LocationLevel[] = [
  {
    id: 'desailmu',
    name: 'Desa Ilmu',
    subtitle: 'Permulaan Petualangan Pengetahuan',
    levelNumber: 1,
    description: 'Desa damai tempat para pembelajar memulai perjalanan ilmu. Selesaikan tantangan kuis dasar untuk naik ke level berikutnya!',
    icon: '🏠',
    bgGradient: 'from-amber-900/80 to-emerald-950/90',
    requiredLevel: 1,
    mapX: 12,
    mapY: 72,
    isUnlocked: true,
    isCompleted: false,
    bossName: 'Penjaga Gerbang Desa',
    themeColor: '#10b981'
  },
  {
    id: 'hutankreativitas',
    name: 'Hutan Kreativitas',
    subtitle: 'Lembah Ide dan Gagasan Baru',
    levelNumber: 2,
    description: 'Hutan rindang yang menyimpan ribuan ide kreatif. Jawab pertanyaan bernalar untuk membuka jalan ke akademi!',
    icon: '🌲',
    bgGradient: 'from-emerald-900/80 to-teal-950/90',
    requiredLevel: 2,
    mapX: 28,
    mapY: 38,
    isUnlocked: false,
    isCompleted: false,
    bossName: 'Kabut Kebingungan',
    themeColor: '#059669'
  },
  {
    id: 'pelabuhanpengalaman',
    name: 'Pelabuhan Pengalaman',
    subtitle: 'Dermaga Praktik dan Eksperimen',
    levelNumber: 3,
    description: 'Pelabuhan sibuk di mana pengalaman dipraktikkan secara nyata. Jalani kuis aplikasi ilmu untuk berlayar!',
    icon: '⛵',
    bgGradient: 'from-blue-900/80 to-slate-950/90',
    requiredLevel: 3,
    mapX: 46,
    mapY: 75,
    isUnlocked: false,
    isCompleted: false,
    bossName: 'Kraken Tanpa Arah',
    themeColor: '#0284c7'
  },
  {
    id: 'akademimain',
    name: 'Akademi Inspirasi',
    subtitle: 'Istana Riset dan Kolaborasi',
    levelNumber: 4,
    description: 'Kastil megah pusat riset dan logika. Di sini kamu menguji pemahaman tingkat tinggi sebelum mendaki gunung!',
    icon: '🏰',
    bgGradient: 'from-indigo-900/80 to-purple-950/90',
    requiredLevel: 4,
    mapX: 62,
    mapY: 35,
    isUnlocked: false,
    isCompleted: false,
    bossName: 'Golem Keraguan',
    themeColor: '#6366f1'
  },
  {
    id: 'gunungpengetahuan',
    name: 'Gunung Pengetahuan',
    subtitle: 'Puncak Pemikiran Logis & Kritis',
    levelNumber: 5,
    description: 'Gunung salju tinggi yang melatih ketahanan berpikir logis dan analisis mendalam.',
    icon: '🏔️',
    bgGradient: 'from-slate-800/80 to-sky-950/90',
    requiredLevel: 5,
    mapX: 78,
    mapY: 68,
    isUnlocked: false,
    isCompleted: false,
    bossName: 'Naga Kesalahan Konsep',
    themeColor: '#0ea5e9'
  },
  {
    id: 'menaramalas',
    name: 'Menara Malas',
    subtitle: 'Benteng Terakhir Tantangan Kebodohan',
    levelNumber: 6,
    description: 'Menara tinggi tempat Bos Kebodohan & Rasa Malas berada. Selesaikan kuis ujian akhir untuk menjadi Pahlawan Ilmu!',
    icon: '⚡',
    bgGradient: 'from-purple-950/90 to-red-950/90',
    requiredLevel: 6,
    mapX: 90,
    mapY: 25,
    isUnlocked: false,
    isCompleted: false,
    bossName: 'Raja Malas & Kebodohan',
    themeColor: '#dc2626'
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // Desa Ilmu (Level 1)
  {
    id: 'q_desailmu_1',
    locationId: 'desailmu',
    classGrade: 'Kelas 5 SD',
    question: 'Berapakah hasil dari 15 + 27 ÷ 3?',
    options: ['14', '24', '19', '32'],
    correctAnswer: 1, // 27/3 = 9; 15+9 = 24
    explanation: 'Sesuai aturan urutan operasi matematika (Kabataku), lakukan pembagian terlebih dahulu: 27 ÷ 3 = 9, lalu ditambahkan 15 + 9 = 24.',
    hint: 'Dahulukan operasi pembagian sebelum penjumlahan!',
    expReward: 50,
    goldReward: 20
  },
  {
    id: 'q_desailmu_2',
    locationId: 'desailmu',
    classGrade: 'Kelas 5 SD',
    question: 'Proses pembuangan zat sisa metabolisme dari dalam tubuh manusia disebut...',
    options: ['Respirasi', 'Ekskresi', 'Pencernaan', 'Sirkulasi'],
    correctAnswer: 1,
    explanation: 'Ekskresi adalah proses pengeluaran zat-zat sisa metabolisme yang sudah tidak digunakan oleh tubuh seperti urine, keringat, dan empedu.',
    hint: 'Ingat organ ginjal dan kulit mengeluarkan zat sisa.',
    expReward: 50,
    goldReward: 20
  },
  {
    id: 'q_desailmu_3',
    locationId: 'desailmu',
    classGrade: 'Kelas 5 SD',
    question: 'Teks yang berisi petunjuk pembuatan atau penggunaan sesuatu secara berurutan disebut teks...',
    options: ['Eksplanasi', 'Prosedur', 'Deskripsi', 'Narasi'],
    correctAnswer: 1,
    explanation: 'Teks prosedur memuat langkah-langkah atau panduan secara runut untuk mencapai suatu tujuan.',
    hint: 'Bisa berupa resep makanan atau tutorial langkah-langkah.',
    expReward: 60,
    goldReward: 25
  },

  // Hutan Kreativitas (Level 2)
  {
    id: 'q_hutankreativitas_1',
    locationId: 'hutankreativitas',
    classGrade: 'Kelas 7 SMP',
    question: 'Organel sel yang berfungsi sebagai tempat terjadinya respirasi sel untuk menghasilkan energi (ATP) adalah...',
    options: ['Ribosom', 'Lisosom', 'Mitokondria', 'Badan Golgi'],
    correctAnswer: 2,
    explanation: 'Mitokondria dijuluki "Powerhouse of the Cell" karena memproduksi energi utama sel lewat respirasi seluler.',
    hint: 'Disebut juga sebagai pabrik energi sel!',
    expReward: 70,
    goldReward: 30
  },
  {
    id: 'q_hutankreativitas_2',
    locationId: 'hutankreativitas',
    classGrade: 'Kelas 7 SMP',
    question: 'Manakah di antara kalimat berikut yang memuat majas hiperbola?',
    options: [
      'Angin malam berbisik lembut di telingaku.',
      'Suaranya yang menggelegar membelah angkasa.',
      'Dewi Malam tersenyum di balik awan.',
      'Ia bekerja keras bagaikan kuda.'
    ],
    correctAnswer: 1,
    explanation: 'Majas hiperbola adalah gaya bahasa yang berlebihan. "Membelah angkasa" adalah contoh ungkapan yang berlebihan.',
    hint: 'Cari kalimat yang melebih-lebihkan kenyataan secara ekstrem!',
    expReward: 75,
    goldReward: 35
  },

  // Pelabuhan Pengalaman (Level 3)
  {
    id: 'q_pelabuhan_1',
    locationId: 'pelabuhanpengalaman',
    classGrade: 'Kelas 8 SMP',
    question: 'Sebuah mobil bergerak dengan kecepatan konstan 72 km/jam. Kecepatan ini setara dengan...',
    options: ['15 m/s', '20 m/s', '25 m/s', '30 m/s'],
    correctAnswer: 1, // 72 * (1000/3600) = 20 m/s
    explanation: 'Untuk mengubah km/jam ke m/s, kalikan dengan 1000/3600 atau bagi dengan 3.6: 72 ÷ 3.6 = 20 m/s.',
    hint: 'Bagi nilai km/jam dengan angka 3,6!',
    expReward: 90,
    goldReward: 40
  },

  // Akademi Inspirasi (Level 4)
  {
    id: 'q_akademi_1',
    locationId: 'akademimain',
    classGrade: 'Kelas 10 SMA',
    question: 'Unsur kimia dengan nomor atom 6 yang menjadi dasar seluruh kehidupan organik di bumi adalah...',
    options: ['Oksigen (O)', 'Hidrogen (H)', 'Karbon (C)', 'Nitrogen (N)'],
    correctAnswer: 2,
    explanation: 'Karbon (C) memiliki 4 elektron valensi yang memungkinkan pembentukan ikatan kovalen kompleks penyusun molekul organik.',
    hint: 'Unsur ini ada di dalam pensil graphite dan intan!',
    expReward: 110,
    goldReward: 50
  },

  // Gunung Pengetahuan (Level 5)
  {
    id: 'q_gunung_1',
    locationId: 'gunungpengetahuan',
    classGrade: 'Kelas 10 SMA',
    question: 'Konsep Hukum II Newton secara matematis dirumuskan sebagai...',
    options: ['F = m × a', 'F = m / a', 'E = m × c²', 'P = F × v'],
    correctAnswer: 0,
    explanation: 'Hukum II Newton menyatakan Gaya (F) sama dengan massa (m) dikalikan percepatan (a).',
    hint: 'F adalah Force, m adalah mass, a adalah acceleration.',
    expReward: 130,
    goldReward: 60
  },

  // Menara Malas (Level 6 - Boss)
  {
    id: 'q_menaramalas_1',
    locationId: 'menaramalas',
    classGrade: 'Semua Kelas',
    question: 'Pemberantas utama dari Rasa Malas dan Kebodohan di dunia pendidikan adalah...',
    options: ['Penundaan waktu', 'Semangat Belajar & Konsistensi', 'Hanya bermain game', 'Menyerah pada kesulitan'],
    correctAnswer: 1,
    explanation: 'Rasa malas dan kebodohan hanya bisa dikalahkan dengan ilmu pengetahuan, niat tulus, dan aksi nyata yang konsisten!',
    hint: 'Kunci menjadi Pahlawan Ilmu!',
    expReward: 200,
    goldReward: 100
  }
];

export const INITIAL_ITEMS: InventoryItem[] = [
  {
    id: 'item_1',
    name: 'Tongkat Ilmu Pak Guru',
    type: 'weapon',
    icon: '🪄',
    description: 'Tongkat sihir yang memancarkan energi jawaban benar.',
    statBonus: '+15 Daya Nalar',
    isEquipped: true
  },
  {
    id: 'item_2',
    name: 'Buku Catatan Ajaib',
    type: 'accessory',
    icon: '📖',
    description: 'Catatan pintar yang menyimpan rumus dan petunjuk kuis.',
    statBonus: '+10 MP Maximum',
    isEquipped: true
  },
  {
    id: 'item_3',
    name: 'Laptop AI Assistant',
    type: 'weapon',
    icon: '💻',
    description: 'Laptop pintar terhubung ke AI Buddy untuk membantu analisis soal.',
    statBonus: '+20 Kebijaksanaan AI',
    isEquipped: false
  },
  {
    id: 'item_4',
    name: 'Ramuan Konsentrasi (XP Boost)',
    type: 'potion',
    icon: '🧪',
    description: 'Memberikan dorongan energi dan +50 EXP instan.',
    statBonus: 'Memulihkan 50 Energy',
    isEquipped: false
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge_1',
    name: 'Pahlawan Desa Ilmu',
    icon: '🌟',
    description: 'Menyelesaikan kuis di Desa Ilmu dan naik ke Level 2.',
    unlockedAt: 'Awal Petualangan'
  },
  {
    id: 'badge_2',
    name: 'Penjelajah Hutan Kreatif',
    icon: '🌲',
    description: 'Membuka Hutan Kreativitas dan memecahkan teka-teki ide.',
  },
  {
    id: 'badge_3',
    name: 'Master Kuis Pak GuruAI',
    icon: '🏆',
    description: 'Menjawab 5 kuis berturut-turut dengan nilai sempurna.',
  },
  {
    id: 'badge_4',
    name: 'Penakluk Menara Malas',
    icon: '👑',
    description: 'Mengalahkan Bos Kebodohan & Rasa Malas di level puncak!',
  }
];

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'q_main_1',
    title: 'Kalahkan Kebodohan di Menara Malas',
    category: 'utama',
    description: 'Jelajahi setiap lokasi level dari Desa Ilmu hingga Menara Malas.',
    progress: 1,
    maxProgress: 6,
    isCompleted: false,
    rewardExp: 500,
    rewardGold: 250
  },
  {
    id: 'q_side_1',
    title: 'Bantu Siswa di Desa Ilmu',
    category: 'sampingan',
    description: 'Selesaikan minimal 3 pertanyaan kuis dari Pak Guru.',
    progress: 1,
    maxProgress: 3,
    isCompleted: false,
    rewardExp: 150,
    rewardGold: 80
  },
  {
    id: 'q_daily_1',
    title: 'Pelajari 1 Materi Kreatif Hari Ini',
    category: 'harian',
    description: 'Masuk ke mode petualangan dan selesaikan 1 lokasi level.',
    progress: 1,
    maxProgress: 1,
    isCompleted: true,
    rewardExp: 100,
    rewardGold: 50
  }
];

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  id: 'std_01',
  name: 'Siswa Teladan',
  classGrade: 'Kelas 5 SD / VII SMP',
  avatar: '👨‍🎓',
  level: 1,
  currentExp: 65,
  maxExp: 100,
  hp: 250,
  maxHp: 250,
  mp: 180,
  maxMp: 180,
  energy: 120,
  maxEnergy: 120,
  gold: 150,
  currentLocationId: 'desailmu',
  completedLocations: [],
  inventory: INITIAL_ITEMS,
  badges: INITIAL_BADGES,
  activeQuests: INITIAL_QUESTS
};
