import React, { useRef, useEffect, useState } from 'react';

export default function ChatMain({ 
  activeChat, 
  currentUserId, 
  onSendMessage, 
  onCall, 
  onVideoCall,
  onToggleInfo 
}) {
  const [messageText, setMessageText] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [activeChat?.messages?.length]);

  useEffect(() => {
    if (!messageText) return setTyping(false);
    setTyping(true);
    const timer = setTimeout(() => setTyping(false), 1200);
    return () => clearTimeout(timer);
  }, [messageText]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    onSendMessage(messageText.trim());
    setMessageText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center text-white text-2xl mx-auto mb-4">
            💬
          </div>
          <h3 className="text-white text-lg font-medium mb-2">Welcome to Chat</h3>
          <p className="text-gray-400 text-sm">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Chat Header */}
      <div className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-lg flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-semibold">
            {activeChat.name ? activeChat.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div className="text-white text-sm font-medium">
              {activeChat.name || 'Direct Message'}
            </div>
            <div className="text-xs text-gray-400">
              {typing ? "Typing..." : "Online"}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onCall}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
            title="Voice Call"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          
          <button
            onClick={onVideoCall}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
            title="Video Call"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          
          <button
            onClick={onToggleInfo}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
            title="Chat Info"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 hide-scrollbar smooth-scroll">
        {activeChat.messages?.map((message) => {
          const isMine = message.from === currentUserId;
          return (
            <div
              key={message.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  isMine
                    ? "bg-indigo-500 text-white"
                    : "bg-white/10 text-white"
                }`}
              >
                {message.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="border-t border-white/10 bg-white/5 backdrop-blur-lg p-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-white placeholder-gray-400 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="rounded-xl bg-indigo-500 px-4 py-2.5 font-semibold text-white hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
