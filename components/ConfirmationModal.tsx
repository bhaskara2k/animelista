
import React from 'react';
import Modal from './Modal';
import { CheckIcon, XMarkIcon, QuestionMarkCircleIcon } from './Icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonClassName?: string; // This will now primarily control destructive (red) vs constructive (accent)
  icon?: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = "Confirmar",
  cancelButtonText = "Cancelar",
  confirmButtonClassName, // Example: "bg-red-600 hover:bg-red-500" for destructive
  icon
}) => {
  if (!isOpen) return null;

  const effectiveConfirmButtonClass = confirmButtonClassName 
    ? confirmButtonClassName // If a specific class (like red for delete) is provided, use it
    : "bg-accent-cta hover:bg-accent-cta-hover"; // Otherwise, use the themed accent color

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="text-center">
        {icon && <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center">{icon}</div>}
        <p className="text-text-primary mb-8 text-lg">
          {message}
        </p>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-md text-text-primary bg-surface-secondary hover:bg-surface-hover transition-colors flex items-center justify-center space-x-2"
            aria-label={cancelButtonText}
          >
            <XMarkIcon className="w-5 h-5"/>
            <span>{cancelButtonText}</span>
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2.5 rounded-md text-white ${effectiveConfirmButtonClass} transition-colors flex items-center justify-center space-x-2`}
            aria-label={confirmButtonText}
          >
            <CheckIcon className="w-5 h-5"/>
            <span>{confirmButtonText}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
