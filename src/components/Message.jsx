import ReactMarkdown from "react-markdown";

export default function Message({ role, text }) {
  const isUser = role === "user";

  return (
    <article className={`message-row${isUser ? " user" : ""}`}>
      {!isUser && <div className="assistant-avatar" aria-hidden="true">✦</div>}
      <div className="message-body">
        {isUser ? text : (
          <ReactMarkdown>
            {text}
          </ReactMarkdown>
        )}
      </div>
    </article>
  );
}
