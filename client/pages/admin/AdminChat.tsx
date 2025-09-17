import { useEffect, useRef, useState } from "react";
import { getMessages, sendMessage } from "@/store/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminChat() {
  const [messages, setMessages] = useState(getMessages());
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{ setMessages(getMessages()); },[]);
  useEffect(()=>{ listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }); },[messages]);

  function onSend() {
    if (!text.trim()) return;
    sendMessage("admin", text);
    setText("");
    setMessages(getMessages());
  }

  return (
    <section className="py-6">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">User Support Chat (Admin)</h1>
        </div>
        <div ref={listRef} className="h-[60vh] w-full overflow-y-auto rounded-lg border bg-card p-4">
          {messages.map(m=> (
            <div key={m.id} className={`mb-2 flex ${m.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${m.from==='admin' ? 'bg-primary text-primary-foreground' : m.from==='ai' ? 'bg-secondary' : 'bg-muted'}`}>
                <div className="opacity-80 text-[10px]">{m.from.toUpperCase()} • {new Date(m.time).toLocaleTimeString()}</div>
                <div className="mt-1 whitespace-pre-wrap">{m.text}</div>
              </div>
            </div>
          ))}
          {messages.length===0 && <div className="text-sm text-muted-foreground">No messages yet.</div>}
        </div>
        <div className="mt-3 flex gap-2">
          <Input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Type a reply" onKeyDown={(e)=>{ if(e.key==='Enter') onSend(); }} />
          <Button onClick={onSend}>Send</Button>
        </div>
      </div>
    </section>
  );
}
