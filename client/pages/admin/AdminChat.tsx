import { useEffect, useRef, useState } from "react";
import { getMessages, sendMessage, getConversations, updateConversation, markConversationAsRead, createConversation, deleteConversation, clearAllConversations, deleteMessage, ChatConversation, ChatMessage } from "@/store/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminChat() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
    
    // Auto-refresh conversations every 5 seconds
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (selectedConversation) {
      const userMessages = getMessages(selectedConversation.userId);
      setMessages(userMessages);
      
      // Mark conversation as read when selected
      markConversationAsRead(selectedConversation.id);
      loadConversations(); // Refresh to update unread count
    } else {
      setMessages([]);
    }
  }, [selectedConversation]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function loadConversations() {
    const convs = getConversations();
    setConversations(convs);
  }

  function onSend() {
    if (!text.trim() || !selectedConversation) return;
    
    sendMessage("admin", text, selectedConversation.userId, selectedConversation.id);
    setText("");
    setMessages(getMessages(selectedConversation.userId));
    
    // Update conversation
    updateConversation(selectedConversation.id, {
      lastMessage: text,
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
    });
    
    loadConversations();
  }

  function handleDeleteConversation(conversationId: string) {
    if (window.confirm("Are you sure you want to delete this conversation? This will delete all messages and cannot be undone.")) {
      deleteConversation(conversationId);
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
      }
      loadConversations();
    }
  }

  function handleClearAllConversations() {
    if (window.confirm("Are you sure you want to delete ALL conversations? This will delete all messages from all users and cannot be undone.")) {
      clearAllConversations();
      setSelectedConversation(null);
      setMessages([]);
      loadConversations();
    }
  }

  function handleDeleteMessage(messageId: string) {
    if (window.confirm("Are you sure you want to delete this message?")) {
      const updatedMessages = deleteMessage(messageId, selectedConversation?.userId);
      setMessages(updatedMessages);
    }
  }

  return (
    <section className="py-6">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Support Chat Management</h1>
            <p className="text-muted-foreground">Manage user conversations and provide support</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadConversations} variant="outline" size="sm">
              Refresh
            </Button>
            {conversations.length > 0 && (
              <Button 
                onClick={handleClearAllConversations} 
                variant="outline" 
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[60vh] overflow-y-auto">
                  {conversations.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <div>No conversations yet</div>
                      <div className="text-xs mt-2">
                        Conversations will appear here when users send messages
                      </div>
                    </div>
                  ) : (
                    conversations.map((conv, index) => (
                      <div
                        key={conv.id || index}
                        className={`p-4 border-b hover:bg-muted/50 transition-colors ${
                          selectedConversation?.id === conv.id ? 'bg-muted' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div 
                            onClick={() => setSelectedConversation(conv)}
                            className="flex-1 cursor-pointer"
                          >
                            <h4 className="font-medium">{conv.userName || 'Unknown User'}</h4>
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.lastMessage || 'No message'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleString() : 'No time'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {conv.unreadCount > 0 && (
                              <Badge variant="destructive" className="ml-2">
                                {conv.unreadCount}
                              </Badge>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteConversation(conv.id);
                              }}
                              className="text-red-400 hover:text-red-600 text-sm"
                              title="Delete conversation"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Messages */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedConversation ? `Chat with ${selectedConversation.userName}` : 'Select a conversation'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {selectedConversation ? (
                  <>
                    <div ref={listRef} className="h-[50vh] w-full overflow-y-auto p-4">
                      {messages.map(m => (
                        <div key={m.id} className={`mb-3 flex ${m.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                            m.from === 'admin' 
                              ? 'bg-primary text-primary-foreground' 
                              : m.from === 'ai' 
                                ? 'bg-secondary' 
                                : 'bg-muted'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="opacity-80 text-[10px]">
                                {m.from.toUpperCase()} • {new Date(m.time).toLocaleTimeString()}
                              </div>
                              <button
                                onClick={() => handleDeleteMessage(m.id)}
                                className="ml-2 text-red-400 hover:text-red-600 text-xs"
                                title="Delete message"
                              >
                                ×
                              </button>
                            </div>
                            <div className="mt-1 whitespace-pre-wrap">{m.text}</div>
                          </div>
                        </div>
                      ))}
                      {messages.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                          No messages in this conversation yet
                        </div>
                      )}
                    </div>
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Input
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder="Type a reply..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') onSend();
                          }}
                        />
                        <Button onClick={onSend} disabled={!text.trim()}>
                          Send
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-[50vh] flex items-center justify-center text-muted-foreground">
                    Select a conversation to start chatting
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
