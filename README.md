# SavvyMoney

[![Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ECF8E)](https://supabase.com)

A modern personal finance manager that helps adults and kids track budgets, savings goals, transactions, and learning progress. The backend has been migrated from Base44 to **Supabase**, providing a secure, real‑time database with Row Level Security.

---

## ✨ Features
- **User‑auth** via Supabase Auth (email/password, magic links)
- **Budget management**, **transaction tracking**, **savings goals**, **notifications**, **lesson progress**, **badges**
- Real‑time updates for savings goals and notifications
- Fully responsive UI built with React and Vite

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm or yarn
- Supabase account (project already created)

### 1. Clone the repo
```bash
git clone https://github.com/gardianAngel/SavvyMoney.git
cd SavvyMoney
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file (template `.env.example` is provided) and add:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
These values are taken from your Supabase dashboard → **Project Settings → API**.

### 4. Run the development server
```bash
npm run dev
```
Open http://localhost:5173 in your browser.

---

## 📦 Database Migration
The migration file `supabase/migrations/20260614000000_init.sql` defines the following tables (all with Row Level Security policies):
- `users`
- `budgets`
- `transactions`
- `savings_goals`
- `notifications`
- `lesson_progress`
- `user_badges`

To push the migration to Supabase (if needed):
```bash
SUPABASE_ACCESS_TOKEN=your_access_token \
SUPABASE_DB_PASSWORD=your_database_password \
npx supabase@2.106.0 db push
```

---

## 🛠️ Development Workflow
- Auth hook: `src/hooks/useAuth.jsx`
- Supabase client: `src/lib/supabaseClient.js`
- UI components: `src/components/ui/`
- Pages: `src/pages/adult/` and `src/pages/kids/`

Run linter and tests before committing:
```bash
npm run lint
npm test
```

---

## 📚 Documentation & Support
- Supabase Docs: https://supabase.com/docs
- Project issues: https://github.com/gardianAngel/SavvyMoney/issues
- General support: https://app.base44.com/support

---

## 🎉 License
MIT © 2026 Gardian Angel
