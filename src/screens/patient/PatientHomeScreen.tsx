import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
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
  chest: "critical",
  fever: "medium",
  headache: "low",
};

export function PatientHomeScreen({ openChatbot, openVideoCall }: Props) {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResult | null>(null);

  const analyzeSymptoms = () => {
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const normalized = symptoms.toLowerCase();
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
    <ScrollView className="flex-1 bg-slate-50 px-4 pt-6">
      <Card>
        <Text className="text-xl font-bold text-blue-700">Analyse des symptomes</Text>
        <TextInput
          className="mt-4 rounded-xl bg-slate-100 p-4"
          multiline
          placeholder="Ex: chest pain and dizziness..."
          value={symptoms}
          onChangeText={setSymptoms}
        />
        <View className="mt-4">
          <AppButton label="Analyser" onPress={analyzeSymptoms} loading={loading} />
        </View>
      </Card>

      {result && (
        <Card className="mt-4">
          <Text className="mb-2 text-base font-semibold text-slate-700">Resultat IA</Text>
          <PriorityBadge severity={result.severity} />
          <Text className="mt-3 text-slate-700">Action: {result.suggestedAction}</Text>
          <Text className="mt-1 text-slate-700">Specialite: {result.suggestedSpecialty}</Text>
        </Card>
      )}

      <View className="mt-4 gap-3 pb-8">
        <AppButton label="Demarrer consultation chatbot" onPress={openChatbot} />
        <AppButton label="Demarrer appel video" onPress={openVideoCall} variant="danger" />
      </View>
    </ScrollView>
  );
}
