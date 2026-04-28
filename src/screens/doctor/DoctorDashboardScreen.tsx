import { FlatList, Pressable, Text, View } from "react-native";
import { Card } from "../../components/ui/Card";
import { PriorityBadge } from "../../components/ui/PriorityBadge";
import { patients } from "../../data/mockData";

type Props = {
  openPatient: (id: string) => void;
};

export function DoctorDashboardScreen({ openPatient }: Props) {
  return (
    <View className="flex-1 bg-slate-50 px-4 pt-6">
      <Text className="mb-4 text-xl font-bold text-blue-700">Patients a suivre</Text>
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => openPatient(item.id)}>
            <Card className="mb-3">
              <Text className="text-base font-semibold text-slate-800">{item.name}</Text>
              <Text className="mb-2 text-slate-600">{item.symptoms}</Text>
              <PriorityBadge severity={item.priority} />
            </Card>
          </Pressable>
        )}
      />
    </View>
  );
}
