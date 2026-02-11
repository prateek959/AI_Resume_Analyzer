import ReactMarkdown from "react-markdown";

export default function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xl px-4 py-3 rounded-2xl shadow text-sm leading-relaxed ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-800"
        }`}
      >
        {isUser ? (
          content
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
