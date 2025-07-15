import React, { useEffect, useState } from 'react';
import { SparklesIcon, TrendingUpIcon } from './Icons';

export interface Toast {
  id: number;
  message: string;
  type: 'xp' | 'level-up';
}

interface ToastNotificationProps {
  toast: Toast;
  onDismiss: (id: number) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setIsVisible(true);

    // Set timer to animate out and then dismiss
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(toast.id), 300); // Wait for fade-out transition
    }, 4000); // Display for 4 seconds

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const isLevelUp = toast.type === 'level-up';
  const Icon = isLevelUp ? TrendingUpIcon : SparklesIcon;

  const containerClasses = `
    w-full max-w-sm rounded-lg shadow-custom-xl pointer-events-auto
    transition-all duration-300 ease-in-out
    ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
  `;

  const backgroundClasses = isLevelUp
    ? 'bg-gradient-to-br from-amber-500 to-yellow-400'
    : 'bg-surface-primary border border-border-primary';

  const textClasses = isLevelUp ? 'text-white' : 'text-text-primary';
  const iconClasses = isLevelUp ? 'text-yellow-200' : 'text-accent';

  return (
    <div className={`${containerClasses} ${backgroundClasses}`}>
      <div className="p-4 flex items-center">
        <div className={`flex-shrink-0 mr-3 ${isLevelUp ? 'animate-pulse' : ''}`}>
          <Icon className={`w-7 h-7 ${iconClasses}`} />
        </div>
        <div className="flex-1">
          <p className={`font-semibold ${textClasses}`} dangerouslySetInnerHTML={{ __html: toast.message }} />
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onDismiss(toast.id), 300);
          }}
          className={`ml-3 p-1 rounded-full ${isLevelUp ? 'hover:bg-white/20' : 'hover:bg-surface-secondary'} transition-colors`}
          aria-label="Dispensar notificação"
        >
          <svg className={`w-4 h-4 ${textClasses}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: Toast[]; onDismiss: (id: number) => void }> = ({ toasts, onDismiss }) => {
  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[100]"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <ToastNotification key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </div>
    </div>
  );
};
