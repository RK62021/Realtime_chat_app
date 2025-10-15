import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserSidebar from "../components/chat/UserSidebar";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatMain from "../components/chat/ChatMain";
import ChatInfo from "../components/chat/ChatInfo";
import { initializeSocket } from "../features/socket/socketService";

// Hardcoded sample data
const sampleUsers = [
  { id: "u1", name: "Jane Doe", username: "jane", online: true },
  { id: "u2", name: "Alex Park", username: "alex", online: true },
  { id: "u3", name: "Sam Lee", username: "sam", online: false },
];

const sampleChats = [
  {
    id: "c1",
    participants: ["u1", "u2"],
    messages: [
      {
        id: "m1",
        from: "u1",
        text: "Hey Alex!",
        at: Date.now() - 1000 * 60 * 60,
      },
      {
        id: "m2",
        from: "u2",
        text: "Hey Jane, what's up?",
        at: Date.now() - 1000 * 60 * 55,
      },
      {
        id: "m3",
        from: "u1",
        text: "All good, working on the chat app.",
        at: Date.now() - 1000 * 60 * 54,
      },
    ],
  },
  {
    id: "g1",
    name: "Project Alpha",
    participants: ["u1", "u2", "u3"],
    messages: [
      {
        id: "m4",
        from: "u3",
        text: "Standup at 10:30am.",
        at: Date.now() - 1000 * 60 * 30,
      },
      {
        id: "m5",
        from: "u2",
        text: "I'll be there.",
        at: Date.now() - 1000 * 60 * 29,
      },
      { id: "m6", from: "u1", text: "Same.", at: Date.now() - 1000 * 60 * 28 },
    ],
  },
];

export default function ChatRoom() {
  const currentUserId = "u1";
  const [query, setQuery] = useState("");
  const [activeChatId, setActiveChatId] = useState("c1");
  const [data, setData] = useState(sampleChats);
  const [showInfo, setShowInfo] = useState(true);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([
    currentUserId,
  ]);
  const [activeSidebar, setActiveSidebar] = useState("chat"); // "chat" or "calls"
  const dispatch = useDispatch();
  const { isConnected } = useSelector((state) => state.socket);
  const { token } = useSelector((state) => state.auth);

  const activeChat = useMemo(
    () => data.find((c) => c.id === activeChatId),
    [data, activeChatId]
  );
  const participants = useMemo(
    () => activeChat?.participants || [],
    [activeChat]
  );

  const sendMessage = (messageText) => {
    if (!messageText.trim()) return;
    setData((prev) =>
      prev.map((c) => {
        if (c.id !== activeChatId) return c;
        const msg = {
          id: `m${Math.random().toString(36).slice(2, 8)}`,
          from: currentUserId,
          text: messageText.trim(),
          at: Date.now(),
        };
        return { ...c, messages: [...c.messages, msg] };
      })
    );
  };

  const startNewChat = (username) => {
    const newId = `c${Math.random().toString(36).slice(2, 6)}`;
    const chat = {
      id: newId,
      name: null,
      participants: [currentUserId, username],
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setData((p) => [chat, ...p]);
    setActiveChatId(newId);
  };

  const startNewGroup = () => {
    setGroupName("");
    setSelectedParticipants([currentUserId]);
    setShowGroupModal(true);
  };

  const confirmCreateGroup = () => {
    const members = Array.from(new Set(selectedParticipants));
    if (!groupName.trim() || members.length < 2) return;
    const newId = `g${Math.random().toString(36).slice(2, 6)}`;
    const chat = {
      id: newId,
      name: groupName.trim(),
      participants: members,
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setData((p) => [chat, ...p]);
    setActiveChatId(newId);
    setShowGroupModal(false);
  };

  const toggleParticipant = (id) => {
    setSelectedParticipants((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCall = () => {
    console.log("Starting voice call...");
    // Implement call functionality
  };

  const handleVideoCall = () => {
    console.log("Starting video call...");
    // Implement video call functionality
  };

  const handleChatClick = () => {
    setActiveSidebar("chat");
  };

  const handleCallsClick = () => {
    setActiveSidebar("calls");
  };

  const handleSettingsClick = () => {
    console.log("Opening settings...");
    // Implement settings functionality
  };

  useEffect(() => {
    if (token) {
      const socket = initializeSocket(token, dispatch); // Initialize socket connection
    }
  }, [token, dispatch]);
  console.log(isConnected ? "🟢 Connected" : "🔴 Disconnected");
  return (
    <>
      <div className="h-screen w-full bg-[radial-gradient(1000px_600px_at_-10%_-10%,rgba(99,102,241,0.25),transparent),radial-gradient(800px_500px_at_110%_110%,rgba(147,51,234,0.25),transparent)] bg-slate-950 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar - User Navigation */}
        <UserSidebar
          onChatClick={handleChatClick}
          onCallsClick={handleCallsClick}
          onSettingsClick={handleSettingsClick}
        />

        {/* Left Main Sidebar - Chat Options */}
        {activeSidebar === "chat" && (
          <ChatSidebar
            chats={data}
            activeChatId={activeChatId}
            onChatSelect={setActiveChatId}
            onNewChat={startNewChat}
            onNewGroup={startNewGroup}
            searchQuery={query}
            onSearchChange={setQuery}
          />
        )}

        {/* Calls Sidebar - Placeholder for calls */}
        {activeSidebar === "calls" && (
          <div className="w-80 lg:w-80 md:w-72 sm:w-64 bg-white/5 backdrop-blur-lg border-r border-white/10 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-white font-semibold">Calls</h2>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  📞
                </div>
                <h3 className="text-white text-lg font-medium mb-2">
                  No Calls Yet
                </h3>
                <p className="text-gray-400 text-sm">
                  Your call history will appear here
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <ChatMain
          activeChat={activeChat}
          currentUserId={currentUserId}
          onSendMessage={sendMessage}
          onCall={handleCall}
          onVideoCall={handleVideoCall}
          onToggleInfo={() => setShowInfo(!showInfo)}
        />

        {/* Right Info Panel */}
        <ChatInfo
          activeChat={activeChat}
          participants={participants}
          isVisible={showInfo}
        />
      </div>

      {/* Group Creation Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowGroupModal(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">
              Create Group
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Group Name
                </label>
                <input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Project Team"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <div className="text-sm text-gray-300 mb-2">Participants</div>
                <div className="max-h-56 overflow-y-auto space-y-2 hide-scrollbar smooth-scroll">
                  {sampleUsers.map((u) => (
                    <label
                      key={u.id}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${
                            u.online ? "bg-emerald-400" : "bg-gray-500"
                          }`}
                        />
                        <span className="text-white">{u.name}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedParticipants.includes(u.id)}
                        onChange={() => toggleParticipant(u.id)}
                        className="h-4 w-4"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowGroupModal(false)}
                className="rounded-xl px-4 py-2.5 text-sm text-white bg-white/10 hover:bg-white/15 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmCreateGroup}
                className="rounded-xl px-4 py-2.5 text-sm text-white bg-indigo-500 hover:bg-indigo-400 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
