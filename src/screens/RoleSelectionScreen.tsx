import { Text, View } from "react-native";
import { AppButton } from "../components/ui/AppButton";
import { Card } from "../components/ui/Card";

type Props = {
  onSelectRole: (role: "patient" | "doctor") => void;
};

export function RoleSelectionScreen({ onSelectRole }: Props) {
  return (
    <View className="flex-1 justify-center bg-[#070b12] px-6">
      <Text className="mb-2 text-xs uppercase tracking-[2px] text-slate-500">Selection du parcours</Text>
      <Text className="mb-2 text-3xl font-bold text-white">Choisissez votre role</Text>
      <Text className="mb-8 text-slate-400">
        Meme flux applicatif, experience adaptee pour le patient et le medecin.
      </Text>

      <Card>
        <Text className="mb-4 text-lg font-semibold text-white">Acces rapide</Text>
        <AppButton label="Entrer en mode patient" onPress={() => onSelectRole("patient")} />
        <View className="mt-4">
          <AppButton
            label="Entrer en mode docteur"
            onPress={() => onSelectRole("doctor")}
            variant="danger"
          />
        </View>
      </Card>
    </View>
  );
}
