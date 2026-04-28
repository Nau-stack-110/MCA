import { FlatList, Text, View } from "react-native";
import { Card } from "../../components/ui/Card";
import { hospitals } from "../../data/mockData";

export function PatientMapScreen() {
  return (
    <View className="flex-1 bg-slate-50 px-4 pt-6">
      <Text className="mb-4 text-xl font-bold text-blue-700">Hopitaux proches</Text>
      <FlatList
        data={hospitals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card className="mb-3">
            <Text className="text-base font-semibold text-slate-800">{item.name}</Text>
            <Text className="mt-1 text-slate-600">Distance: {item.distance}</Text>
            <Text className="mt-1 text-slate-600">Disponibilite: {item.availability}</Text>
          </Card>
        )}
      />
    </View>
  );
}
