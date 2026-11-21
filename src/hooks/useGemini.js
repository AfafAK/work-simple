import { useChat } from "../context/ChatContext";

const ASSISTANT_SYSTEM_PROMPT = `You are Nova, a helpful and thoughtful AI assistant. Answer clearly, accurately, and naturally. Match the user's language and tone. Use markdown when it makes your answer easier to read.`;

export function useGemini() {
  const { activeConv, addMessage, setLoading } = useChat();

  async function sendMessage(userText) {
    if (!userText.trim()) return;

    addMessage("user", userText);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error("No API key found. Please set VITE_GROQ_API_KEY in .env.local");
      }

      const history = (activeConv?.messages || []).map((message) => ({
        role: message.role === "user" ? "user" : "assistant",
        content: message.text
      }));
      history.push({ role: "user", content: userText });

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: ASSISTANT_SYSTEM_PROMPT },
            ...history
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const modelResponse = data.choices[0]?.message?.content || "";
      addMessage("assistant", modelResponse);
    } catch (error) {
      addMessage("assistant", `Sorry, I couldn't complete that request: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return { sendMessage };
}
