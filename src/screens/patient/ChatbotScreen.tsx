import { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { symptomsAnalysis } from "../../data/mockData";
import { Severity } from "../../types";

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

  return `Niveau evalue: ${statusLabel}\nAction: ${guidance.action}\nOrientation: ${guidance.specialty}`;
}

export function ChatbotScreen() {
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      _id: 1,
      text: "Bonjour, je suis votre assistant medical. Decrivez vos symptomes pour une premiere orientation.",
      createdAt: new Date(),
      user: BOT_USER,
    },
  ]);
  const [draft, setDraft] = useState("");

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
    [messages]
  );

  const onSend = useCallback(() => {
    const trimmedDraft = draft.trim();

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

    const botMessage: ChatMessage = {
      _id: Date.now() + 1,
      text: buildBotReply(trimmedDraft),
      createdAt: new Date(),
      user: BOT_USER,
    };

    setTimeout(() => {
      setMessages((previousMessages) => [...previousMessages, botMessage]);
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    }, 500);
  }, [draft]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#070b12]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
    >
      <View className="px-4 pb-3 pt-6">
        <Text className="mb-1 text-xl font-bold text-white">Assistant de triage</Text>
        <Text className="text-sm text-slate-400">
          Chat frontend avec logique locale. Aucun backend necessaire pour cette premiere version.
        </Text>
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
      />

      <View className="mx-3 mb-3 mt-2 flex-row items-end rounded-3xl border border-slate-800 bg-[#0f1722] px-3 py-2">
        <TextInput
          className="max-h-28 flex-1 px-2 py-3 text-white"
          placeholder="Decrivez vos symptomes..."
          placeholderTextColor="#64748b"
          value={draft}
          multiline
          onChangeText={setDraft}
        />
        <TouchableOpacity
          className="mb-1 ml-2 rounded-full bg-red-600 p-3"
          accessibilityRole="button"
          onPress={onSend}
        >
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
