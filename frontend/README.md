# MediCare Connect

[![Next.js](https://img.shields.io/badge/Next.js-15%2B-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)

**MediCare Connect** is a production-grade healthcare appointment and prescription coordinator portal designed for Patients, Doctors, and Administrators.

This repository houses the **Next.js** application. The codebase handles local JWT authentication cookie simulations, responsive sidebar layouts, Stripe checkout simulations, Recharts analytics, and clinic calendars.

---

## Key Features

### Public Portal

- **Home Page**: Search boxes with category tabs, testimonials sliders, dynamic statistics tracker.
- **Find Doctors**: Advanced search filters using **300ms debounce** (name & specialization), fee/experience sorting, and pagination (10 items per page).
- **Specialist Detail**: Availability calendars showing days/slots, symptoms questionnaire forms, and patient review logs.

### Patient Dashboard (`/dashboard/patient`)

- **Overview**: Stat metrics cards + nearest scheduled consultations info.
- **My Appointments**: CRUD schedules panel with cancellations, rescheduling forms, and digital prescription receipt views.
- **Payment History**: Logging of consultation fees, transaction IDs, and dates.
- **My Reviews**: CRUD reviews manager rating clinical consults.
- **Profile Manager**: Form editing names, phone, and profile photos.

### Doctor Dashboard (`/dashboard/doctor`)

- **Overview**: Today's appointment schedules list and reviews panel.
- **Schedule Planner**: Add/remove calendar available days and consultation hour slots.
- **Booking Requests**: Accept/reject/complete appointments. Complete transitions directly to writing prescriptions.
- **Prescription Writer**: Form fields drafting clinical diagnoses, medications lists, and guidelines notes.

### Admin Dashboard (`/dashboard/admin`)

- **Overview Analytics**: Dynamic Recharts rendering line/bar/pie charts (revenue trends, appointment status ratio, doctor fees).
- **Users Manager**: Suspend, activate, or permanently delete accounts.
- **Doctors Auditor**: Audit and verify clinic practitioners.

---

## Demo Credentials & Mock DB

To facilitate immediate testing without setting up databases and payment keys, the application initiates with a local storage-backed **Mock Database** populated with realistic seeds (Dr. Sarah Jenkins, Jane Doe, Admin Sarah Connor, written reviews, past appointments, prescriptions).

You can swap roles instantly during evaluation using the floating **Demo Role Switcher** widget in the bottom-right corner!

### Preset Accounts

- **Admin**: `admin@medicare.com` / `admin123`
- **Patient**: `patient@medicare.com` / `patient123`
- **Doctor**: `jenkins@medicare.com` / `doctor123`

---

## Local Setup & Installation

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies (using legacy-peer-deps for React 19 libraries sync):

   ```bash
   npm install --legacy-peer-deps
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Access in browser: [http://localhost:3000](http://localhost:3000)

---

## Environment Variables List

Create a `.env.local` file in the root of the `frontend` folder containing the following keys (values are simulated locally for this demonstration phase):

```env
# Frontend Next Auth & API Config
NEXT_PUBLIC_API_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# OAuth Credentials
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Payments Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Database Settings (For Backend Integration)
DB_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
```

---

## JWT Cookie Persist Mechanism

To satisfy production-grade security and session persistence:

1. When a user submits registration or logs in, a simulated **JWT token** is generated.
2. The payload is encrypted with standard header-body-signature signatures.
3. Access and Refresh tokens are stored directly in the client's **cookies** (`mc_jwt_token` and `mc_user_email`) rather than volatile `localStorage` or `sessionStorage` scripts.
4. On browser reload, the cookies are sent and verified. This prevents session loss on page refresh.
5. Suspending a user immediately flags their profile state; any subsequent reload or operation detects the status and terminates active JWT cookies.
