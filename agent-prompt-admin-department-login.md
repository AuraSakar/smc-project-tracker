# Task: Split Login into Admin + Department, Redesign Admin Post-Login Layout

## Context
This is the SMC Project Tracker app (see AGENTS.md at project root for full architecture — React 18 + Vite, Express, PostgreSQL + Prisma, JWT auth, react-router-dom v6, plain CSS with `:root` variables, react-i18next). Follow all existing conventions in AGENTS.md (color palette, `formatINR()`, `formatDate()`, CSS naming, etc.) unless explicitly told otherwise below.

Do **not** touch project data models, CRUD logic, or public-facing pages in this task. This task is scoped to authentication entry points and the admin shell/layout only.

---

## Part 1 — Login Selector

Currently the footer SMC logo click routes straight to `/login` (Employee ID + Password form). Change this to a two-step flow:

1. `/login` becomes a **Login Selector** page with two large buttons/cards:
   - **"Admin Login"** → routes to `/login/admin`
   - **"Department Login"** → routes to `/login/department`
2. Use the existing SMC visual language (navy `#1a3c6e`, orange `#e87722` accents, existing card/button styling) — this should look like an official government portal chooser, not a generic split page.
3. Keep the footer logo's existing behavior of linking here (`/login`), unchanged.

## Part 2 — Admin Login (`/login/admin`)

- This is a **direct move** of the current login form (Employee ID + Password) — no visual or functional changes to the form itself.
- Only the route changes: it now lives at `/login/admin` instead of `/login`.
- On successful login, behavior is unchanged (JWT stored, redirect to admin dashboard) — but see Part 3 for the new dashboard shell it lands on.

## Part 3 — New Admin Shell/Layout (applies to all `/admin/*` routes)

Replace the current admin page chrome with a layout matching the attached wireframe. Build this as a new `AdminLayout.jsx` component wrapping all `/admin/*` routes via `<Outlet />`, structured as:

**1. Top bar — Accessibility Toolbar**
- Full-width dark strip, reuses the existing A11yBar component/logic already in `App.jsx` (font size, wide spacing, dark theme, text-to-speech) — just relocate it to render inside `AdminLayout` instead of globally, since it's only shown here for now (confirm with me if it's still needed on public pages — assume yes, keep it there too, this is additive not a move).

**2. Header bar**
- Left: SMC logo (`favicon_smc.png`) + "Solapur Municipal Corporation" text
- Center: Bold title — "Project Management System"
- Right: Logged-in username, click-to-open dropdown with a **Logout** option (clears JWT from `localStorage`, redirects to `/login`)

**3. Left sidebar (fixed, full-height)**
Vertical nav with these items, each a stacked full-width row with a bottom divider (as in the wireframe):
- **Projects** → `/admin/projects` (list/table view, i.e. current `ManageProjects.jsx`)
- **Add new Project** → `/admin/projects/add`
- **Manage Projects (edit)** → keep as a distinct entry if you want to separate "view/delete" from "edit," otherwise this can point to the same `ManageProjects.jsx` as "Projects" — use your judgment, but don't duplicate functionality, just duplicate the nav entry if needed for UX clarity
- **Report** → new stub page `/admin/report` (blank placeholder page for now, just a heading "Report" — no chart logic yet)

**4. Main content area**
- Right of sidebar, below header — this is where `<Outlet />` renders the routed admin page content (Dashboard, ManageProjects, AddProject, EditProject, Report, etc.)

Update `App.jsx` routing so all existing `/admin/*` routes render inside this new `AdminLayout`, and `ProtectedRoute` continues to guard them exactly as it does now.

## Part 4 — Department Login (stub only — do not build full logic yet)

I will give you the department login/page requirements separately later. For now, just scaffold so nothing breaks:

- Add route `/login/department` rendering a simple placeholder page ("Department Login — Coming Soon" or similar, styled consistently with the admin login page).
- Add a `department` value to the user `role` field in `schema.prisma` (alongside existing `viewer`, `admin`, `superadmin`) so the schema is forward-compatible — but do **not** build any department-specific middleware, dashboard, or permissions yet.
- Do not wire up a real submit handler on this placeholder form.

## Deliverables checklist
- [ ] `/login` → Login Selector page (Admin / Department)
- [ ] `/login/admin` → existing login form, moved (no logic changes)
- [ ] `/login/department` → placeholder page only
- [ ] `AdminLayout.jsx` → a11y bar + header + sidebar + `<Outlet />`, matches wireframe
- [ ] All `/admin/*` routes render inside `AdminLayout`
- [ ] New `/admin/report` stub page
- [ ] `role` enum in `schema.prisma` includes `department`
- [ ] **Update AGENTS.md** to reflect: new routing structure, new `AdminLayout` component, new role value — per the "Notes for Future AI Agents" instruction already in that file

## Out of scope (do not touch)
- Public pages (Home, ProjectDetail, About)
- Project CRUD logic, controllers, or Prisma project model
- i18n translation files (unless adding the new sidebar/header labels as translation keys, which you should do, following the existing `t('Key')` pattern)
- Department login functionality itself (details coming later)
