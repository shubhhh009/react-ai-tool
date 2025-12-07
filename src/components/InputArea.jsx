import { useState } from 'react';

const InputArea = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="glass-panel rounded-2xl p-2 flex items-end gap-2 relative ring-1 ring-white/20 dark:ring-white/10 focus-within:ring-violet-500/50 transition-all duration-300">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className="w-full bg-transparent border-none outline-none resize-none p-3 max-h-32 min-h-[50px] text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 font-normal"
          rows={1}
          style={{ height: 'auto', minHeight: '52px' }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className="p-3 mb-1 rounded-xl bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </div>
      <div className="text-center mt-2 text-xs text-zinc-500 dark:text-zinc-400">
        AI can make mistakes. Check important info.
      </div>
    </div>
  );
};

export default InputArea;
