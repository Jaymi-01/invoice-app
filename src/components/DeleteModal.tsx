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
        <h2 className="mb-3 text-2xl font-bold tracking-tight text-text-main transition-colors">Confirm Deletion</h2>
        <p className="mb-4 text-[12px] leading-6 text-text-secondary font-medium transition-colors">
          Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="rounded-full bg-btn-secondary-bg px-6 py-4 text-[12px] font-bold text-btn-secondary-text lg:hover:bg-btn-secondary-hover transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="rounded-full bg-[#EC5757] px-6 py-4 text-[12px] font-bold text-white lg:hover:bg-[#FF9797] transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
