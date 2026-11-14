# Deployment & Local Operations Guide — StudyQuest AI

## 1. System Requirements
- **Operating System**: Windows 10/11, macOS 12+, or modern Linux (Ubuntu 22.04+).
- **Node.js**: v18.18.0 or newer (v20+ or v24 LTS recommended).
- **Package Manager**: `npm` (v10+).

---

## 2. Windows Local Development Setup

### Step 1: Clone / Navigate to Directory
```powershell
cd "c:\Users\steve\OneDrive\Desktop\study app"
```

### Step 2: Environment Configuration
Copy the template to your local environment file:
```powershell
Copy-Item .env.example .env.local
```
*(No external secrets or keys are required for Phase 1 local development.)*

### Step 3: Install Dependencies
```powershell
npm.cmd install
```

### Step 4: Run the Development Server
```powershell
npm.cmd run dev
```
Open your browser to: **`http://localhost:3000`**

### Step 5: Execute Test Suites
```powershell
# Run unit & integration tests
npm.cmd run test

# Run tests with interactive UI
npm.cmd run test:ui

# Run Playwright E2E tests
npm.cmd run test:e2e
```

---

## 3. Production Deployment Architecture

### A. Vercel / Cloudflare / Node Platform (Recommended)
1. Link GitHub repository to Vercel or modern Node hosting provider.
2. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
3. Configure Environment Variables in the provider dashboard:
   - `DATABASE_URL` (PostgreSQL connection string for Phase 2)
   - `GEMINI_API_KEY` (Server-side Gemini AI key for Phase 3)
   - `STRIPE_SECRET_KEY` & `STRIPE_WEBHOOK_SECRET` (Phase 6)
   - `NEXTAUTH_SECRET` (Phase 2 authentication)

### B. Docker Container Deployment
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```
