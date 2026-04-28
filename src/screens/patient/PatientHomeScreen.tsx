import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { AppButton } from "../../components/ui/AppButton";
import { Card } from "../../components/ui/Card";
import { PriorityBadge } from "../../components/ui/PriorityBadge";
import { AiResult, Severity } from "../../types";
import { symptomsAnalysis } from "../../data/mockData";

type Props = {
  openChatbot: () => void;
  openVideoCall: () => void;
};

const severityByKeyword: Record<string, Severity> = {
  thorax: "critical",
  poitrine: "critical",
  essoufflement: "critical",
  fievre: "medium",
  fracture: "medium",
  migraine: "low",
  fatigue: "low",
};

const symptomChoices = [
  { id: "thorax", label: "Douleur thoracique" },
  { id: "souffle", label: "Essoufflement" },
  { id: "fievre", label: "Fievre elevee" },
  { id: "fracture", label: "Suspicion de fracture" },
  { id: "vertige", label: "Vertiges" },
  { id: "maux", label: "Maux de tete" },
];

export function PatientHomeScreen({ openChatbot, openVideoCall }: Props) {
  const [symptoms, setSymptoms] = useState("Douleur thoracique avec gene respiratoire depuis 15 minutes.");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(["thorax", "souffle"]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResult | null>(null);
  const [ambulanceRequested, setAmbulanceRequested] = useState(false);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const analyzeSymptoms = () => {
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const selectedLabels = symptomChoices
        .filter((item) => selectedSymptoms.includes(item.id))
        .map((item) => item.label.toLowerCase())
        .join(" ");
      const normalized = `${symptoms} ${selectedLabels}`.toLowerCase();
      const severity =
        Object.entries(severityByKeyword).find(([key]) => normalized.includes(key))?.[1] || "low";
      const details = symptomsAnalysis[severity];
      setResult({
        severity,
        suggestedAction: details.action,
        suggestedSpecialty: details.specialty,
      });
      setLoading(false);
    }, 1300);
  };

  return (
    <ScrollView className="flex-1 bg-[#070b12] px-4 pt-6">
      <Card className="border-red-500/20 bg-[#190d12]">
        <Text className="text-xs uppercase tracking-[2px] text-red-300">Urgence en 2 tapes</Text>
        <Text className="mt-2 text-2xl font-bold text-white">Alerte immediate</Text>
        <Text className="mt-2 text-sm leading-6 text-slate-300">
          Appuyez pour declencher une urgence, puis confirmez la demande d'ambulance.
        </Text>
        <View className="mt-5 gap-3">
          <AppButton label="Declencher une alerte" onPress={() => setAmbulanceRequested(true)} variant="danger" />
          <AppButton
            label={ambulanceRequested ? "Ambulance demandee" : "Demander une ambulance"}
            onPress={() => setAmbulanceRequested(true)}
          />
        </View>
      </Card>

      <Card className="mt-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold text-white">Analyse des symptomes</Text>
            <Text className="mt-1 text-sm text-slate-400">
              Cases a cocher + description libre, prete pour une API IA plus tard.
            </Text>
          </View>
          <View className="rounded-full bg-[#0b1119] px-3 py-1">
            <Text className="text-xs text-slate-300">{selectedSymptoms.length} coches</Text>
          </View>
        </View>

        <View className="mt-4 flex-row flex-wrap">
          {symptomChoices.map((item) => {
            const active = selectedSymptoms.includes(item.id);
            return (
              <Pressable
                key={item.id}
                onPress={() => toggleSymptom(item.id)}
                className={`mb-3 mr-3 rounded-2xl border px-4 py-3 ${
                  active ? "border-red-400 bg-red-500/10" : "border-white/10 bg-[#0b1119]"
                }`}
              >
                <Text className={`${active ? "text-red-200" : "text-slate-200"}`}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <TextInput
          className="mt-2 rounded-2xl border border-white/10 bg-[#0b1119] p-4 text-white"
          multiline
          placeholder="Decrivez les symptomes observes..."
          placeholderTextColor="#64748b"
          value={symptoms}
          onChangeText={setSymptoms}
        />
        <View className="mt-4">
          <AppButton label="Lancer le triage" onPress={analyzeSymptoms} loading={loading} />
        </View>
      </Card>

      {result ? (
        <Card className="mt-4">
          <Text className="mb-2 text-base font-semibold text-white">Resultat du triage</Text>
          <PriorityBadge severity={result.severity} />
          <Text className="mt-3 text-slate-300">Action recommandee: {result.suggestedAction}</Text>
          <Text className="mt-1 text-slate-300">Orientation: {result.suggestedSpecialty}</Text>
        </Card>
      ) : null}

      <View className="mt-4 gap-3 pb-8">
        <AppButton label="Ouvrir l'assistant de sante" onPress={openChatbot} variant="secondary" />
        <AppButton label="Demarrer un appel video" onPress={openVideoCall} />
      </View>
    </ScrollView>
  );
}
