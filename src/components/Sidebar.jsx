import { useChat } from "../context/ChatContext";

export default function Sidebar() {
  const { conversations, activeId, setActiveId, newConversation, deleteConversation } = useChat();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">✦</div>
        <div className="brand-copy">
          <div className="brand-name">Nova</div>
          <div className="brand-caption">YOUR AI COMPANION</div>
        </div>
      </div>

      <button className="new-chat-button" onClick={newConversation}>
        <span aria-hidden="true">＋</span>
        <span className="new-chat-label">New chat</span>
      </button>

      <div className="history-heading">Recent chats</div>
      <nav className="chat-history" aria-label="Recent chats">
        {conversations.map((conversation) => (
          <div
            className={`history-entry${conversation.id === activeId ? " active" : ""}`}
            key={conversation.id}
            title={conversation.title}
          >
            <button
              className="history-item"
              onClick={() => setActiveId(conversation.id)}
              aria-current={conversation.id === activeId ? "page" : undefined}
            >
              <span className="history-icon" aria-hidden="true">◷</span>
              <span className="history-title">{conversation.title}</span>
            </button>
            <button
              className="delete-chat"
              onClick={() => deleteConversation(conversation.id)}
              aria-label={`Delete ${conversation.title}`}
              title="Delete chat"
            >
              ×
            </button>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="profile-mark" aria-hidden="true">N</div>
        <div className="profile-copy">
          <div className="profile-title">Nova Assistant</div>
          <div className="profile-subtitle">Powered by Groq</div>
        </div>
      </div>
    </aside>
  );
}
