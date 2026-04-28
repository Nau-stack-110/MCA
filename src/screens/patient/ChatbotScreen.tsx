import { Text, View } from "react-native";
import { Card } from "../../components/ui/Card";

export function ChatbotScreen() {
  return (
    <View className="flex-1 bg-slate-50 px-4 pt-6">
      <Text className="mb-4 text-xl font-bold text-blue-700">Consultation Chatbot</Text>
      <Card className="mb-3">
        <Text className="font-semibold text-slate-700">Bot:</Text>
        <Text className="mt-1 text-slate-700">
          Bonjour, je suis votre assistant medical. Decrivez vos symptomes.
        </Text>
      </Card>
      <Card>
        <Text className="font-semibold text-slate-700">Patient:</Text>
        <Text className="mt-1 text-slate-700">Je ressens une douleur thoracique legere.</Text>
      </Card>
    </View>
  );
}
