import { Text, View } from "react-native";
import { Card } from "../../components/ui/Card";
import { ambulanceFleet } from "../../data/mockData";

export function AmbulanceTrackingScreen() {
  const ambulance = ambulanceFleet[0];

  return (
    <View className="flex-1 bg-[#070b12] px-4 pt-6">
      <Text className="mb-1 text-xl font-bold text-white">Suivi de l'ambulance</Text>
      <Text className="mb-4 text-sm text-slate-400">Confirmation de demande, progression et equipe embarquee.</Text>
      <Card>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-base font-semibold text-white">{ambulance.label}</Text>
            <Text className="mt-1 text-slate-400">{ambulance.status}</Text>
          </View>
          <Text className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-300">
            ETA {ambulance.eta}
          </Text>
        </View>
        <View className="mt-4 h-3 rounded-full bg-slate-800">
          <View className="h-3 rounded-full bg-red-500" style={{ width: `${ambulance.progress}%` }} />
        </View>
        <Text className="mt-2 text-slate-400">{ambulance.progress}% du trajet complete</Text>
        <Text className="mt-2 text-slate-500">Equipe: {ambulance.crew}</Text>
      </Card>

      <Card className="mt-4">
        <Text className="font-semibold text-white">Carte de suivi</Text>
        <Text className="mt-1 text-sm text-slate-400">Zone reservee a la visualisation OpenStreetMap.</Text>
        <View className="mt-3 h-40 rounded-[20px] border border-white/10 bg-[#0b1119]" />
      </Card>
    </View>
  );
}
