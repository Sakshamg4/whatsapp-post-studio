import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface NotificationProps {
  notification: { text: string; type: 'success' | 'error' } | null;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for transition
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification && !isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      } w-[calc(100%-2rem)] max-w-[320px] pointer-events-none md:w-auto md:max-w-sm`}
    >
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md ${
          notification?.type === 'success'
            ? 'bg-[#1e4620]/90 border-wa-green/50 text-white'
            : 'bg-[#4c1d1d]/90 border-red-500/50 text-white'
        }`}
      >
        <div className="flex-shrink-0 mt-0.5">
          {notification?.type === 'success' ? (
            <CheckCircle2 size={18} className="text-wa-green" />
          ) : (
            <XCircle size={18} className="text-red-400" />
          )}
        </div>
        <p className="text-sm font-medium leading-relaxed">{notification?.text}</p>
      </div>
    </div>
  );
};

export default Notification;
