import React, { useState, useEffect } from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { Topic, Lesson, Quiz, LearningProgress, UserProfile, ComplexityLevel } from './types';
import { ApiService } from './services/api';
import { Header } from './components/Header';
import { TopicCatalog } from './components/TopicCatalog';
import { LessonReader } from './components/LessonReader';
import { QuizView } from './components/QuizView';
import { ProfileProgress } from './components/ProfileProgress';
import { AdminWorkflow } from './components/AdminWorkflow';
import { AITutorDrawer } from './components/AITutorDrawer';
import { BlueprintDrawer } from './components/BlueprintDrawer';

export function App() {
  const [activeView, setActiveView] = useState<'catalog' | 'lesson' | 'quiz' | 'profile' | 'admin' | 'blueprint'>('catalog');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, LearningProgress>>({});
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [tutorQuery, setTutorQuery] = useState<string>('');
  const [isBlueprintOpen, setIsBlueprintOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize data on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [loadedTopics, loadedProfile, loadedProgress] = await Promise.all([
          ApiService.getTopics(),
          ApiService.getUserProfile(),
          ApiService.getProgressMap()
        ]);

        setTopics(loadedTopics);
        setUserProfile(loadedProfile);
        setProgressMap(loadedProgress);

        // Set default active lesson if in-progress exists
        const inProgressEntry = Object.values(loadedProgress).find((p) => p.status === 'in_progress');
        if (inProgressEntry) {
          for (const t of loadedTopics) {
            const found = t.lessons.find((l) => l.id === inProgressEntry.lessonId);
            if (found) {
              setCurrentLesson(found);
              break;
            }
          }
        } else if (loadedTopics[0]?.lessons[0]) {
          setCurrentLesson(loadedTopics[0].lessons[0]);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  const handleSelectLesson = async (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setActiveView('lesson');
    // Save progress as in_progress
    const updated = await ApiService.saveProgress(lesson.id, 'in_progress', lesson.sections[0]?.id);
    setProgressMap((prev) => ({
      ...prev,
      [lesson.id]: updated
    }));
  };

  const handleStartQuiz = async () => {
    if (!currentLesson) return;
    setIsLoading(true);
    try {
      const quiz = await ApiService.getQuizForLesson(currentLesson.id);
      if (quiz) {
        setCurrentQuiz(quiz);
        setActiveView('quiz');
      } else {
        alert('Assessment drill for this module is currently being finalized in review.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizCompleted = async () => {
    // Refresh progress and profile
    const [updatedProgress, updatedProfile] = await Promise.all([
      ApiService.getProgressMap(),
      ApiService.getUserProfile()
    ]);
    setProgressMap(updatedProgress);
    setUserProfile(updatedProfile);
  };

  const handleAskTutorAboutSection = (sectionHeading: string) => {
    setTutorQuery(`Can you explain "${sectionHeading}" with a memorable real-world analogy?`);
    setIsTutorOpen(true);
  };

  const handleUpdateLevel = async (level: ComplexityLevel) => {
    const updated = await ApiService.updateUserLevel(level);
    setUserProfile(updated);
  };

  const refreshAllData = async () => {
    const [loadedTopics, loadedProfile, loadedProgress] = await Promise.all([
      ApiService.getTopics(),
      ApiService.getUserProfile(),
      ApiService.getProgressMap()
    ]);
    setTopics(loadedTopics);
    setUserProfile(loadedProfile);
    setProgressMap(loadedProgress);
  };

  return (
    <div className="app-container">
      {/* Primary Site Navigation Header */}
      <Header
        activeView={activeView}
        onNavigate={(view) => {
          if (view === 'blueprint') {
            setIsBlueprintOpen(true);
          } else {
            setActiveView(view);
          }
        }}
        userProfile={userProfile}
        onOpenTutor={() => setIsTutorOpen(true)}
        hasActiveLesson={!!currentLesson}
      />

      {/* Main Dynamic View Content */}
      <main className="main-content" role="main">
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: '#94a3b8' }}>
            <Sparkles size={24} className="float-animation" color="#38bdf8" />
            <span style={{ marginLeft: '0.75rem', fontSize: '1.1rem' }}>Loading Solian Wolves Curriculum...</span>
          </div>
        ) : (
          <>
            {activeView === 'catalog' && (
              <TopicCatalog
                topics={topics}
                progressMap={progressMap}
                onSelectLesson={handleSelectLesson}
                onOpenTutor={() => setIsTutorOpen(true)}
              />
            )}

            {activeView === 'lesson' && currentLesson && (
              <LessonReader
                lesson={currentLesson}
                onBack={() => setActiveView('catalog')}
                onStartQuiz={handleStartQuiz}
                onAskTutor={handleAskTutorAboutSection}
              />
            )}

            {activeView === 'quiz' && currentQuiz && (
              <QuizView
                quiz={currentQuiz}
                onBack={() => setActiveView('lesson')}
                onCompleted={handleQuizCompleted}
              />
            )}

            {activeView === 'profile' && userProfile && (
              <ProfileProgress
                userProfile={userProfile}
                progressMap={progressMap}
                topics={topics}
                onUpdateLevel={handleUpdateLevel}
                onRefreshData={refreshAllData}
              />
            )}

            {activeView === 'admin' && (
              <AdminWorkflow
                topics={topics}
                onRefreshTopics={refreshAllData}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Action Button for AI Tutor */}
      {!isTutorOpen && (
        <button
          id="floating-tutor-fab"
          className="tutor-launcher-fab"
          onClick={() => setIsTutorOpen(true)}
          aria-label="Open Grounded AI Tutor"
        >
          <Brain size={20} />
          <span>AI Tutor</span>
        </button>
      )}

      {/* In-Context Grounded AI Tutor Drawer */}
      <AITutorDrawer
        isOpen={isTutorOpen}
        onClose={() => {
          setIsTutorOpen(false);
          setTutorQuery('');
        }}
        activeLessonId={currentLesson?.id}
        initialQuery={tutorQuery}
      />

      {/* Blueprint Specification Modal */}
      <BlueprintDrawer
        isOpen={isBlueprintOpen}
        onClose={() => setIsBlueprintOpen(false)}
      />
    </div>
  );
}

export default App;
