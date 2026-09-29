import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { X, Bell, BellOff, Volume2, VolumeX, CheckCircle, Flame, Clock, ShieldCheck, Vote, Trash2 } from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  setActiveTab
}) => {
  const {
    notifications,
    unreadNotifsCount,
    pushEnabled,
    soundEnabled,
    markNotificationAsRead,
    clearAllNotifications,
    togglePushNotifications,
    toggleSound
  } = useWeb3();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter((item) => {
    if (categoryFilter === 'all') return true;
    return item.category === categoryFilter;
  });

  const getCategoryIcon = (category: NotificationItem['category']) => {
    switch (category) {
      case 'ido':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'vesting':
        return <Clock className="w-4 h-4 text-emerald-400" />;
      case 'governance':
        return <Vote className="w-4 h-4 text-sky-400" />;
      case 'security':
        return <ShieldCheck className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    markNotificationAsRead(notif.id);
    if (notif.actionUrl) {
      const tab = notif.actionUrl.replace('#', '');
      setActiveTab(tab);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-[#0B0F19] border-l border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-white text-sm">Protocol Notifications</h3>
            {unreadNotifsCount > 0 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono">
                {unreadNotifsCount} new
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Push & Sound Preferences Bar */}
        <div className="p-3 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePushNotifications}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                pushEnabled ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Browser Push Notifications"
            >
              {pushEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
              <span>Push {pushEnabled ? 'On' : 'Off'}</span>
            </button>

            <button
              onClick={toggleSound}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                soundEnabled ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Web3 Audio Chimes"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>Sound</span>
            </button>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="flex items-center gap-1 text-slate-500 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Filter categories tabs */}
        <div className="flex items-center gap-1 p-2 bg-[#080C14] border-b border-slate-800 overflow-x-auto">
          {['all', 'ido', 'vesting', 'governance', 'security'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 text-xs rounded font-medium capitalize whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <CheckCircle className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
              No notifications in this category.
            </div>
          ) : (
            filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-[#0E1524] border-slate-800/80 text-slate-400 hover:border-slate-700'
                    : 'bg-[#131D31] border-amber-500/30 text-slate-200 hover:border-amber-400/50 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">{getCategoryIcon(notif.category)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs font-semibold truncate ${
                          notif.read ? 'text-slate-300' : 'text-amber-300'
                        }`}
                      >
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {notif.message}
                    </p>
                    {notif.actionUrl && (
                      <div className="mt-2 text-[10px] font-medium text-amber-400 hover:underline">
                        View details →
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#080C14] border-t border-slate-800 text-center text-[11px] text-slate-500">
          Push notifications powered by Web Push Protocol & Binance Smart Chain Events
        </div>
      </div>
    </div>
  );
};
