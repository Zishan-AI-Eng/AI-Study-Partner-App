# StudyAI

StudyAI is a polished frontend-only AI study companion built with Next.js App Router, TypeScript, Tailwind CSS, lucide-react, recharts, and react-hot-toast.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Registration validates passwords at six characters or longer.

## Scaffold and dependency commands

```bash
npx create-next-app@latest studyai --ts --tailwind --eslint --app --src-dir --use-npm --import-alias "@/*"
npm install lucide-react recharts react-hot-toast
```

## How to connect the FastAPI backend later

Replace the functions in `src/lib/api.ts` with typed `fetch` calls to FastAPI routes while keeping the current function signatures. Move authentication from localStorage to secure HTTP-only cookies, add an API base URL environment variable, and connect document, quiz, and result resources to PostgreSQL. The `TODO` markers above each API function identify integration points.
