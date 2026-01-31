# Putt Calculator

Golf simulator putting calculator: enter distance (ft), pick a handicap preset (or custom percentages), and get a randomized putt result (1–4 putts) based on make-% and 3-putt % data. Mobile-first PWA with optional accounts (sign up / sign in) to save preset and history.

## Stack

- **Next.js 15** (App Router), React 19, TypeScript, Tailwind CSS
- **PostgreSQL** + **Prisma**
- **Auth.js (NextAuth)** with Credentials provider, sign-up, Prisma adapter
- **PWA:** manifest, service worker (next-pwa), Add to home screen

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and set:

   - `DATABASE_URL` – PostgreSQL connection string (e.g. local Postgres, Neon, Supabase).
   - `AUTH_SECRET` – secret for Auth.js (e.g. `openssl rand -base64 32`).
   - `NEXTAUTH_URL` – app URL (e.g. `http://localhost:3000` for dev).

3. **Database**

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

4. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deployment (self‑hosted)

1. **Build:** `npm run build`
2. **Run:** `npm start` (Next.js listens on port 3000).
3. **Process manager:** Run via **systemd** (or PM2). Example unit:

   ```ini
   [Unit]
   Description=Next.js Putt Calculator

   [Service]
   ExecStart=/usr/bin/npm start
   WorkingDirectory=/var/www/putt-calc
   Restart=always
   User=www-data

   [Install]
   WantedBy=multi-user.target
   ```

4. **Reverse proxy:** Put **nginx** in front, proxy to `http://localhost:3000`. Use Certbot for SSL if needed.

## Scripts

- `npm run dev` – development server
- `npm run build` – production build
- `npm start` – run production server
- `npm run lint` – ESLint

## License

MIT
