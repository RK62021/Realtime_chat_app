import React, { useState } from 'react';

export default function ChatSidebar({ 
  chats, 
  activeChatId, 
  onChatSelect, 
  onNewChat, 
  onNewGroup,
  searchQuery,
  onSearchChange 
}) {
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [usernameSearch, setUsernameSearch] = useState('');

  const handleNewChat = () => {
    setShowNewChatModal(true);
  };

  const handleStartChat = () => {
    if (usernameSearch.trim()) {
      onNewChat(usernameSearch.trim());
      setUsernameSearch('');
      setShowNewChatModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowNewChatModal(false);
    setUsernameSearch('');
  };

  return (
    <>
      <div className="w-80 lg:w-80 md:w-72 sm:w-64 bg-white/5 backdrop-blur-lg border-r border-white/10 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold">Chats</h2>
            <div className="flex gap-2">
              <button 
                onClick={handleNewChat}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15 transition-colors"
              >
                New
              </button>
              <button 
                onClick={onNewGroup}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15 transition-colors"
              >
                Group
              </button>
            </div>
          </div>
          
          {/* Search */}
          <div>
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search chats..."
              className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder-gray-400 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto hide-scrollbar smooth-scroll">
          {chats.map((chat) => {
            const isActive = chat.id === activeChatId;
            const lastMessage = chat.messages[chat.messages.length - 1];
            
            return (
              <button
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-colors ${
                  isActive ? "bg-white/10" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Chat Avatar */}
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                      {chat.name ? chat.name[0].toUpperCase() : 'U'}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-white font-medium truncate">
                        {chat.name || 'Direct Message'}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {lastMessage?.text || "No messages yet"}
                      </div>
                    </div>
                  </div>
                  
                  {/* Online indicator */}
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 flex-shrink-0"></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={handleCloseModal}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Start New Chat</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Username</label>
                <input
                  value={usernameSearch}
                  onChange={(e) => setUsernameSearch(e.target.value)}
                  placeholder="Enter username..."
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
                  onKeyPress={(e) => e.key === 'Enter' && handleStartChat()}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={handleCloseModal}
                className="rounded-xl px-4 py-2.5 text-sm text-white bg-white/10 hover:bg-white/15 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStartChat}
                disabled={!usernameSearch.trim()}
                className="rounded-xl px-4 py-2.5 text-sm text-white bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
