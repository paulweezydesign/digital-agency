# Testing Digital Agency App

## Overview
The digital-agency app is a Next.js 15 full-stack SaaS platform with Mastra.ai agent orchestration, MongoDB, and NextAuth.js authentication.

## Devin Secrets Needed
- `OPENAI_API_KEY` - Required for agent chat functionality
- `MONGODB_URI` - Required for database features (not needed for basic UI testing)
- `NEXTAUTH_SECRET` - Required for authentication
- `NEXTAUTH_URL` - Set to `http://localhost:3000`
- `EXA_API_KEY` - Optional, for web search tools
- `RESEND_API_KEY` - Optional, for email tools
- `GITHUB_TOKEN` - Optional, for GitHub integration tools

## Dev Server Setup
1. Ensure `.env.local` exists with at minimum `NEXTAUTH_SECRET` and `NEXTAUTH_URL`
2. Run `npm run dev` from the project root
3. Server starts on http://localhost:3000 (typically ready in ~2 seconds)
4. Dashboard pages use static sample data - MongoDB is NOT required for basic UI rendering

## Demo Credentials
- Admin: `admin@digitalagency.com` / `admin123`
- Operator: `operator@digitalagency.com` / `operator123`
- Auth uses JWT strategy (no database needed for login)

## Key Pages to Test

| Route | Page | What to Verify |
|-------|------|----------------|
| `/` | Dashboard | 4 stat cards, Agent Activity Feed, Active Projects section, sidebar navigation |
| `/projects` | Projects | List view with 6 projects, Kanban Board tab with 4 columns |
| `/clients` | Client Pipeline | 5-column kanban (Leads, Qualified, Proposal, Onboarding, Active) with client cards |
| `/agents` | AI Agents | Grid of 10 agents with stats row (Total, Active, Actions Today, Success Rate) |
| `/agents/[name]` | Agent Detail | Agent info, Chat/History/Capabilities tabs, chat input area |
| `/login` | Login | DA logo, email/password form, demo credentials displayed at bottom |
| `/portal` | Client Portal | Project Status, Recent Updates, Deliverables for Review sections |

## Navigation
- Sidebar has 3 groups: Overview (Dashboard), Work (Projects, Clients), AI Agents (All Agents)
- Agent names for detail pages: `project-manager`, `tech-lead`, `design`, `research`, `frontend`, `backend`, `qa`, `prospector`, `nurture`, `onboarding`

## Testing Notes
- The login page redirects to `/` on success via `window.location.href`
- Agent chat requires `OPENAI_API_KEY` to actually stream responses - without it, the chat UI still renders but sending messages may fail
- All dashboard pages render with hardcoded sample data, so they work without a MongoDB connection
- The portal page (`/portal`) uses a separate layout without the dashboard sidebar
- Projects page has two views toggled by tabs: "List View" and "Kanban Board"
- Build command: `npm run build` (uses Next.js Turbopack)
- Lint command: `npm run lint`
