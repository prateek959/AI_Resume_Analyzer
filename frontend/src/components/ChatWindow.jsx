import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ resume }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Fetch message history when resume changes
  useEffect(() => {
    if (resume?._id) {
      fetchHistory();
    }
  }, [resume]);

  // Auto scroll when messages change
  useEffect(() => {
    if (scrollRef.current && autoScroll) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/resume/history/${resume._id}`);
      setMessages(res.data.allMessages || []);
    } catch (err) {
      console.log("History error:", err);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !resume?._id) return;

    const messageText = input.trim();

    // Add user message with placeholder reply
    setMessages((prev) => [...prev, { message: messageText, reply: "..." }]);
    setInput("");

    try {
      const res = await api.post("/resume/question", {
        message: messageText,
        resumeID: resume._id,
      });

      // Update the last message with AI reply
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].reply = res.data.reply;
        return updated;
      });
    } catch (err) {
      console.log("Send error:", err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].reply = "Failed to send. Please try again.";
        return updated;
      });
    }
  };

  return (
    <div className="flex flex-col h-[87vh] bg-gray-900">

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
        onScroll={() => {
          if (!scrollRef.current) return;
          const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
          setAutoScroll(scrollTop + clientHeight >= scrollHeight - 10);
        }}
      >
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-4">
            No messages yet. Start by typing below!
          </p>
        )}

        {messages.map((msg, index) => (
          <div key={index}>
            <MessageBubble role="user" content={msg.message} />
            {msg.reply && <MessageBubble role="ai" content={msg.reply} />}
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="flex gap-2 p-4 bg-gray-900 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask question..."
          className="flex-1 p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button
          onClick={sendMessage}
          className="px-5 py-3 bg-blue-600 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
