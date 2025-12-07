import React from 'react';

const Sidebar = ({ recentHistory, setRecentHistory, setSelectedHistory, isOpen, toggleSidebar }) => {
  const clearHistory = () => {
    localStorage.removeItem("history"); // Actually remove from local storage
    setRecentHistory([]);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-r border-white/20 dark:border-white/5
        flex flex-col
      `}>
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            History
          </h2>
          <button 
            onClick={clearHistory}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500 hover:text-red-500"
            title="Clear History"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
          {recentHistory && recentHistory.length > 0 ? (
            <ul className="space-y-2">
              {recentHistory.map((item, index) => (
                <li 
                  key={index}
                  onClick={() => {
                    setSelectedHistory(item);
                    // Close sidebar on mobile when item selected
                    if (window.innerWidth < 768) toggleSidebar(); 
                  }}
                  className="p-3 text-sm rounded-xl cursor-pointer transition-all duration-200
                    hover:bg-violet-50 dark:hover:bg-violet-900/20 
                    text-zinc-600 dark:text-zinc-300 hover:text-violet-700 dark:hover:text-violet-300
                    truncate border border-transparent hover:border-violet-100 dark:hover:border-violet-900/30"
                >
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 opacity-50 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                    </svg>
                    <span className="truncate">{item}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-zinc-400 dark:text-zinc-600 text-sm py-10">
              No history yet
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 text-xs text-center text-zinc-400">
           React AI Tool v1.0
        </div>
      </div>
    </>
  );
};

export default Sidebar;
