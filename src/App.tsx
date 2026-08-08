import React, { useState, useEffect } from 'react';
import { GameMode, StudentProfile, LocationLevel, Question, DatabaseConfig, StudentSubmission } from './types';
import {
  INITIAL_LOCATIONS,
  INITIAL_QUESTIONS,
  DEFAULT_STUDENT_PROFILE
} from './data/defaultGameData';
import { getStoredDbConfig, submitScoreToDatabase } from './utils/gasClient';
import { soundFx } from './utils/soundEffects';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DatabaseModal } from './components/DatabaseModal';
import { TeacherAuthModal } from './components/TeacherAuthModal';

import { GameCanvas } from './components/SiswaView/GameCanvas';
import { QuizModal } from './components/SiswaView/QuizModal';
import { StudentSetupModal } from './components/SiswaView/StudentSetupModal';
import { InventoryModal } from './components/SiswaView/InventoryModal';
import { LeaderboardModal } from './components/SiswaView/LeaderboardModal';

import { GuruDashboard } from './components/GuruView/GuruDashboard';

export default function App() {
  // Game Mode
  const [gameMode, setGameMode] = useState<GameMode>('siswa');

  // Sound FX
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Database Config
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>(() => getStoredDbConfig());

  // Student Profile
  const [student, setStudent] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('pakguruai_student_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_STUDENT_PROFILE;
  });

  // RPG Level Locations
  const [locations, setLocations] = useState<LocationLevel[]>(() => {
    const saved = localStorage.getItem('pakguruai_locations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_LOCATIONS;
  });

  // Question Bank
  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('pakguruai_questions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_QUESTIONS;
  });

  // Modals state
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isTeacherAuthOpen, setIsTeacherAuthOpen] = useState(false);
  const [isStudentSetupOpen, setIsStudentSetupOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [selectedQuizLocation, setSelectedQuizLocation] = useState<LocationLevel | null>(null);

  // Save to localStorage upon state changes
  useEffect(() => {
    localStorage.setItem('pakguruai_student_profile', JSON.stringify(student));
  }, [student]);

  useEffect(() => {
    localStorage.setItem('pakguruai_locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('pakguruai_questions', JSON.stringify(questions));
  }, [questions]);

  // Handle Location Selection (Triggers Quiz / Level Challenge)
  const handleSelectLocation = (loc: LocationLevel) => {
    if (!loc.isUnlocked) {
      soundFx.playWrong();
      alert(`Lokasi ${loc.name} masih terkunci! Selesaikan level sebelumnya terlebih dahulu untuk naik level.`);
      return;
    }

    soundFx.playTravel();
    // Set student current location
    setStudent((prev) => ({
      ...prev,
      currentLocationId: loc.id,
    }));

    // Open Quiz Modal
    setSelectedQuizLocation(loc);
  };

  // Handle Quiz Completion
  const handleCompleteQuiz = async (
    locationId: string,
    correctCount: number,
    totalQuestions: number,
    expEarned: number,
    goldEarned: number
  ) => {
    const loc = locations.find((l) => l.id === locationId);
    const scorePct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 100;

    // Unlock Next Location
    const currentIndex = locations.findIndex((l) => l.id === locationId);
    const nextLoc = locations[currentIndex + 1];

    setLocations((prev) =>
      prev.map((l) => {
        if (l.id === locationId) {
          return { ...l, isCompleted: true };
        }
        if (nextLoc && l.id === nextLoc.id) {
          return { ...l, isUnlocked: true };
        }
        return l;
      })
    );

    // Update Student Character Stats (Level Up!)
    setStudent((prev) => {
      const newExp = prev.currentExp + expEarned;
      let newLevel = prev.level;
      let maxExp = prev.maxExp;
      let currentExp = newExp;

      if (currentExp >= maxExp) {
        newLevel += 1;
        currentExp -= maxExp;
        maxExp = Math.round(maxExp * 1.3);
      }

      const completedLocs = prev.completedLocations.includes(locationId)
        ? prev.completedLocations
        : [...prev.completedLocations, locationId];

      return {
        ...prev,
        level: newLevel,
        currentExp,
        maxExp,
        hp: prev.maxHp,
        mp: prev.maxMp,
        energy: Math.min(prev.maxEnergy, prev.energy + 20),
        gold: prev.gold + goldEarned,
        completedLocations: completedLocs,
      };
    });

    // Record Submission to Google Sheets Database
    const submissionPayload: StudentSubmission = {
      studentName: student.name,
      classGrade: student.classGrade,
      level: student.level + 1,
      locationName: loc?.name || 'Desa Ilmu',
      score: scorePct,
      correctCount,
      totalQuestions,
      timestamp: new Date().toLocaleString('id-ID'),
    };

    await submitScoreToDatabase(dbConfig, submissionPayload);
  };

  // Add Question in Mode Guru
  const handleAddQuestion = (newQ: Question) => {
    setQuestions((prev) => [...prev, newQ]);
  };

  // Update Question
  const handleUpdateQuestion = (updatedQ: Question) => {
    setQuestions((prev) => prev.map((q) => (q.id === updatedQ.id ? updatedQ : q)));
  };

  // Delete Question
  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Add AI Generated Questions
  const handleAddGeneratedQuestions = (locationId: string, newQs: Question[]) => {
    setQuestions((prev) => [...prev, ...newQs]);
  };

  // Use Potion Action
  const handleUsePotion = () => {
    setStudent((prev) => ({
      ...prev,
      energy: Math.min(prev.maxEnergy, prev.energy + 50),
      currentExp: prev.currentExp + 50,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Header Bar */}
      <Header
        gameMode={gameMode}
        dbConfig={dbConfig}
        student={student}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          soundFx.enabled = next;
        }}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        onOpenTeacherAuth={() => setIsTeacherAuthOpen(true)}
        onSwitchToSiswa={() => setGameMode('siswa')}
        onOpenStudentSetup={() => setIsStudentSetupOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 p-2 sm:p-4 flex items-center justify-center">
        {gameMode === 'siswa' ? (
          <GameCanvas
            student={student}
            locations={locations}
            questions={questions}
            onSelectLocation={handleSelectLocation}
            onOpenInventory={() => setIsInventoryOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenStudentSetup={() => setIsStudentSetupOpen(true)}
            onOpenDbModal={() => setIsDbModalOpen(true)}
            onOpenTeacherAuth={() => setIsTeacherAuthOpen(true)}
          />
        ) : (
          <GuruDashboard
            locations={locations}
            questions={questions}
            dbConfig={dbConfig}
            onAddQuestion={handleAddQuestion}
            onUpdateQuestion={handleUpdateQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onAddGeneratedQuestions={handleAddGeneratedQuestions}
            onSwitchToSiswa={() => setGameMode('siswa')}
            onOpenDbModal={() => setIsDbModalOpen(true)}
          />
        )}
      </main>

      {/* Footer with Mandatory Copyright @Copyright by. Pak GuruAI */}
      <Footer
        dbConfig={dbConfig}
        gameMode={gameMode}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        onOpenTeacherAuth={() => setIsTeacherAuthOpen(true)}
      />

      {/* Modals */}
      <DatabaseModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        dbConfig={dbConfig}
        onUpdateDbConfig={(cfg) => setDbConfig(cfg)}
      />

      <TeacherAuthModal
        isOpen={isTeacherAuthOpen}
        onClose={() => setIsTeacherAuthOpen(false)}
        onAuthenticated={() => {
          setIsTeacherAuthOpen(false);
          setGameMode('guru');
        }}
      />

      <StudentSetupModal
        isOpen={isStudentSetupOpen}
        student={student}
        onClose={() => setIsStudentSetupOpen(false)}
        onSaveStudent={(updated) => setStudent((prev) => ({ ...prev, ...updated }))}
      />

      <InventoryModal
        isOpen={isInventoryOpen}
        student={student}
        onClose={() => setIsInventoryOpen(false)}
        onUsePotion={handleUsePotion}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        dbConfig={dbConfig}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      {selectedQuizLocation && (
        <QuizModal
          isOpen={!!selectedQuizLocation}
          location={selectedQuizLocation}
          questions={questions.filter((q) => q.locationId === selectedQuizLocation.id)}
          student={student}
          onClose={() => setSelectedQuizLocation(null)}
          onCompleteQuiz={handleCompleteQuiz}
        />
      )}

    </div>
  );
}
