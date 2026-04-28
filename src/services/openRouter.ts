type ChatMessagePayload = {
  role: "system" | "user" | "assistant";
  content: string;
};

type OpenRouterChoice = {
  message?: {
    content?: string;
  };
};

type OpenRouterResponse = {
  choices?: OpenRouterChoice[];
  error?: {
    message?: string;
  };
};

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function getOpenRouterConfig() {
  const rawApiKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY?.trim();
  const apiKey = rawApiKey?.replace(/^['\"]|['\"]$/g, "");
  const model =
    process.env.EXPO_PUBLIC_OPENROUTER_MODEL?.trim() || "meta-llama/llama-3.1-8b-instruct:free";
  const appTitle = process.env.EXPO_PUBLIC_OPENROUTER_APP_TITLE?.trim() || "MADA-CARE";
  const referer = process.env.EXPO_PUBLIC_OPENROUTER_REFERER?.trim() || "https://mada-care.local";

  return {
    apiKey,
    appTitle,
    model,
    referer,
  };
}

export function hasOpenRouterKey() {
  return Boolean(getOpenRouterConfig().apiKey);
}

export async function requestOpenRouterChat(messages: ChatMessagePayload[]) {
  const { apiKey, appTitle, model, referer } = getOpenRouterConfig();

  if (!apiKey) {
    throw new Error("Clé OpenRouter manquante.");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": referer,
      "X-OpenRouter-Title": appTitle,
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_tokens: 220,
      messages,
    }),
  });

  let data: OpenRouterResponse = {};

  try {
    data = (await response.json()) as OpenRouterResponse;
  } catch {
    throw new Error(`OpenRouter error HTTP ${response.status}`);
  }

  if (!response.ok) {
    throw new Error(data.error?.message || `La requete OpenRouter a echoue (HTTP ${response.status}).`);
  }

  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("Reponse IA vide.");
  }

  return {
    content,
    model,
  };
}
