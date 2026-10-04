import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "StudyAI | Turn your notes into a study guide",
  description: "Upload notes, build a study guide, practice with quizzes, and track your progress with StudyAI.",
  openGraph: {
    title: "StudyAI | Turn your notes into a study guide",
    description: "Upload notes, build a study guide, practice with quizzes, and track your progress with StudyAI.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "StudyAI | Turn your notes into a study guide",
    description: "Upload notes, build a study guide, practice with quizzes, and track your progress with StudyAI.",
  },
};

export default function Home() {
  return <LandingPage />;
}
