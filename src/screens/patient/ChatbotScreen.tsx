import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { hasOpenRouterKey, requestOpenRouterChat } from "../../services/openRouter";
import { Severity } from "../../types";

type ChatUser = {
  _id: number;
  name: string;
};

type ChatMessage = {
  _id: number;
  text: string;
  createdAt: Date;
  user: ChatUser;
};

const BOT_USER: ChatUser = {
  _id: 2,
  name: "MADA-CARE",
};

const PATIENT_USER: ChatUser = {
  _id: 1,
  name: "Patient",
};

const AI_SYSTEM_PROMPT = `
Tu es MADA-CARE, un assistant médical conversationnel.

OBJECTIF :
Discuter avec le patient pour comprendre ses symptômes et donner une orientation médicale avec des conseils de secours si nécessaire.

COMPORTEMENT :
- Analyse les symptômes
- Pose UNE question si nécessaire
- Donne une recommandation claire si possible
- Si pertinent, proposer une ordonnance de secours simple et prudente

STYLE :
- Français naturel
- Ton humain, empathique
- 1 à 3 phrases maximum

IMPORTANT :
- Ne répète pas les mêmes réponses
- Adapte ta réponse à chaque message
- Varie ton langage

URGENCE :
- Si symptômes graves → dire d'aller aux urgences immédiatement

INTERDIT :
- Pas de liste
- Pas de texte long
`;

function detectSeverity(text: string): Severity {
  const t = text.toLowerCase();

  if (
    t.includes("poitrine") ||
    t.includes("respirer") ||
    t.includes("essoufflement") ||
    t.includes("malaise")
  ) return "critical";

  if (
    t.includes("fievre") ||
    t.includes("toux") ||
    t.includes("vomissement")
  ) return "medium";

  return "low";
}

function formatReply(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  const sentences = clean.match(/[^.!?]+[.!?]?/g)?.map((s) => s.trim()) ?? [];
  return sentences.slice(0, 3).join(" ");
}

export function ChatbotScreen() {
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const aiEnabled = hasOpenRouterKey();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      _id: 1,
      text: "Bonjour, décrivez vos symptômes pour que je puisse vous aider.",
      createdAt: new Date(),
      user: BOT_USER,
    },
  ]);

  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
    [messages]
  );

  const pushBotMessage = useCallback((text: string) => {
    const botMessage: ChatMessage = {
      _id: Date.now() + Math.random(),
      text,
      createdAt: new Date(),
      user: BOT_USER,
    };

    setMessages((prev) => [...prev, botMessage]);
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const sendMessage = useCallback(async () => {
    const text = draft.trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      _id: Date.now(),
      text,
      createdAt: new Date(),
      user: PATIENT_USER,
    };

    setDraft("");
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const severity = detectSeverity(text);

    if (severity === "critical") {
      pushBotMessage("Cela peut être grave, rendez-vous immédiatement aux urgences.");
      setIsTyping(false);
      return;
    }

    if (text.length < 8) {
      pushBotMessage("Pouvez-vous préciser vos symptômes ?");
      setIsTyping(false);
      return;
    }

    try {
      if (aiEnabled) {
        const history = [...sortedMessages, userMessage]
          .slice(-10)
          .map((msg) => ({
            role: msg.user._id === 1 ? "user" : "assistant",
            content: msg.text,
          }));

        const result = await requestOpenRouterChat([
          { role: "system", content: AI_SYSTEM_PROMPT },
          ...history,
        ]);

        pushBotMessage(formatReply(result.content));
      } else {
        pushBotMessage("Paracetamol 500 mg si fievre ou douleur legere, repos et hydratation. Consultez rapidement si aggravation.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      console.log("[ChatbotScreen] OpenRouter error:", errorMessage);
      pushBotMessage("Service IA indisponible. Ordonnance de secours: paracetamol 500 mg si besoin, hydratation, repos, et urgence si aggravation.");
    } finally {
      setIsTyping(false);
    }
  }, [draft, sortedMessages, pushBotMessage, aiEnabled]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#070b12]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="px-4 pt-6 pb-3">
        <Text className="text-white text-xl font-bold">Assistant médical</Text>
      </View>

      <FlatList
        ref={listRef}
        data={sortedMessages}
        keyExtractor={(i) => i._id.toString()}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => {
          const isUser = item.user._id === 1;

          return (
            <View className={isUser ? "items-end" : "items-start"}>
              <View className={`px-4 py-3 rounded-2xl ${isUser ? "bg-blue-600" : "bg-[#17202b]"}`}>
                <Text className="text-white">{item.text}</Text>
              </View>
            </View>
          );
        }}
      />

      {isTyping && (
        <View className="p-3 flex-row items-center">
          <ActivityIndicator color="#fff" />
          <Text className="text-slate-400 ml-2">Analyse...</Text>
        </View>
      )}

      <View className="flex-row p-3 bg-[#0f1722]">
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Décrivez vos symptômes..."
          placeholderTextColor="#64748b"
          className="flex-1 text-white"
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
