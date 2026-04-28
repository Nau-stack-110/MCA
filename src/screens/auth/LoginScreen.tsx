import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { AppButton } from "../../components/ui/AppButton";
import { Card } from "../../components/ui/Card";

type Props = {
  onLogin: () => void;
  goToRegister: () => void;
};

export function LoginScreen({ onLogin, goToRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 justify-center bg-[#070b12] px-6">
      <Text className="mb-2 text-xs uppercase tracking-[2px] text-slate-500">MADA-CARE AI SYSTEM</Text>
      <Text className="mb-2 text-3xl font-bold text-white">Connexion securisee</Text>
      <Text className="mb-8 text-slate-400">
        Accedez au parcours patient ou au tableau de bord medecin.
      </Text>

      <Card>
        <Text className="mb-4 text-lg font-semibold text-white">Bienvenue</Text>
        <TextInput
          className="mb-3 rounded-2xl border border-white/10 bg-[#0b1119] p-4 text-white"
          placeholder="Adresse e-mail"
          placeholderTextColor="#64748b"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className="mb-5 rounded-2xl border border-white/10 bg-[#0b1119] p-4 text-white"
          placeholder="Mot de passe"
          placeholderTextColor="#64748b"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <AppButton label="Se connecter" onPress={onLogin} />
        <View className="mt-4">
          <AppButton label="Creer un compte" onPress={goToRegister} variant="secondary" />
        </View>
      </Card>
    </View>
  );
}
