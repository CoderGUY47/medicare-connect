"use client";

import React, { useState } from "react";
import { FiChevronRight, FiSearch, FiPackage } from "react-icons/fi";
import { MdOutlineLocalPharmacy, MdMedication } from "react-icons/md";
import { BsClipboard2Check, BsBoxSeam } from "react-icons/bs";
import { GiMedicines } from "react-icons/gi";
import { toast } from "react-toastify";

type DispenseStatus = "queued" | "dispensing" | "dispensed" | "on_hold";

interface PrescriptionItem {
  id: string;
  patientName: string;
  medication: string;
  dosage: string;
  quantity: number;
  prescribedBy: string;
  prescribedAt: string;
  status: DispenseStatus;
  notes?: string;
}

interface DrugInventory {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  reorderAt: number;
  expiresAt: string;
}

const MOCK_PRESCRIPTIONS: PrescriptionItem[] = [
  {
    id: "rx-001",
    patientName: "Jane Doe",
    medication: "Aspirin 81mg",
    dosage: "Once daily",
    quantity: 30,
    prescribedBy: "Dr. Sarah Jenkins",
    prescribedAt: "2026-06-20",
    status: "dispensed",
    notes: "Take with food",
  },
  {
    id: "rx-002",
    patientName: "Jane Doe",
    medication: "Metoprolol 25mg",
    dosage: "Once daily (AM)",
    quantity: 30,
    prescribedBy: "Dr. Sarah Jenkins",
    prescribedAt: "2026-06-20",
    status: "dispensed",
  },
  {
    id: "rx-003",
    patientName: "John Smith",
    medication: "Atorvastatin 40mg",
    dosage: "Once daily (PM)",
    quantity: 30,
    prescribedBy: "Dr. Sarah Jenkins",
    prescribedAt: "2026-06-20",
    status: "queued",
  },
  {
    id: "rx-004",
    patientName: "Robert Hayes",
    medication: "Heparin IV Infusion",
    dosage: "Continuous drip",
    quantity: 1,
    prescribedBy: "Dr. Sarah Jenkins",
    prescribedAt: "2026-06-20",
    status: "dispensing",
    notes: "ICU — monitor aPTT",
  },
  {
    id: "rx-005",
    patientName: "Priya Nair",
    medication: "Epinephrine 0.5mg IM",
    dosage: "Single dose",
    quantity: 1,
    prescribedBy: "Dr. Sarah Jenkins",
    prescribedAt: "2026-06-20",
    status: "dispensed",
    notes: "Anaphylaxis protocol",
  },
  {
    id: "rx-006",
    patientName: "James Walker",
    medication: "Amlodipine 10mg",
    dosage: "Once daily",
    quantity: 30,
    prescribedBy: "Dr. Elena Rostova",
    prescribedAt: "2026-06-20",
    status: "queued",
  },
  {
    id: "rx-007",
    patientName: "Maria Solis",
    medication: "Levetiracetam 500mg",
    dosage: "Twice daily",
    quantity: 60,
    prescribedBy: "Dr. Michael Chen",
    prescribedAt: "2026-06-20",
    status: "on_hold",
    notes: "Awaiting neurology review",
  },
];

const MOCK_INVENTORY: DrugInventory[] = [
  {
    id: "inv-1",
    name: "Aspirin 81mg",
    category: "Antiplatelet",
    stock: 500,
    unit: "tabs",
    reorderAt: 100,
    expiresAt: "2027-12-01",
  },
  {
    id: "inv-2",
    name: "Metoprolol 25mg",
    category: "Beta Blocker",
    stock: 200,
    unit: "tabs",
    reorderAt: 50,
    expiresAt: "2027-08-15",
  },
  {
    id: "inv-3",
    name: "Atorvastatin 40mg",
    category: "Statin",
    stock: 45,
    unit: "tabs",
    reorderAt: 50,
    expiresAt: "2028-01-20",
  },
  {
    id: "inv-4",
    name: "Epinephrine 0.5mg/mL",
    category: "Emergency",
    stock: 12,
    unit: "vials",
    reorderAt: 20,
    expiresAt: "2026-10-01",
  },
  {
    id: "inv-5",
    name: "Amlodipine 10mg",
    category: "CCB",
    stock: 300,
    unit: "tabs",
    reorderAt: 80,
    expiresAt: "2027-06-30",
  },
  {
    id: "inv-6",
    name: "Levetiracetam 500mg",
    category: "Anticonvulsant",
    stock: 150,
    unit: "tabs",
    reorderAt: 60,
    expiresAt: "2027-03-15",
  },
];

const STATUS_CFG: Record<
  DispenseStatus,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  queued: {
    label: "Queued",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    dot: "bg-amber-500",
  },
  dispensing: {
    label: "Dispensing",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    dot: "bg-blue-500",
  },
  dispensed: {
    label: "Dispensed",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  on_hold: {
    label: "On Hold",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-500",
  },
};

export default function PharmacyPage() {
  const [prescriptions, setPrescriptions] =
    useState<PrescriptionItem[]>(MOCK_PRESCRIPTIONS);
  const [search, setSearch] = useState("");

  const counts = {
    total: prescriptions.length,
    queued: prescriptions.filter((p) => p.status === "queued").length,
    dispensing: prescriptions.filter((p) => p.status === "dispensing").length,
    dispensed: prescriptions.filter((p) => p.status === "dispensed").length,
  };

  const filtered = prescriptions.filter(
    (p) =>
      !search ||
      p.patientName.toLowerCase().includes(search.toLowerCase()) ||
      p.medication.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDispense = (id: string) => {
    setPrescriptions((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "queued" ? "dispensing" : "dispensed" }
          : p,
      ),
    );
    toast.success("Prescription status updated.");
  };

  const lowStock = MOCK_INVENTORY.filter((i) => i.stock <= i.reorderAt);

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">
          <span>Admin</span>
          <FiChevronRight className="h-3 w-3" />
          <span className="text-rose-500">Pharmacy</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <MdOutlineLocalPharmacy className="h-5 w-5 text-rose-600 dark:text-rose-500 " />
          </div>
          Pharmacy
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 ml-12">
          Prescription dispense queue and drug inventory management.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Rx",
            value: counts.total,
            color: "text-slate-600 dark:text-zinc-300",
            bg: "bg-slate-500/10",
            border: "border-slate-200 dark:border-zinc-800",
            icon: BsClipboard2Check,
          },
          {
            label: "Queued",
            value: counts.queued,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-500/10",
            border: "border-amber-200 dark:border-amber-900/50",
            icon: FiPackage,
          },
          {
            label: "Dispensing",
            value: counts.dispensing,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-200 dark:border-blue-900/50",
            icon: MdMedication,
          },
          {
            label: "Dispensed",
            value: counts.dispensed,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-200 dark:border-emerald-900/50",
            icon: BsBoxSeam,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-white dark:bg-zinc-900 border ${stat.border} rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow`}
            >
              <div
                className={`h-11 w-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}
              >
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <div className={`text-2xl font-extrabold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mt-0.5">
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
          <GiMedicines className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-amber-700 dark:text-amber-400">
              Low Stock Alert
            </div>
            <div className="text-xs text-amber-600 dark:text-amber-500 mt-1">
              {lowStock
                .map((d) => `${d.name} (${d.stock} ${d.unit} left)`)
                .join(" · ")}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dispense Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                Dispense Queue
              </h2>
              <div className="flex items-center gap-2 border border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50 dark:bg-zinc-800/50 px-3 py-1.5 focus-within:border-rose-500 transition-all">
                <FiSearch className="h-3 w-3 text-slate-400 shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search…"
                  className="bg-transparent outline-none text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 w-32"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-100 dark:border-zinc-800">
                    {[
                      "Patient",
                      "Medication",
                      "Dosage",
                      "Qty",
                      "Prescribed By",
                      "Status",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {filtered.map((p) => {
                    const sc = STATUS_CFG[p.status];
                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-rose-50/30 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        <td className="px-4 py-3 text-xs font-bold text-slate-800 dark:text-zinc-100 whitespace-nowrap">
                          {p.patientName}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                            {p.medication}
                          </div>
                          {p.notes && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {p.notes}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 dark:text-zinc-400 whitespace-nowrap">
                          {p.dosage}
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-slate-700 dark:text-zinc-200">
                          {p.quantity}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 dark:text-zinc-400 whitespace-nowrap">
                          {p.prescribedBy}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-lg ${sc.color} ${sc.bg} border ${sc.border}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${sc.dot}`}
                            />
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {(p.status === "queued" ||
                            p.status === "dispensing") && (
                            <button
                              onClick={() => handleDispense(p.id)}
                              className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white cursor-pointer transition-all"
                            >
                              {p.status === "queued" ? "Start" : "Complete"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Inventory Panel */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
              Drug Inventory
            </h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
            {MOCK_INVENTORY.map((d) => {
              const pct = Math.min(
                100,
                Math.round((d.stock / (d.reorderAt * 5)) * 100),
              );
              const isLow = d.stock <= d.reorderAt;
              return (
                <div key={d.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-zinc-100">
                        {d.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {d.category}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-xs font-extrabold ${isLow ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}
                      >
                        {d.stock}
                      </div>
                      <div className="text-[10px] text-slate-400">{d.unit}</div>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isLow ? "bg-red-500" : "bg-emerald-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
