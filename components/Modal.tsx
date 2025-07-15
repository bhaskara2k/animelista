
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      <div className={`bg-surface-primary p-6 rounded-lg shadow-custom-xl w-full ${modalSizeClass} max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modal-appear text-text-primary`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-accent">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-accent transition-colors"
            aria-label="Fechar modal"
          >
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
