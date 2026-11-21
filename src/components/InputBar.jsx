import { useState } from "react";
import { useGemini } from "../hooks/useGemini";
import { useChat } from "../context/ChatContext";

export default function InputBar() {
  const [text, setText] = useState("");
  const { sendMessage } = useGemini();
  const { loading } = useChat();

  function handleSend() {
    if (!text.trim() || loading) return;
    sendMessage(text.trim());
    setText("");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="composer-area">
      <div className="composer">
        <input
          aria-label="Message Nova"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder={loading ? "Nova is thinking..." : "Message Nova..."}
        />
        <button
          className="send-button"
          onClick={handleSend}
          disabled={!text.trim() || loading}
          aria-label="Send message"
          title="Send message"
        >
          ↑
        </button>
      </div>
      <p className="composer-hint">Press Enter to send · Shift + Enter for a new line</p>
    </div>
  );
}
