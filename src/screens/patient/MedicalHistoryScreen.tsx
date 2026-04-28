import { FlatList, Text, View } from "react-native";
import { Card } from "../../components/ui/Card";
import { consultations } from "../../data/mockData";

export function MedicalHistoryScreen() {
  return (
    <View className="flex-1 bg-[#070b12] px-4 pt-6">
      <Text className="mb-1 text-xl font-bold text-white">Historique medical</Text>
      <Text className="mb-4 text-sm text-slate-400">Consultations et recommandations precedentes.</Text>
      <FlatList
        data={consultations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card className="mb-3">
            <Text className="text-base font-semibold text-white">{item.doctor}</Text>
            <Text className="text-slate-400">{item.specialty}</Text>
            <Text className="mt-1 text-slate-500">{item.date}</Text>
            <Text className="mt-2 text-slate-300">{item.outcome}</Text>
          </Card>
        )}
      />
    </View>
  );
}
