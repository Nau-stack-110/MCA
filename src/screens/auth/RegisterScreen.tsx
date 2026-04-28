import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { AppButton } from "../../components/ui/AppButton";

type Props = {
  onRegister: () => void;
  goToLogin: () => void;
};

export function RegisterScreen({ onRegister, goToLogin }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 justify-center bg-slate-50 px-6">
      <Text className="mb-1 text-3xl font-bold text-blue-700">Inscription</Text>
      <Text className="mb-8 text-slate-500">Créez votre profil de santé</Text>

      <TextInput
        className="mb-3 rounded-xl bg-white p-4"
        placeholder="Nom complet"
        value={name}
        onChangeText={setName}
      />
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
      <AppButton label="S'inscrire" onPress={onRegister} />
      <View className="mt-4">
        <AppButton label="Retour à la connexion" onPress={goToLogin} variant="secondary" />
      </View>
    </View>
  );
}
