import { Text, View } from "react-native";
import { Card } from "../../components/ui/Card";

export function VideoCallScreen() {
  return (
    <View className="flex-1 bg-slate-900 px-4 pt-6">
      <Text className="mb-1 text-xl font-bold text-white">Teleconsultation video</Text>
      <Text className="mb-4 text-sm text-slate-400">Canal d'echange rapide entre patient et medecin.</Text>
      <Card className="bg-slate-800">
        <View className="h-80 rounded-xl bg-slate-700" />
        <Text className="mt-3 text-center text-white">Connexion securisee en cours...</Text>
      </Card>
    </View>
  );
}
