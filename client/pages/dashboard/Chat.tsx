import { useEffect, useRef, useState } from "react";
import { getMessages, sendMessage, generateAIResponse } from "@/store/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function Chat() {
  const [messages, setMessages] = useState(getMessages());
  const [text, setText] = useState("");
  const [useAI, setUseAI] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    setMessages(getMessages());
  },[]);

  useEffect(()=>{
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  },[messages]);

  async function onSend() {
    if (!text.trim()) return;
    sendMessage("user", text);
    setMessages(getMessages());
    const prompt = text;
    setText("");
    if (useAI) {
      await new Promise(r=>setTimeout(r,400));
      await generateAIResponse(prompt);
      setMessages(getMessages());
    }
  }

  return (
    <section className="py-6">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Support Chat</h1>
          <label className="flex items-center gap-2 text-sm"><span>AI Assistant</span><Switch checked={useAI} onCheckedChange={setUseAI} /></label>
        </div>
        <div ref={listRef} className="h-[50vh] w-full overflow-y-auto rounded-lg border bg-card p-4">
          {messages.map(m=> (
            <div key={m.id} className={`mb-2 flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${m.from==='user' ? 'bg-primary text-primary-foreground' : m.from==='ai' ? 'bg-secondary' : 'bg-muted'}`}>
                <div className="opacity-80 text-[10px]">{m.from.toUpperCase()} • {new Date(m.time).toLocaleTimeString()}</div>
                <div className="mt-1 whitespace-pre-wrap">{m.text}</div>
              </div>
            </div>
          ))}
          {messages.length===0 && <div className="text-sm text-muted-foreground">Start the conversation…</div>}
        </div>
        <div className="mt-3 flex gap-2">
          <Input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Type a message" onKeyDown={(e)=>{ if(e.key==='Enter') onSend(); }} />
          <Button onClick={onSend}>Send</Button>
        </div>
      </div>
    </section>
  );
}
