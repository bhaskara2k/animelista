
import React from 'react';
import { XMarkIcon } from './Icons';

type ModalSize = 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: ModalSize;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'lg' }) => {
  // Handle ESC key to close
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses: Record<ModalSize, string> = {
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  };

  const modalSizeClass = sizeClasses[size] || sizeClasses.lg;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-surface-primary border border-white/10 p-0 rounded-2xl shadow-2xl w-full ${modalSizeClass} max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100 animate-scale-up flex flex-col`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5 sticky top-0 z-10 backdrop-blur-xl">
          <h2 id="modal-title" className="text-2xl font-bold text-white tracking-tight">{title}</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-gray-500 border border-white/10 px-2 py-1 rounded hidden md:inline-block">ESC</span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors"
              aria-label="Fechar modal"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
