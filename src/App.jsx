import { ChatProvider } from "./context/ChatContext";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";

function Layout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <ChatArea />
    </div>
  );
}

export default function App() {
  return (
    <ChatProvider>
      <Layout />
    </ChatProvider>
  );
}
