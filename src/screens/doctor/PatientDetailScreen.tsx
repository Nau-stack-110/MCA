import { Text, View } from "react-native";
import { AppButton } from "../../components/ui/AppButton";
import { Card } from "../../components/ui/Card";
import { patients } from "../../data/mockData";

type Props = {
  patientId?: string;
};

export function PatientDetailScreen({ patientId }: Props) {
  const patient = patients.find((p) => p.id === patientId) || patients[0];

  return (
    <View className="flex-1 bg-slate-50 px-4 pt-6">
      <Text className="mb-4 text-xl font-bold text-blue-700">Dossier patient</Text>
      <Card>
        <Text className="text-lg font-semibold text-slate-800">{patient.name}</Text>
        <Text className="mt-2 text-slate-700">Symptomes: {patient.symptoms}</Text>
        <Text className="mt-2 text-slate-700">Suggestion IA: {patient.aiSuggestion}</Text>
        <View className="mt-4">
          <AppButton label="Valider prescription" onPress={() => {}} />
        </View>
      </Card>
    </View>
  );
}
