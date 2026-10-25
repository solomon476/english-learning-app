// Solian Wolves Learning Platform: API Client & Server Boundary
// Implements the REST API Contract specified in Blueprint Section 6.

import {
  Topic,
  Lesson,
  Quiz,
  QuizQuestion,
  QuizAttemptResult,
  QuestionFeedback,
  LearningProgress,
  UserProfile,
  ComplexityLevel,
  PublishingStatus
} from '../types';
import { MOCK_TOPICS, SERVER_QUIZ_STORE } from '../data/mockCurriculum';

const STORAGE_KEYS = {
  PROFILE: 'swl_user_profile_v1',
  PROGRESS: 'swl_learning_progress_v1',
  TOPICS_OVERRIDE: 'swl_topics_override_v1'
};

// Initial default user profile (Solian Wolves learner)
const DEFAULT_PROFILE: UserProfile = {
  id: 'usr-learner-01',
  displayName: 'Learner',
  email: 'learner@solianwolves.org',
  preferredLevel: 'beginner',
  streakDays: 1,
  lastActiveDate: new Date().toISOString(),
  totalCompletedLessons: 0,
  tutorCreditsUsed: 0,
  tutorCreditsMax: 20
};

// Seed initial learning progress
const DEFAULT_PROGRESS: Record<string, LearningProgress> = {
  'les-active-voice': {
    lessonId: 'les-active-voice',
    status: 'in_progress',
    lastSectionId: 'sec-av-1',
    highestQuizScore: 0,
    lastStudiedAt: new Date(Date.now() - 3600000).toISOString()
  }
};

export class ApiService {
  private static simulateLatency(ms: number = 200): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // --- Content Endpoints ---

  public static async getTopics(): Promise<Topic[]> {
    await this.simulateLatency(150);
    const overrides = localStorage.getItem(STORAGE_KEYS.TOPICS_OVERRIDE);
    if (overrides) {
      try {
        return JSON.parse(overrides);
      } catch {
        // fallback
      }
    }
    return MOCK_TOPICS;
  }

  public static async getTopicBySlug(slug: string): Promise<Topic | null> {
    const topics = await this.getTopics();
    return topics.find((t) => t.slug === slug) || null;
  }

  public static async getLessonBySlug(slug: string): Promise<Lesson | null> {
    const topics = await this.getTopics();
    for (const t of topics) {
      const match = t.lessons.find((l) => l.slug === slug);
      if (match) return match;
    }
    return null;
  }

  // GET /lessons/:id/quizzes (Server explicitly omits answer keys!)
  public static async getQuizForLesson(lessonId: string): Promise<Quiz | null> {
    await this.simulateLatency(100);
    const serverQuiz = Object.values(SERVER_QUIZ_STORE).find((q) => q.lessonId === lessonId);
    if (!serverQuiz) return null;

    // Sanitize: strip correctOptionId and explanation before sending to client
    const clientQuestions: QuizQuestion[] = serverQuiz.questions.map((q) => ({
      id: q.id,
      position: q.position,
      type: q.type,
      prompt: q.prompt,
      options: q.options
    }));

    return {
      id: serverQuiz.id,
      lessonId: serverQuiz.lessonId,
      title: serverQuiz.title,
      passThresholdPercent: serverQuiz.passThresholdPercent,
      status: 'published',
      questions: clientQuestions
    };
  }

  // POST /quizzes/:id/attempts (Evaluates answers strictly server-side!)
  public static async submitQuizAttempt(
    quizId: string,
    responses: Record<string, string> // questionId -> selectedOptionId
  ): Promise<QuizAttemptResult> {
    await this.simulateLatency(350);
    const serverQuiz = SERVER_QUIZ_STORE[quizId];
    if (!serverQuiz) {
      throw new Error(`Quiz ${quizId} not found`);
    }

    let correctCount = 0;
    const totalQuestions = serverQuiz.questions.length;
    const breakdown: QuestionFeedback[] = [];

    for (const q of serverQuiz.questions) {
      const selected = responses[q.id] || '';
      const isCorrect = selected === q.correctOptionId;
      if (isCorrect) correctCount++;

      breakdown.push({
        questionId: q.id,
        isCorrect,
        selectedOptionId: selected,
        correctOptionId: q.correctOptionId,
        explanation: q.explanation
      });
    }

    const calculatedScore = Math.round((correctCount / totalQuestions) * 100);
    const passed = calculatedScore >= serverQuiz.passThresholdPercent;

    const result: QuizAttemptResult = {
      attemptId: `att-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      quizId,
      score: calculatedScore,
      totalPoints: totalQuestions,
      passed,
      breakdown,
      submittedAt: new Date().toISOString()
    };

    // Automatically update learning progress on the server
    await this.updateProgressAfterQuiz(serverQuiz.lessonId, calculatedScore, passed);

    return result;
  }

  // --- Learner Profile & Progress Endpoints ---

  public static async getUserProfile(): Promise<UserProfile> {
    await this.simulateLatency(100);
    const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (stored) {
      try {
        const parsed: UserProfile = JSON.parse(stored);
        if (parsed.displayName === 'Kiprono Cheruiyot') {
          parsed.displayName = 'Learner';
          localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(parsed));
        }
        return parsed;
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
    return DEFAULT_PROFILE;
  }

  public static async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const profile = await this.getUserProfile();
    const updated = { ...profile, ...updates };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    return updated;
  }

  public static async updateUserLevel(level: ComplexityLevel): Promise<UserProfile> {
    const profile = await this.getUserProfile();
    profile.preferredLevel = level;
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    return profile;
  }

  public static async getProgressMap(): Promise<Record<string, LearningProgress>> {
    await this.simulateLatency(100);
    const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(DEFAULT_PROGRESS));
    return DEFAULT_PROGRESS;
  }

  public static async saveProgress(
    lessonId: string,
    status: 'in_progress' | 'completed',
    lastSectionId?: string
  ): Promise<LearningProgress> {
    await this.simulateLatency(150);
    const progressMap = await this.getProgressMap();
    const existing = progressMap[lessonId] || {
      lessonId,
      status: 'in_progress',
      highestQuizScore: 0,
      lastStudiedAt: new Date().toISOString()
    };

    const updated: LearningProgress = {
      ...existing,
      status: status === 'completed' ? 'completed' : existing.status === 'completed' ? 'completed' : 'in_progress',
      lastSectionId: lastSectionId || existing.lastSectionId,
      lastStudiedAt: new Date().toISOString(),
      completedAt: status === 'completed' ? new Date().toISOString() : existing.completedAt
    };

    progressMap[lessonId] = updated;
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressMap));

    // Update profile count if newly completed
    if (status === 'completed') {
      const profile = await this.getUserProfile();
      const completedCount = Object.values(progressMap).filter((p) => p.status === 'completed').length;
      profile.totalCompletedLessons = completedCount;
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    }

    return updated;
  }

  private static async updateProgressAfterQuiz(
    lessonId: string,
    score: number,
    passed: boolean
  ): Promise<void> {
    const progressMap = await this.getProgressMap();
    const existing = progressMap[lessonId] || {
      lessonId,
      status: 'in_progress',
      highestQuizScore: 0,
      lastStudiedAt: new Date().toISOString()
    };

    existing.highestQuizScore = Math.max(existing.highestQuizScore, score);
    if (passed) {
      existing.status = 'completed';
      existing.completedAt = new Date().toISOString();
    }
    existing.lastStudiedAt = new Date().toISOString();

    progressMap[lessonId] = existing;
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressMap));

    // Refresh profile completed count
    const profile = await this.getUserProfile();
    const completedCount = Object.values(progressMap).filter((p) => p.status === 'completed').length;
    profile.totalCompletedLessons = completedCount;
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }

  // DELETE /api/v1/me/data (Kenya DPA 2019 compliance)
  public static async purgeUserData(): Promise<void> {
    await this.simulateLatency(300);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem('swl_tutor_history_v1');
  }

  // --- Content Administration Endpoints ---

  public static async updateLessonStatus(
    lessonId: string,
    newStatus: PublishingStatus
  ): Promise<void> {
    const topics = await this.getTopics();
    for (const t of topics) {
      const lesson = t.lessons.find((l) => l.id === lessonId);
      if (lesson) {
        lesson.status = newStatus;
        break;
      }
    }
    localStorage.setItem(STORAGE_KEYS.TOPICS_OVERRIDE, JSON.stringify(topics));
  }
}
