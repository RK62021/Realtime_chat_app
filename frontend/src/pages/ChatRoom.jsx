import { useEffect, useMemo, useRef, useState } from "react";

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
			{ id: "m1", from: "u1", text: "Hey Alex!", at: Date.now() - 1000 * 60 * 60 },
			{ id: "m2", from: "u2", text: "Hey Jane, what's up?", at: Date.now() - 1000 * 60 * 55 },
			{ id: "m3", from: "u1", text: "All good, working on the chat app.", at: Date.now() - 1000 * 60 * 54 },
		],
	},
	{
		id: "g1",
		name: "Project Alpha",
		participants: ["u1", "u2", "u3"],
		messages: [
			{ id: "m4", from: "u3", text: "Standup at 10:30am.", at: Date.now() - 1000 * 60 * 30 },
			{ id: "m5", from: "u2", text: "I'll be there.", at: Date.now() - 1000 * 60 * 29 },
			{ id: "m6", from: "u1", text: "Same.", at: Date.now() - 1000 * 60 * 28 },
		],
	},
];

export default function ChatRoom() {
	const currentUserId = "u1";
	const [query, setQuery] = useState("");
	const [typing, setTyping] = useState(false);
	const [activeChatId, setActiveChatId] = useState("c1");
	const [messageText, setMessageText] = useState("");
	const [data, setData] = useState(sampleChats);
	const scrollRef = useRef(null);

	const [showInfo, setShowInfo] = useState(true);
	const [showGroupModal, setShowGroupModal] = useState(false);
	const [groupName, setGroupName] = useState("");
	const [selectedParticipants, setSelectedParticipants] = useState([currentUserId]);

	const activeChat = useMemo(() => data.find((c) => c.id === activeChatId), [data, activeChatId]);
	const participants = useMemo(() => activeChat?.participants || [], [activeChat]);
	const otherUsers = useMemo(
		() => participants.filter((id) => id !== currentUserId).map((id) => sampleUsers.find((u) => u.id === id)),
		[participants]
	);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [activeChatId, activeChat?.messages.length]);

	useEffect(() => {
		if (!messageText) return setTyping(false);
		setTyping(true);
		const t = setTimeout(() => setTyping(false), 1200);
		return () => clearTimeout(t);
	}, [messageText]);

	const sendMessage = () => {
		if (!messageText.trim()) return;
		setData((prev) => prev.map((c) => {
			if (c.id !== activeChatId) return c;
			const msg = { id: `m${Math.random().toString(36).slice(2, 8)}`, from: currentUserId, text: messageText.trim(), at: Date.now() };
			return { ...c, messages: [...c.messages, msg] };
		}));
		setMessageText("");
	};

	const startNewChat = () => {
		const newId = `c${Math.random().toString(36).slice(2, 6)}`;
		const chat = { id: newId, participants: [currentUserId, "u3"], messages: [] };
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
		const chat = { id: newId, name: groupName.trim(), participants: members, messages: [] };
		setData((p) => [chat, ...p]);
		setActiveChatId(newId);
		setShowGroupModal(false);
	};

	const toggleParticipant = (id) => {
		setSelectedParticipants((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
	};

	const getInitials = (full) => {
		if (!full) return "?";
		const parts = full.split(" ");
		const a = parts[0]?.[0] || "";
		const b = parts[1]?.[0] || "";
		return (a + b).toUpperCase() || a.toUpperCase();
	};

	return (
	
		<>
			<div className="min-h-screen w-full bg-[radial-gradient(1000px_600px_at_-10%_-10%,rgba(99,102,241,0.25),transparent),radial-gradient(800px_500px_at_110%_110%,rgba(147,51,234,0.25),transparent)] bg-slate-950 flex">
				{/* Sidebar */}
				<aside className="hidden md:flex w-80 flex-col border-r border-white/10 bg-white/5 backdrop-blur-lg">
					<div className="p-4 border-b border-white/10">
						<div className="flex items-center justify-between">
							<h2 className="text-white font-semibold">Chats</h2>
							<div className="flex gap-2">
								<button onClick={startNewChat} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15">New</button>
								<button onClick={startNewGroup} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15">Group</button>
							</div>
						</div>
						<div className="mt-3">
							<input
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search"
								className="mx-4 mb-3 w-[calc(100%-2rem)] rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder-gray-400 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
							/>
						</div>
					</div>
					<div className="flex-1 overflow-y-auto">
						{data.filter((c) => {
							const title = c.name || sampleUsers.find((u) => u.id === c.participants.find((id) => id !== currentUserId))?.name || "Unknown";
							return title.toLowerCase().includes(query.toLowerCase());
						}).map((c) => {
							const isActive = c.id === activeChatId;
							const last = c.messages[c.messages.length - 1];
							const otherId = c.participants.find((id) => id !== currentUserId);
							const other = sampleUsers.find((u) => u.id === otherId);
							const title = c.name || other?.name || "Unknown";
							const online = c.name ? c.participants.some((id) => sampleUsers.find((u) => u.id === id)?.online) : other?.online;
							return (
								<button key={c.id} onClick={() => setActiveChatId(c.id)} className={`w-full text-left px-4 py-3 hover:bg-white/5 ${isActive ? "bg-white/10" : ""}`}>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div className={`h-2.5 w-2.5 rounded-full ${online ? "bg-emerald-400" : "bg-gray-500"}`} />
											<span className="text-sm text-white font-medium">{title}</span>
										</div>
										<span className="text-xs text-gray-400 max-w-[50%] truncate">{last?.text || "No messages yet"}</span>
									</div>
								</button>
							);
						})}
					</div>
				</aside>

				{/* Conversation */}
				<main className="flex-1 flex">
					<div className="flex-1 flex flex-col">
					{/* Header */}
					<div className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-lg flex items-center justify-between px-4">
						<div>
							<div className="flex items-center gap-2">
								{otherUsers.map((u) => (
									<div key={u?.id} className="flex items-center gap-2">
										<div className={`h-2.5 w-2.5 rounded-full ${u?.online ? "bg-emerald-400" : "bg-gray-500"}`} />
										<span className="text-white text-sm font-medium">{u?.name}</span>
									</div>
								))}
							</div>
							<div className="text-xs text-gray-400">{typing ? "Typing…" : "Online"}</div>
						</div>
						<div className="flex items-center gap-2">
							<button onClick={() => setShowInfo((v) => !v)} aria-label="Toggle info" className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15">
								{/* user/info icon */}
								<span className="inline-block">Info</span>
							</button>
						</div>
					</div>

					{/* Messages */}
					<div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
						{activeChat?.messages.map((m) => {
							const mine = m.from === currentUserId;
							return (
								<div key={m.id} className={`mb-3 flex ${mine ? "justify-end" : "justify-start"}`}>
									<div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${mine ? "bg-indigo-500 text-white" : "bg-white/10 text-white"}`}>
										{m.text}
									</div>
								</div>
							);
						})}
					</div>

					{/* Composer */}
					<div className="border-t border-white/10 bg-white/5 backdrop-blur-lg p-3">
						<div className="flex items-center gap-2">
							<input
								value={messageText}
								onChange={(e) => setMessageText(e.target.value)}
								placeholder="Write a message"
								className="flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-white placeholder-gray-400 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
							/>
							<button onClick={sendMessage} className="rounded-xl bg-indigo-500 px-4 py-2.5 font-semibold text-white hover:bg-indigo-400">Send</button>
						</div>
					</div>
					</div>

					{/* Right Info Panel */}
					{showInfo && (
						<aside className="hidden lg:block w-80 border-l border-white/10 bg-white/5 backdrop-blur-lg">
							<div className="p-5">
								{/* Avatar */}
								<div className="mx-auto h-20 w-20 rounded-full bg-white/10 flex items-center justify-center text-white text-xl font-semibold">
									{activeChat?.name
										? getInitials(activeChat.name)
										: getInitials(otherUsers[0]?.name)}
								</div>
								<div className="mt-3 text-center">
									<div className="text-white font-medium">
										{activeChat?.name || otherUsers[0]?.name}
									</div>
									<div className="text-xs text-gray-400">
										{activeChat?.name ? `${participants.length} members` : (otherUsers[0]?.online ? "Online" : "Offline")}
									</div>
								</div>

								<div className="mt-6">
									<div className="text-xs uppercase tracking-wide text-gray-400 mb-2">Details</div>
									<div className="space-y-2 text-sm">
										{activeChat?.name ? (
											<ul className="space-y-2">
												{participants.map((id) => {
													const u = sampleUsers.find((x) => x.id === id);
													return (
														<li key={id} className="flex items-center justify-between">
															<div className="flex items-center gap-2">
																<div className={`h-2.5 w-2.5 rounded-full ${u?.online ? "bg-emerald-400" : "bg-gray-500"}`} />
																<span className="text-white">{u?.name}</span>
															</div>
															<span className="text-gray-400 text-xs">@{u?.username}</span>
														</li>
													);
												})}
											</ul>
										) : (
											<div className="space-y-1">
												<div className="flex items-center justify-between">
													<span className="text-gray-400">Username</span>
													<span className="text-white">@{otherUsers[0]?.username}</span>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-gray-400">Status</span>
													<span className="text-white">{otherUsers[0]?.online ? "Online" : "Offline"}</span>
												</div>
											</div>
										)}
									</div>
								</div>
								</div>
							</aside>
					)}
				</main>
			</div>
			{showGroupModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div className="absolute inset-0 bg-black/60" onClick={() => setShowGroupModal(false)} />
					<div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-xl p-6">
						<h3 className="text-white text-lg font-semibold">Create group</h3>
						<div className="mt-4">
							<label className="block text-sm text-gray-300">Group name</label>
							<input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Project Team" className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30" />
						</div>
						<div className="mt-4">
							<div className="text-sm text-gray-300 mb-2">Participants</div>
							<div className="max-h-56 overflow-y-auto space-y-2">
								{sampleUsers.map((u) => (
									<label key={u.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
										<div className="flex items-center gap-2">
											<div className={`h-2.5 w-2.5 rounded-full ${u.online ? "bg-emerald-400" : "bg-gray-500"}`} />
											<span className="text-white">{u.name}</span>
										</div>
										<input type="checkbox" checked={selectedParticipants.includes(u.id)} onChange={() => toggleParticipant(u.id)} className="h-4 w-4" />
									</label>
								))}
							</div>
						</div>
						<div className="mt-6 flex justify-end gap-2">
							<button onClick={() => setShowGroupModal(false)} className="rounded-xl px-4 py-2.5 text-sm text-white bg-white/10 hover:bg-white/15">Cancel</button>
							<button onClick={confirmCreateGroup} className="rounded-xl px-4 py-2.5 text-sm text-white bg-indigo-500 hover:bg-indigo-400">Create</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

