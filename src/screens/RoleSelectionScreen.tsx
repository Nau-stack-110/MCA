import { Text, View } from "react-native";
import { AppButton } from "../components/ui/AppButton";

type Props = {
  onSelectRole: (role: "patient" | "doctor") => void;
};

export function RoleSelectionScreen({ onSelectRole }: Props) {
  return (
    <View className="flex-1 justify-center bg-slate-50 px-6">
      <Text className="mb-2 text-3xl font-bold text-blue-700">Choisissez un role</Text>
      <Text className="mb-8 text-slate-500">Experience demo avec donnees mockees</Text>

      <AppButton label="Mode Patient" onPress={() => onSelectRole("patient")} />
      <View className="mt-4">
        <AppButton label="Mode Docteur" onPress={() => onSelectRole("doctor")} variant="danger" />
      </View>
    </View>
  );
}
