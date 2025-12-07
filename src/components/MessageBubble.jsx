import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`
        max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm
        ${isUser 
          ? 'bg-violet-600 text-white rounded-br-none' 
          : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border border-zinc-100 dark:border-zinc-700 rounded-bl-none'}
      `}>
        {isUser ? (
          <div className="text-sm md:text-base whitespace-pre-wrap">{message.content}</div>
        ) : (
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
             <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        {...props}
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg !my-4 !bg-zinc-950"
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code {...props} className={`${className} bg-black/10 dark:bg-white/10 rounded px-1 py-0.5`}>
                        {children}
                      </code>
                    )
                  }
                }}
             >
                {message.content}
             </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
