'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  confirmVariant?: 'default' | 'destructive';
  loading?: boolean;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  onConfirm,
  confirmLabel = 'Confirm',
  confirmVariant = 'default',
  loading,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold text-navy">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-full p-1 hover:bg-gray-100 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>
          {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
          {children}
          {onConfirm && (
            <div className="flex justify-end gap-2 mt-6">
              <Dialog.Close asChild>
                <Button variant="outline" size="sm">Cancel</Button>
              </Dialog.Close>
              <Button
                variant={confirmVariant}
                size="sm"
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? 'Loading...' : confirmLabel}
              </Button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
