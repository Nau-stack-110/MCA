import { FlatList, Pressable, Text, View } from "react-native";
import { Card } from "../../components/ui/Card";
import { PriorityBadge } from "../../components/ui/PriorityBadge";
import { ambulanceFleet, bedUnits, patients } from "../../data/mockData";

type Props = {
  openPatient: (id: string) => void;
};

export function DoctorDashboardScreen({ openPatient }: Props) {
  const sortedPatients = [...patients].sort((a, b) => {
    const severityOrder = { critical: 0, medium: 1, low: 2 };
    return severityOrder[a.priority] - severityOrder[b.priority];
  });

  return (
    <View className="flex-1 bg-[#070b12] px-4 pt-6">
      <Text className="mb-1 text-xl font-bold text-white">Tableau de bord medecin</Text>
      <Text className="mb-4 text-sm text-slate-400">Vue temps reel des cas, lits disponibles et ambulances actives.</Text>

      <Card className="mb-4">
        <Text className="text-base font-semibold text-white">Vue rapide</Text>
        <View className="mt-4 flex-row">
          <View className="mr-3 flex-1 rounded-2xl bg-red-500/15 p-3">
            <Text className="text-xs uppercase tracking-[1.2px] text-red-300">Critiques</Text>
            <Text className="mt-2 text-2xl font-bold text-white">
              {patients.filter((item) => item.priority === "critical").length}
            </Text>
          </View>
          <View className="mr-3 flex-1 rounded-2xl bg-emerald-500/15 p-3">
            <Text className="text-xs uppercase tracking-[1.2px] text-emerald-300">Lits critiques</Text>
            <Text className="mt-2 text-2xl font-bold text-white">
              {bedUnits.reduce((sum, item) => sum + item.openCritical, 0)}
            </Text>
          </View>
          <View className="flex-1 rounded-2xl bg-orange-500/15 p-3">
            <Text className="text-xs uppercase tracking-[1.2px] text-orange-300">Ambulances</Text>
            <Text className="mt-2 text-2xl font-bold text-white">{ambulanceFleet.length}</Text>
          </View>
        </View>
      </Card>

      <FlatList
        data={sortedPatients}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <Text className="mb-3 text-base font-semibold text-white">Patients tries par priorite</Text>
            <Card className="mb-4">
              <Text className="text-base font-semibold text-white">Gestion des lits</Text>
              {bedUnits.map((bed) => (
                <View key={bed.id} className="mt-3 rounded-2xl bg-[#0b1119] p-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-medium text-white">{bed.label}</Text>
                    <Text className="text-slate-400">
                      {bed.occupied}/{bed.total}
                    </Text>
                  </View>
                  <Text className="mt-1 text-xs text-slate-500">
                    {bed.openCritical} lit critique disponible
                    {bed.openCritical > 1 ? "s" : ""}
                  </Text>
                </View>
              ))}
            </Card>

            <Card className="mb-4">
              <Text className="text-base font-semibold text-white">Suivi des ambulances</Text>
              {ambulanceFleet.map((ambulance) => (
                <View key={ambulance.id} className="mt-3 rounded-2xl bg-[#0b1119] p-3">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="font-medium text-white">{ambulance.label}</Text>
                      <Text className="text-slate-400">{ambulance.status}</Text>
                    </View>
                    <Text className="text-orange-300">{ambulance.eta}</Text>
                  </View>
                  <View className="mt-3 h-2 rounded-full bg-slate-800">
                    <View className="h-2 rounded-full bg-orange-400" style={{ width: `${ambulance.progress}%` }} />
                  </View>
                </View>
              ))}
            </Card>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => openPatient(item.id)}>
            <Card className="mb-3">
              <View className="flex-row items-start justify-between">
                <View className="max-w-[72%]">
                  <Text className="text-base font-semibold text-white">{item.name}</Text>
                  <Text className="mb-2 text-slate-400">{item.symptoms}</Text>
                  <Text className="text-xs uppercase tracking-[1.2px] text-slate-500">
                    {item.location} - attente {item.waitingTime}
                  </Text>
                </View>
                <PriorityBadge severity={item.priority} />
              </View>
            </Card>
          </Pressable>
        )}
      />
    </View>
  );
}
