import { Document, Quiz, Result, Stats, User } from "./types";

const read = <T>(key: string, fallback: T): T => { if (typeof window === "undefined") return fallback; const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; };
const write = (key: string, value: unknown) => { if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(value)); };
const delay = (ms = 650) => new Promise((resolve) => setTimeout(resolve, ms));
const documents = () => read<Document[]>("studyai-documents", []);
const results = () => read<Result[]>("studyai-results", []);
const quizzes = () => read<Quiz[]>("studyai-quizzes", []);

const demoDocuments: Document[] = [
  { id: "demo-os", title: "Operating Systems - Process Scheduling", content: "Process scheduling determines which ready process receives the CPU and for how long.", summary: "Process scheduling coordinates CPU access among ready processes. FCFS is simple but can create convoy effects, while SJF minimizes average waiting time when burst lengths are known. Round Robin improves responsiveness by assigning each process a time quantum.", createdAt: new Date().toISOString(), quizId: "quiz-demo-os", questionCount: 5 },
  { id: "demo-db", title: "Database Systems - Normalization", content: "Normalization organizes relational data to reduce redundancy and update anomalies.", summary: "Normalization decomposes relations into focused tables while preserving important dependencies. First, second, and third normal forms progressively remove repeating groups, partial dependencies, and transitive dependencies.", createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), quizId: "quiz-demo-db", questionCount: 5 },
  { id: "demo-net", title: "Computer Networks - OSI Model", content: "The OSI model describes networking responsibilities across seven conceptual layers.", summary: "The OSI model separates communication into physical, data link, network, transport, session, presentation, and application layers. This separation helps teams reason about protocols, interfaces, and troubleshooting boundaries.", createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), quizId: "quiz-demo-net", questionCount: 5 },
  { id: "demo-tree", title: "Data Structures - Binary Trees", content: "Binary trees organize values with at most two children per node.", summary: "Binary trees support recursive structure and traversal strategies. Binary search trees keep smaller values to the left and larger values to the right, enabling efficient lookup when the tree remains balanced.", createdAt: new Date(Date.now() - 86400000 * 6).toISOString(), quizId: "quiz-demo-tree", questionCount: 5 },
];
const demoTopics = ["CPU scheduling", "normalization", "OSI layers", "binary trees"];
const demoQuizzes: Quiz[] = demoDocuments.map((doc, topicIndex) => ({ id: doc.quizId, documentId: doc.id, questions: Array.from({ length: 5 }, (_, index) => ({ id: `${doc.id}-q${index + 1}`, question: `Which statement best describes ${demoTopics[topicIndex]} in this study guide?`, options: ["It organizes a core concept for reliable system behavior.", "It removes the need for any design decisions.", "It applies only after a system has failed.", "It is unrelated to the subject."], answerIndex: 0, explanation: "The first option captures the central idea from this study guide." })) }));
const demoScores = [2, 3, 2, 3, 3, 4, 3, 4, 4, 5];

function seedDemoData(email: string) {
  if (typeof window === "undefined" || localStorage.getItem(`studyai-demo-seeded:${email}`)) return;
  write("studyai-documents", demoDocuments);
  write("studyai-quizzes", demoQuizzes);
  write("studyai-results", demoScores.map((score, index) => ({ id: `demo-result-${index}`, quizId: demoQuizzes[index % demoQuizzes.length].id, documentTitle: demoDocuments[index % demoDocuments.length].title, score, total: 5, takenAt: new Date(Date.now() - 86400000 * (9 - index)).toISOString() })));
  localStorage.setItem(`studyai-demo-seeded:${email}`, "true");
}

if (typeof window !== "undefined" && !localStorage.getItem("studyai-storage-reset-v2")) {
  localStorage.removeItem("studyai-documents");
  localStorage.removeItem("studyai-quizzes");
  localStorage.removeItem("studyai-results");
  localStorage.setItem("studyai-storage-reset-v2", "true");
}

// TODO: replace with real FastAPI endpoint
export async function login(email: string, password: string) { await delay(); void password; const name = email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Student"; const user = { id: `user-${Date.now()}`, name, email }; write("studyai-user", user); seedDemoData(email); return user; }
// TODO: replace with real FastAPI endpoint
export async function register(name: string, email: string, password: string) { await delay(); void password; const user = { id: "u-new", name, email }; write("studyai-user", user); return user; }
// TODO: replace with real FastAPI endpoint
export async function logout() { await delay(250); if (typeof window !== "undefined") localStorage.removeItem("studyai-user"); }
// TODO: replace with real FastAPI endpoint
export async function getCurrentUser(): Promise<User | null> { await delay(250); const user = read<User | null>("studyai-user", null); if (user?.email === "ali@example.com") { if (typeof window !== "undefined") localStorage.removeItem("studyai-user"); return null; } return user; }
// TODO: replace with real FastAPI endpoint
export async function getDocuments() { await delay(); return documents(); }
// TODO: replace with real FastAPI endpoint
export async function getDocument(id: string) { await delay(); return documents().find((d) => d.id === id) ?? null; }
// TODO: replace with real FastAPI endpoint
export async function createDocument(title: string, fileOrText: File | string): Promise<never> { await delay(3500); void title; void fileOrText; throw new Error("AI document generation is unavailable until the FastAPI backend is connected."); }
// TODO: replace with real FastAPI endpoint
export async function deleteDocument(id: string) { await delay(); write("studyai-documents", documents().filter((d) => d.id !== id)); return true; }
// TODO: replace with real FastAPI endpoint
export async function getQuiz(id: string): Promise<Quiz | null> { await delay(); return quizzes().find((q) => q.id === id) ?? null; }
// TODO: replace with real FastAPI endpoint
export async function submitQuiz(quizId: string, answers: number[]) { await delay(); const quiz = quizzes().find((q) => q.id === quizId); const doc = documents().find((d) => d.quizId === quizId); const score = quiz ? answers.reduce((sum, a, i) => sum + (a === quiz.questions[i]?.answerIndex ? 1 : 0), 0) : 0; const result: Result = { id: `result-${Date.now()}`, quizId, documentTitle: doc?.title ?? "Study session", score, total: quiz?.questions.length ?? 5, takenAt: new Date().toISOString() }; write("studyai-results", [result, ...results()]); return result; }
// TODO: replace with real FastAPI endpoint
export async function getResults() { await delay(); return results(); }
// TODO: replace with real FastAPI endpoint
export async function getStats(): Promise<Stats> { await delay(); const rs = results(); const percentages = rs.map((r) => (r.score / r.total) * 100); return { totalDocuments: documents().length, quizzesTaken: rs.length, averageScore: percentages.length ? Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length) : 0, bestScore: percentages.length ? Math.round(Math.max(...percentages)) : 0 }; }
// TODO: replace with real FastAPI endpoint
export async function resetDemoData(email: string) { if (typeof window !== "undefined") localStorage.removeItem(`studyai-demo-seeded:${email}`); seedDemoData(email); return true; }
// TODO: replace with real FastAPI endpoint
export async function clearAllData() { write("studyai-documents", []); write("studyai-quizzes", []); write("studyai-results", []); return true; }
// TODO: replace with real FastAPI endpoint
export async function requestPasswordReset(email: string) { await delay(1000); void email; return { accepted: true }; }
// TODO: replace with real FastAPI endpoint
export async function resetPassword(token: string, newPassword: string) { await delay(900); void newPassword; if (token !== "demo") throw new Error("This reset link is invalid or has expired."); return { updated: true }; }
