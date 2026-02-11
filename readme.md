# AI Resume Analyzer

AI Resume Analyzer is a full-stack web app that extracts, analyzes, and scores uploaded resumes using AI-powered resume parsing and evaluation. It provides a responsive React frontend and a Node/Express backend with file upload, parsing, and user authentication.

Live demo
- Frontend: https://airesumeana.netlify.app
- Backend (API): https://ai-resume-analyzer-j2kz.onrender.com

Repository
- https://github.com/prateek959/AI_Resume_Analyzer

Key features
- Upload resumes (PDF/DOCX) and extract text
- AI-powered resume analysis and suggestions
- User authentication and resume management
- Clean React + Vite frontend and Express + MongoDB backend

Tech stack
- Frontend: React, Vite, Tailwind (UI tooling), Axios
- Backend: Node.js, Express, Mongoose, Multer, PDF/DOCX parsers
- AI: integrated via a genAI client in `backend/service`

Quickstart (Local Development)

Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

Clone

```bash
git clone https://github.com/prateek959/AI_Resume_Analyzer.git
cd AI_Resume_Analyzer
```

Backend

```bash
cd backend
npm install
# create .env from the sample and fill values
copy Env_sample .env
# start in dev mode (nodemon)
npm run dev
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

Build (frontend production)

```bash
cd frontend
npm run build
```

Environment
- See `backend/Env_sample` for required environment variables and example values.

API
- Main API route groups live under `/user` and `/resume` — see `backend/routes` for details.

Project structure (top-level)
- `backend/` — server, routes, controllers, models, middleware
- `frontend/` — React app (Vite), components, pages
- `uploads/` — stored uploaded resume files (backend)

Notes
- The app integrates with an AI service in `backend/service` for resume analysis. Configure credentials via the env sample before running the server.

Contributing
- Feel free to open issues or pull requests on the repository.

License
- MIT
