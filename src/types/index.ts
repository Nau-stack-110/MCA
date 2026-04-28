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
  availability: "Available" | "Busy" | "Limited";
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
};

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  time: string;
};
