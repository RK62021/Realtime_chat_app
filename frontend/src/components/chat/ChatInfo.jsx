import React from 'react';

export default function ChatInfo({ activeChat, participants, isVisible }) {
  if (!isVisible || !activeChat) return null;

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    const a = parts[0]?.[0] || "";
    const b = parts[1]?.[0] || "";
    return (a + b).toUpperCase() || a.toUpperCase();
  };

  return (
    <aside className="w-80 lg:w-80 md:w-72 sm:w-64 border-l border-white/10 bg-white/5 backdrop-blur-lg h-full overflow-y-auto hide-scrollbar smooth-scroll">
      <div className="p-5">
        {/* Chat Avatar */}
        <div className="mx-auto h-20 w-20 rounded-full bg-white/10 flex items-center justify-center text-white text-xl font-semibold mb-3">
          {getInitials(activeChat.name || "Chat")}
        </div>
        
        <div className="text-center mb-6">
          <div className="text-white font-medium text-lg">
            {activeChat.name || "Direct Message"}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {activeChat.name 
              ? `${participants?.length || 0} members` 
              : "Online"
            }
          </div>
        </div>

        {/* Chat Details */}
        <div className="space-y-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">
              Chat Details
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Type</span>
                <span className="text-white">
                  {activeChat.name ? "Group" : "Direct"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Messages</span>
                <span className="text-white">
                  {activeChat.messages?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Created</span>
                <span className="text-white">
                  {activeChat.createdAt 
                    ? new Date(activeChat.createdAt).toLocaleDateString()
                    : "Recently"
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Participants */}
          {activeChat.name && participants && (
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                Members ({participants.length})
              </div>
              <div className="space-y-2">
                {participants.map((participant, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400"></div>
                      <span className="text-white text-sm">
                        {participant.name || `User ${index + 1}`}
                      </span>
                    </div>
                    <span className="text-gray-400 text-xs">
                      @{participant.username || `user${index + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-white/10">
            <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">
              Actions
            </div>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm">Add to Favorites</span>
              </button>
              
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM4 5h6V1H4v4zM15 3h5l-5-5v5z" />
                </svg>
                <span className="text-sm">Share Chat</span>
              </button>
              
              {activeChat.name && (
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="text-sm">Leave Group</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
