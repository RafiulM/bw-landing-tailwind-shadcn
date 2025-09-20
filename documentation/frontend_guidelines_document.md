# Frontend Guideline Document

This document outlines how the frontend of the `bw-landing-tailwind-shadcn` project is structured, the principles that guide its design, and the tools and practices we use. It is written in simple, everyday language so everyone on the team—whether you’re new to code or a seasoned dev—can understand how everything fits together.

---

## 1. Frontend Architecture

### Overall Structure
- **Framework:** We use **Next.js 13** with the **App Router**. That means each folder under `app/` becomes a page or layout automatically—no extra routing setup needed.
- **Language:** **TypeScript** adds types on top of JavaScript so we catch errors early and make code easier to read.
- **Styling:** **Tailwind CSS** gives us ready-made utility classes (like `bg-blue-500` or `p-4`) so we can style quickly and keep everything consistent.
- **Components Library:** **Shadcn UI** sits on top of Tailwind and provides prebuilt, accessible React components (buttons, forms, modals) that match our look and feel.
- **Authentication:** **NextAuth.js** handles sign-up, sign-in, and session management through a built-in API route (`app/api/auth/[...all]/route.ts`).

### How It Supports Scalability, Maintainability, and Performance
- **File-Based Routing & Layouts:** Adding a new page is as simple as creating a folder or file. Shared UI (header, footer, sidebar) lives in `layout.tsx` files so you don’t repeat code.
- **Server & Client Components:** Next.js lets us mark components as server-only or client-only. We fetch data on the server when we can, and only ship what we need to the browser.
- **Utility-First Styling:** Tailwind’s purging feature removes unused classes in production, keeping CSS small and fast.
- **Modular Components:** By breaking our UI into small, reusable pieces, we reduce duplication and make updates safer and faster.

---

## 2. Design Principles

### Key Guidelines
1. **Usability:** Interfaces should be straightforward. Forms use clear labels and inline error messages. Buttons have meaningful text (e.g., “Sign In” vs. “Submit”).
2. **Accessibility:** We follow WCAG AA standards. Shadcn UI components come with ARIA attributes by default. We check color contrast, support keyboard navigation, and add `aria-label`s where needed.
3. **Responsiveness:** We build mobile-first. Tailwind breakpoints (`sm`, `md`, `lg`, etc.) let us adjust layouts easily so the app looks great on phones, tablets, and desktops.

### Applying the Principles
- **Landing Page:** Clean hierarchy—headline, sub-headline, call-to-action buttons. On mobile, sections stack vertically; on desktop, they sit side by side.
- **Forms:** Each input has a label. Errors appear beneath the field in red text. The submit button stays disabled until required fields are filled.
- **Dashboard:** Consistent header and sidebar across all pages. Content cards have enough padding and margin so they don’t feel cramped.

---

## 3. Styling and Theming

### Styling Approach
- **Utility-First (Tailwind CSS):** We write classes like `text-gray-700` or `px-6 py-3` directly in JSX. No separate CSS files for each component.
- **Global Styles:** In `globals.css`, we import Tailwind’s base, components, and utilities. We also add small overrides (e.g., link hover color) here.

### Theming
- **Light & Dark Mode:** We leverage Tailwind’s `dark:` variants. A top-level `<html>` class toggles between `light` and `dark`.
- **Color Palette:** Defined in `tailwind.config.js` under `theme.extend.colors`:  
  • Primary: Blue (500) `#3b82f6`, Blue (600) `#2563eb`  
  • Secondary: Indigo (500) `#6366f1`, Indigo (600) `#4f46e5`  
  • Accent: Teal (400) `#2dd4bf`, Teal (500) `#14b8a6`  
  • Neutral Light: Gray (100) `#f3f4f6`, Gray (200) `#e5e7eb`  
  • Neutral Dark: Gray (700) `#374151`, Gray (900) `#111827`  
  • Error: Red (500) `#ef4444`  
  • Success: Green (500) `#10b981`

### Visual Style
- We follow a **modern, flat design** with subtle shadows and rounded corners.  
- Cards and modals may use a light glassmorphism effect (`backdrop-filter: blur(8px)`) sparingly for emphasis.
- **Font:** We use **Inter**, a clean, modern sans-serif. It’s loaded via Google Fonts in the root layout.

---

## 4. Component Structure

### Organization
- **app/** holds pages, layouts, and API routes.  
- **components/** (planned) will contain reusable UI blocks, organized by type or feature (e.g., `components/ui/Button.tsx`, `components/dashboard/Card.tsx`).

### Reusability & Naming
- Each component lives in its own folder with a clear name and tests (e.g., `Button/`, `Modal/`).  
- We prefer **PascalCase** for component file names and folder names.  
- Props and logic are minimal: a button component might accept `variant` (`primary`, `secondary`), `size` (`sm`, `md`, `lg`), and `onClick`.

### Why Component-Based Architecture Matters
- **Maintainability:** Fix a bug in one place, and every use of that component benefits.  
- **Consistency:** All buttons, cards, and inputs look and behave the same.  
- **Onboarding:** New developers can find UI pieces quickly and understand how they connect.

---

## 5. State Management

### Current Approach
- **React State & Context:** For small bits of UI state (e.g., open/closed modals), we use `useState` or `useReducer`.  
- **NextAuth.js Hooks:** We call `useSession()` to get the current user’s session data anywhere in the app.

### Sharing State Across Components
- We wrap the app in a **SessionProvider** (from NextAuth) in the root layout so any component can read session info.
- If we need shared UI state (like a global notification banner), we’ll create a custom **React Context**.

### Future Growth
- If state grows complex in the dashboard (caching lists, optimistic updates), we’ll introduce a data-fetching library such as **SWR** or **React Query**. That gives us built-in caching, refetching, and error states.

---

## 6. Routing and Navigation

### How Routing Works
- **Next.js App Router:** Every folder or file under `app/` becomes a route.  
  • `app/page.tsx` → `/` (landing page)  
  • `app/sign-in/page.tsx` → `/sign-in`  
  • `app/sign-up/page.tsx` → `/sign-up`  
  • `app/dashboard/layout.tsx` + `app/dashboard/page.tsx` → `/dashboard`

### Navigation Structure
- **Public Header:** On the landing page, we show links to “Sign Up” and “Sign In.”
- **Dashboard Layout:** Once authenticated, the header shows a “Log Out” button and the user’s email or avatar. A sidebar lists sections like “Overview” and “Settings.”
- We use Next.js’s `<Link>` component for client-side transitions (fast, no full reload).

---

## 7. Performance Optimization

### Strategies We Use
1. **Static Site Generation (SSG) & Server-Side Rendering (SSR):**  
   • Landing page is built statically for speed and SEO.  
   • Dashboard data can be fetched server-side or statically if it doesn’t change often.  
2. **Code Splitting & Dynamic Imports:**  
   • Heavy components (e.g., charts) load on demand with `React.lazy` or Next.js dynamic imports.  
3. **CSS Purging:**  
   • Tailwind removes unused styles automatically in production builds.  
4. **Image Optimization:**  
   • Next.js’s `<Image>` component automatically serves modern formats and sizes.  
5. **Caching & CDN:**  
   • Deployed on Vercel’s global edge network. Static assets and pre-rendered pages live on a CDN.

### Benefits
- Faster initial loads.  
- Lower data usage for mobile users.  
- Better scores on Core Web Vitals.

---

## 8. Testing and Quality Assurance

### Testing Strategies
1. **Unit Tests:**  
   • Use **Jest** or **Vitest** + **React Testing Library** to validate individual components and functions.  
   • Example: test that the `Button` renders correct text and calls `onClick`.
2. **Integration Tests:**  
   • Test small user flows (e.g., filling out the sign-in form) by rendering multiple components together.  
3. **End-to-End (E2E) Tests:**  
   • Use **Cypress** or **Playwright** to simulate real user interactions in a running build.  
   • Flows: sign-up, sign-in, navigation to dashboard, log out.

### Linting and Formatting
- **ESLint** enforces code style and catches common mistakes.  
- **Prettier** formats code consistently.  
- Both run locally (via IDE plugins) and in CI (GitHub Actions) to block bad commits.

### Accessibility Checks
- Integrate **axe-core** or **Pa11y** in CI to catch accessibility issues early.
- Manual audit of key pages with browser devtools and screen readers.

---

## 9. Conclusion and Overall Frontend Summary

Our frontend setup combines the power of **Next.js**, **TypeScript**, **Tailwind CSS**, **Shadcn UI**, and **NextAuth.js** to deliver a secure, fast, and easy-to-maintain application. We:
- Use a clear file-based structure that scales with more pages and features.
- Follow design principles around usability, accessibility, and responsiveness.
- Rely on utility-first styling and a consistent theme defined in `tailwind.config.js`.
- Build with components that are reusable, well-typed, and easy to test.
- Manage user session state simply with NextAuth and local state (with room to grow into React Query or similar).
- Optimize performance through SSG, code splitting, and CDN deployment on Vercel.
- Ensure quality with unit, integration, and E2E tests, plus linting and accessibility checks.

This guideline should serve as a roadmap for anyone contributing to or reviewing the frontend code. It aligns with our project goals—fast, secure onboarding on the landing page, seamless authentication flows, and a personalized, protected dashboard—while keeping the code clean and approachable for future growth.

---

Happy coding! 🚀   