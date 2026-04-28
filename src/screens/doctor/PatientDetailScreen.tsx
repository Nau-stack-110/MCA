import { Text, View } from "react-native";
import { AppButton } from "../../components/ui/AppButton";
import { Card } from "../../components/ui/Card";
import { PriorityBadge } from "../../components/ui/PriorityBadge";
import { patients } from "../../data/mockData";

type Props = {
  patientId?: string;
};

export function PatientDetailScreen({ patientId }: Props) {
  const patient = patients.find((p) => p.id === patientId) || patients[0];

  return (
    <View className="flex-1 bg-[#070b12] px-4 pt-6">
      <Text className="mb-1 text-xl font-bold text-white">Dossier patient</Text>
      <Text className="mb-4 text-sm text-slate-400">Synthese clinique, urgence estimee et proposition daction.</Text>
      <Card>
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-white">{patient.name}</Text>
          <PriorityBadge severity={patient.priority} />
        </View>
        <Text className="mt-3 text-slate-300">Symptomes: {patient.symptoms}</Text>
        <Text className="mt-2 text-slate-300">Suggestion IA: {patient.aiSuggestion}</Text>
        <Text className="mt-2 text-slate-500">
          Localisation: {patient.location} - Attente: {patient.waitingTime}
        </Text>
        <View className="mt-4">
          <AppButton label="Valider la prise en charge" onPress={() => {}} />
        </View>
      </Card>
    </View>
  );
}
