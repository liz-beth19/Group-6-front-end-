export type ChatMessage = {
  id: string;
  from: "user" | "admin" | "ai";
  text: string;
  time: string; // ISO
};

const CHAT_KEY = "gg_chat";

function save(msgs: ChatMessage[]) {
  localStorage.setItem(CHAT_KEY, JSON.stringify(msgs));
}

export function getMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return [];
  }
}

export function sendMessage(from: ChatMessage["from"], text: string): ChatMessage {
  const msg: ChatMessage = {
    id: `m_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
    from,
    text: text.trim(),
    time: new Date().toISOString(),
  };
  const next = [...getMessages(), msg];
  save(next);
  return msg;
}

export async function generateAIResponse(prompt: string): Promise<ChatMessage> {
  // Simple offline helper. Replace with real API later.
  const lower = prompt.toLowerCase();
  let reply = "I’m here to help. Could you share more details?";
  if (lower.includes("apply")) reply = "To apply, open Dashboard → Opportunities, choose a job, and click Apply. Fill the form and submit.";
  else if (lower.includes("password")) reply = "Use the Register or Settings → Profile to update credentials. Demo password is Innovate2025!.";
  else if (lower.includes("contact") || lower.includes("support")) reply = "You can message admin here. We typically respond within a day.";
  else if (lower.includes("calendar") || lower.includes("event")) reply = "Use the Calendar widget on your dashboard to track key dates.";
  return sendMessage("ai", reply);
}
