import { useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import Message from "./Message";
import InputBar from "./InputBar";
import { useGemini } from "../hooks/useGemini";

const suggestions = [
  { title: "Explain a concept", copy: "Make something complicated easy to understand.", prompt: "Explain a complicated topic in a simple way." },
  { title: "Write something", copy: "Get help drafting, editing, or finding the right words.", prompt: "Help me write a clear, friendly email." },
  { title: "Plan my day", copy: "Turn a busy to-do list into a simple plan.", prompt: "Help me make a simple plan for a productive day." },
  { title: "Brainstorm ideas", copy: "Explore fresh ideas for your next project.", prompt: "Help me brainstorm some creative project ideas." }
];

export default function ChatArea() {
  const { activeConv, loading } = useChat();
  const { sendMessage } = useGemini();
  const bottomRef = useRef(null);
  const messages = activeConv?.messages || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  return (
    <main className="chat-panel">
      <header className="topbar">
        <div className="topbar-title">{activeConv?.title || "New chat"}</div>
        <div className="topbar-status">
          <span className="status-dot" />
          AI assistant
        </div>
      </header>

      <div className="messages">
        {messages.length === 0 ? (
          <section className="welcome">
            <div className="welcome-orb" aria-hidden="true">✦</div>
            <h1>What can I help with?</h1>
            <p className="welcome-copy">
              Ask me anything, or choose a starting point below. I’m here to help you think, create, and get things done.
            </p>
            <div className="suggestions">
              {suggestions.map((suggestion) => (
                <button
                  className="suggestion"
                  key={suggestion.title}
                  onClick={() => sendMessage(suggestion.prompt)}
                >
                  <span className="suggestion-title">{suggestion.title}</span>
                  <span className="suggestion-copy">{suggestion.copy}</span>
                </button>
              ))}
            </div>
          </section>
        ) : (
          messages.map((message, index) => (
            <Message key={`${activeConv.id}-${index}`} role={message.role} text={message.text} />
          ))
        )}

        {loading && (
          <div className="loading-indicator" role="status" aria-label="Nova is thinking">
            <div className="assistant-avatar" aria-hidden="true">✦</div>
            <div className="loading-dots" aria-hidden="true"><span /><span /><span /></div>
            <span className="typing-label">Thinking</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <InputBar />
    </main>
  );
}
