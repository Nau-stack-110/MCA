import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { symptomsAnalysis } from "../../data/mockData";
import { Severity } from "../../types";
import { hasOpenRouterKey, requestOpenRouterChat } from "../../services/openRouter";

type ChatUser = {
  _id: number;
  name: string;
  avatar?: string;
};

type ChatMessage = {
  _id: number;
  text: string;
  createdAt: Date;
  user: ChatUser;
};

const AI_SYSTEM_PROMPT = `
Tu es MADA-CARE, un assistant de pre-triage medical francophone.
Tu reponds avec empathie, clarte et concision.
Tu n'inventes jamais un diagnostic certain.
Si les symptomes evoquent une urgence vitale, demande immediatement d'appeler les urgences ou de consulter sans attendre.
Structure les reponses en phrases courtes, facilement lisibles sur mobile.
`;

const QUICK_PROMPTS = [
  "J'ai de la fievre depuis 2 jours",
  "Je ressens une douleur thoracique",
  "Mon enfant tousse beaucoup",
];

const BOT_USER: ChatUser = {
  _id: 2,
  name: "MADA-CARE Bot",
  avatar: "https://ui-avatars.com/api/?name=MADA&background=dc2626&color=fff",
};

const PATIENT_USER: ChatUser = {
  _id: 1,
  name: "Patient",
};

function detectSeverity(text: string): Severity {
  const normalized = text.toLowerCase();

  if (
    normalized.includes("douleur thoracique") ||
    normalized.includes("poitrine") ||
    normalized.includes("essoufflement") ||
    normalized.includes("je n'arrive pas a respirer") ||
    normalized.includes("malaise")
  ) {
    return "critical";
  }

  if (
    normalized.includes("fievre") ||
    normalized.includes("vomissement") ||
    normalized.includes("fracture") ||
    normalized.includes("toux")
  ) {
    return "medium";
  }

  return "low";
}

function buildBotReply(text: string) {
  const severity = detectSeverity(text);
  const guidance = symptomsAnalysis[severity];
  const statusLabel =
    severity === "critical" ? "Critique" : severity === "medium" ? "Urgent" : "Normal";

  return `Niveau evalue: ${statusLabel}\nAction prioritaire: ${guidance.action}\nOrientation suggeree: ${guidance.specialty}\nSi les symptomes s'aggravent, contactez rapidement un professionnel de sante.`;
}

export function ChatbotScreen() {
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const aiEnabled = hasOpenRouterKey();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      _id: 1,
      text: aiEnabled
        ? "Bonjour, je suis votre assistant sante. Decrivez vos symptomes pour une premiere orientation claire et rapide."
        : "Bonjour, je suis votre assistant sante. Le mode intelligent n'est pas encore configure, mais je peux deja faire une premiere orientation locale.",
      createdAt: new Date(),
      user: BOT_USER,
    },
  ]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [statusLabel, setStatusLabel] = useState(aiEnabled ? "OpenRouter actif" : "Mode local");

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
    [messages]
  );

  const pushBotMessage = useCallback((text: string) => {
    const botMessage: ChatMessage = {
      _id: Date.now() + Math.floor(Math.random() * 1000),
      text,
      createdAt: new Date(),
      user: BOT_USER,
    };

    setMessages((previousMessages) => [...previousMessages, botMessage]);
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const sendMessage = useCallback(async (inputText?: string) => {
    const trimmedDraft = (inputText ?? draft).trim();

    if (!trimmedDraft) {
      return;
    }

    const userMessage: ChatMessage = {
      _id: Date.now(),
      text: trimmedDraft,
      createdAt: new Date(),
      user: PATIENT_USER,
    };

    setDraft("");
    setMessages((previousMessages) => [...previousMessages, userMessage]);
    setIsTyping(true);

    try {
      if (aiEnabled) {
        const history = [...sortedMessages, userMessage].slice(-8).map((message) => ({
          role: (message.user._id === PATIENT_USER._id ? "user" : "assistant") as "user" | "assistant",
          content: message.text,
        }));

        const result = await requestOpenRouterChat([
          { role: "system", content: AI_SYSTEM_PROMPT.trim() },
          ...history,
        ]);

        setStatusLabel(`IA active · ${result.model}`);
        pushBotMessage(result.content);
      } else {
        setStatusLabel("Mode local");
        pushBotMessage(buildBotReply(trimmedDraft));
      }
    } catch (error) {
      console.log("[ChatbotScreen] OpenRouter fallback:", error);
      setStatusLabel("Mode local de secours");
      pushBotMessage(buildBotReply(trimmedDraft));
    } finally {
      setIsTyping(false);
    }
  }, [aiEnabled, draft, pushBotMessage, sortedMessages]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#070b12]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
    >
      <View className="px-4 pb-3 pt-6">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="mb-1 text-xl font-bold text-white">Assistant de triage</Text>
            <Text className="text-sm text-slate-400">Conversation medicale guidee, rapide et lisible.</Text>
          </View>
          <View className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1">
            <Text className="text-xs text-cyan-100">{statusLabel}</Text>
          </View>
        </View>

        <View className="mt-4 flex-row flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <Pressable
              key={prompt}
              className="rounded-full border border-white/10 bg-[#0f1722] px-3 py-2"
              onPress={() => sendMessage(prompt)}
            >
              <Text className="text-xs text-slate-200">{prompt}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={sortedMessages}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const isPatient = item.user._id === PATIENT_USER._id;

          return (
            <View className={isPatient ? "items-end" : "items-start"}>
              <View
                className={
                  isPatient
                    ? "max-w-[85%] rounded-3xl rounded-br-md bg-blue-700 px-4 py-3"
                    : "max-w-[85%] rounded-3xl rounded-bl-md border border-slate-700 bg-[#17202b] px-4 py-3"
                }
              >
                <Text className={isPatient ? "text-white" : "text-slate-200"}>{item.text}</Text>
              </View>
              <Text className="mt-1 px-1 text-[11px] text-slate-500">
                {item.user.name} · {item.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </View>
          );
        }}
        ListFooterComponent={
          isTyping ? (
            <View className="mt-2 flex-row items-center gap-3 px-1">
              <View className="rounded-full border border-cyan-400/20 bg-[#12202e] px-4 py-3">
                <ActivityIndicator color="#67e8f9" />
              </View>
              <Text className="text-sm text-slate-400">Analyse en cours...</Text>
            </View>
          ) : null
        }
      />

      <View className="mx-3 mb-3 mt-2 flex-row items-end rounded-3xl border border-slate-800 bg-[#0f1722] px-3 py-2">
        <TextInput
          className="max-h-28 flex-1 px-2 py-3 text-white"
          placeholder="Decrivez vos symptomes..."
          placeholderTextColor="#64748b"
          value={draft}
          multiline
          onChangeText={setDraft}
          editable={!isTyping}
        />
        <TouchableOpacity
          className={`mb-1 ml-2 rounded-full p-3 ${isTyping ? "bg-slate-700" : "bg-red-600"}`}
          accessibilityRole="button"
          disabled={isTyping}
          onPress={() => sendMessage()}
        >
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
