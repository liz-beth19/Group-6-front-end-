export type ChatMessage = {
  id: string;
  from: "user" | "admin" | "ai";
  text: string;
  time: string; // ISO
  userId?: string; // For user-specific messages
  adminId?: string; // For admin-specific messages
  conversationId?: string; // For grouping conversations
};

export type ChatConversation = {
  id: string;
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isActive: boolean;
};

const CHAT_KEY = "gg_chat";
const CONVERSATIONS_KEY = "gg_conversations";

function getUserKey(userId?: string): string {
  return userId ? `${CHAT_KEY}_${userId}` : CHAT_KEY;
}

function save(msgs: ChatMessage[], userId?: string) {
  localStorage.setItem(getUserKey(userId), JSON.stringify(msgs));
}

export function getMessages(userId?: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(getUserKey(userId));
    if (!raw) return [];
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return [];
  }
}

export function sendMessage(from: ChatMessage["from"], text: string, userId?: string, conversationId?: string): ChatMessage {
  const msg: ChatMessage = {
    id: `m_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
    from,
    text: text.trim(),
    time: new Date().toISOString(),
    userId,
    conversationId,
  };
  const next = [...getMessages(userId), msg];
  save(next, userId);
  
  // Update conversation with new message
  if (conversationId) {
    const conversations = getConversations();
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      const isAdminMessage = from === 'admin';
      updateConversation(conversationId, {
        lastMessage: text,
        lastMessageTime: new Date().toISOString(),
        unreadCount: isAdminMessage ? 0 : (conversation.unreadCount || 0) + 1,
      });
    }
  }
  
  return msg;
}

export async function generateAIResponse(prompt: string, userId?: string, conversationId?: string): Promise<ChatMessage> {
  try {
    // Try to get AI response from local AI server
    const response = await fetch('http://localhost:3001/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: prompt,
        userId: userId,
        conversationId: conversationId
      })
    });

    if (response.ok) {
      const data = await response.json();
      return sendMessage("ai", data.reply, userId, conversationId);
    }
  } catch (error) {
    console.log("AI API not available, using fallback response");
  }

  // Fallback to intelligent responses based on context
  const lower = prompt.toLowerCase();
  let reply = "I'm here to help! How can I assist you today?";
  
  if (lower.includes("apply") || lower.includes("application")) {
    reply = "To apply for jobs, go to Dashboard → Opportunities, select a job posting, and click Apply. Fill out the application form with your details and submit it.";
  } else if (lower.includes("password") || lower.includes("login")) {
    reply = "For password issues, use the Register page to create a new account or contact support. The demo password is Innovate2025!";
  } else if (lower.includes("contact") || lower.includes("support") || lower.includes("help")) {
    reply = "You can reach our support team through this chat. An admin will respond to your message shortly. We typically respond within 24 hours.";
  } else if (lower.includes("calendar") || lower.includes("event") || lower.includes("schedule")) {
    reply = "Use the Calendar feature on your dashboard to view upcoming events, track important dates, and manage your schedule.";
  } else if (lower.includes("job") || lower.includes("career") || lower.includes("opportunity")) {
    reply = "Check out the Opportunities section in your dashboard to browse available job positions. You can filter by company, location, or job type.";
  } else if (lower.includes("profile") || lower.includes("account") || lower.includes("settings")) {
    reply = "Manage your account settings and profile information in the Profile section of your dashboard.";
  } else if (lower.includes("mentorship") || lower.includes("mentor")) {
    reply = "The Mentorship section connects you with industry professionals who can guide your career development.";
  } else if (lower.includes("roadmap") || lower.includes("career path")) {
    reply = "Explore career roadmaps in the Roadmaps section to plan your professional development journey.";
  } else if (lower.includes("thank") || lower.includes("thanks")) {
    reply = "You're welcome! I'm happy to help. Is there anything else you'd like to know?";
  } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    reply = "Hello! Welcome to our support chat. I'm here to help you with any questions about our platform, job applications, or career development resources.";
  }
  
  return sendMessage("ai", reply, userId, conversationId);
}

// Conversation management functions
export function getConversations(): ChatConversation[] {
  try {
    const raw = localStorage.getItem(CONVERSATIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ChatConversation[];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: ChatConversation[]) {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
}

export function createConversation(userId: string, userName: string): ChatConversation {
  const conversation: ChatConversation = {
    id: `conv_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
    userId,
    userName,
    lastMessage: "Conversation started",
    lastMessageTime: new Date().toISOString(),
    unreadCount: 0,
    isActive: true,
  };
  
  const conversations = getConversations();
  conversations.push(conversation);
  saveConversations(conversations);
  
  return conversation;
}

export function updateConversation(conversationId: string, updates: Partial<ChatConversation>) {
  const conversations = getConversations();
  const index = conversations.findIndex(c => c.id === conversationId);
  if (index !== -1) {
    conversations[index] = { ...conversations[index], ...updates };
    saveConversations(conversations);
  }
}

export function getConversationByUserId(userId: string): ChatConversation | undefined {
  const conversations = getConversations();
  return conversations.find(c => c.userId === userId);
}

// Get all messages from all users (for admin view)
export function getAllMessages(): ChatMessage[] {
  const conversations = getConversations();
  const allMessages: ChatMessage[] = [];
  
  conversations.forEach(conv => {
    const userMessages = getMessages(conv.userId);
    allMessages.push(...userMessages);
  });
  
  return allMessages.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
}

// Mark conversation as read (for admin)
export function markConversationAsRead(conversationId: string) {
  updateConversation(conversationId, {
    unreadCount: 0,
  });
}

// Delete all messages for a user
export function deleteUserMessages(userId: string) {
  localStorage.removeItem(getUserKey(userId));
}

// Delete a specific conversation
export function deleteConversation(conversationId: string) {
  const conversations = getConversations();
  const conversation = conversations.find(c => c.id === conversationId);
  
  if (conversation) {
    // Delete user messages
    deleteUserMessages(conversation.userId);
    
    // Remove conversation from list
    const updatedConversations = conversations.filter(c => c.id !== conversationId);
    saveConversations(updatedConversations);
  }
}

// Clear all conversations (admin only)
export function clearAllConversations() {
  const conversations = getConversations();
  
  // Delete all user messages
  conversations.forEach(conv => {
    deleteUserMessages(conv.userId);
  });
  
  // Clear conversations list
  saveConversations([]);
}

// Delete a specific message
export function deleteMessage(messageId: string, userId?: string) {
  const messages = getMessages(userId);
  const updatedMessages = messages.filter(m => m.id !== messageId);
  save(updatedMessages, userId);
  return updatedMessages;
}
