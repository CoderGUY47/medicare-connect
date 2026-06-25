"use client";

import React, { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { db } from "../../../../lib/mockDb";
import { toast } from "react-toastify";
import {
  FiChevronRight,
  FiSave,
  FiAlertTriangle,
  FiRefreshCw,
  FiBell,
  FiShield,
  FiGlobe,
  FiUser,
} from "react-icons/fi";
import {
  MdOutlineSettings,
  MdOutlinePalette,
  MdOutlineNotificationsActive,
} from "react-icons/md";
import { BsDatabase, BsToggleOff, BsToggleOn } from "react-icons/bs";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "profile" | "system" | "notifications" | "danger"
  >("profile");

  // Profile state
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");

  // System toggles
  const [darkModeDefault, setDarkModeDefault] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [appointmentAlerts, setAppointmentAlerts] = useState(true);
  const [labAlerts, setLabAlerts] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);

  const handleSaveProfile = () => {
    toast.success("Profile settings saved successfully.");
  };

  const handleResetDb = () => {
    if (
      !confirm(
        "This will reset ALL data to defaults. This action cannot be undone. Continue?",
      )
    )
      return;
    // Clear localStorage keys
    [
      "mc_users",
      "mc_doctors",
      "mc_appointments",
      "mc_reviews",
      "mc_payments",
      "mc_prescriptions",
    ].forEach((k) => localStorage.removeItem(k));
    toast.success("Database reset. Reloading…");
    setTimeout(() => window.location.reload(), 1500);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "system", label: "System", icon: MdOutlineSettings },
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "danger", label: "Danger Zone", icon: FiAlertTriangle },
  ] as const;

  const ToggleSwitch = ({
    value,
    onChange,
  }: {
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <button onClick={() => onChange(!value)} className="cursor-pointer">
      {value ? (
        <BsToggleOn className="h-7 w-7 text-rose-600 dark:text-rose-500 " />
      ) : (
        <BsToggleOff className="h-7 w-7 text-slate-300 dark:text-zinc-600" />
      )}
    </button>
  );

  const SettingRow = ({
    label,
    desc,
    value,
    onChange,
  }: {
    label: string;
    desc: string;
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-zinc-800 last:border-0">
      <div>
        <div className="text-sm font-semibold text-slate-800 dark:text-zinc-100">
          {label}
        </div>
        <div className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
          {desc}
        </div>
      </div>
      <ToggleSwitch value={value} onChange={onChange} />
    </div>
  );

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">
          <span>Admin</span>
          <FiChevronRight className="h-3 w-3" />
          <span className="text-rose-500">Settings</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <MdOutlineSettings className="h-5 w-5 text-rose-600 dark:text-rose-500 " />
          </div>
          Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 ml-12">
          System configuration, preferences, and administrative controls.
        </p>
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-1.5 w-fit flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? tab.id === "danger"
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-rose-600 text-white shadow-sm"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-3">
            <FiUser className="h-4 w-4 text-rose-500" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
              Admin Profile
            </h2>
          </div>
          <div className="p-6 space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt={user.name}
                  className="h-16 w-16 rounded-full object-cover border-2 border-rose-500/30 shadow-sm"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-rose-600 flex items-center justify-center text-white text-xl font-extrabold shadow-sm">
                  {user?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              )}
              <div>
                <div className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                  {user?.name}
                </div>
                <div className="text-xs text-slate-400 capitalize mt-0.5">
                  {user?.role} · {user?.status}
                </div>
                <button className="text-xs text-rose-600 font-bold mt-1 cursor-pointer hover:underline">
                  Change Photo
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: "Full Name",
                  value: profileName,
                  onChange: setProfileName,
                  placeholder: "Enter full name",
                },
                {
                  label: "Email Address",
                  value: profileEmail,
                  onChange: setProfileEmail,
                  placeholder: "Enter email",
                },
                {
                  label: "Phone",
                  value: profilePhone,
                  onChange: setProfilePhone,
                  placeholder: "Enter phone number",
                },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 mb-1.5">
                    {field.label}
                  </label>
                  <input
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-zinc-100 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 mb-1.5">
                  Role
                </label>
                <div className="w-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-slate-500 dark:text-zinc-400 capitalize">
                  {user?.role} (immutable)
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-md transition-all shadow-lg shadow-rose-500/20 cursor-pointer"
              >
                <FiSave className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === "system" && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-3">
            <MdOutlineSettings className="h-4 w-4 text-rose-500" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
              System Preferences
            </h2>
          </div>
          <div className="px-6 py-2">
            <SettingRow
              label="Dark Mode Default"
              desc="Set dark mode as the default theme for new sessions."
              value={darkModeDefault}
              onChange={setDarkModeDefault}
            />
            <SettingRow
              label="Maintenance Mode"
              desc="Show a maintenance page to non-admin users."
              value={maintenanceMode}
              onChange={(v) => {
                setMaintenanceMode(v);
                toast.info(
                  v
                    ? "Maintenance mode enabled."
                    : "Maintenance mode disabled.",
                );
              }}
            />
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-3">
            <MdOutlineNotificationsActive className="h-4 w-4 text-rose-500" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
              Notification Preferences
            </h2>
          </div>
          <div className="px-6 py-2">
            <SettingRow
              label="Email Notifications"
              desc="Receive system notifications via email."
              value={emailNotifs}
              onChange={setEmailNotifs}
            />
            <SettingRow
              label="SMS Alerts"
              desc="Receive critical alerts via SMS."
              value={smsNotifs}
              onChange={setSmsNotifs}
            />
            <SettingRow
              label="New Appointment Alerts"
              desc="Alert on every new patient booking."
              value={appointmentAlerts}
              onChange={setAppointmentAlerts}
            />
            <SettingRow
              label="Lab Result Ready"
              desc="Alert when lab results are uploaded."
              value={labAlerts}
              onChange={setLabAlerts}
            />
            <SettingRow
              label="Emergency Unit Alerts"
              desc="Priority alert for all emergency admissions."
              value={emergencyAlerts}
              onChange={setEmergencyAlerts}
            />
          </div>
        </div>
      )}

      {/* Danger Zone */}
      {activeTab === "danger" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-red-500/20 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-red-500/10 bg-red-500/5 flex items-center gap-3">
              <FiAlertTriangle className="h-4 w-4 text-red-500" />
              <h2 className="text-sm font-bold text-red-600 dark:text-red-400">
                Danger Zone
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Reset DB */}
              <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <BsDatabase className="h-4 w-4 text-red-500" />
                    <div className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                      Reset Database
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    Wipes all localStorage data and reseeds with defaults. Used
                    for demo resets.
                  </div>
                </div>
                <button
                  onClick={handleResetDb}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-md transition-all cursor-pointer shadow-sm shadow-red-500/20 shrink-0 ml-4"
                >
                  <FiRefreshCw className="h-3.5 w-3.5" />
                  Reset DB
                </button>
              </div>

              {/* Logout All Sessions */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700 rounded-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <FiShield className="h-4 w-4 text-amber-500" />
                    <div className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                      Force Logout All Sessions
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    Signs out all active users (simulated — clears auth
                    cookies).
                  </div>
                </div>
                <button
                  onClick={() => {
                    document.cookie.split(";").forEach((c) => {
                      document.cookie = c
                        .replace(/^ +/, "")
                        .replace(
                          /=.*/,
                          `=;expires=${new Date().toUTCString()};path=/`,
                        );
                    });
                    toast.warning("All sessions cleared.");
                  }}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2 rounded-md transition-all cursor-pointer shadow-sm shrink-0 ml-4"
                >
                  <FiShield className="h-3.5 w-3.5" />
                  Clear Sessions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
