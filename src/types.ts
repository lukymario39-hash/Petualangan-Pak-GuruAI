export type GameMode = 'siswa' | 'guru';
export type PlayMode = 'solo' | 'multiplayer';

export interface MultiplayerPlayer {
  id: string;
  name: string;
  classGrade: string;
  avatar: string;
  level: number;
  score: number;
  gold: number;
  status: 'Menunggu Start ⏳' | 'Siap Bermain 🟢' | 'Sedang Berpetualang 🎮' | 'Selesai Kuis 🏆';
  isHost: boolean;
  joinedAt: string;
}

export interface MultiplayerRoom {
  roomCode: string;
  roomName: string;
  hostName: string;
  isGameStarted: boolean;
  players: MultiplayerPlayer[];
  createdAt: string;
}

export interface LocationLevel {
  id: string;
  name: string;
  subtitle: string;
  levelNumber: number;
  description: string;
  icon: string;
  bgGradient: string;
  requiredLevel: number;
  mapX: number; // 0 - 100 percentage for pixel map placement
  mapY: number; // 0 - 100 percentage
  isUnlocked: boolean;
  isCompleted: boolean;
  bossName?: string;
  themeColor: string;
}

export interface Question {
  id: string;
  locationId: string;
  classGrade?: string; // Optional class grade filter e.g., "Kelas 5 SD", "Kelas 7 SMP", "Semua Kelas"
  question: string;
  options: string[];
  correctAnswer: number; // 0-3 index
  explanation: string;
  hint: string;
  expReward: number;
  goldReward: number;
}

export interface ProgressRecord {
  id: string;
  timestamp: string;
  dateStr: string;
  score: number;
  level: number;
  correctCount: number;
  totalQuestions: number;
  locationName: string;
  classGrade: string;
  studentName: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'potion';
  icon: string;
  description: string;
  statBonus: string;
  isEquipped?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: string;
}

export interface Quest {
  id: string;
  title: string;
  category: 'utama' | 'sampingan' | 'harian';
  description: string;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  rewardExp: number;
  rewardGold: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'soal' | 'level' | 'peta' | 'koin' | 'khusus';
  currentValue: number;
  targetValue: number;
  isUnlocked: boolean;
  rewardExp: number;
  rewardGold: number;
  unlockedAt?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  classGrade: string;
  avatar: string;
  level: number;
  currentExp: number;
  maxExp: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  energy: number;
  maxEnergy: number;
  gold: number;
  currentLocationId: string;
  completedLocations: string[];
  inventory: InventoryItem[];
  badges: Badge[];
  activeQuests: Quest[];
}

export interface StudentSubmission {
  id?: string;
  studentName: string;
  classGrade: string;
  level: number;
  locationName: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  timestamp: string;
}

export interface DatabaseConfig {
  webAppUrl: string;
  isConnected: boolean;
  lastTested?: string;
}
