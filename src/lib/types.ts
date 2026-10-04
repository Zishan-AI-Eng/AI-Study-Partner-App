export type User = { id: string; name: string; email: string };
export type Document = { id: string; title: string; content: string; summary: string; createdAt: string; quizId: string; questionCount: number };
export type Question = { id: string; question: string; options: string[]; answerIndex: number; explanation: string };
export type Quiz = { id: string; documentId: string; questions: Question[] };
export type Result = { id: string; quizId: string; documentTitle: string; score: number; total: number; takenAt: string };
export type Stats = { totalDocuments: number; quizzesTaken: number; averageScore: number; bestScore: number };
