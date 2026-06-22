<div align="center">

<img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white" />
<img src="https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel" />

<br/><br/>

<h1>
  <img src="https://img.shields.io/badge/%F0%9F%A9%BA-MEDI--DOC-e11d48?style=flat-square&labelColor=0f172a" height="34"/>
  <br/>
  <sub><i>Full-Stack Healthcare Appointment & Management Platform</i></sub>
</h1>

<p>
  Book consultations with verified specialists, manage prescriptions, track payments, and coordinate care — all in one place.
</p>

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-medicare--connect.vercel.app-e11d48?style=for-the-badge)](https://medicare-connect-ten.vercel.app)
&nbsp;
[![Backend API](https://img.shields.io/badge/🔌%20Backend%20API-backend--nu--rosy.vercel.app-6366f1?style=for-the-badge)](https://backend-nu-rosy-20.vercel.app)

</div>

---

## 📸 Screenshots

### 🏠 Homepage

<table>
  <tr>
    <td align="center" width="70%">
      <strong>Desktop</strong><br/><br/>
      <img src="https://raw.githubusercontent.com/CoderGUY47/medicare-connect/main/frontend/public/assets/Homepage.png" alt="Homepage Desktop" style="border-radius:12px; border: 1px solid #1e293b;" />
    </td>
    <td align="center" width="30%">
      <strong>Mobile</strong><br/><br/>
      <img src="https://raw.githubusercontent.com/CoderGUY47/medicare-connect/main/frontend/public/assets/mobile-homepage.png" alt="Homepage Mobile" style="border-radius:12px; border: 1px solid #1e293b;" />
    </td>
  </tr>
</table>

### 📊 Patient Dashboard

<table>
  <tr>
    <td align="center" width="70%">
      <strong>Desktop</strong><br/><br/>
      <img src="https://raw.githubusercontent.com/CoderGUY47/medicare-connect/main/frontend/public/assets/Dashboard.png" alt="Dashboard Desktop" style="border-radius:12px; border: 1px solid #1e293b;" />
    </td>
    <td align="center" width="30%">
      <strong>Mobile</strong><br/><br/>
      <img src="https://raw.githubusercontent.com/CoderGUY47/medicare-connect/main/frontend/public/assets/mobile-dashboard.png" alt="Dashboard Mobile" style="border-radius:12px; border: 1px solid #1e293b;" />
    </td>
  </tr>
</table>

---

## ✨ Features

### 🧑‍⚕️ For Patients
- 🔍 **Find Doctors** — Search & filter by specialization, fee, availability
- 📅 **Book Appointments** — Real-time slot selection with Stripe payment
- 💊 **Prescriptions** — View electronic prescriptions issued by doctors
- 💳 **Payment History** — Track all consultation payments with spending chart
- 🔔 **Notifications** — Real-time alerts for appointments & payments
- 👤 **Profile Management** — Update personal info, photo, and contact details

### 🩺 For Doctors
- 📋 **Appointment Management** — Confirm, complete, or reject bookings
- 📝 **Issue Prescriptions** — Write and manage patient prescriptions
- 📊 **Earnings Dashboard** — Track consultation revenue and history
- 🏥 **Profile Setup** — Specialization, fees, availability schedule

### 🛡️ For Admins
- 👥 **User Management** — View, search, and suspend all users
- ✅ **Doctor Verification** — Approve or reject doctor applications
- 📈 **Platform Analytics** — Stats overview across all roles
- 🏛️ **Full Oversight** — Manage appointments, payments, and reviews

### 🔐 Authentication
- **Credentials login** (email + password via JWT)
- **Google OAuth** via Better Auth
- **Role-based access** — patient, doctor, admin, nurse, lab, pharmacist

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4 |
| **UI Components** | Radix UI, shadcn/ui, Framer Motion, Recharts |
| **Backend** | Express.js, TypeScript, Node.js |
| **Database** | MongoDB Atlas (via Mongoose + native driver) |
| **Auth** | Better Auth (JWKS), JWT (HTTPOnly cookies) |
| **Payments** | Stripe Checkout (server-side sessions) |
| **Icons** | Lucide React, React Icons |
| **Deployment** | Vercel (frontend + backend as serverless) |

---

## 🗂️ Project Structure

```
medicare-connect/
├── frontend/                  # Next.js 16 App Router
│   ├── src/
│   │   ├── app/               # Pages & API routes
│   │   │   ├── dashboard/     # Role-based dashboards
│   │   │   │   ├── patient/   # Patient pages
│   │   │   │   ├── doctor/    # Doctor pages
│   │   │   │   └── admin/     # Admin pages
│   │   │   ├── find-doctors/  # Doctor search & booking
│   │   │   ├── login/         # Auth pages
│   │   │   └── success/       # Post-payment confirmation
│   │   ├── components/        # Shared UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── NotificationBell.tsx
│   │   │   └── ...
│   │   ├── context/           # AuthContext (global auth state)
│   │   ├── lib/               # mockDb (localStorage + MongoDB sync)
│   │   └── utils/             # backendUrl helper
│   └── public/assets/         # Static assets & screenshots
│
└── backend/                   # Express API server
    └── index.ts               # All routes, middleware, seeding
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Stripe account
- Google OAuth credentials

### 1. Clone the repository
```bash
git clone https://github.com/CoderGUY47/medicare-connect.git
cd medicare-connect
```

### 2. Setup the Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/medi-doc
JWT_SECRET=your_jwt_secret_key
PORT=5000
CLIENT_URL=http://localhost:3000
```

Start the backend:
```bash
npm run dev
```

### 3. Setup the Frontend
```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Start the frontend:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| 🧑‍⚕️ Patient | `patient@gmail.com` | `patient123` |
| 🩺 Doctor | `doctor@gmail.com` | `doctor123` |
| 🛡️ Admin | `admin@gmail.com` | `admin123` |
| 💊 Pharmacist | `pharmacist@gmail.com` | `pharmacist123` |
| 🔬 Lab | `lab@gmail.com` | `lab123` |
| 🏥 Nurse | `nurse@gmail.com` | `nurse123` |

> 💡 Demo accounts are available until **June 29, 2026**. Register for a permanent account anytime.

---

## 💳 Stripe Test Cards

| Card | Number |
|------|--------|
| ✅ Success | `4242 4242 4242 4242` |
| ❌ Decline | `4000 0000 0000 0002` |

Use any future date for expiry and any 3-digit CVV.

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | ❌ | Login with credentials |
| `POST` | `/api/auth/logout` | ❌ | Logout |
| `GET` | `/api/db-dump` | ❌ | Sync all collections |
| `POST` | `/api/db-sync` | ❌ | Push local data to MongoDB |
| `GET` | `/doctors` | ❌ | List all doctors |
| `GET` | `/doctors/:id` | ❌ | Single doctor profile |
| `POST` | `/appointments` | ✅ | Book appointment |
| `GET` | `/appointments/:userId` | ✅ | Get user appointments |
| `GET` | `/payments/:userId` | ✅ | Get payment history |
| `POST` | `/payment-confirm` | ❌ | Stripe webhook sync |
| `GET` | `/reviews/:doctorId` | ❌ | Get doctor reviews |
| `POST` | `/reviews` | ✅ | Submit review |
| `GET` | `/users` | ✅ Admin | All users |

---

## 🧩 Key Architectural Decisions

- **Hybrid Storage**: Data is stored in both `localStorage` (fast reads) and MongoDB (persistence). They sync bidirectionally — the backend is the source of truth but locally added records (e.g. just-paid appointments) are merged, not overwritten.
- **Seed Guarantee**: Seed appointments and payments for demo accounts are always injected if missing, ensuring a rich demo experience on every reload.
- **SSR-safe Charts**: Recharts `ResponsiveContainer` is wrapped with a `mounted` guard and explicit-height parent div to prevent the `width(-1)` SSR error.
- **JWT + JWKS**: Custom credentials use server-signed JWTs stored as HTTPOnly cookies. Google OAuth tokens are validated via JWKS (Better Auth's public key endpoint).

---

## 📦 Deployment

Both the frontend and backend are deployed on **Vercel**:

| Service | URL |
|---------|-----|
| Frontend | `https://medicare-connect-ten.vercel.app` |
| Backend API | `https://backend-nu-rosy-20.vercel.app` |

The backend runs as a serverless Express function via Vercel's Node.js runtime.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p>Built with ❤️ using Next.js, MongoDB & Stripe</p>
  <p>
    <a href="https://medicare-connect-ten.vercel.app">🌐 Live Demo</a> ·
    <a href="https://github.com/CoderGUY47/medicare-connect/issues">🐛 Report Bug</a> ·
    <a href="https://github.com/CoderGUY47/medicare-connect/issues">✨ Request Feature</a>
  </p>
</div>
