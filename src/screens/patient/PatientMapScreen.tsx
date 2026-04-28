import { FlatList, Text, View } from "react-native";
import { Card } from "../../components/ui/Card";
import { hospitals } from "../../data/mockData";

export function PatientMapScreen() {
  return (
    <View className="flex-1 bg-[#070b12] px-4 pt-6">
      <Text className="mb-1 text-xl font-bold text-white">Carte et hopitaux proches</Text>
      <Text className="mb-4 text-sm text-slate-400">Apercu de la carte OpenStreetMap et capacite de prise en charge.</Text>

      <Card className="mb-4">
        <Text className="text-base font-semibold text-white">Apercu OpenStreetMap</Text>
        <Text className="mt-1 text-sm text-slate-400">Integration prevue avec tuiles OSM et geolocalisation temps reel.</Text>
        <View className="mt-4 h-48 rounded-[20px] border border-white/10 bg-[#0b1119] p-4">
          <View className="flex-1 rounded-[16px] border border-dashed border-slate-700 bg-[#101826]" />
          <View className="mt-3 flex-row justify-between">
            <Text className="text-xs text-red-300">Patient</Text>
            <Text className="text-xs text-orange-300">Ambulance</Text>
            <Text className="text-xs text-emerald-300">Hopital</Text>
          </View>
        </View>
      </Card>

      <FlatList
        data={hospitals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card className="mb-3">
            <View className="flex-row items-start justify-between">
              <View className="max-w-[70%]">
                <Text className="text-base font-semibold text-white">{item.name}</Text>
                <Text className="mt-1 text-slate-400">Distance: {item.distance}</Text>
                <Text className="mt-1 text-slate-400">Temps estime: {item.eta}</Text>
              </View>
              <Text
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.availability === "Disponible"
                    ? "bg-emerald-500/15 text-emerald-300"
                    : item.availability === "Limite"
                      ? "bg-orange-500/15 text-orange-300"
                      : "bg-red-500/15 text-red-300"
                }`}
              >
                {item.availability}
              </Text>
            </View>
          </Card>
        )}
      />
    </View>
  );
}
