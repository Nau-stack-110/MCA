import { Text, View } from "react-native";
import { Card } from "../../components/ui/Card";

export function ChatbotScreen() {
  return (
    <View className="flex-1 bg-[#070b12] px-4 pt-6">
      <Text className="mb-1 text-xl font-bold text-white">Assistant de triage</Text>
      <Text className="mb-4 text-sm text-slate-400">Interface conversationnelle compatible avec une future API IA.</Text>
      <Card className="mb-3">
        <Text className="font-semibold text-red-300">Assistant:</Text>
        <Text className="mt-1 text-slate-300">
          Bonjour, je suis votre assistant medical. Indiquez vos symptomes pour une premiere orientation.
        </Text>
      </Card>
      <Card>
        <Text className="font-semibold text-slate-200">Patient:</Text>
        <Text className="mt-1 text-slate-300">Je ressens une douleur thoracique legere avec gene respiratoire.</Text>
      </Card>
    </View>
  );
}
