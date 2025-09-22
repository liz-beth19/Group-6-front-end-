import { useEffect, useRef, useState } from "react";
import { getMessages, sendMessage, generateAIResponse, createConversation, getConversationByUserId, updateConversation, deleteUserMessages, deleteMessage } from "@/store/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [useAI, setUseAI] = useState(true);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id) {
      // Load user-specific messages
      const userMessages = getMessages(user.id);
      setMessages(userMessages);
      
      // Create or get conversation
      let conversation = getConversationByUserId(user.id);
      
      if (!conversation) {
        conversation = createConversation(user.id, user.name || user.username || "User");
      }
      setConversationId(conversation.id);
    }
  }, [user?.id]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function onSend() {
    if (!text.trim() || !user?.id || !conversationId) return;
    
    const prompt = text;
    setText("");
    
    // Send user message
    sendMessage("user", prompt, user.id, conversationId);
    setMessages(getMessages(user.id));
    
    if (useAI) {
      await new Promise(r => setTimeout(r, 400));
      await generateAIResponse(prompt, user.id, conversationId);
      setMessages(getMessages(user.id));
    }
    
    // Update conversation
    updateConversation(conversationId, {
      lastMessage: prompt,
      lastMessageTime: new Date().toISOString(),
    });
  }

  function handleDeleteMessage(messageId: string) {
    if (window.confirm("Are you sure you want to delete this message?")) {
      const updatedMessages = deleteMessage(messageId, user?.id);
      setMessages(updatedMessages);
    }
  }

  function handleClearAllMessages() {
    if (window.confirm("Are you sure you want to delete all messages? This cannot be undone.")) {
      deleteUserMessages(user?.id || "");
      setMessages([]);
    }
  }

  return (
    <section className="py-6">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Support Chat</h1>
            <p className="text-sm text-muted-foreground">
              {conversationId ? "Connected to support team" : "Connecting..."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <span>AI Assistant</span>
              <Switch checked={useAI} onCheckedChange={setUseAI} />
            </label>
            {messages.length > 0 && (
              <Button
                onClick={handleClearAllMessages}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
        <div ref={listRef} className="h-[50vh] w-full overflow-y-auto rounded-lg border bg-card p-4">
          {messages.map(m=> (
            <div key={m.id} className={`mb-2 flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${m.from==='user' ? 'bg-primary text-primary-foreground' : m.from==='ai' ? 'bg-secondary' : 'bg-muted'}`}>
                <div className="flex items-center justify-between">
                  <div className="opacity-80 text-[10px]">{m.from.toUpperCase()} • {new Date(m.time).toLocaleTimeString()}</div>
                  {m.from === 'user' && (
                    <button
                      onClick={() => handleDeleteMessage(m.id)}
                      className="ml-2 text-red-400 hover:text-red-600 text-xs"
                      title="Delete message"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="mt-1 whitespace-pre-wrap">{m.text}</div>
              </div>
            </div>
          ))}
          {messages.length===0 && <div className="text-sm text-muted-foreground">Start the conversation…</div>}
        </div>
        <div className="mt-3 flex gap-2">
          <Input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Type a message" onKeyDown={(e)=>{ if(e.key==='Enter') onSend(); }} />
          <Button onClick={onSend} disabled={!text.trim()}>Send</Button>
        </div>
      </div>
    </section>
  );
}
