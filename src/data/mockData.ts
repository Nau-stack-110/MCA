import {
  AmbulanceStatus,
  AppNotification,
  BedUnit,
  Consultation,
  Hospital,
  Patient,
  Severity,
} from "../types";

export const symptomsAnalysis: Record<Severity, { action: string; specialty: string }> = {
  low: {
    action: "Surveillance simple, hydratation et consultation differée si besoin.",
    specialty: "Medecine generale",
  },
  medium: {
    action: "Evaluation rapide recommandee avec un medecin dans la journee.",
    specialty: "Medecine interne",
  },
  critical: {
    action: "Declencher une prise en charge immediate et prioritaire.",
    specialty: "Urgences",
  },
};

export const hospitals: Hospital[] = [
  {
    id: "h1",
    name: "Centre Hospitalier HJRA",
    distance: "1,8 km",
    availability: "Disponible",
    eta: "5 min",
  },
  {
    id: "h2",
    name: "Hopital Militaire de Soavinandriana",
    distance: "3,2 km",
    availability: "Limite",
    eta: "9 min",
  },
  {
    id: "h3",
    name: "Clinique Anosy Urgences",
    distance: "5,1 km",
    availability: "Sature",
    eta: "14 min",
  },
];

export const consultations: Consultation[] = [
  {
    id: "c1",
    doctor: "Dr L. Martin",
    specialty: "Cardiologie",
    date: "2026-03-14",
    outcome: "Traitement ajuste, controle recommande sous 2 semaines.",
  },
  {
    id: "c2",
    doctor: "Dr J. Dumas",
    specialty: "Medecine generale",
    date: "2026-02-09",
    outcome: "Infection resolue, aucune prise en charge complementaire necessaire.",
  },
];

export const patients: Patient[] = [
  {
    id: "p1",
    name: "Aina R.",
    age: 47,
    symptoms: "Douleur thoracique, essoufflement, sueurs froides.",
    priority: "critical",
    aiSuggestion: "Syndrome coronarien possible, ECG et accueil prioritaire recommandes.",
    location: "Analakely",
    waitingTime: "2 min",
    ambulanceEta: "4 min",
  },
  {
    id: "p2",
    name: "Feno T.",
    age: 32,
    symptoms: "Forte fievre, toux seche persistante, fatigue importante.",
    priority: "medium",
    aiSuggestion: "Infection respiratoire probable, evaluation rapide recommandee.",
    location: "Ankorondrano",
    waitingTime: "7 min",
    ambulanceEta: "8 min",
  },
  {
    id: "p3",
    name: "Soa M.",
    age: 25,
    symptoms: "Cephalee legere, fatigue et nausees.",
    priority: "low",
    aiSuggestion: "Probable deshydratation ou stress, repos et surveillance conseilles.",
    location: "Ambohijatovo",
    waitingTime: "11 min",
  },
];

export const doctorNotifications: AppNotification[] = [
  {
    id: "n1",
    title: "Cas critique assigne",
    message: "Aina R. requiert une validation immediate.",
    time: "Il y a 2 min",
  },
  {
    id: "n2",
    title: "Teleconsultation imminente",
    message: "La session avec Feno T. commence dans 15 minutes.",
    time: "Il y a 10 min",
  },
];

export const bedUnits: BedUnit[] = [
  { id: "b1", label: "Urgences", total: 18, occupied: 14, openCritical: 2 },
  { id: "b2", label: "Soins intensifs", total: 8, occupied: 7, openCritical: 1 },
  { id: "b3", label: "Observation", total: 14, occupied: 9, openCritical: 3 },
];

export const ambulanceFleet: AmbulanceStatus[] = [
  {
    id: "a1",
    label: "Ambulance 07",
    status: "En route",
    eta: "4 min",
    progress: 72,
    crew: "Dr Rakoto - Paramedic Jo",
    phone: "+261340000907",
    distanceKm: 1.2,
  },
  {
    id: "a2",
    label: "Ambulance 11",
    status: "En preparation",
    eta: "8 min",
    progress: 28,
    crew: "Nurse Miora - EMT Faly",
    phone: "+261340000911",
    distanceKm: 2.6,
  },
  {
    id: "a3",
    label: "Ambulance 15",
    status: "Disponible",
    eta: "6 min",
    progress: 0,
    crew: "Dr Tiana - EMT Solo",
    phone: "+261340000915",
    distanceKm: 1.9,
  },
];
