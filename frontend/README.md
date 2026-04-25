# 🐾 PetCare — Pet Health & Vaccination Record System

A premium, glassmorphic Next.js 14 frontend for managing pet health records, vaccinations, reminders, and medical history.

## ✨ Features

- **Authentication** — Login & Signup with JWT stored in localStorage
- **Dashboard** — Stats overview, quick actions, recent pets
- **Pet Management** — List, add, and view full pet profiles
- **Vaccinations** — Log vaccine name, date given, next due date, and notes
- **Reminders** — Set health reminders with due dates
- **Medical History** — Record visits with descriptions and vet info
- **Glassmorphism UI** — Dark-mode-first, blur effects, gradient accents
- **Fully responsive** — Works on mobile, tablet, and desktop
- **Protected routes** — Redirects unauthenticated users to login

## 🚀 Quick Start

### 1. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Set your backend URL
Edit `.env.local`:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:3000
\`\`\`

### 3. Run the dev server
\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3001](http://localhost:3001) (or the port shown).

---

## 📁 Project Structure

\`\`\`
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx          # Login page
│   │   └── signup/page.tsx         # Signup page
│   ├── dashboard/
│   │   ├── layout.tsx              # Dashboard layout (auth guard)
│   │   └── page.tsx                # Dashboard home with stats
│   ├── pets/
│   │   ├── layout.tsx              # Pets layout (auth guard)
│   │   ├── page.tsx                # Pets list
│   │   ├── add/page.tsx            # Add pet form
│   │   └── [id]/page.tsx          # Pet full profile
│   ├── globals.css                 # Global styles + glassmorphism
│   └── layout.tsx                  # Root layout
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Top navigation bar
│   │   └── Sidebar.tsx             # Side navigation
│   └── ui/
│       ├── GlassCard.tsx           # Reusable glass card
│       ├── Modal.tsx               # Generic modal wrapper
│       ├── Skeleton.tsx            # Skeleton loaders
│       └── Spinner.tsx             # Loading spinner
├── lib/
│   ├── api.ts                      # Axios instance + all API calls
│   ├── auth.ts                     # JWT storage helpers
│   └── utils.ts                    # cn(), formatDate(), getInitials()
└── types/
    └── index.ts                    # TypeScript interfaces
\`\`\`

## 🔌 API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login |
| POST | `/auth/signup` | Register |
| GET | `/pet` | List all pets |
| POST | `/pet` | Create pet |
| GET | `/pet/:id/full-profile` | Full pet profile |
| POST | `/pet/:id/vaccination` | Add vaccination |
| POST | `/pet/:id/reminder` | Add reminder |
| POST | `/pet/:id/history` | Add medical history |

## 🎨 Design System

- **Background**: Deep dark `#050814` with gradient mesh overlays
- **Cards**: `backdrop-blur-xl`, `bg-white/6`, `border-white/10`, `rounded-2xl`
- **Accent**: Indigo → Purple gradient (`#6366f1` → `#a855f7`)
- **Secondary**: Teal (`#14b8a6`), Emerald, Pink, Amber
- **Typography**: Syne (headings) + DM Sans (body)
- **Animations**: fade-in, slide-up, scale-in, shimmer skeleton

## 📦 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Axios**
- **Lucide React** (icons)
- **Google Fonts** — Syne + DM Sans
