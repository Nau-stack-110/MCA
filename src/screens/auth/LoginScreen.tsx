import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { AppButton } from "../../components/ui/AppButton";

type Props = {
  onLogin: () => void;
  goToRegister: () => void;
};

export function LoginScreen({ onLogin, goToRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 justify-center bg-slate-50 px-6">
      <Text className="mb-1 text-3xl font-bold text-blue-700">MediCare Connect</Text>
      <Text className="mb-8 text-slate-500">Connexion patient ou docteur</Text>

      <TextInput
        className="mb-3 rounded-xl bg-white p-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="mb-5 rounded-xl bg-white p-4"
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <AppButton label="Se connecter" onPress={onLogin} />
      <View className="mt-4">
        <AppButton label="Créer un compte" onPress={goToRegister} variant="secondary" />
      </View>
    </View>
  );
}
