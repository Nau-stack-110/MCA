import { FlatList, Text, View } from "react-native";
import { Card } from "../../components/ui/Card";
import { doctorNotifications } from "../../data/mockData";

export function NotificationsScreen() {
  return (
    <View className="flex-1 bg-slate-50 px-4 pt-6">
      <Text className="mb-4 text-xl font-bold text-blue-700">Notifications</Text>
      <FlatList
        data={doctorNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card className="mb-3">
            <Text className="font-semibold text-slate-800">{item.title}</Text>
            <Text className="mt-1 text-slate-700">{item.message}</Text>
            <Text className="mt-1 text-xs text-slate-500">{item.time}</Text>
          </Card>
        )}
      />
    </View>
  );
}
