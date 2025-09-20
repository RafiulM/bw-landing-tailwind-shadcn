# Backend Structure Document

## 1. Backend Architecture

Our backend is built on top of Next.js 13’s App Router, combining server-side rendering, static site generation, and API routes in one framework. We rely on a modular, file-based routing pattern that keeps code organized and intuitive.

Key design patterns and frameworks:
- **Next.js App Router:** Co-located page, layout, and API logic based on folder structure
- **Server Components & Client Components:** Clear separation of data-fetching on the server and interactive UI on the client
- **NextAuth.js:** Manages authentication flows via a dedicated API route

How this supports our goals:
- **Scalability:**  
  • File-based routing makes it easy to add new pages or APIs without reworking central routing logic.  
  • Static site generation (SSG) and incremental static regeneration (ISR) minimize server load on high-traffic pages.
- **Maintainability:**  
  • Clear directory conventions (`app/`, `app/api/`, `app/dashboard/`) let new developers find code quickly.  
  • Layout components (`app/layout.tsx`, `app/dashboard/layout.tsx`) ensure consistent structure across pages.
- **Performance:**  
  • Server-side rendering (SSR) for dynamic pages that need up-to-date data.  
  • SSG for the landing page and static dashboard content, resulting in sub-second load times.

## 2. Database Management

In version 1, we keep data management simple:

• **Static JSON**: Dashboard content is stored in `app/dashboard/data.json`.  
• **Session Storage**: NextAuth.js uses secure, HTTP-only cookies (and optionally JWTs) to track user sessions on the edge.  

Data handling practices:
- **File-based storage** for quick prototyping without external dependencies
- **Graceful fallback**: If the JSON file fails to load, the app shows a friendly error and retry option
- **Future roadmap**: Replace or augment `data.json` with a managed database (e.g., PostgreSQL, MongoDB) via API routes or an ORM

## 3. Database Schema

Because we currently use a JSON file, our schema is defined in human-readable terms. In future, if we switch to a relational database, we would use a PostgreSQL schema like this:

PostgreSQL Sample Schema (Future Phase 2+):
```sql
CREATE TABLE users (
  id        SERIAL PRIMARY KEY,
  email     TEXT UNIQUE NOT NULL,
  password  TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE sessions (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER REFERENCES users(id),
  token      TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE dashboard_items (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id),
  title       TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Current JSON Schema (`app/dashboard/data.json`):
- **Type:** Array of objects
- **Fields per object:**
  - `id`: unique number or string
  - `title`: string (item heading)
  - `description`: string (item details)
  - `value`: optional number or boolean

## 4. API Design and Endpoints

We use Next.js API Routes, all nestled under `app/api/`, following RESTful conventions where possible.

Key endpoints:
- **/api/auth/[...nextauth]**  
  • Provided by NextAuth.js to handle: sign-in, sign-up (credentials), session checks, callbacks, and sign-out.  
- **(Future) /api/dashboard**  
  • Will serve dynamic dashboard data via GET, POST, PUT, DELETE once we integrate a real database.

How they work:
- The frontend calls `/api/auth/...` for all authentication actions.  
- Upon successful sign-in or sign-up, NextAuth.js issues a session cookie and redirects to `/dashboard`.  
- Protected pages and API routes verify the session server-side; if invalid, the user is sent to `/sign-in`.

## 5. Hosting Solutions

We deploy on Vercel, the platform made by the Next.js team.

Benefits:
- **Global CDN & Edge Network:** Fast load times for users worldwide
- **Automatic SSL:** Secure HTTPS out of the box
- **On-Demand Builders:** Serverless functions for API routes that scale with traffic
- **One-Click Deployments:** Every git push can trigger a new deployment, with preview URLs for pull requests
- **Environment Variables Management:** Securely store secrets like `NEXTAUTH_SECRET` in Vercel dashboard

## 6. Infrastructure Components

Our infrastructure revolves around serverless and edge components for reliability and performance.

- **Load Balancing & Edge Routing (Vercel):** Distributes requests across multiple edge locations automatically
- **Caching & CDN:**  
  • Static assets and pages are cached at the edge  
  • ISR allows cached pages to update in the background
- **Image Optimization (Next.js):** Delivers images in modern formats and appropriate sizes
- **Serverless Functions:** API routes spin up only when needed, reducing idle costs

## 7. Security Measures

We follow industry best practices to keep data and users safe.

Authentication & Authorization:
- **NextAuth.js:** Secure credential flow, CSRF protection, session encryption
- **Protected Routes:** Server-side checks in layout components or middleware to prevent unauthorized access

Data Protection:
- **HTTPS Everywhere:** Vercel enforces SSL for all domains
- **HTTP-Only Cookies:** Session tokens are not accessible via JavaScript, mitigating XSS attacks
- **Environment Variables:** Secrets (e.g., `NEXTAUTH_SECRET`, database URLs) never hardcoded in source
- **Input Validation:** Forms and API routes validate all inputs to prevent injection attacks

Regulatory Compliance:
- We can extend logs and audit trails to comply with GDPR or other privacy regulations when we add a database

## 8. Monitoring and Maintenance

We use a combination of built-in and third-party tools to keep the backend healthy.

Monitoring:
- **Vercel Analytics & Logs:** Track real-time traffic, latency, and error rates
- **Error Reporting (Future):** Integrate Sentry or LogRocket to capture exceptions in API routes and server components

Maintenance:
- **Dependency Management:** GitHub Dependabot keeps npm packages up to date
- **CI/CD Pipelines (Future):** GitHub Actions to run ESLint, Prettier, and automated tests on every pull request
- **Health Checks:** Automated scripts or synthetic tests to verify key endpoints (e.g., `/api/auth/session`) remain operational
- **Scheduled Updates:** Regularly upgrade Node.js, Next.js, and other frameworks to benefit from security patches

## 9. Conclusion and Overall Backend Summary

Our backend structure leverages Next.js’s App Router and API Routes to deliver a seamless blend of SSR, SSG, and serverless APIs. Authentication is handled by NextAuth.js, with user sessions managed via secure HTTP-only cookies. We store dashboard content in a static JSON file for v1 and plan to evolve toward a relational database using PostgreSQL. Hosting on Vercel gives us a global CDN, automatic scaling, and built-in security. Caching, edge functions, and optimized images ensure fast performance, while environment variables and input validation keep data safe.

This setup aligns perfectly with our goals of fast page loads, simple yet secure authentication, and an easy path to future growth—whether that means connecting to a real database, adding more API endpoints, or integrating advanced monitoring tools.