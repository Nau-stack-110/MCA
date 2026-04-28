import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Alert, Linking, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { Card } from "../../components/ui/Card";
import { ambulanceFleet } from "../../data/mockData";

export function AmbulanceTrackingScreen() {
  const sortedAmbulances = useMemo(() => {
    const statusPriority = (status: string) => {
      if (status === "Disponible") {
        return 0;
      }
      if (status === "En preparation") {
        return 1;
      }
      return 2;
    };

    return [...ambulanceFleet].sort((a, b) => {
      const priorityDelta = statusPriority(a.status) - statusPriority(b.status);
      if (priorityDelta !== 0) {
        return priorityDelta;
      }
      return a.distanceKm - b.distanceKm;
    });
  }, []);

  const leadAmbulance = sortedAmbulances[0];

  const callAmbulance = async (phone: string) => {
    const phoneUrl = Platform.OS === "ios" ? `telprompt:${phone}` : `tel:${phone}`;
    try {
      await Linking.openURL(phoneUrl);
    } catch {
      Alert.alert("Appel indisponible", "Testez sur un vrai telephone avec application d&apos;appel.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#070b12] px-4 pt-6" contentContainerStyle={{ paddingBottom: 32 }}>
      <Text className="mb-1 text-xl font-bold text-white">Ambulances disponibles</Text>
      <Text className="mb-4 text-sm text-slate-400">Triees par disponibilite puis distance. Appel direct en un clic.</Text>
      <Card>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-base font-semibold text-white">{leadAmbulance.label}</Text>
            <Text className="mt-1 text-slate-400">{leadAmbulance.status}</Text>
          </View>
          <Text className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-300">
            ETA {leadAmbulance.eta}
          </Text>
        </View>
        <View className="mt-4 h-3 rounded-full bg-slate-800">
          <View className="h-3 rounded-full bg-red-500" style={{ width: `${leadAmbulance.progress}%` }} />
        </View>
        <Text className="mt-2 text-slate-400">{leadAmbulance.progress}% du trajet complete</Text>
        <Text className="mt-2 text-slate-500">Equipe: {leadAmbulance.crew}</Text>
      </Card>

      <Card className="mt-4">
        <Text className="font-semibold text-white">Numeros des ambulances</Text>
        <Text className="mt-1 text-sm text-slate-400">Touchez l&apos;icone telephone pour appeler immediatement.</Text>

        <View className="mt-3 gap-3">
          {sortedAmbulances.map((ambulance) => (
            <View key={ambulance.id} className="rounded-2xl border border-white/10 bg-[#0b1119] p-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-sm font-semibold text-white">{ambulance.label}</Text>
                  <Text className="mt-1 text-xs text-slate-300">
                    {ambulance.status} • {ambulance.distanceKm.toFixed(1)} km • ETA {ambulance.eta}
                  </Text>
                  <Text className="mt-1 text-xs text-slate-400">{ambulance.phone}</Text>
                </View>

                <Pressable
                  onPress={() => callAmbulance(ambulance.phone)}
                  className="h-10 w-10 items-center justify-center rounded-full bg-emerald-600"
                >
                  <Ionicons name="call" size={18} color="#fff" />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}
