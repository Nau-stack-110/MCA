import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { AppButton } from "../../components/ui/AppButton";
import { Card } from "../../components/ui/Card";
import { PriorityBadge } from "../../components/ui/PriorityBadge";
import { AiResult, Severity } from "../../types";
import { symptomsAnalysis } from "../../data/mockData";

type Props = {
  openChatbot: () => void;
  openVideoCall: () => void;
};

const severityByKeyword: Record<string, Severity> = {
  thorax: "critical",
  poitrine: "critical",
  essoufflement: "critical",
  fievre: "medium",
  fracture: "medium",
  migraine: "low",
  fatigue: "low",
};

const symptomChoices = [
  { id: "thorax", label: "Douleur thoracique" },
  { id: "souffle", label: "Essoufflement" },
  { id: "fievre", label: "Fievre elevee" },
  { id: "fracture", label: "Suspicion de fracture" },
  { id: "vertige", label: "Vertiges" },
  { id: "maux", label: "Maux de tete" },
];

export function PatientHomeScreen({ openChatbot, openVideoCall }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;
  const [symptoms, setSymptoms] = useState("Douleur thoracique avec gene respiratoire depuis 15 minutes.");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(["thorax", "souffle"]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResult | null>(null);
  const [ambulanceRequested, setAmbulanceRequested] = useState(false);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [pulse]);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const analyzeSymptoms = () => {
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const selectedLabels = symptomChoices
        .filter((item) => selectedSymptoms.includes(item.id))
        .map((item) => item.label.toLowerCase())
        .join(" ");
      const normalized = `${symptoms} ${selectedLabels}`.toLowerCase();
      const severity =
        Object.entries(severityByKeyword).find(([key]) => normalized.includes(key))?.[1] || "low";
      const details = symptomsAnalysis[severity];
      setResult({
        severity,
        suggestedAction: details.action,
        suggestedSpecialty: details.specialty,
      });
      setLoading(false);
    }, 1300);
  };

  return (
    <View className="flex-1 bg-[#070b12]">
      <ScrollView className="flex-1 px-4 pt-6" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="rounded-[28px] border border-cyan-400/10 bg-[#09111b] px-5 py-5">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-xs uppercase tracking-[2px] text-cyan-300">Tableau patient</Text>
              <Text className="mt-2 text-3xl font-bold text-white">Suivi medical intelligent</Text>
              <Text className="mt-2 text-sm leading-6 text-slate-400">
                Triage, urgence et aide conversationnelle au meme endroit.
              </Text>
            </View>
            <View className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <Ionicons name="pulse" size={24} color="#67e8f9" />
            </View>
          </View>

          <View className="mt-5 flex-row gap-3">
            <View className="flex-1 rounded-2xl border border-emerald-400/15 bg-emerald-400/10 px-4 py-3">
              <Text className="text-xs uppercase tracking-[1.5px] text-emerald-200">Statut</Text>
              <Text className="mt-2 text-lg font-semibold text-white">Stable</Text>
            </View>
            <View className="flex-1 rounded-2xl border border-amber-400/15 bg-amber-400/10 px-4 py-3">
              <Text className="text-xs uppercase tracking-[1.5px] text-amber-100">Dernier triage</Text>
              <Text className="mt-2 text-lg font-semibold text-white">{result ? "Actualise" : "En attente"}</Text>
            </View>
          </View>
        </View>

        <View className="mt-4 flex-row gap-3">
          <Card className="flex-1 border-red-500/20 bg-[#190d12]">
            <View className="flex-row items-center justify-between">
              <View className="rounded-2xl bg-red-500/15 p-3">
                <Ionicons name="warning" size={22} color="#fca5a5" />
              </View>
              {ambulanceRequested ? (
                <View className="rounded-full bg-red-500/15 px-3 py-1">
                  <Text className="text-xs text-red-200">En cours</Text>
                </View>
              ) : null}
            </View>
            <Text className="mt-4 text-lg font-semibold text-white">Urgence</Text>
            <Text className="mt-1 text-sm text-slate-400">Acces prioritaire ambulance.</Text>
            <View className="mt-4">
              <AppButton
                label={ambulanceRequested ? "Ambulance demandee" : "Alerter"}
                onPress={() => setAmbulanceRequested(true)}
                variant="danger"
              />
            </View>
          </Card>

          <Card className="flex-1">
            <View className="flex-row items-center justify-between">
              <View className="rounded-2xl bg-blue-500/15 p-3">
                <Ionicons name="videocam" size={22} color="#93c5fd" />
              </View>
              <View className="rounded-full bg-white/5 px-3 py-1">
                <Text className="text-xs text-slate-300">Live</Text>
              </View>
            </View>
            <Text className="mt-4 text-lg font-semibold text-white">Teleconsultation</Text>
            <Text className="mt-1 text-sm text-slate-400">Lancer un appel video securise.</Text>
            <View className="mt-4">
              <AppButton label="Appeler" onPress={openVideoCall} />
            </View>
          </Card>
        </View>

        <Card className="mt-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-bold text-white">Triage express</Text>
              <Text className="mt-1 text-sm text-slate-400">Selection rapide, puis description libre.</Text>
            </View>
            <View className="rounded-full bg-[#0b1119] px-3 py-1">
              <Text className="text-xs text-slate-300">{selectedSymptoms.length} signes</Text>
            </View>
          </View>

          <View className="mt-4 flex-row flex-wrap">
            {symptomChoices.map((item) => {
              const active = selectedSymptoms.includes(item.id);
              return (
                <Pressable
                  key={item.id}
                  onPress={() => toggleSymptom(item.id)}
                  className={`mb-3 mr-3 rounded-2xl border px-4 py-3 ${
                    active ? "border-cyan-300 bg-cyan-400/10" : "border-white/10 bg-[#0b1119]"
                  }`}
                >
                  <Text className={`${active ? "text-cyan-100" : "text-slate-200"}`}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <TextInput
            className="mt-1 rounded-2xl border border-white/10 bg-[#0b1119] p-4 text-white"
            multiline
            placeholder="Ex: douleur, duree, intensite, respiration..."
            placeholderTextColor="#64748b"
            value={symptoms}
            onChangeText={setSymptoms}
          />
          <View className="mt-4">
            <AppButton label="Analyser maintenant" onPress={analyzeSymptoms} loading={loading} />
          </View>
        </Card>

        {result ? (
          <Card className="mt-4 border-cyan-400/10 bg-[#0d1724]">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-semibold text-white">Resultat</Text>
              <PriorityBadge severity={result.severity} />
            </View>
            <View className="mt-4 flex-row gap-3">
              <View className="flex-1 rounded-2xl bg-[#0b1119] px-4 py-3">
                <Text className="text-xs uppercase tracking-[1.5px] text-slate-500">Action</Text>
                <Text className="mt-2 text-sm leading-6 text-slate-200">{result.suggestedAction}</Text>
              </View>
              <View className="flex-1 rounded-2xl bg-[#0b1119] px-4 py-3">
                <Text className="text-xs uppercase tracking-[1.5px] text-slate-500">Orientation</Text>
                <Text className="mt-2 text-sm leading-6 text-slate-200">{result.suggestedSpecialty}</Text>
              </View>
            </View>
          </Card>
        ) : null}
      </ScrollView>

      <Animated.View
        style={{
          position: "absolute",
          right: 20,
          bottom: 24,
          transform: [{ scale: pulse }],
        }}
      >
        <Pressable
          accessibilityRole="button"
          onPress={openChatbot}
          className="h-16 w-16 items-center justify-center rounded-full border border-cyan-300/30 bg-[#0e7490] shadow-2xl shadow-cyan-900/40"
        >
          <Ionicons name="chatbubble-ellipses" size={28} color="#ecfeff" />
        </Pressable>
      </Animated.View>
    </View>
  );
}
