import { AppNotification, Consultation, Hospital, Patient, Severity } from "../types";

export const symptomsAnalysis: Record<Severity, { action: string; specialty: string }> = {
  low: {
    action: "Hydrate, rest, and monitor symptoms for 24h.",
    specialty: "General Practitioner",
  },
  medium: {
    action: "Book a same-day teleconsultation with a specialist.",
    specialty: "Internal Medicine",
  },
  critical: {
    action: "Call emergency services immediately.",
    specialty: "Emergency Medicine",
  },
};

export const hospitals: Hospital[] = [
  { id: "h1", name: "CityCare Hospital", distance: "1.8 km", availability: "Available" },
  { id: "h2", name: "Saint Mary Medical Center", distance: "3.2 km", availability: "Limited" },
  { id: "h3", name: "BlueCross Emergency", distance: "5.1 km", availability: "Busy" },
];

export const consultations: Consultation[] = [
  {
    id: "c1",
    doctor: "Dr. L. Martin",
    specialty: "Cardiology",
    date: "2026-03-14",
    outcome: "Medication adjusted, follow-up in 2 weeks.",
  },
  {
    id: "c2",
    doctor: "Dr. J. Dumas",
    specialty: "General Medicine",
    date: "2026-02-09",
    outcome: "Viral infection resolved, no additional treatment.",
  },
];

export const patients: Patient[] = [
  {
    id: "p1",
    name: "Adam K.",
    age: 47,
    symptoms: "Chest tightness, shortness of breath.",
    priority: "critical",
    aiSuggestion: "Possible acute coronary syndrome, urgent ECG advised.",
  },
  {
    id: "p2",
    name: "Maya T.",
    age: 32,
    symptoms: "Persistent fever and dry cough for 3 days.",
    priority: "medium",
    aiSuggestion: "Respiratory infection likely, chest exam recommended.",
  },
  {
    id: "p3",
    name: "Noah R.",
    age: 25,
    symptoms: "Mild headache and fatigue.",
    priority: "low",
    aiSuggestion: "Likely dehydration/stress, rest and hydration advised.",
  },
];

export const doctorNotifications: AppNotification[] = [
  {
    id: "n1",
    title: "Critical case assigned",
    message: "Adam K. needs immediate review.",
    time: "2 min ago",
  },
  {
    id: "n2",
    title: "Video consultation reminder",
    message: "Session with Maya T. starts in 15 minutes.",
    time: "10 min ago",
  },
];
