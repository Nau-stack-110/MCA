import { Text, View } from "react-native";
import { Card } from "../../components/ui/Card";

export function AmbulanceTrackingScreen() {
  const progress = 72;

  return (
    <View className="flex-1 bg-slate-50 px-4 pt-6">
      <Text className="mb-4 text-xl font-bold text-blue-700">Suivi ambulance</Text>
      <Card>
        <Text className="text-base text-slate-700">Ambulance en route vers votre position</Text>
        <View className="mt-4 h-3 rounded-full bg-slate-200">
          <View className="h-3 rounded-full bg-red-500" style={{ width: `${progress}%` }} />
        </View>
        <Text className="mt-2 text-slate-600">{progress}% du trajet complete</Text>
      </Card>

      <Card className="mt-4">
        <Text className="font-semibold text-slate-800">Carte (mock UI)</Text>
        <View className="mt-3 h-40 rounded-xl bg-blue-100" />
      </Card>
    </View>
  );
}
