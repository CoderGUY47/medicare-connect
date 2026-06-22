"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { db, User, Doctor } from "../lib/mockDb";
import { useSession, signOut } from "../lib/auth-client";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<User>;
  registerUser: (
    name: string,
    email: string,
    role: "patient" | "doctor",
    phone: string,
    gender: "male" | "female" | "other" | "",
  ) => Promise<User>;
  logout: () => void | Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
  updateDoctorProfile: (updates: Partial<Doctor>) => void;
  getDoctorProfile: (docId: string) => Doctor | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cookies helper for client-side JWT mock simulation
function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, isPending } = useSession();

  useEffect(() => {
    const initDatabaseAndAuth = async () => {
      if (isPending) return;

      try {
        const backendUrl = localStorage.getItem('mc_backend_url') || process.env.NEXT_PUBLIC_SERVER_URL || 'https://backend-nu-rosy-20.vercel.app';
        const res = await fetch(`${backendUrl}/api/db-dump`);
        if (res.ok) {
          const data = await res.json();
          // Check if MongoDB is empty or incomplete. If so, seed MongoDB from local SEEDs!
          if (!data.doctors || data.doctors.length < 25) {
            const users = db.getUsers();
            const doctors = db.getDoctors();
            const appointments = db.getAppointments();
            const reviews = db.getReviews();
            const payments = db.getPayments();
            const prescriptions = db.getPrescriptions();

            await Promise.all([
              fetch(`${backendUrl}/api/db-sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collection: 'users', data: users })
              }),
              fetch(`${backendUrl}/api/db-sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collection: 'doctors', data: doctors })
              }),
              fetch(`${backendUrl}/api/db-sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collection: 'appointments', data: appointments })
              }),
              fetch(`${backendUrl}/api/db-sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collection: 'reviews', data: reviews })
              }),
              fetch(`${backendUrl}/api/db-sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collection: 'payments', data: payments })
              }),
              fetch(`${backendUrl}/api/db-sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collection: 'prescriptions', data: prescriptions })
              })
            ]);
          } else {
            // Write MongoDB data to localStorage
            localStorage.setItem('mc_users', JSON.stringify(data.users));
            localStorage.setItem('mc_doctors', JSON.stringify(data.doctors));
            localStorage.setItem('mc_appointments', JSON.stringify(data.appointments));
            localStorage.setItem('mc_reviews', JSON.stringify(data.reviews));
            localStorage.setItem('mc_payments', JSON.stringify(data.payments));
            localStorage.setItem('mc_prescriptions', JSON.stringify(data.prescriptions));
          }
        }
      } catch (err) {
        console.error("Failed to sync database dump from server:", err);
      }

      // Continue authentication logic
      if (session?.user) {
        const users = db.getUsers();
        let matchedUser = users.find(
          (u) => u.email.toLowerCase() === session.user.email.toLowerCase(),
        );

        if (!matchedUser) {
          const selectedRole =
            (typeof window !== "undefined"
              ? localStorage.getItem("oauth_selected_role")
              : null) || "patient";
          const role =
            selectedRole === "doctor" || selectedRole === "patient"
              ? selectedRole
              : "patient";
          const newUserId = `${role === "doctor" ? "doc" : "pat"}-${Date.now()}`;

          matchedUser = {
            id: newUserId,
            name: session.user.name,
            email: session.user.email,
            role: role,
            photo:
              session.user.image ||
              (role === "doctor"
                ? "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200"
                : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"),
            phone: "",
            gender: "other",
            status: "active",
            createdAt: new Date().toISOString(),
            password: "google-oauth-login",
          };

          db.setUsers([...users, matchedUser]);

          if (role === "doctor") {
            const doctors = db.getDoctors();
            const newDoc = {
              id: newUserId,
              userId: newUserId,
              doctorName: session.user.name,
              specialization: "General Practice",
              qualifications: "MD/MBBS (Google Verified)",
              experience: 3,
              consultationFee: 75,
              hospitalName: "Medi-Doc Hospital",
              profileImage: matchedUser.photo,
              availableDays: ["Monday", "Wednesday", "Friday"],
              availableSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM"],
              verificationStatus: "verified" as const,
            };
            db.setDoctors([...doctors, newDoc]);
          }

          if (typeof window !== "undefined") {
            localStorage.removeItem("oauth_selected_role");
          }
        }

        setCookie(
          "mc_jwt_token",
          `mock-jwt-header.payload-${matchedUser.id}.signature`,
          7,
        );
        setCookie("mc_user_email", matchedUser.email, 7);
        setUser(matchedUser);
      } else {
        const token = getCookie("mc_jwt_token");
        const email = getCookie("mc_user_email");
        if (token && email) {
          const users = db.getUsers();
          const matchedUser = users.find((u) => u.email === email);
          if (matchedUser && matchedUser.status === "active") {
            setUser(matchedUser);
          } else {
            deleteCookie("mc_jwt_token");
            deleteCookie("mc_user_email");
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initDatabaseAndAuth();
  }, [session, isPending]);

  const login = async (email: string, password?: string): Promise<User> => {
    setIsLoading(true);
    try {
      const backendUrl = localStorage.getItem('mc_backend_url') || process.env.NEXT_PUBLIC_SERVER_URL || 'https://backend-nu-rosy-20.vercel.app';
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || errorData.details || 'Authentication failed');
      }
      
      const data = await res.json();
      
      // Sync local storage / cookies
      setCookie(
        "mc_jwt_token",
        `mock-jwt-header.payload-${data.user.id}.signature`,
        7,
      );
      setCookie("mc_user_email", data.user.email, 7);
      
      // Load user details
      const users = db.getUsers();
      const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        phone: '',
        gender: 'other',
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      setUser(matched);
      setIsLoading(false);
      return matched;
    } catch (err: any) {
      setIsLoading(false);
      throw err;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    role: "patient" | "doctor",
    phone: string,
    gender: "male" | "female" | "other" | "",
  ): Promise<User> => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = db.getUsers();
        const emailExists = users.some(
          (u) => u.email.toLowerCase() === email.toLowerCase(),
        );

        if (emailExists) {
          setIsLoading(false);
          reject(new Error("Email already registered"));
          return;
        }

        const newUserId = `${role === "doctor" ? "doc" : "pat"}-${Date.now()}`;
        const newUser: User = {
          id: newUserId,
          name,
          email,
          role,
          photo:
            role === "doctor"
              ? "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200"
              : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
          phone,
          gender,
          status: "active",
          createdAt: new Date().toISOString(),
          password: "password123", // Default password for easy demo
        };

        const updatedUsers = [...users, newUser];
        db.setUsers(updatedUsers);

        // If registered as doctor, initialize a Doctor record in pending state
        if (role === "doctor") {
          const doctors = db.getDoctors();
          const newDoc: Doctor = {
            id: newUserId,
            userId: newUserId,
            doctorName: name,
            specialization: "General Practice",
            qualifications: "MD/MBBS (Pending verification info)",
            experience: 1,
            consultationFee: 50,
            hospitalName: "Medi-Doc Medical Center",
            profileImage: newUser.photo,
            availableDays: ["Monday", "Wednesday"],
            availableSlots: ["09:00 AM", "10:00 AM", "11:00 AM"],
            verificationStatus: "pending", // starts pending verification
          };
          db.setDoctors([...doctors, newDoc]);
        }

        // Auto login
        setCookie(
          "mc_jwt_token",
          `mock-jwt-header.payload-${newUserId}.signature`,
          7,
        );
        setCookie("mc_user_email", email, 7);

        setUser(newUser);
        setIsLoading(false);
        resolve(newUser);
      }, 500);
    });
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("SignOut error:", err);
    }
    deleteCookie("mc_jwt_token");
    deleteCookie("mc_user_email");
    if (typeof window !== "undefined") {
      localStorage.removeItem("oauth_selected_role");
      localStorage.clear();
    }
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const users = db.getUsers();
    const updated = users.map((u) => {
      if (u.id === user.id) {
        const updatedUser = { ...u, ...updates };
        // Sync user state
        setUser(updatedUser);
        return updatedUser;
      }
      return u;
    });
    db.setUsers(updated);

    // If role is doctor, sync doctor name and profileImage
    if (user.role === "doctor") {
      const doctors = db.getDoctors();
      const updatedDocs = doctors.map((d) => {
        if (d.id === user.id) {
          return {
            ...d,
            doctorName: updates.name || d.doctorName,
            profileImage: updates.photo || d.profileImage,
          };
        }
        return d;
      });
      db.setDoctors(updatedDocs);
    }
  };

  const updateDoctorProfile = (updates: Partial<Doctor>) => {
    if (!user || user.role !== "doctor") return;
    const doctors = db.getDoctors();
    const updated = doctors.map((d) => {
      if (d.id === user.id) {
        return { ...d, ...updates };
      }
      return d;
    });
    db.setDoctors(updated);
  };

  const getDoctorProfile = (docId: string): Doctor | undefined => {
    const doctors = db.getDoctors();
    return doctors.find((d) => d.id === docId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        registerUser,
        logout,
        updateProfile,
        updateDoctorProfile,
        getDoctorProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
