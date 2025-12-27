import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import {logoutwork} from "../../services/auth"
import { showToast, toastMessages } from '../../utils/toast';
import {logoutThunk} from "../../features/auth/authThunk.js"

export default function UserSidebar({ onChatClick, onCallsClick, onSettingsClick }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const getInitials = (full) => {
    if (!full) return "?";
    const parts = full.split(" ");
    const a = parts[0]?.[0] || "";
    const b = parts[1]?.[0] || "";
    return (a + b).toUpperCase() || a.toUpperCase();
  };

  const handleLogout = async () => {
  try {
    await dispatch(logoutThunk()).unwrap();
    dispatch(logout()); // clears Redux state
    showToast.success(toastMessages.auth.logoutSuccess);
  } catch (err) {
    showToast.error(err || "Logout failed");
  }
};

  return (
    <div className="w-16 lg:w-16 md:w-14 sm:w-12 bg-white/5 backdrop-blur-lg border-r border-white/10 flex flex-col items-center py-4 space-y-4 h-full overflow-hidden">
      {/* User Avatar */}
      <div className="relative">
        <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white text-lg font-semibold cursor-pointer hover:bg-white/15 transition-colors">
          {user?.username ? getInitials(user.username) : getInitials(user?.email || "User")}
        </div>
        {/* Online indicator */}
        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-400 rounded-full border-2 border-slate-950"></div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col space-y-3">
        <button
          onClick={onChatClick}
          className="p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors group"
          title="Chats"
        >
          <svg className="w-5 h-5 text-white group-hover:text-indigo-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>

        <button
          onClick={onCallsClick}
          className="p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors group"
          title="Calls"
        >
          <svg className="w-5 h-5 text-white group-hover:text-indigo-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>
      </div>

      {/* Bottom Buttons */}
      <div className="flex-1 flex flex-col justify-end space-y-3">
        <button
          onClick={onSettingsClick}
          className="p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors group"
          title="Settings"
        >
          <svg className="w-5 h-5 text-white group-hover:text-indigo-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <button
          onClick={handleLogout}
          className="p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-colors group"
          title="Logout"
        >
          <svg className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  );
}
