import React, { useState } from 'react';
import { Bell, BellOff, Check, Trash2, Settings, TrendingUp, TrendingDown, Shield, Zap, Clock, X, Volume2, VolumeX } from 'lucide-react';
import { NotificationItem } from '../types';

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'price_alert',
    title: 'ETH Price Alert',
    message: 'Ethereum dropped below $2,500',
    timestamp: '2 min ago',
    isRead: false,
    data: { symbol: 'ETH', price: 2498.50, direction: 'down' }
  },
  {
    id: '2',
    type: 'transaction',
    title: 'Swap Completed',
    message: 'Successfully swapped 1 ETH to 2,650 USDC',
    timestamp: '15 min ago',
    isRead: false,
    data: { txHash: '0x1234...5678' }
  },
  {
    id: '3',
    type: 'security',
    title: 'New Device Login',
    message: 'Your wallet was accessed from a new device',
    timestamp: '1 hour ago',
    isRead: true,
    data: { device: 'iPhone 15', location: 'New York, US' }
  },
  {
    id: '4',
    type: 'price_alert',
    title: 'SOL Price Alert',
    message: 'Solana reached $145 target price',
    timestamp: '3 hours ago',
    isRead: true,
    data: { symbol: 'SOL', price: 145.20, direction: 'up' }
  },
  {
    id: '5',
    type: 'system',
    title: 'Scheduled Buy Executed',
    message: 'Weekly DCA: Bought 0.05 BTC for $3,000',
    timestamp: '1 day ago',
    isRead: true,
    data: { scheduleId: '1' }
  },
];

interface NotificationCenterProps {
  onClose?: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    priceAlerts: true,
    transactions: true,
    security: true,
    system: true,
    sound: true,
    pushEnabled: true
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'price_alert': return <TrendingUp size={18} />;
      case 'transaction': return <Zap size={18} />;
      case 'security': return <Shield size={18} />;
      case 'system': return <Clock size={18} />;
      default: return <Bell size={18} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'price_alert': return 'bg-blue-500/20 text-blue-500';
      case 'transaction': return 'bg-green-500/20 text-green-500';
      case 'security': return 'bg-red-500/20 text-red-500';
      case 'system': return 'bg-purple-500/20 text-purple-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell size={20} className="text-[#AB9FF2]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <h3 className="font-bold text-lg">Notifications</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-[#AB9FF2] text-black' : 'bg-[#1C1C1E] text-gray-400 hover:text-white'}`}
          >
            <Settings size={18} />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-3 py-1.5 bg-[#1C1C1E] text-gray-400 hover:text-white rounded-lg text-sm transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {showSettings && (
        <div className="bg-[#1C1C1E] rounded-2xl p-4 border border-[#AB9FF2]/30">
          <h4 className="font-bold mb-4">Notification Settings</h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <TrendingUp size={16} className="text-blue-500" />
                </div>
                <span>Price Alerts</span>
              </div>
              <button
                onClick={() => setSettings(s => ({ ...s, priceAlerts: !s.priceAlerts }))}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.priceAlerts ? 'bg-[#AB9FF2]' : 'bg-gray-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.priceAlerts ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Zap size={16} className="text-green-500" />
                </div>
                <span>Transaction Updates</span>
              </div>
              <button
                onClick={() => setSettings(s => ({ ...s, transactions: !s.transactions }))}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.transactions ? 'bg-[#AB9FF2]' : 'bg-gray-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.transactions ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Shield size={16} className="text-red-500" />
                </div>
                <span>Security Alerts</span>
              </div>
              <button
                onClick={() => setSettings(s => ({ ...s, security: !s.security }))}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.security ? 'bg-[#AB9FF2]' : 'bg-gray-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.security ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-2">
              <div className="flex items-center gap-3">
                {settings.sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
                <span>Sound Effects</span>
              </div>
              <button
                onClick={() => setSettings(s => ({ ...s, sound: !s.sound }))}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.sound ? 'bg-[#AB9FF2]' : 'bg-gray-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.sound ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={18} />
                <span>Push Notifications</span>
              </div>
              <button
                onClick={() => setSettings(s => ({ ...s, pushEnabled: !s.pushEnabled }))}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.pushEnabled ? 'bg-[#AB9FF2]' : 'bg-gray-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.pushEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {notifications.length > 0 ? (
        <div className="flex flex-col gap-2">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`bg-[#1C1C1E] rounded-xl p-4 transition-all cursor-pointer hover:bg-[#252528] ${
                !notification.isRead ? 'border-l-4 border-[#AB9FF2]' : ''
              }`}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className={`font-bold text-sm ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-0.5">{notification.message}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(notification.id); }}
                      className="p-1 hover:bg-red-500/20 rounded transition-colors flex-shrink-0"
                    >
                      <X size={14} className="text-gray-500 hover:text-red-400" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-600">{notification.timestamp}</span>
                    {!notification.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#AB9FF2]" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button
            onClick={handleClearAll}
            className="w-full py-3 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-medium transition-colors"
          >
            Clear All Notifications
          </button>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <BellOff size={48} className="mx-auto mb-3 opacity-50" />
          <p className="font-medium">No notifications</p>
          <p className="text-sm mt-1">You're all caught up!</p>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl p-4 border border-blue-500/20">
        <div className="flex items-start gap-3">
          <Bell size={20} className="text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-500">Stay Informed</h4>
            <p className="text-sm text-gray-400 mt-1">
              Enable push notifications to receive real-time alerts about price movements, 
              completed transactions, and security updates even when the app is closed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
