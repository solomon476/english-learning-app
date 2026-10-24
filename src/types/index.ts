// Solian Wolves Learning Platform — Type Definitions
// Corresponds to Section 5 (Database Design) and Section 6 (API Specification)

export type ComplexityLevel = 'beginner' | 'intermediate' | 'advanced';
export type PublishingStatus = 'draft' | 'review' | 'published' | 'archived';
export type TutorMode = 'explain' | 'explore' | 'practice' | 'deep_dive';

export interface ContentSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  licenseNotes: string;
  accessedAt: string;
}

export interface LessonSection {
  id: string;
  position: number;
  heading: string;
  bodyStandard: string;
  bodyAnalogy: string;
  bodyAdvanced: string;
  keyTakeaway: string;
}

export interface Lesson {
  id: string;
  topicId: string;
  slug: string;
  title: string;
  level: ComplexityLevel;
  estMinutes: number;
  summary: string;
  position: number;
  status: PublishingStatus;
  version: number;
  sections: LessonSection[];
  sources: ContentSource[];
  quizId?: string;
}

export interface Topic {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: 'Language & Communication' | 'Logic & Philosophy' | 'Technology & Systems' | 'Science & Nature';
  iconName: string;
  status: PublishingStatus;
  lessons: Lesson[];
}

export interface QuestionOption {
  id: string;
  text: string;
}

// Client-safe question payload (answer key is omitted!)
export interface QuizQuestion {
  id: string;
  position: number;
  type: 'multiple_choice' | 'true_false';
  prompt: string;
  options: QuestionOption[];
}

// Private server question with protected answer key
export interface ServerQuestion extends QuizQuestion {
  correctOptionId: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  passThresholdPercent: number;
  status: PublishingStatus;
  questions: QuizQuestion[];
}

export interface QuestionFeedback {
  questionId: string;
  isCorrect: boolean;
  selectedOptionId: string;
  correctOptionId: string;
  explanation: string;
}

export interface QuizAttemptResult {
  attemptId: string;
  quizId: string;
  score: number;
  totalPoints: number;
  passed: boolean;
  breakdown: QuestionFeedback[];
  submittedAt: string;
}

export interface LearningProgress {
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  lastSectionId?: string;
  highestQuizScore: number;
  lastStudiedAt: string;
  completedAt?: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  preferredLevel: ComplexityLevel;
  streakDays: number;
  lastActiveDate: string;
  totalCompletedLessons: number;
  tutorCreditsUsed: number;
  tutorCreditsMax: number;
}

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  mode: TutorMode;
  sources?: ContentSource[];
  followUpSuggestions?: string[];
  usage?: {
    inputTokens: number;
    outputTokens: number;
    costEstimate: number;
  };
  createdAt: string;
}
