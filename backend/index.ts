import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { createRemoteJWKSet, jwtVerify } from "jose";

dotenv.config();

const uri = process.env.MONGODB_URI;
const app = express();
const PORT = process.env.PORT || 5000;

// setup global cors and json body parsing middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());

// create a mongo client
const client = new MongoClient(uri!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// define database collections at the top level
const db = client.db("medi-doc");
const usersCollection = db.collection("users");
const doctorsCollection = db.collection("doctors");
const appointmentsCollection = db.collection("appointments");
const reviewsCollection = db.collection("reviews");
const paymentsCollection = db.collection("payments");
const prescriptionsCollection = db.collection("prescriptions");

// initialize jwks from auth server
const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL || 'http://localhost:3000'}/api/auth/jwks`),
);

// verify token middleware using only const and descriptive Banglish variable names
const verifyToken = async (request: Request, response: Response, next: NextFunction) => {
  const authChabi = request.headers.authorization;
  const mathaToken = (authChabi && authChabi.startsWith("Bearer ")) 
    ? authChabi.split(" ")[1] 
    : null;

  const biskutHeader = request.headers.cookie;
  const sobBiskut: Record<string, string> = biskutHeader 
    ? biskutHeader.split(";").reduce((accumulator: Record<string, string>, cookieString) => {
        const [cookieKey, cookieValue] = cookieString.trim().split("=");
        accumulator[cookieKey] = cookieValue;
        return accumulator;
      }, {}) 
    : {};
  
  const biskutToken = sobBiskut["token"] || null;
  const choltiToken = mathaToken || biskutToken;

  if (!choltiToken) {
    return response.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Verify the active token
  try {
    // Attempt local JWT secret validation first (cookie-based flow)
    try {
      const khojaUser = jwt.verify(choltiToken, process.env.JWT_SECRET || "medidoc_jwt_secret_key");
      (request as any).user = khojaUser;
      return next();
    } catch (jwtBhul) {
      // Fallback: Validate with JWKS signature directory (Better Auth token flow)
      const { payload: jwksUser } = await jwtVerify(choltiToken, JWKS);
      (request as any).user = jwksUser;
      return next();
    }
  } catch (authBhul) {
    return response.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

// Helper middleware to check for authorized roles
const verifyRole = (roles: string[]) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const user = (request as any).user;
    if (!user || !roles.includes(user.role)) {
      return response.status(403).json({ error: "Forbidden: Access denied for this role" });
    }
    return next();
  };
};

// Seeding function for all demo role accounts and all 30 doctors
const seedStaticUsers = async () => {
  try {
    const staticUsers = [
      {
        id: 'admin-1',
        name: 'Admin',
        email: 'admin@gmail.com',
        role: 'admin',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        phone: '+880 1555-019283',
        gender: 'female',
        status: 'active',
        createdAt: '2026-01-01T00:00:00.000Z',
        password: 'admin123'
      },
      {
        id: 'doc-1',
        name: 'Dr. Sarah Jahan',
        email: 'doctor@gmail.com',
        role: 'doctor',
        photo: '/assets/doctors/dr_sarah_jenkins.png',
        phone: '+880 1711-014998',
        gender: 'female',
        status: 'active',
        createdAt: '2026-01-10T00:00:00.000Z',
        password: 'doctor123'
      },
      {
        id: 'pat-1',
        name: 'Jannatul Ferdous',
        email: 'patient@gmail.com',
        role: 'patient',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        phone: '+880 1711-012345',
        gender: 'female',
        status: 'active',
        createdAt: '2026-05-01T00:00:00.000Z',
        password: 'patient123'
      },
      {
        id: 'nurse-1',
        name: 'Mary Begum',
        email: 'nurse@gmail.com',
        role: 'nurse',
        photo: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=200',
        phone: '+880 1711-018927',
        gender: 'female',
        status: 'active',
        createdAt: '2026-06-01T00:00:00.000Z',
        password: 'nurse123'
      },
      {
        id: 'lab-1',
        name: 'Dr. Jonathan Islam',
        email: 'lab@gmail.com',
        role: 'lab',
        photo: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=200',
        phone: '+880 1711-011884',
        gender: 'male',
        status: 'active',
        createdAt: '2026-06-02T00:00:00.000Z',
        password: 'lab123'
      },
      {
        id: 'pharm-1',
        name: 'Dr. Robert Biswas',
        email: 'pharmacist@gmail.com',
        role: 'pharmacist',
        photo: 'https://images.unsplash.com/photo-1563211124-73a811d7c368?auto=format&fit=crop&q=80&w=200',
        phone: '+880 1711-019332',
        gender: 'male',
        status: 'active',
        createdAt: '2026-06-03T00:00:00.000Z',
        password: 'pharmacist123'
      },
      // Additional doctor users (doc-2 to doc-30)
      { id: 'doc-2', name: 'Dr. Arjun Talukdar', email: 'patel@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_arjun_patel.png', phone: '+880 1711-016772', gender: 'male', status: 'active', createdAt: '2026-02-12T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-3', name: 'Dr. Elena Rostova', email: 'rostova@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_elena_rostova.png', phone: '+880 1711-018334', gender: 'female', status: 'active', createdAt: '2026-03-01T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-4', name: 'Dr. Michael Chowdhury', email: 'chen@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_michael_chen.png', phone: '+880 1711-011445', gender: 'male', status: 'active', createdAt: '2026-04-15T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-5', name: 'Dr. Sophia Martinez', email: 'martinez@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_sophia_martinez.png', phone: '+880 1711-012990', gender: 'female', status: 'active', createdAt: '2026-04-20T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-6', name: 'Dr. David Shikdar', email: 'kim@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_david_kim.png', phone: '+880 1711-013881', gender: 'male', status: 'active', createdAt: '2026-05-01T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-7', name: 'Dr. Aisha Siddika', email: 'diallo@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_aisha_diallo.png', phone: '+880 1711-014772', gender: 'female', status: 'active', createdAt: '2026-05-15T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-8', name: 'Dr. James Halder', email: 'wilson@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_james_wilson.png', phone: '+880 1711-015663', gender: 'male', status: 'active', createdAt: '2026-05-20T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-9', name: 'Dr. Emily Mojumder', email: 'taylor@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_emily_taylor.png', phone: '+880 1711-016554', gender: 'female', status: 'active', createdAt: '2026-06-01T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-10', name: 'Dr. Marcus Vance', email: 'vance@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_marcus_vance.png', phone: '+880 1711-017445', gender: 'male', status: 'active', createdAt: '2026-06-10T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-11', name: 'Dr. Tanvir Hasan', email: 'tanvir@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_sarah_jenkins.png', phone: '+880 1711-000011', gender: 'male', status: 'active', createdAt: '2026-06-15T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-12', name: 'Dr. Tasnim Jahan', email: 'tasnim@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_elena_rostova.png', phone: '+880 1711-000012', gender: 'female', status: 'active', createdAt: '2026-06-15T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-13', name: 'Dr. Mehzabin Chowdhury', email: 'mehzabin@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_aisha_diallo.png', phone: '+880 1711-000013', gender: 'female', status: 'active', createdAt: '2026-06-15T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-14', name: 'Dr. Sajjadul Islam', email: 'sajjad@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_michael_chen.png', phone: '+880 1711-000014', gender: 'male', status: 'active', createdAt: '2026-06-15T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-15', name: 'Dr. Fariha Sultana', email: 'fariha@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_sophia_martinez.png', phone: '+880 1711-000015', gender: 'female', status: 'active', createdAt: '2026-06-15T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-16', name: 'Dr. Rashedul Bari', email: 'rashed@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_arjun_patel.png', phone: '+880 1711-000016', gender: 'male', status: 'active', createdAt: '2026-06-15T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-17', name: 'Dr. Nusrat Sharmin', email: 'nusrat@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_emily_taylor.png', phone: '+880 1711-000017', gender: 'female', status: 'active', createdAt: '2026-06-15T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-18', name: 'Dr. Mahmudul Hasan', email: 'mahmud@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_david_kim.png', phone: '+880 1711-000018', gender: 'male', status: 'active', createdAt: '2026-06-15T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-19', name: 'Dr. Nishat Anjum', email: 'nishat@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_sarah_jenkins.png', phone: '+880 1711-000019', gender: 'female', status: 'active', createdAt: '2026-06-15T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-20', name: 'Dr. Arifur Rahman', email: 'arif@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_marcus_vance.png', phone: '+880 1711-000020', gender: 'male', status: 'active', createdAt: '2026-06-15T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-21', name: 'Dr. Zahidul Islam', email: 'zahid@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_james_wilson.png', phone: '+880 1711-000021', gender: 'male', status: 'active', createdAt: '2026-06-15T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-22', name: 'Dr. Sadia Afrin', email: 'sadia@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_elena_rostova.png', phone: '+880 1711-000022', gender: 'female', status: 'active', createdAt: '2026-06-15T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-23', name: 'Dr. Kamrul Hasan', email: 'kamrul@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_arjun_patel.png', phone: '+880 1711-000023', gender: 'male', status: 'active', createdAt: '2026-06-15T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-24', name: 'Dr. Tanzila Rahman', email: 'tanzila@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_sophia_martinez.png', phone: '+880 1711-000024', gender: 'female', status: 'active', createdAt: '2026-06-15T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-25', name: 'Dr. Ashraful Alam', email: 'ashraful@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_michael_chen.png', phone: '+880 1711-000025', gender: 'male', status: 'active', createdAt: '2026-06-15T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-26', name: 'Dr. Rehana Parveen', email: 'rehana@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_aisha_diallo.png', phone: '+880 1711-000026', gender: 'female', status: 'active', createdAt: '2026-06-15T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-27', name: 'Dr. Fatema Zohra', email: 'fatema@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_emily_taylor.png', phone: '+880 1711-000027', gender: 'female', status: 'active', createdAt: '2026-06-15T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-28', name: 'Dr. Mustafizur Rahman', email: 'mustafiz@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_david_kim.png', phone: '+880 1711-000028', gender: 'male', status: 'active', createdAt: '2026-06-15T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-29', name: 'Dr. Sabrina Sultana', email: 'sabrina@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_sarah_jenkins.png', phone: '+880 1711-000029', gender: 'female', status: 'active', createdAt: '2026-06-15T00:00:00.000Z', password: 'doctor123' },
      { id: 'doc-30', name: 'Dr. Hasibul Islam', email: 'hasibul@medi-doc.com', role: 'doctor', photo: '/assets/doctors/dr_marcus_vance.png', phone: '+880 1711-000030', gender: 'male', status: 'active', createdAt: '2026-06-15T00:00:00.000Z', password: 'doctor123' },
      // Additional patient users
      { id: 'pat-2', name: 'Imtiaz Ahmed', email: 'smith@medi-doc.com', role: 'patient', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', phone: '+880 1711-015678', gender: 'male', status: 'active', createdAt: '2026-05-10T00:00:00.000Z', password: 'patient123' }
    ];

    for (const u of staticUsers) {
      const exists = await usersCollection.findOne({ email: u.email });
      if (!exists) {
        await usersCollection.insertOne(u);
      } else {
        await usersCollection.updateOne({ email: u.email }, { $set: { password: u.password, name: u.name, role: u.role } });
      }
    }

    // Seed all 30 doctors into the doctors collection
    const allDoctors = [
      { id: 'doc-1', userId: 'doc-1', doctorName: 'Dr. Sarah Jahan', specialization: 'Cardiology', qualifications: 'MD, FACC - Harvard Medical School', experience: 14, consultationFee: 750, hospitalName: 'Dhaka Medical College Hospital', profileImage: '/assets/doctors/dr_sarah_jenkins.png', availableDays: ['Monday', 'Wednesday', 'Friday'], availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-2', userId: 'doc-2', doctorName: 'Dr. Arjun Talukdar', specialization: 'Pediatrics', qualifications: 'MD, DCH - Johns Hopkins University', experience: 10, consultationFee: 500, hospitalName: 'Dhaka Shishu Hospital', profileImage: '/assets/doctors/dr_arjun_patel.png', availableDays: ['Tuesday', 'Thursday'], availableSlots: ['09:30 AM', '10:30 AM', '01:30 PM', '02:30 PM', '04:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-3', userId: 'doc-3', doctorName: 'Dr. Elena Rostova', specialization: 'Dermatology', qualifications: 'MD, PhD - Stanford University', experience: 12, consultationFee: 600, hospitalName: 'Square Hospital', profileImage: '/assets/doctors/dr_elena_rostova.png', availableDays: ['Monday', 'Tuesday', 'Thursday'], availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-4', userId: 'doc-4', doctorName: 'Dr. Michael Chowdhury', specialization: 'Neurology', qualifications: 'MD - UCSF School of Medicine', experience: 8, consultationFee: 950, hospitalName: 'National Institute of Neurosciences', profileImage: '/assets/doctors/dr_michael_chen.png', availableDays: ['Wednesday', 'Friday'], availableSlots: ['10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-5', userId: 'doc-5', doctorName: 'Dr. Sophia Martinez', specialization: 'Orthopedics', qualifications: 'MD - Harvard Medical School', experience: 11, consultationFee: 700, hospitalName: 'NITOR (Pangu Hospital)', profileImage: '/assets/doctors/dr_sophia_martinez.png', availableDays: ['Tuesday', 'Thursday', 'Friday'], availableSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-6', userId: 'doc-6', doctorName: 'Dr. David Shikdar', specialization: 'General Medicine', qualifications: 'MD - Yale School of Medicine', experience: 7, consultationFee: 450, hospitalName: 'Dhaka Medical College Hospital', profileImage: '/assets/doctors/dr_david_kim.png', availableDays: ['Monday', 'Wednesday', 'Friday'], availableSlots: ['08:30 AM', '10:30 AM', '01:30 PM', '03:30 PM'], verificationStatus: 'verified' },
      { id: 'doc-7', userId: 'doc-7', doctorName: 'Dr. Aisha Siddika', specialization: 'Gynecology', qualifications: 'MD, FACOG - Johns Hopkins University', experience: 15, consultationFee: 800, hospitalName: 'Dhaka Medical College Hospital', profileImage: '/assets/doctors/dr_aisha_diallo.png', availableDays: ['Monday', 'Tuesday', 'Thursday'], availableSlots: ['09:00 AM', '10:00 AM', '01:00 PM', '03:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-8', userId: 'doc-8', doctorName: 'Dr. James Halder', specialization: 'Oncology', qualifications: 'MD, PhD - Columbia University', experience: 16, consultationFee: 1000, hospitalName: 'Ahsania Mission Cancer Hospital', profileImage: '/assets/doctors/dr_james_wilson.png', availableDays: ['Wednesday', 'Thursday', 'Friday'], availableSlots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-9', userId: 'doc-9', doctorName: 'Dr. Emily Mojumder', specialization: 'Psychiatry', qualifications: 'MD - UPenn Perelman School of Medicine', experience: 9, consultationFee: 650, hospitalName: 'NIMH', profileImage: '/assets/doctors/dr_emily_taylor.png', availableDays: ['Monday', 'Tuesday', 'Wednesday'], availableSlots: ['09:00 AM', '10:30 AM', '01:30 PM', '03:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-10', userId: 'doc-10', doctorName: 'Dr. Marcus Vance', specialization: 'Gastroenterology', qualifications: 'MD - Mayo Clinic College of Medicine', experience: 13, consultationFee: 750, hospitalName: 'BIRDEM General Hospital', profileImage: '/assets/doctors/dr_marcus_vance.png', availableDays: ['Tuesday', 'Thursday'], availableSlots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-11', userId: 'doc-11', doctorName: 'Dr. Tanvir Hasan', specialization: 'Cardiology', qualifications: 'MBBS, FCPS - Cardiology specialist', experience: 12, consultationFee: 800, hospitalName: 'NICVD', profileImage: '/assets/doctors/dr_sarah_jenkins.png', availableDays: ['Monday', 'Wednesday', 'Friday'], availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-12', userId: 'doc-12', doctorName: 'Dr. Tasnim Jahan', specialization: 'Pediatrics', qualifications: 'MBBS, MD (Pediatrics) - Child health specialist', experience: 8, consultationFee: 500, hospitalName: 'BSMMU', profileImage: '/assets/doctors/dr_elena_rostova.png', availableDays: ['Tuesday', 'Thursday'], availableSlots: ['09:30 AM', '10:30 AM', '01:30 PM', '02:30 PM'], verificationStatus: 'verified' },
      { id: 'doc-13', userId: 'doc-13', doctorName: 'Dr. Mehzabin Chowdhury', specialization: 'Dermatology', qualifications: 'MBBS, DDV - Skin specialist', experience: 9, consultationFee: 600, hospitalName: 'Ibn Sina Hospital', profileImage: '/assets/doctors/dr_aisha_diallo.png', availableDays: ['Monday', 'Tuesday', 'Thursday'], availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-14', userId: 'doc-14', doctorName: 'Dr. Sajjadul Islam', specialization: 'Neurology', qualifications: 'MBBS, MD (Neurology) - Brain specialist', experience: 11, consultationFee: 950, hospitalName: 'National Institute of Neurosciences', profileImage: '/assets/doctors/dr_michael_chen.png', availableDays: ['Wednesday', 'Friday'], availableSlots: ['10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-15', userId: 'doc-15', doctorName: 'Dr. Fariha Sultana', specialization: 'Orthopedics', qualifications: 'MBBS, MS (Ortho) - Bone & joint specialist', experience: 10, consultationFee: 700, hospitalName: 'NITOR (Pangu Hospital)', profileImage: '/assets/doctors/dr_sophia_martinez.png', availableDays: ['Tuesday', 'Thursday', 'Friday'], availableSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-16', userId: 'doc-16', doctorName: 'Dr. Rashedul Bari', specialization: 'General Medicine', qualifications: 'MBBS, FCPS - General medicine practitioner', experience: 6, consultationFee: 400, hospitalName: 'Dhaka Medical College Hospital', profileImage: '/assets/doctors/dr_arjun_patel.png', availableDays: ['Monday', 'Wednesday', 'Friday'], availableSlots: ['08:30 AM', '10:30 AM', '01:30 PM', '03:30 PM'], verificationStatus: 'verified' },
      { id: 'doc-17', userId: 'doc-17', doctorName: 'Dr. Nusrat Sharmin', specialization: 'Gynecology', qualifications: 'MBBS, MS (Gynae) - Gynecologist & surgeon', experience: 13, consultationFee: 850, hospitalName: 'Dhaka Medical College Hospital', profileImage: '/assets/doctors/dr_emily_taylor.png', availableDays: ['Monday', 'Tuesday', 'Thursday'], availableSlots: ['09:00 AM', '10:00 AM', '01:00 PM', '03:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-18', userId: 'doc-18', doctorName: 'Dr. Mahmudul Hasan', specialization: 'Oncology', qualifications: 'MBBS, MD (Oncology) - Cancer specialist', experience: 14, consultationFee: 1000, hospitalName: 'National Cancer Research Institute', profileImage: '/assets/doctors/dr_david_kim.png', availableDays: ['Wednesday', 'Thursday', 'Friday'], availableSlots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-19', userId: 'doc-19', doctorName: 'Dr. Nishat Anjum', specialization: 'Psychiatry', qualifications: 'MBBS, FCPS (Psychiatry) - Mental health consultant', experience: 7, consultationFee: 750, hospitalName: 'NIMH', profileImage: '/assets/doctors/dr_sarah_jenkins.png', availableDays: ['Monday', 'Tuesday', 'Wednesday'], availableSlots: ['09:00 AM', '10:30 AM', '01:30 PM', '03:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-20', userId: 'doc-20', doctorName: 'Dr. Arifur Rahman', specialization: 'Gastroenterology', qualifications: 'MBBS, MD (Gastro) - Stomach & liver specialist', experience: 12, consultationFee: 900, hospitalName: 'BIRDEM General Hospital', profileImage: '/assets/doctors/dr_marcus_vance.png', availableDays: ['Tuesday', 'Thursday'], availableSlots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-21', userId: 'doc-21', doctorName: 'Dr. Zahidul Islam', specialization: 'Cardiology', qualifications: 'MBBS, MD - Cardiology specialist', experience: 13, consultationFee: 850, hospitalName: 'NICVD', profileImage: '/assets/doctors/dr_james_wilson.png', availableDays: ['Monday', 'Wednesday', 'Friday'], availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-22', userId: 'doc-22', doctorName: 'Dr. Sadia Afrin', specialization: 'Pediatrics', qualifications: 'MBBS, DCH - Pediatrician', experience: 9, consultationFee: 550, hospitalName: 'Dhaka Shishu Hospital', profileImage: '/assets/doctors/dr_elena_rostova.png', availableDays: ['Tuesday', 'Thursday'], availableSlots: ['09:30 AM', '10:30 AM', '01:30 PM', '02:30 PM'], verificationStatus: 'verified' },
      { id: 'doc-23', userId: 'doc-23', doctorName: 'Dr. Kamrul Hasan', specialization: 'Dermatology', qualifications: 'MBBS, FCPS - Skin & allergy consultant', experience: 10, consultationFee: 700, hospitalName: 'Square Hospital', profileImage: '/assets/doctors/dr_arjun_patel.png', availableDays: ['Monday', 'Tuesday', 'Thursday'], availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-24', userId: 'doc-24', doctorName: 'Dr. Tanzila Rahman', specialization: 'Neurology', qualifications: 'MBBS, FCPS (Neuro) - Brain surgeon & specialist', experience: 12, consultationFee: 900, hospitalName: 'National Institute of Neurosciences', profileImage: '/assets/doctors/dr_sophia_martinez.png', availableDays: ['Wednesday', 'Friday'], availableSlots: ['10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-25', userId: 'doc-25', doctorName: 'Dr. Ashraful Alam', specialization: 'Orthopedics', qualifications: 'MBBS, D-Ortho - Orthopedic specialist', experience: 9, consultationFee: 650, hospitalName: 'NITOR (Pangu Hospital)', profileImage: '/assets/doctors/dr_michael_chen.png', availableDays: ['Tuesday', 'Thursday', 'Friday'], availableSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-26', userId: 'doc-26', doctorName: 'Dr. Rehana Parveen', specialization: 'General Medicine', qualifications: 'MBBS, BCS - Medicine specialist', experience: 8, consultationFee: 450, hospitalName: 'Sir Salimullah Medical College', profileImage: '/assets/doctors/dr_aisha_diallo.png', availableDays: ['Monday', 'Wednesday', 'Friday'], availableSlots: ['08:30 AM', '10:30 AM', '01:30 PM', '03:30 PM'], verificationStatus: 'verified' },
      { id: 'doc-27', userId: 'doc-27', doctorName: 'Dr. Fatema Zohra', specialization: 'Gynecology', qualifications: 'MBBS, DGO - Gynecology & obstetrics specialist', experience: 11, consultationFee: 750, hospitalName: 'Dhaka Medical College Hospital', profileImage: '/assets/doctors/dr_emily_taylor.png', availableDays: ['Monday', 'Tuesday', 'Thursday'], availableSlots: ['09:00 AM', '10:00 AM', '01:00 PM', '03:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-28', userId: 'doc-28', doctorName: 'Dr. Mustafizur Rahman', specialization: 'Oncology', qualifications: 'MBBS, FCPS (Onco) - Cancer physician', experience: 15, consultationFee: 950, hospitalName: 'Ahsania Mission Cancer Hospital', profileImage: '/assets/doctors/dr_david_kim.png', availableDays: ['Wednesday', 'Thursday', 'Friday'], availableSlots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-29', userId: 'doc-29', doctorName: 'Dr. Sabrina Sultana', specialization: 'Psychiatry', qualifications: 'MBBS, MD - Psychiatry consultant', experience: 8, consultationFee: 800, hospitalName: 'NIMH', profileImage: '/assets/doctors/dr_sarah_jenkins.png', availableDays: ['Monday', 'Tuesday', 'Wednesday'], availableSlots: ['09:00 AM', '10:30 AM', '01:30 PM', '03:00 PM'], verificationStatus: 'verified' },
      { id: 'doc-30', userId: 'doc-30', doctorName: 'Dr. Hasibul Islam', specialization: 'Gastroenterology', qualifications: 'MBBS, FCPS - Gastromedicine consultant', experience: 10, consultationFee: 850, hospitalName: 'BIRDEM General Hospital', profileImage: '/assets/doctors/dr_marcus_vance.png', availableDays: ['Tuesday', 'Thursday'], availableSlots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:00 PM'], verificationStatus: 'verified' }
    ];

    for (const doc of allDoctors) {
      const exists = await doctorsCollection.findOne({ id: doc.id });
      if (!exists) {
        await doctorsCollection.insertOne(doc);
      } else {
        await doctorsCollection.updateOne(
          { id: doc.id },
          { $set: { doctorName: doc.doctorName, specialization: doc.specialization, consultationFee: doc.consultationFee, hospitalName: doc.hospitalName, verificationStatus: doc.verificationStatus } }
        );
      }
    }
    console.log(`Seeded/verified ${allDoctors.length} doctors in MongoDB.`);
  } catch (err) {
    console.error("Error seeding static users:", err);
  }
};

// asynchronous connection starter
async function run(): Promise<void> {
  try {
    // connect the client to the server
    await client.connect();
    // send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );

    // Seed database static accounts
    const dbUsers = await usersCollection.find({}).toArray();
    const dbDoctors = await doctorsCollection.find({}).toArray();
    const hasBengaliNames = dbUsers.some(u => /[\u0985-\u09B9\u09C0-\u09E3]/.test(u.name || '')) ||
                             dbDoctors.some(d => /[\u0985-\u09B9\u09C0-\u09E3]/.test(d.doctorName || ''));
    if (hasBengaliNames) {
      console.log("Detected native Bengali letters in MongoDB. Wiping database collections to force clean English-transliterated seeding...");
      await usersCollection.deleteMany({});
      await doctorsCollection.deleteMany({});
      await appointmentsCollection.deleteMany({});
      await reviewsCollection.deleteMany({});
      await paymentsCollection.deleteMany({});
      await prescriptionsCollection.deleteMany({});
    }

    await seedStaticUsers();
  } catch (error) {
    console.error("Database connection failed on startup:", error);
  }
}

// start database connection asynchronously
run().catch(console.dir);

// root route
app.get("/", (req: Request, res: Response) => {
  res.send("Medi-Doc server is running");
});



// Database Sync Endpoint (frontend pushes updates here)
app.post("/api/db-sync", async (req: Request, res: Response) => {
  try {
    const { collection, data } = req.body;
    if (!collection || !Array.isArray(data)) {
      return res.status(400).json({ error: "Invalid collection or data" });
    }

    let col;
    if (collection === "users") col = usersCollection;
    else if (collection === "doctors") col = doctorsCollection;
    else if (collection === "appointments") col = appointmentsCollection;
    else if (collection === "reviews") col = reviewsCollection;
    else if (collection === "payments") col = paymentsCollection;
    else if (collection === "prescriptions") col = prescriptionsCollection;

    if (!col) {
      return res.status(400).json({ error: "Unknown collection" });
    }

    // Clear old data and insert synced records
    await col.deleteMany({});
    if (data.length > 0) {
      const docs = data.map((item: any) => {
        const doc = { ...item };
        if (doc._id) {
          try {
            if (ObjectId.isValid(doc._id)) {
              doc._id = new ObjectId(doc._id);
            } else {
              delete doc._id;
            }
          } catch (_) {
            delete doc._id;
          }
        }
        return doc;
      });
      await col.insertMany(docs);
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to sync collection", details: error.message });
  }
});

// Database Dump Endpoint (frontend pulls database on reload)
app.get("/api/db-dump", async (req: Request, res: Response) => {
  try {
    const staticEmails = [
      "admin@gmail.com",
      "patient@gmail.com",
      "doctor@gmail.com",
      "nurse@gmail.com",
      "lab@gmail.com",
      "pharmacist@gmail.com"
    ];
    const expiryDate = new Date("2026-06-29T12:35:24+06:00");
    const isExpired = new Date() > expiryDate;

    let users = await usersCollection.find({}).toArray();
    if (isExpired) {
      users = users.map(u => {
        if (staticEmails.includes(u.email.toLowerCase())) {
          return { ...u, status: "suspended" };
        }
        return u;
      });
    }

    const doctors = await doctorsCollection.find({}).toArray();
    const appointments = await appointmentsCollection.find({}).toArray();
    const reviews = await reviewsCollection.find({}).toArray();
    const payments = await paymentsCollection.find({}).toArray();
    const prescriptions = await prescriptionsCollection.find({}).toArray();

    res.json({ users, doctors, appointments, reviews, payments, prescriptions });
  } catch (error) {
    res.status(500).json({ error: "Failed to dump database" });
  }
});

// Dynamic pre-filled credentials for roles
app.get("/api/auth/demo-credentials", async (req: Request, res: Response) => {
  try {
    const staticEmails = [
      "admin@gmail.com",
      "patient@gmail.com",
      "doctor@gmail.com",
      "nurse@gmail.com",
      "lab@gmail.com",
      "pharmacist@gmail.com"
    ];
    
    const expiryDate = new Date("2026-06-29T12:35:24+06:00");
    const isExpired = new Date() > expiryDate;
    
    if (isExpired) {
      return res.json([]);
    }

    const dbUsers = await usersCollection.find({ email: { $in: staticEmails } }).toArray();
    const result = dbUsers.map(u => ({
      role: u.role,
      email: u.email,
      pw: u.password || "password123"
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch credentials" });
  }
});

// login endpoint - generates JWT token and stores in HTTPOnly cookie
app.post("/api/auth/login", async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).json({ error: "Email and password are required" });
    }

    const staticEmails = [
      "admin@gmail.com",
      "patient@gmail.com",
      "doctor@gmail.com",
      "nurse@gmail.com",
      "lab@gmail.com",
      "pharmacist@gmail.com"
    ];

    if (staticEmails.includes(email.toLowerCase())) {
      const expiryDate = new Date("2026-06-29T12:35:24+06:00");
      if (new Date() > expiryDate) {
        return response.status(403).json({ error: "Demo credentials expired. Static role accounts are no longer active." });
      }
    }

    // Find authenticated user record in database
    const milDeyaUser = await usersCollection.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (!milDeyaUser) {
      return response.status(401).json({ error: "Invalid credentials" });
    }

    if (milDeyaUser.password && milDeyaUser.password !== password) {
      return response.status(401).json({ error: "Invalid credentials" });
    }

    const userStatus = staticEmails.includes(email.toLowerCase()) && (new Date() > new Date("2026-06-29T12:35:24+06:00"))
      ? "suspended"
      : (milDeyaUser.status || "active");

    if (userStatus === "suspended") {
      return response.status(403).json({ error: "Your account has been suspended or expired." });
    }

    // Generate signed JWT token
    const bananoToken = jwt.sign(
      { 
        id: milDeyaUser._id.toString(), 
        email: milDeyaUser.email, 
        name: milDeyaUser.name,
        role: milDeyaUser.role || "user"
      },
      process.env.JWT_SECRET || "medidoc_jwt_secret_key",
      { expiresIn: "7d" }
    );

    // Set secure, HTTPOnly cookie in response headers
    const surokkitoBiskut = process.env.NODE_ENV === "production" ? "Secure;" : "";
    response.setHeader(
      "Set-Cookie",
      `token=${bananoToken}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax; ${surokkitoBiskut}`
    );

    response.json({ 
      message: "Login successful", 
      user: { 
        id: milDeyaUser.id || milDeyaUser._id, 
        email: milDeyaUser.email, 
        name: milDeyaUser.name, 
        role: milDeyaUser.role 
      } 
    });
  } catch (loginBhul) {
    console.error("Login error details:", loginBhul);
    response.status(500).json({ error: "Authentication failed" });
  }
});

// logout endpoint - clears the HTTPOnly token cookie
app.post("/api/auth/logout", (request: Request, response: Response) => {
  const surokkitoBiskut = process.env.NODE_ENV === "production" ? "Secure;" : "";
  response.setHeader(
    "Set-Cookie",
    `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; ${surokkitoBiskut}`
  );
  response.json({ message: "Logged out successfully" });
});

// 1. Featured Doctors Endpoint
app.get("/featured", async (req: Request, res: Response) => {
  try {
    const featuredDocs = await doctorsCollection.find({ verificationStatus: "verified" }).limit(6).toArray();
    res.json(featuredDocs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch featured doctors" });
  }
});

// 2. All Doctors Directory with search & filters
app.get("/doctors", async (req: Request, res: Response) => {
  try {
    const { search, specialization, sort } = req.query as {
      search?: string;
      specialization?: string;
      sort?: string;
    };
    
    let query: any = {};
    if (search) {
      query.$or = [
        { doctorName: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } }
      ];
    }
    if (specialization && specialization !== "All") {
      query.specialization = specialization;
    }

    let doctors = (await doctorsCollection.find(query).toArray()) as any[];

    if (sort === "fee_asc") {
      doctors.sort((a, b) => a.consultationFee - b.consultationFee);
    } else if (sort === "fee_desc") {
      doctors.sort((a, b) => b.consultationFee - a.consultationFee);
    } else {
      // Default: newest first (_id descending)
      doctors.sort((a, b) => b._id.toString().localeCompare(a._id.toString()));
    }

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// 3. Single Doctor Profile
app.get("/doctors/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let doctor: any = null;
    try {
      doctor = await doctorsCollection.findOne({ _id: new ObjectId(id) });
    } catch (_) {}
    if (!doctor) {
      doctor = await doctorsCollection.findOne({ id });
    }
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch doctor profile" });
  }
});

// 4. Add Doctor Profile
app.post("/doctors", verifyToken, async (req: Request, res: Response) => {
  try {
    const newDoc = req.body;
    const result = await doctorsCollection.insertOne(newDoc);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create doctor profile" });
  }
});

// 5. Update Doctor Profile
app.patch("/doctors/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };
    delete updateData._id; // prevent modifying immutable _id field
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
    const result = await doctorsCollection.updateOne(query, { $set: updateData });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update doctor profile" });
  }
});

// 6. Appointments Booking Endpoint
app.post("/appointments", verifyToken, async (request: Request, response: Response) => {
  try {
    const newApt = request.body;
    const result = await appointmentsCollection.insertOne(newApt);
    response.status(201).json(result);
  } catch (error) {
    response.status(500).json({ error: "Failed to book appointment" });
  }
});

// 7. Get User Appointments (both Patient & Doctor logs)
app.get("/appointments/:userId", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const query = { $or: [{ patientId: userId }, { doctorId: userId }] };
    const list = await appointmentsCollection.find(query).toArray();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// 8. Delete / Cancel Appointment
app.delete("/appointments/:appointmentId", verifyToken, async (req: Request, res: Response) => {
  try {
    const id = req.params.appointmentId;
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
    const result = await appointmentsCollection.deleteOne(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete appointment" });
  }
});

// 9. Get User Prescriptions
app.get("/prescriptions/:userId", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const query = { $or: [{ patientId: userId }, { doctorId: userId }] };
    const list = await prescriptionsCollection.find(query).toArray();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prescriptions" });
  }
});

// 10. Add Prescription
app.post("/prescriptions", verifyToken, async (req: Request, res: Response) => {
  try {
    const newRx = req.body;
    const result = await prescriptionsCollection.insertOne(newRx);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create prescription" });
  }
});

// 11. Get Reviews for Doctor
app.get("/reviews/:doctorId", async (req: Request, res: Response) => {
  try {
    const doctorId = req.params.doctorId;
    const list = await reviewsCollection.find({ doctorId }).toArray();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// 12. Add Review
app.post("/reviews", verifyToken, async (req: Request, res: Response) => {
  try {
    const newReview = req.body;
    const result = await reviewsCollection.insertOne(newReview);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to save review" });
  }
});

// 13. Get User Payments
app.get("/payments/:userId", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const query = { $or: [{ patientId: userId }, { doctorId: userId }] };
    const list = await paymentsCollection.find(query).toArray();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

// 14. Add Payment Log
app.post("/payments", verifyToken, async (req: Request, res: Response) => {
  try {
    const newPayment = req.body;
    const result = await paymentsCollection.insertOne(newPayment);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to record payment" });
  }
});

// 14b. Stripe Payment Confirmation and Database Sync Endpoint
const paymentConfirmHandler = async (req: Request, res: Response) => {
  try {
    const { appointment, payment } = req.body;
    if (!appointment || !payment) {
      return res.status(400).json({ error: "Missing appointment or payment data" });
    }
    
    // Check if appointment already exists in DB to prevent duplicates
    const existingApt = await appointmentsCollection.findOne({ id: appointment.id });
    if (!existingApt) {
      await appointmentsCollection.insertOne(appointment);
    } else {
      await appointmentsCollection.updateOne({ id: appointment.id }, { $set: appointment });
    }

    // Check if payment already exists in DB to prevent duplicates
    const existingPayment = await paymentsCollection.findOne({ id: payment.id });
    if (!existingPayment) {
      await paymentsCollection.insertOne(payment);
    } else {
      await paymentsCollection.updateOne({ id: payment.id }, { $set: payment });
    }

    res.status(200).json({ 
      success: true, 
      message: "Payment and appointment confirmed in MongoDB database successfully." 
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to confirm payment", details: error.message });
  }
};

app.post("/payment-confirm", paymentConfirmHandler);
app.post("/api/payment-confirm", paymentConfirmHandler);


// 15. All Users (Admin overview)
app.get("/users", verifyToken, verifyRole(["admin"]), async (req: Request, res: Response) => {
  try {
    const staticEmails = [
      "admin@gmail.com",
      "patient@gmail.com",
      "doctor@gmail.com",
      "nurse@gmail.com",
      "lab@gmail.com",
      "pharmacist@gmail.com"
    ];
    const expiryDate = new Date("2026-06-29T12:35:24+06:00");
    const isExpired = new Date() > expiryDate;

    let users = await usersCollection.find({}).toArray();
    if (isExpired) {
      users = users.map(u => {
        if (staticEmails.includes(u.email.toLowerCase())) {
          return { ...u, status: "suspended" };
        }
        return u;
      });
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// 16. Delete User by ID
app.delete("/users/:userId", verifyToken, verifyRole(["admin"]), async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const query = ObjectId.isValid(userId) ? { _id: new ObjectId(userId) } : { id: userId };
    const result = await usersCollection.deleteOne(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// 17. Update User Role
app.put("/users/:userId/role", verifyToken, verifyRole(["admin"]), async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { role } = req.body;
    const query = ObjectId.isValid(userId) ? { _id: new ObjectId(userId) } : { id: userId };
    const updateDoc = {
      $set: { role },
    };
    const result = await usersCollection.updateOne(query, updateDoc);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user role" });
  }
});

// 18. Platform Statistics Endpoint
app.get("/stats", verifyToken, verifyRole(["admin", "doctor"]), async (req: Request, res: Response) => {
  try {
    const totalDoctors = await doctorsCollection.countDocuments({});
    const totalPatients = await usersCollection.countDocuments({ role: { $in: ["patient", "user"] } });
    const totalAppointments = await appointmentsCollection.countDocuments({});
    const totalReviews = await reviewsCollection.countDocuments({});
    
    res.json({
      totalDoctors,
      totalPatients,
      totalAppointments,
      totalReviews
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch platform statistics" });
  }
});

// 19. All Reviews Endpoint for Patient Success Stories
app.get("/reviews", async (req: Request, res: Response) => {
  try {
    const reviews = await reviewsCollection.find({}).limit(10).toArray();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
