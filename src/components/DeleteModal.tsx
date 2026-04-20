import React from 'react'

interface DeleteModalProps {
  invoiceId: string
  onClose: () => void
  onConfirm: () => void
}

const DeleteModal = ({ invoiceId, onClose, onConfirm }: DeleteModalProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative w-full max-w-[480px] rounded-lg bg-container p-8 md:p-12 transition-colors">
        <h2 className="mb-3 text-2xl font-bold tracking-tight text-text-main">Confirm Deletion</h2>
        <p className="mb-4 text-[12px] leading-6 text-text-secondary font-medium">
          Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="rounded-full bg-discard-button dark:bg-[#252945] dark:text-text-secondary px-6 py-4 text-[12px] font-bold text-text-accent hover:bg-input-border dark:hover:bg-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="rounded-full bg-[#EC5757] px-6 py-4 text-[12px] font-bold text-white hover:bg-[#FF9797] transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
