import { FlatList, Text, View } from "react-native";
import { Card } from "../../components/ui/Card";
import { consultations } from "../../data/mockData";

export function MedicalHistoryScreen() {
  return (
    <View className="flex-1 bg-slate-50 px-4 pt-6">
      <Text className="mb-4 text-xl font-bold text-blue-700">Historique medical</Text>
      <FlatList
        data={consultations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card className="mb-3">
            <Text className="text-base font-semibold text-slate-800">{item.doctor}</Text>
            <Text className="text-slate-600">{item.specialty}</Text>
            <Text className="mt-1 text-slate-500">{item.date}</Text>
            <Text className="mt-2 text-slate-700">{item.outcome}</Text>
          </Card>
        )}
      />
    </View>
  );
}
