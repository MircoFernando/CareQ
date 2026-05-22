import React from 'react';
import Button from './Button';
import { ShieldAlert } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isConfirming = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-slide-up">
      {/* Dark tint backdrop */}
      <div className="fixed inset-0 bg-text-primary/45 backdrop-blur-sm" onClick={onCancel} />

      {/* Dialog body */}
      <div className="bg-white rounded-xl border border-border max-w-md w-full relative z-10 p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 text-orange-700 rounded-lg border border-orange-200 shrink-0">
            <ShieldAlert size={20} className="stroke-[2.5]" />
          </div>
          <h2 className="text-base font-bold text-text-primary">{title}</h2>
        </div>
        
        <p className="text-sm text-text-secondary leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-end gap-3 mt-2 border-t border-border pt-4">
          <Button variant="secondary" onClick={onCancel} disabled={isConfirming}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isConfirming}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmDialog;
