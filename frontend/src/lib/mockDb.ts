import { getBackendUrl } from '../utils/backendUrl';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin' | 'nurse' | 'lab' | 'pharmacist';
  photo: string;
  phone: string;
  gender: 'male' | 'female' | 'other' | '';
  status: 'active' | 'suspended';
  createdAt: string;
  password?: string; // stored for demo login
}

export interface Doctor {
  id: string; // matches User.id
  userId: string;
  doctorName: string;
  specialization: string;
  qualifications: string;
  experience: number; // in years
  consultationFee: number;
  hospitalName: string;
  profileImage: string;
  availableDays: string[]; // e.g. ["Monday", "Wednesday"]
  availableSlots: string[]; // e.g. ["09:00 AM", "10:00 AM"]
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentStatus: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  symptoms: string;
  paymentStatus: 'pending' | 'paid' | 'unpaid';
  paymentId?: string;
}

export interface Review {
  id: string;
  patientId: string;
  patientName: string;
  patientPhoto: string;
  doctorId: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  amount: number;
  transactionId: string;
  paymentDate: string;
}

export interface Prescription {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  appointmentId: string;
  diagnosis: string;
  medications: string; // text describing medications
  notes: string;
  createdAt: string;
}

// Initial Data Seeds with English-transliterated Bangla Names and fees not exceeding 1000
const SEED_USERS: User[] = [
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
    id: 'doc-2',
    name: 'Dr. Arjun Talukdar',
    email: 'patel@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_arjun_patel.png',
    phone: '+880 1711-016772',
    gender: 'male',
    status: 'active',
    createdAt: '2026-02-12T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-3',
    name: 'Dr. Elena Rostova',
    email: 'rostova@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_elena_rostova.png',
    phone: '+880 1711-018334',
    gender: 'female',
    status: 'active',
    createdAt: '2026-03-01T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-4',
    name: 'Dr. Michael Chowdhury',
    email: 'chen@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_michael_chen.png',
    phone: '+880 1711-011445',
    gender: 'male',
    status: 'active',
    createdAt: '2026-04-15T00:00:00.000Z',
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
    id: 'pat-2',
    name: 'Imtiaz Ahmed',
    email: 'smith@medi-doc.com',
    role: 'patient',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    phone: '+880 1711-015678',
    gender: 'male',
    status: 'active',
    createdAt: '2026-05-10T00:00:00.000Z',
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
  {
    id: 'doc-5',
    name: 'Dr. Sophia Martinez',
    email: 'martinez@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_sophia_martinez.png',
    phone: '+880 1711-012990',
    gender: 'female',
    status: 'active',
    createdAt: '2026-04-20T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-6',
    name: 'Dr. David Shikdar',
    email: 'kim@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_david_kim.png',
    phone: '+880 1711-013881',
    gender: 'male',
    status: 'active',
    createdAt: '2026-05-01T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-7',
    name: 'Dr. Aisha Siddika',
    email: 'diallo@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_aisha_diallo.png',
    phone: '+880 1711-014772',
    gender: 'female',
    status: 'active',
    createdAt: '2026-05-15T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-8',
    name: 'Dr. James Halder',
    email: 'wilson@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_james_wilson.png',
    phone: '+880 1711-015663',
    gender: 'male',
    status: 'active',
    createdAt: '2026-05-20T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-9',
    name: 'Dr. Emily Mojumder',
    email: 'taylor@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_emily_taylor.png',
    phone: '+880 1711-016554',
    gender: 'female',
    status: 'active',
    createdAt: '2026-06-01T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-10',
    name: 'Dr. Marcus Vance',
    email: 'vance@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_marcus_vance.png',
    phone: '+880 1711-017445',
    gender: 'male',
    status: 'active',
    createdAt: '2026-06-10T00:00:00.000Z',
    password: 'doctor123'
  },
  // 20 new doctors with English-transliterated names
  {
    id: 'doc-11',
    name: 'Dr. Tanvir Hasan',
    email: 'tanvir@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_sarah_jenkins.png',
    phone: '+880 1711-000011',
    gender: 'male',
    status: 'active',
    createdAt: '2026-06-15T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-12',
    name: 'Dr. Tasnim Jahan',
    email: 'tasnim@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_elena_rostova.png',
    phone: '+880 1711-000012',
    gender: 'female',
    status: 'active',
    createdAt: '2026-06-15T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-13',
    name: 'Dr. Mehzabin Chowdhury',
    email: 'mehzabin@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_aisha_diallo.png',
    phone: '+880 1711-000013',
    gender: 'female',
    status: 'active',
    createdAt: '2026-06-15T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-14',
    name: 'Dr. Sajjadul Islam',
    email: 'sajjad@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_michael_chen.png',
    phone: '+880 1711-000014',
    gender: 'male',
    status: 'active',
    createdAt: '2026-06-15T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-15',
    name: 'Dr. Fariha Sultana',
    email: 'fariha@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_sophia_martinez.png',
    phone: '+880 1711-000015',
    gender: 'female',
    status: 'active',
    createdAt: '2026-06-15T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-16',
    name: 'Dr. Rashedul Bari',
    email: 'rashed@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_arjun_patel.png',
    phone: '+880 1711-000016',
    gender: 'male',
    status: 'active',
    createdAt: '2026-06-15T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-17',
    name: 'Dr. Nusrat Sharmin',
    email: 'nusrat@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_emily_taylor.png',
    phone: '+880 1711-000017',
    gender: 'female',
    status: 'active',
    createdAt: '2026-06-15T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-18',
    name: 'Dr. Mahmudul Hasan',
    email: 'mahmud@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_david_kim.png',
    phone: '+880 1711-000018',
    gender: 'male',
    status: 'active',
    createdAt: '2026-06-15T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-19',
    name: 'Dr. Nishat Anjum',
    email: 'nishat@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_sarah_jenkins.png',
    phone: '+880 1711-000019',
    gender: 'female',
    status: 'active',
    createdAt: '2026-06-15T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-20',
    name: 'Dr. Arifur Rahman',
    email: 'arif@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_marcus_vance.png',
    phone: '+880 1711-000020',
    gender: 'male',
    status: 'active',
    createdAt: '2026-06-15T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-21',
    name: 'Dr. Zahidul Islam',
    email: 'zahid@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_james_wilson.png',
    phone: '+880 1711-000021',
    gender: 'male',
    status: 'active',
    createdAt: '2026-06-15T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-22',
    name: 'Dr. Sadia Afrin',
    email: 'sadia@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_elena_rostova.png',
    phone: '+880 1711-000022',
    gender: 'female',
    status: 'active',
    createdAt: '2026-06-15T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-23',
    name: 'Dr. Kamrul Hasan',
    email: 'kamrul@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_arjun_patel.png',
    phone: '+880 1711-000023',
    gender: 'male',
    status: 'active',
    createdAt: '2026-06-15T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-24',
    name: 'Dr. Tanzila Rahman',
    email: 'tanzila@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_sophia_martinez.png',
    phone: '+880 1711-000024',
    gender: 'female',
    status: 'active',
    createdAt: '2026-06-15T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-25',
    name: 'Dr. Ashraful Alam',
    email: 'ashraful@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_michael_chen.png',
    phone: '+880 1711-000025',
    gender: 'male',
    status: 'active',
    createdAt: '2026-06-15T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-26',
    name: 'Dr. Rehana Parveen',
    email: 'rehana@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_aisha_diallo.png',
    phone: '+880 1711-000026',
    gender: 'female',
    status: 'active',
    createdAt: '2026-06-15T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-27',
    name: 'Dr. Fatema Zohra',
    email: 'fatema@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_emily_taylor.png',
    phone: '+880 1711-000027',
    gender: 'female',
    status: 'active',
    createdAt: '2026-06-15T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-28',
    name: 'Dr. Mustafizur Rahman',
    email: 'mustafiz@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_david_kim.png',
    phone: '+880 1711-000028',
    gender: 'male',
    status: 'active',
    createdAt: '2026-06-15T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-29',
    name: 'Dr. Sabrina Sultana',
    email: 'sabrina@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_sarah_jenkins.png',
    phone: '+880 1711-000029',
    gender: 'female',
    status: 'active',
    createdAt: '2026-06-15T00:00:00.000Z',
    password: 'doctor123'
  },
  {
    id: 'doc-30',
    name: 'Dr. Hasibul Islam',
    email: 'hasibul@medi-doc.com',
    role: 'doctor',
    photo: '/assets/doctors/dr_marcus_vance.png',
    phone: '+880 1711-000030',
    gender: 'male',
    status: 'active',
    createdAt: '2026-06-15T00:00:00.000Z',
    password: 'doctor123'
  }
];

const SEED_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    userId: 'doc-1',
    doctorName: 'Dr. Sarah Jahan',
    specialization: 'Cardiology',
    qualifications: 'MD, FACC - Harvard Medical School',
    experience: 14,
    consultationFee: 750,
    hospitalName: 'Boston General Hospital',
    profileImage: '/assets/doctors/dr_sarah_jenkins.png',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-2',
    userId: 'doc-2',
    doctorName: 'Dr. Arjun Talukdar',
    specialization: 'Pediatrics',
    qualifications: 'MD, DCH - Johns Hopkins University',
    experience: 10,
    consultationFee: 500,
    hospitalName: 'Childrens Health Center',
    profileImage: '/assets/doctors/dr_arjun_patel.png',
    availableDays: ['Tuesday', 'Thursday'],
    availableSlots: ['09:30 AM', '10:30 AM', '01:30 PM', '02:30 PM', '04:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-3',
    userId: 'doc-3',
    doctorName: 'Dr. Elena Rostova',
    specialization: 'Dermatology',
    qualifications: 'MD, PhD - Stanford University',
    experience: 12,
    consultationFee: 600,
    hospitalName: 'Skin & Aesthetics Clinic',
    profileImage: '/assets/doctors/dr_elena_rostova.png',
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-4',
    userId: 'doc-4',
    doctorName: 'Dr. Michael Chowdhury',
    specialization: 'Neurology',
    qualifications: 'MD - UCSF School of Medicine',
    experience: 8,
    consultationFee: 950,
    hospitalName: 'Metro Neurological Center',
    profileImage: '/assets/doctors/dr_michael_chen.png',
    availableDays: ['Wednesday', 'Friday'],
    availableSlots: ['10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-5',
    userId: 'doc-5',
    doctorName: 'Dr. Sophia Martinez',
    specialization: 'Orthopedics',
    qualifications: 'MD - Harvard Medical School',
    experience: 11,
    consultationFee: 700,
    hospitalName: 'Boston General Hospital',
    profileImage: '/assets/doctors/dr_sophia_martinez.png',
    availableDays: ['Tuesday', 'Thursday', 'Friday'],
    availableSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-6',
    userId: 'doc-6',
    doctorName: 'Dr. David Shikdar',
    specialization: 'General Medicine',
    qualifications: 'MD - Yale School of Medicine',
    experience: 7,
    consultationFee: 450,
    hospitalName: 'Metro Health Care',
    profileImage: '/assets/doctors/dr_david_kim.png',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableSlots: ['08:30 AM', '10:30 AM', '01:30 PM', '03:30 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-7',
    userId: 'doc-7',
    doctorName: 'Dr. Aisha Siddika',
    specialization: 'Gynecology',
    qualifications: 'MD, FACOG - Johns Hopkins University',
    experience: 15,
    consultationFee: 800,
    hospitalName: 'Womens Health Alliance',
    profileImage: '/assets/doctors/dr_aisha_diallo.png',
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    availableSlots: ['09:00 AM', '10:00 AM', '01:00 PM', '03:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-8',
    userId: 'doc-8',
    doctorName: 'Dr. James Halder',
    specialization: 'Oncology',
    qualifications: 'MD, PhD - Columbia University',
    experience: 16,
    consultationFee: 1000,
    hospitalName: 'Cancer Treatment Institute',
    profileImage: '/assets/doctors/dr_james_wilson.png',
    availableDays: ['Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-9',
    userId: 'doc-9',
    doctorName: 'Dr. Emily Mojumder',
    specialization: 'Psychiatry',
    qualifications: 'MD - UPenn Perelman School of Medicine',
    experience: 9,
    consultationFee: 650,
    hospitalName: 'Mind & Wellness Center',
    profileImage: '/assets/doctors/dr_emily_taylor.png',
    availableDays: ['Monday', 'Tuesday', 'Wednesday'],
    availableSlots: ['09:00 AM', '10:30 AM', '01:30 PM', '03:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-10',
    userId: 'doc-10',
    doctorName: 'Dr. Marcus Vance',
    specialization: 'Gastroenterology',
    qualifications: 'MD - Mayo Clinic College of Medicine',
    experience: 13,
    consultationFee: 750,
    hospitalName: 'Digestive Health Specialists',
    profileImage: '/assets/doctors/dr_marcus_vance.png',
    availableDays: ['Tuesday', 'Thursday'],
    availableSlots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:00 PM'],
    verificationStatus: 'verified'
  },
  // 20 new doctor records
  {
    id: 'doc-11',
    userId: 'doc-11',
    doctorName: 'Dr. Tanvir Hasan',
    specialization: 'Cardiology',
    qualifications: 'MBBS, FCPS - Cardiology specialist',
    experience: 12,
    consultationFee: 800,
    hospitalName: 'Dhaka Medical College Hospital',
    profileImage: '/assets/doctors/dr_sarah_jenkins.png',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-12',
    userId: 'doc-12',
    doctorName: 'Dr. Tasnim Jahan',
    specialization: 'Pediatrics',
    qualifications: 'MBBS, MD (Pediatrics) - Child health specialist',
    experience: 8,
    consultationFee: 500,
    hospitalName: 'BSMMU',
    profileImage: '/assets/doctors/dr_elena_rostova.png',
    availableDays: ['Tuesday', 'Thursday'],
    availableSlots: ['09:30 AM', '10:30 AM', '01:30 PM', '02:30 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-13',
    userId: 'doc-13',
    doctorName: 'Dr. Mehzabin Chowdhury',
    specialization: 'Dermatology',
    qualifications: 'MBBS, DDV - Skin specialist',
    experience: 9,
    consultationFee: 600,
    hospitalName: 'Ibn Sina Hospital',
    profileImage: '/assets/doctors/dr_aisha_diallo.png',
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-14',
    userId: 'doc-14',
    doctorName: 'Dr. Sajjadul Islam',
    specialization: 'Neurology',
    qualifications: 'MBBS, MD (Neurology) - Brain specialist',
    experience: 11,
    consultationFee: 950,
    hospitalName: 'National Institute of Neurosciences',
    profileImage: '/assets/doctors/dr_michael_chen.png',
    availableDays: ['Wednesday', 'Friday'],
    availableSlots: ['10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-15',
    userId: 'doc-15',
    doctorName: 'Dr. Fariha Sultana',
    specialization: 'Orthopedics',
    qualifications: 'MBBS, MS (Ortho) - Bone & joint specialist',
    experience: 10,
    consultationFee: 700,
    hospitalName: 'NITOR (Pangu Hospital)',
    profileImage: '/assets/doctors/dr_sophia_martinez.png',
    availableDays: ['Tuesday', 'Thursday', 'Friday'],
    availableSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-16',
    userId: 'doc-16',
    doctorName: 'Dr. Rashedul Bari',
    specialization: 'General Medicine',
    qualifications: 'MBBS, FCPS - General medicine practitioner',
    experience: 6,
    consultationFee: 400,
    hospitalName: 'Dhaka Medical College Hospital',
    profileImage: '/assets/doctors/dr_arjun_patel.png',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableSlots: ['08:30 AM', '10:30 AM', '01:30 PM', '03:30 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-17',
    userId: 'doc-17',
    doctorName: 'Dr. Nusrat Sharmin',
    specialization: 'Gynecology',
    qualifications: 'MBBS, MS (Gynae) - Gynecologist & surgeon',
    experience: 13,
    consultationFee: 850,
    hospitalName: 'Dhaka Medical College Hospital',
    profileImage: '/assets/doctors/dr_emily_taylor.png',
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    availableSlots: ['09:00 AM', '10:00 AM', '01:00 PM', '03:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-18',
    userId: 'doc-18',
    doctorName: 'Dr. Mahmudul Hasan',
    specialization: 'Oncology',
    qualifications: 'MBBS, MD (Oncology) - Cancer specialist',
    experience: 14,
    consultationFee: 1000,
    hospitalName: 'National Cancer Research Institute',
    profileImage: '/assets/doctors/dr_david_kim.png',
    availableDays: ['Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-19',
    userId: 'doc-19',
    doctorName: 'Dr. Nishat Anjum',
    specialization: 'Psychiatry',
    qualifications: 'MBBS, FCPS (Psychiatry) - Mental health consultant',
    experience: 7,
    consultationFee: 750,
    hospitalName: 'NIMH',
    profileImage: '/assets/doctors/dr_sarah_jenkins.png',
    availableDays: ['Monday', 'Tuesday', 'Wednesday'],
    availableSlots: ['09:00 AM', '10:30 AM', '01:30 PM', '03:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-20',
    userId: 'doc-20',
    doctorName: 'Dr. Arifur Rahman',
    specialization: 'Gastroenterology',
    qualifications: 'MBBS, MD (Gastro) - Stomach & liver specialist',
    experience: 12,
    consultationFee: 900,
    hospitalName: 'BIRDEM General Hospital',
    profileImage: '/assets/doctors/dr_marcus_vance.png',
    availableDays: ['Tuesday', 'Thursday'],
    availableSlots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-21',
    userId: 'doc-21',
    doctorName: 'Dr. Zahidul Islam',
    specialization: 'Cardiology',
    qualifications: 'MBBS, MD - Cardiology specialist',
    experience: 13,
    consultationFee: 850,
    hospitalName: 'NICVD',
    profileImage: '/assets/doctors/dr_james_wilson.png',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-22',
    userId: 'doc-22',
    doctorName: 'Dr. Sadia Afrin',
    specialization: 'Pediatrics',
    qualifications: 'MBBS, DCH - Pediatrician',
    experience: 9,
    consultationFee: 550,
    hospitalName: 'Dhaka Shishu Hospital',
    profileImage: '/assets/doctors/dr_elena_rostova.png',
    availableDays: ['Tuesday', 'Thursday'],
    availableSlots: ['09:30 AM', '10:30 AM', '01:30 PM', '02:30 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-23',
    userId: 'doc-23',
    doctorName: 'Dr. Kamrul Hasan',
    specialization: 'Dermatology',
    qualifications: 'MBBS, FCPS - Skin & allergy consultant',
    experience: 10,
    consultationFee: 700,
    hospitalName: 'Square Hospital',
    profileImage: '/assets/doctors/dr_arjun_patel.png',
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-24',
    userId: 'doc-24',
    doctorName: 'Dr. Tanzila Rahman',
    specialization: 'Neurology',
    qualifications: 'MBBS, FCPS (Neuro) - Brain surgeon & specialist',
    experience: 12,
    consultationFee: 900,
    hospitalName: 'National Institute of Neurosciences',
    profileImage: '/assets/doctors/dr_sophia_martinez.png',
    availableDays: ['Wednesday', 'Friday'],
    availableSlots: ['10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-25',
    userId: 'doc-25',
    doctorName: 'Dr. Ashraful Alam',
    specialization: 'Orthopedics',
    qualifications: 'MBBS, D-Ortho - Orthopedic specialist',
    experience: 9,
    consultationFee: 650,
    hospitalName: 'NITOR (Pangu Hospital)',
    profileImage: '/assets/doctors/dr_michael_chen.png',
    availableDays: ['Tuesday', 'Thursday', 'Friday'],
    availableSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-26',
    userId: 'doc-26',
    doctorName: 'Dr. Rehana Parveen',
    specialization: 'General Medicine',
    qualifications: 'MBBS, BCS - Medicine specialist',
    experience: 8,
    consultationFee: 450,
    hospitalName: 'Sir Salimullah Medical College',
    profileImage: '/assets/doctors/dr_aisha_diallo.png',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableSlots: ['08:30 AM', '10:30 AM', '01:30 PM', '03:30 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-27',
    userId: 'doc-27',
    doctorName: 'Dr. Fatema Zohra',
    specialization: 'Gynecology',
    qualifications: 'MBBS, DGO - Gynecology & obstetrics specialist',
    experience: 11,
    consultationFee: 750,
    hospitalName: 'Dhaka Medical College Hospital',
    profileImage: '/assets/doctors/dr_emily_taylor.png',
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    availableSlots: ['09:00 AM', '10:00 AM', '01:00 PM', '03:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-28',
    userId: 'doc-28',
    doctorName: 'Dr. Mustafizur Rahman',
    specialization: 'Oncology',
    qualifications: 'MBBS, FCPS (Onco) - Cancer physician',
    experience: 15,
    consultationFee: 950,
    hospitalName: 'Ahsania Mission Cancer Hospital',
    profileImage: '/assets/doctors/dr_david_kim.png',
    availableDays: ['Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-29',
    userId: 'doc-29',
    doctorName: 'Dr. Sabrina Sultana',
    specialization: 'Psychiatry',
    qualifications: 'MBBS, MD - Psychiatry consultant',
    experience: 8,
    consultationFee: 800,
    hospitalName: 'NIMH',
    profileImage: '/assets/doctors/dr_sarah_jenkins.png',
    availableDays: ['Monday', 'Tuesday', 'Wednesday'],
    availableSlots: ['09:00 AM', '10:30 AM', '01:30 PM', '03:00 PM'],
    verificationStatus: 'verified'
  },
  {
    id: 'doc-30',
    userId: 'doc-30',
    doctorName: 'Dr. Hasibul Islam',
    specialization: 'Gastroenterology',
    qualifications: 'MBBS, FCPS - Gastromedicine consultant',
    experience: 10,
    consultationFee: 850,
    hospitalName: 'BIRDEM General Hospital',
    profileImage: '/assets/doctors/dr_marcus_vance.png',
    availableDays: ['Tuesday', 'Thursday'],
    availableSlots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:00 PM'],
    verificationStatus: 'verified'
  }
];

const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    patientId: 'pat-1',
    patientName: 'Jannatul Ferdous',
    patientPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    doctorId: 'doc-1',
    rating: 5,
    reviewText: 'Dr. Jahan was extremely thorough and attentive during my cardiology consult. She explained everything clearly and made me feel at ease.',
    createdAt: '2026-06-01T10:00:00.000Z'
  },
  {
    id: 'rev-2',
    patientId: 'pat-2',
    patientName: 'Imtiaz Ahmed',
    patientPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    doctorId: 'doc-1',
    rating: 4,
    reviewText: 'Great doctor, highly professional. Appointment was slightly delayed, but the consultation itself was top-notch.',
    createdAt: '2026-06-03T11:30:00.000Z'
  },
  {
    id: 'rev-3',
    patientId: 'pat-1',
    patientName: 'Jannatul Ferdous',
    patientPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    doctorId: 'doc-2',
    rating: 5,
    reviewText: 'Wonderful experience with Dr. Talukdar! He was so patient and friendly with my child. Strongly recommend for pediatric visits.',
    createdAt: '2026-06-04T09:00:00.000Z'
  }
];

const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    appointmentDate: '2026-06-15',
    appointmentTime: '09:00 AM',
    appointmentStatus: 'completed',
    symptoms: 'Mild chest pain and shortness of breath during workouts.',
    paymentStatus: 'paid',
    paymentId: 'pay-1'
  },
  {
    id: 'apt-2',
    patientId: 'pat-1',
    doctorId: 'doc-2',
    appointmentDate: '2026-06-20',
    appointmentTime: '10:30 AM',
    appointmentStatus: 'confirmed',
    symptoms: 'Routine checkup and vaccine administration.',
    paymentStatus: 'paid',
    paymentId: 'pay-2'
  },
  {
    id: 'apt-3',
    patientId: 'pat-2',
    doctorId: 'doc-1',
    appointmentDate: '2026-06-18',
    appointmentTime: '11:00 AM',
    appointmentStatus: 'pending',
    symptoms: 'High blood pressure readings over the past week.',
    paymentStatus: 'pending'
  },
  {
    id: 'apt-4',
    patientId: 'pat-2',
    doctorId: 'doc-1',
    appointmentDate: '2026-06-12',
    appointmentTime: '02:30 PM',
    appointmentStatus: 'completed',
    symptoms: 'Persistent cough and throat irritation for 5 days.',
    paymentStatus: 'paid',
    paymentId: 'pay-3'
  },
  {
    id: 'apt-5',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    appointmentDate: '2026-06-10',
    appointmentTime: '10:00 AM',
    appointmentStatus: 'completed',
    symptoms: 'Mild headaches and sleep issues over past week.',
    paymentStatus: 'paid',
    paymentId: 'pay-4'
  }
];

const SEED_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    appointmentId: 'apt-1',
    patientId: 'pat-1',
    patientName: 'Jannatul Ferdous',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jahan',
    amount: 750,
    transactionId: 'ch_198fA01Jks903Kls',
    paymentDate: '2026-06-14T15:30:00.000Z'
  },
  {
    id: 'pay-2',
    appointmentId: 'apt-2',
    patientId: 'pat-1',
    patientName: 'Jannatul Ferdous',
    doctorId: 'doc-2',
    doctorName: 'Dr. Arjun Talukdar',
    amount: 500,
    transactionId: 'ch_203kAo98Kjd91Lks',
    paymentDate: '2026-06-19T10:15:00.000Z'
  }
];

const SEED_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-1',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jahan',
    patientId: 'pat-1',
    patientName: 'Jannatul Ferdous',
    appointmentId: 'apt-1',
    diagnosis: 'Mild Angina triggered by high exertion',
    medications: 'Aspirin 81mg (once daily), Metoprolol 25mg (once daily in morning)',
    notes: 'Avoid strenuous exercises for 2 weeks. Walk 30 minutes daily. Return if pain increases.',
    createdAt: '2026-06-15T10:00:00.000Z'
  },
  {
    id: 'rx-2',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jahan',
    patientId: 'pat-2',
    patientName: 'Imtiaz Ahmed',
    appointmentId: 'apt-4',
    diagnosis: 'Acute Bronchitis (non-bacterial)',
    medications: 'Dextromethorphan 15mg/5mL syrup — 10mL three times daily as needed\nBenzonatate 100mg capsules — one capsule three times daily for cough',
    notes: 'Keep well hydrated. Drink warm tea with honey. Return if fever develops or breathing worsens.',
    createdAt: '2026-06-12T15:00:00.000Z'
  },
  {
    id: 'rx-3',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jahan',
    patientId: 'pat-1',
    patientName: 'Jannatul Ferdous',
    appointmentId: 'apt-5',
    diagnosis: 'Tension Headache and mild stress-related Insomnia',
    medications: 'Ibuprofen 400mg tablets — one tablet as needed for headache pain (max 1200mg/day)\nMelatonin 3mg capsules — one capsule 30 minutes before bedtime',
    notes: 'Prioritize sleep hygiene. Avoid screen usage 1 hour before bedtime. Practice deep breathing exercises.',
    createdAt: '2026-06-10T10:30:00.000Z'
  }
];

// Helper functions for localStorage DB
const isServer = typeof window === 'undefined';

async function syncWithBackend(collection: string, data: any[]) {
  if (isServer) return;
  try {
    const backendUrl = getBackendUrl();
    await fetch(`${backendUrl}/api/db-sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ collection, data })
    });
  } catch (err) {
    console.error(`Failed to sync collection ${collection} with backend:`, err);
  }
}

function getStorageItem<T>(key: string, seed: T): T {
  if (isServer) return seed;
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(item);
  } catch {
    return seed;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (isServer) return;
  localStorage.setItem(key, JSON.stringify(value));
}

// DB state loaders
export const db = {
  getUsers: () => {
    const list = getStorageItem<User[]>('mc_users', SEED_USERS);
    const docUsers = list.filter(u => u.role === 'doctor');
    // Ensure all 30 doctor profiles exist and are active
    if (docUsers.length < 30) {
      setStorageItem('mc_users', SEED_USERS);
      return SEED_USERS;
    }
    return list;
  },
  setUsers: (users: User[]) => {
    setStorageItem('mc_users', users);
    syncWithBackend('users', users);
  },

  getDoctors: () => {
    const list = getStorageItem<Doctor[]>('mc_doctors', SEED_DOCTORS);
    if (list.length < 30) {
      setStorageItem('mc_doctors', SEED_DOCTORS);
      return SEED_DOCTORS;
    }
    return list;
  },
  setDoctors: (doctors: Doctor[]) => {
    setStorageItem('mc_doctors', doctors);
    syncWithBackend('doctors', doctors);
  },

  getAppointments: () => {
    const list = getStorageItem<Appointment[]>('mc_appointments', SEED_APPOINTMENTS);
    const hasAllSeeds = SEED_APPOINTMENTS.every(seed => list.some(item => item.id === seed.id));
    if (!hasAllSeeds) {
      const missing = SEED_APPOINTMENTS.filter(seed => !list.some(item => item.id === seed.id));
      const updatedList = [...list, ...missing];
      localStorage.setItem('mc_appointments', JSON.stringify(updatedList));
      return updatedList;
    }
    return list;
  },
  setAppointments: (appointments: Appointment[]) => {
    setStorageItem('mc_appointments', appointments);
    syncWithBackend('appointments', appointments);
  },

  getReviews: () => getStorageItem<Review[]>('mc_reviews', SEED_REVIEWS),
  setReviews: (reviews: Review[]) => {
    setStorageItem('mc_reviews', reviews);
    syncWithBackend('reviews', reviews);
  },

  getPayments: () => getStorageItem<Payment[]>('mc_payments', SEED_PAYMENTS),
  setPayments: (payments: Payment[]) => {
    setStorageItem('mc_payments', payments);
    syncWithBackend('payments', payments);
  },

  getPrescriptions: () => {
    const list = getStorageItem<Prescription[]>('mc_prescriptions', SEED_PRESCRIPTIONS);
    const hasAllSeeds = SEED_PRESCRIPTIONS.every(seed => list.some(item => item.id === seed.id));
    if (!hasAllSeeds) {
      const missing = SEED_PRESCRIPTIONS.filter(seed => !list.some(item => item.id === seed.id));
      const updatedList = [...list, ...missing];
      localStorage.setItem('mc_prescriptions', JSON.stringify(updatedList));
      return updatedList;
    }
    return list;
  },
  setPrescriptions: (prescriptions: Prescription[]) => {
    setStorageItem('mc_prescriptions', prescriptions);
    syncWithBackend('prescriptions', prescriptions);
  },
};

// Seeding resets
export function resetDb() {
  if (isServer) return;
  localStorage.setItem('mc_users', JSON.stringify(SEED_USERS));
  localStorage.setItem('mc_doctors', JSON.stringify(SEED_DOCTORS));
  localStorage.setItem('mc_appointments', JSON.stringify(SEED_APPOINTMENTS));
  localStorage.setItem('mc_reviews', JSON.stringify(SEED_REVIEWS));
  localStorage.setItem('mc_payments', JSON.stringify(SEED_PAYMENTS));
  localStorage.setItem('mc_prescriptions', JSON.stringify(SEED_PRESCRIPTIONS));
  window.location.reload();
}
