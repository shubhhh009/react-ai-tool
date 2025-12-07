import { useEffect, useRef, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import MessageBubble from "./components/MessageBubble";
import InputArea from "./components/InputArea";
import { getGroqResponse } from "./services/ai";

function App() {
  const [history, setHistory] = useState([]); // Current chat session
  const [savedHistory, setSavedHistory] = useState([]); // List of past queries
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Load saved history on mount
  useEffect(() => {
    const saved = localStorage.getItem("history");
    if (saved) {
      setSavedHistory(JSON.parse(saved));
    }
  }, []);

  // Update localStorage when history changes (simplified: just storing queries for now as per old app behavior)
  // Or better, we can store full conversations if we want, but sticking to old behavior (list of queries) for the sidebar
  const updateSavedHistory = (query) => {
    const newHistory = [query, ...savedHistory];
    setSavedHistory(newHistory);
    localStorage.setItem("history", JSON.stringify(newHistory));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, loading]);

  const handleSendMessage = async (message) => {
    // Add user message
    const newHistory = [...history, { role: "user", content: message }];
    setHistory(newHistory);
    setLoading(true);
    
    // Update sidebar history
    updateSavedHistory(message);

    // Get AI response
    try {
      const response = await getGroqResponse(message, history.map(h => h.content));
      setHistory(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      setHistory(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (query) => {
    // When selecting history, we could either load that conversation or just put it in input
    // For this app's pattern, it seems to "ask" the question again or show the result.
    // Let's treat it as asking again for simplicity, or just starting a fresh chat with that context.
    // Let's clear current view and ask it.
    setHistory([]);
    handleSendMessage(query);
  };

  // Check system dark mode preference
  useEffect(() => {
    // Default to dark mode unless user has explicitly stored 'light' preference (if we had storage)
    // For now, just force dark mode on mount as default
    document.documentElement.classList.add('dark');
  }, []);


  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 overflow-hidden font-display transition-colors duration-300">
      
      {/* Sidebar */}
      <Sidebar 
        recentHistory={savedHistory} 
        setRecentHistory={setSavedHistory}
        setSelectedHistory={handleHistorySelect}
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative w-full h-full max-w-full">
        
        {/* Top Navigation / Mobile Toggle */}
        <header className="p-4 flex items-center justify-between z-10">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 md:hidden text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="ml-auto flex gap-2">
             <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
                title="Toggle Theme"
             >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
             </button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-32 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
          <div className="max-w-4xl mx-auto pt-10">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 animate-fade-in">
                <div className="w-20 h-20 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-500/30 mb-4 rotate-12 transition-transform hover:rotate-0 duration-300">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-10 h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold text-zinc-800 dark:text-white">
                  How can I help you today?
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
                   I'm your advanced AI assistant. Ask me anything about code, writing, or general knowledge.
                </p>
              </div>
            ) : (
              history.map((msg, index) => (
                <div key={index} className="animate-slide-up">
                  <MessageBubble message={msg} />
                </div>
              ))
            )}
            
            {loading && (
              <div className="flex justify-start mb-6 animate-pulse">
                <div className="bg-white dark:bg-zinc-800 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area (Fixed at bottom) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent dark:from-zinc-950 dark:via-zinc-950 dark:to-transparent z-10 pb-6 md:pb-8">
          <InputArea onSendMessage={handleSendMessage} disabled={loading} />
        </div>

      </div>
    </div>
  );
}

export default App;
