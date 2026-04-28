import { FlatList, Text, View } from "react-native";
import { Card } from "../../components/ui/Card";
import { doctorNotifications } from "../../data/mockData";

export function NotificationsScreen() {
  return (
    <View className="flex-1 bg-[#070b12] px-4 pt-6">
      <Text className="mb-1 text-xl font-bold text-white">Notifications</Text>
      <Text className="mb-4 text-sm text-slate-400">Alertes medecin et rappel des interventions prioritaires.</Text>
      <FlatList
        data={doctorNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card className="mb-3">
            <Text className="font-semibold text-white">{item.title}</Text>
            <Text className="mt-1 text-slate-300">{item.message}</Text>
            <Text className="mt-1 text-xs text-slate-500">{item.time}</Text>
          </Card>
        )}
      />
    </View>
  );
}
