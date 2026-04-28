export type Severity = "low" | "medium" | "critical";

export type AiResult = {
  severity: Severity;
  suggestedAction: string;
  suggestedSpecialty: string;
};

export type Hospital = {
  id: string;
  name: string;
  distance: string;
  availability: "Disponible" | "Sature" | "Limite";
  eta?: string;
};

export type Consultation = {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  outcome: string;
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  symptoms: string;
  priority: Severity;
  aiSuggestion: string;
  location?: string;
  waitingTime?: string;
  ambulanceEta?: string;
};

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  time: string;
};

export type BedUnit = {
  id: string;
  label: string;
  total: number;
  occupied: number;
  openCritical: number;
};

export type AmbulanceStatus = {
  id: string;
  label: string;
  status: string;
  eta: string;
  progress: number;
  crew: string;
};
