import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext(null);
const CONVERSATIONS_KEY = "nova_conversations";
const ACTIVE_ID_KEY = "nova_active_id";

function createConversation() {
  return { id: Date.now(), title: "New chat", messages: [] };
}

function readConversations() {
  try {
    const saved = localStorage.getItem(CONVERSATIONS_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch (error) {
    console.error("Failed to load saved chats", error);
  }
  return [createConversation()];
}

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState(readConversations);
  const [activeId, setActiveId] = useState(() => {
    const saved = localStorage.getItem(ACTIVE_ID_KEY);
    return saved ? Number(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    const currentExists = conversations.some((conversation) => conversation.id === activeId);
    if (!currentExists && conversations[0]) setActiveId(conversations[0].id);
  }, [activeId, conversations]);

  useEffect(() => {
    if (activeId !== null) localStorage.setItem(ACTIVE_ID_KEY, String(activeId));
  }, [activeId]);

  const activeConv = conversations.find((conversation) => conversation.id === activeId) || conversations[0];

  function newConversation() {
    const conversation = createConversation();
    setConversations((previous) => [...previous, conversation]);
    setActiveId(conversation.id);
  }

  function deleteConversation(idToDelete) {
    setConversations((previous) => {
      const remaining = previous.filter((conversation) => conversation.id !== idToDelete);
      return remaining.length > 0 ? remaining : [createConversation()];
    });
    if (activeId === idToDelete) {
      const next = conversations.find((conversation) => conversation.id !== idToDelete);
      setActiveId(next?.id ?? null);
    }
  }

  function addMessage(role, text) {
    const finalRole = role === "model" ? "assistant" : role;
    setConversations((previous) => previous.map((conversation) => {
      if (conversation.id !== activeId) return conversation;

      const messages = [...conversation.messages, { role: finalRole, text }];
      const title = conversation.title === "New chat" && finalRole === "user"
        ? (text.length > 36 ? `${text.slice(0, 36).trim()}…` : text)
        : conversation.title;

      return { ...conversation, title, messages };
    }));
  }

  return (
    <ChatContext.Provider value={{
      conversations,
      activeId,
      setActiveId,
      activeConv,
      loading,
      setLoading,
      newConversation,
      deleteConversation,
      addMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
