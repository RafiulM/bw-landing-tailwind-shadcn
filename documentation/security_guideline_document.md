# Security Guidelines for bw-landing-tailwind-shadcn

This document outlines security best practices tailored to the `bw-landing-tailwind-shadcn` Next.js project. Each section maps to core security principles and provides actionable recommendations to harden the application from development through production.

---

## 1. Authentication & Access Control

1. Implement Strong Password Policies:
   - Enforce a minimum password length of 12 characters, including uppercase, lowercase, numbers, and symbols.
   - Reject weak or commonly used passwords with a blocklist.
   - Require periodic password rotation for privileged accounts.

2. Secure Credential Storage:
   - Use Argon2 or bcrypt with a unique salt per user. Do **not** store passwords in plaintext.
   - Offload secrets (e.g., `NEXTAUTH_SECRET`) to a secrets manager (AWS Secrets Manager, HashiCorp Vault).

3. NextAuth.js Configuration:
   - Disable the `none` algorithm. Explicitly set a strong signing algorithm (e.g., `HS256` or `RS256`).
   - Validate JWTs on every request (check `exp`, `iat`, and `aud` claims).
   - Restrict available OAuth providers to only those you actively support.
   - Enable multi-factor authentication (MFA) for user accounts with elevated privileges (future enhancement).

4. Session & Cookie Security:
   - Set cookies with the attributes: `HttpOnly`, `Secure` (requires HTTPS), `SameSite=Strict` or `Lax` for auth cookies.
   - Implement both idle and absolute session timeouts. For example, idle timeout of 15 minutes, absolute timeout of 24 hours.
   - Provide a server-side logout endpoint that properly destroys the session.
   - Guard against session fixation by issuing a new session on privilege change.

5. Role-Based Access Control (RBAC):
   - Define roles (e.g., `guest`, `user`, `admin`) and assign permissions to each.
   - Enforce authorization checks server-side in Next.js route handlers or middleware. Never rely solely on client-side role checks.
   - Reject unauthorized access with HTTP 403 (Forbidden) and avoid leaking details about available resources.

---

## 2. Input Handling & Output Encoding

1. Server-Side Validation:
   - Validate all form inputs (email, password) using a robust schema validator (e.g., Zod, Joi).
   - Reject requests with missing or malformed fields with HTTP 400 (Bad Request).

2. Prevent Injection Attacks:
   - Use parameterized queries or ORM (e.g., Prisma) when integrating a database.
   - Sanitize any user-supplied data inserted into HTML, SQL, or filesystem paths.

3. Cross-Site Scripting (XSS) Mitigation:
   - Use Next.js’s built-in `next/head` sanitization or a library like DOMPurify when dangerously setting inner HTML.
   - Implement a strong Content Security Policy (CSP) header to restrict sources of scripts, styles, and other resources.

4. Secure Redirects:
   - If redirecting on login or logout, validate the target URL against an allow-list of known safe paths (e.g., `/dashboard`).

5. File Upload Handling (Future Scope):
   - Enforce strict file type and size checks, store uploads outside the webroot, and scan for malware.
   - Use randomized filenames to prevent path traversal.

---

## 3. Data Protection & Privacy

1. Encryption In Transit & At Rest:
   - Enforce HTTPS (TLS 1.2+) for all client-server and server-server communication.
   - If storing data in a database or object storage, enable encryption at rest (e.g., AWS EBS encryption).

2. Secrets Management:
   - Store API keys, database URIs, and JWT secrets in environment variables managed by your deployment platform.
   - Restrict access to these secrets based on the principle of least privilege.

3. Prevent Information Leakage:
   - Return generic error messages to clients (e.g., “Invalid credentials”) and log detailed errors server-side.
   - Mask or redact personally identifiable information (PII) in logs.

4. Secure Database Connections:
   - Use a database user with only the permissions required for normal operations (e.g., read/write on user tables, no DROP).  
   - Enable TLS for connections between Next.js and your database.

5. Privacy Compliance:
   - Collect only necessary PII.  
   - Provide clear cookie and privacy notices; implement mechanisms for data deletion (GDPR/CCPA compliance).

---

## 4. API & Service Security

1. Enforce HTTPS & HSTS:
   - Configure your hosting (Vercel) or reverse proxy to redirect HTTP to HTTPS.
   - Apply `Strict-Transport-Security` header with a high max-age and `includeSubDomains`.

2. Rate Limiting & Throttling:
   - Implement per-IP or per-user rate limits on critical endpoints (authentication, password reset) to mitigate brute-force and DoS attacks.

3. CORS Configuration:
   - Restrict `Access-Control-Allow-Origin` to your known front-end domain(s).
   - Avoid wildcard (`*`) origins on endpoints that process credentials.

4. API Versioning:
   - Prefix API routes with a version (e.g., `/api/v1/auth`) to enable safe, non-breaking changes in the future.

5. Principle of Least Privilege:
   - Give each microservice or function only the permissions it needs (e.g., database read-only vs. read-write).

---

## 5. Web Application Security Hygiene

1. CSRF Protection:
   - Use anti-CSRF tokens for state-changing requests. NextAuth.js provides built-in CSRF protection—verify it’s enabled.

2. Security Headers (via `next.config.js`):
   - Content-Security-Policy: restrict sources of scripts, styles, images, fonts.  
   - X-Content-Type-Options: `nosniff`  
   - X-Frame-Options: `DENY` or `SAMEORIGIN`  
   - Referrer-Policy: `strict-origin-when-cross-origin`

3. Secure Cookies:
   - Always set `HttpOnly` and `Secure` flags.  
   - Consider `SameSite=Strict` for cookies that don’t need cross-site usage.

4. Clickjacking Defense:
   - Use `X-Frame-Options: DENY` or CSP `frame-ancestors 'none'`.

5. Subresource Integrity (SRI):
   - Apply SRI attributes when loading external scripts/styles (if any).  

6. Disable Debug in Production:
   - Remove or disable Next.js debug flags.  
   - Do not expose stack traces or internal endpoints.

---

## 6. Infrastructure & Configuration Management

1. Secure Server Hardening:
   - Disable unused ports/services.  
   - Remove default accounts and change default credentials.

2. Automate Patching & Updates:
   - Keep the OS, Node.js, and npm packages up to date.
   - Subscribe to security bulletins for critical libraries (Next.js, React, Tailwind).

3. CI/CD Security:
   - Integrate SAST (linting) and SCA (npm audit, GitHub Dependabot) in your pipeline.
   - Fail builds on high-severity vulnerabilities.

4. Environment Separation:
   - Maintain distinct environments (development, staging, production) with dedicated credentials.

5. File System Permissions:
   - Restrict read/write permissions to only necessary service accounts.

---

## 7. Dependency Management

1. Vet Third-Party Packages:
   - Choose well-maintained libraries with active security patches (NextAuth.js, Shadcn UI, Tailwind).
   - Review transitive dependencies for known vulnerabilities.

2. Lockfile & Audits:
   - Commit `package-lock.json` and run `npm audit` regularly.
   - Automatically apply minor/patch updates using Dependabot or Renovate.

3. Minimize Attack Surface:
   - Only install packages you actively use.  
   - Remove unused dependencies promptly.


---

### Conclusion
By applying these guidelines, the `bw-landing-tailwind-shadcn` project will adhere to security-by-design principles, minimize risk exposure, and create a robust foundation for future growth. Always review and update security practices periodically to address new threats and architectural changes.

*End of Security Guidelines*