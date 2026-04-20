import { useState } from 'react'
import { CaretLeft } from '@phosphor-icons/react'
import type { Invoice } from '../types'
import DeleteModal from './DeleteModal'

interface InvoiceViewProps {
  invoice: Invoice
  onBack: () => void
  onEdit: () => void
  onDelete: (id: string) => void
  onMarkAsPaid: (id: string) => void
}

const InvoiceView = ({ invoice, onBack, onEdit, onDelete, onMarkAsPaid }: InvoiceViewProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const getStatusStyles = (status: 'paid' | 'pending' | 'draft') => {
    switch (status) {
      case 'paid': return 'bg-[#33D69F14] text-paid'
      case 'pending': return 'bg-[#FF8F0014] text-pending'
      case 'draft': return 'bg-btn-draft-bg/10 text-btn-draft-bg dark:text-text-secondary dark:bg-text-secondary/10'
      default: return 'bg-btn-draft-bg/10 text-btn-draft-bg'
    }
  }

  return (
    <div className="flex h-[calc(100vh-72px)] flex-col lg:h-auto lg:block">
      {isDeleteModalOpen && (
        <DeleteModal 
          invoiceId={invoice.id} 
          onClose={() => setIsDeleteModalOpen(false)} 
          onConfirm={() => {
            onDelete(invoice.id)
            setIsDeleteModalOpen(false)
          }} 
        />
      )}

      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-14 lg:px-0 lg:max-w-[730px] lg:mx-auto lg:py-16">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center text-[12px] font-bold tracking-tight text-text-main group transition-colors cursor-pointer"
        >
          <CaretLeft weight="bold" size={12} className="mr-4 text-button lg:group-hover:text-text-accent" />
          Go back
        </button>

        <div className="flex items-center justify-between bg-container rounded-lg p-6 md:px-8 shadow-[0_10px_10px_-10px_rgba(72,84,159,0.1)] mb-4 transition-colors">
          <div className="flex items-center justify-between w-full md:w-auto md:gap-5">
            <span className="text-text-secondary text-[12px] font-medium transition-colors">Status</span>
            <div className={`flex items-center justify-center w-[104px] py-3 rounded-md capitalize font-bold text-[12px] transition-colors ${getStatusStyles(invoice.status as any)}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                invoice.status === 'paid' ? 'bg-paid' : 
                invoice.status === 'pending' ? 'bg-pending' : 'bg-text-secondary'
              }`}></div>
              {invoice.status}
            </div>
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={onEdit} className="rounded-full bg-btn-secondary-bg px-6 py-4 text-[12px] font-bold text-btn-secondary-text lg:hover:bg-btn-secondary-hover transition-colors cursor-pointer">Edit</button>
            <button onClick={() => setIsDeleteModalOpen(true)} className="rounded-full bg-[#EC5757] px-6 py-4 text-[12px] font-bold text-white lg:hover:bg-[#FF9797] transition-colors cursor-pointer">Delete</button>
            {invoice.status === 'pending' && (
              <button onClick={() => onMarkAsPaid(invoice.id)} className="rounded-full bg-button px-6 py-4 text-[12px] font-bold text-white lg:hover:bg-button-hover transition-colors cursor-pointer">Mark as Paid</button>
            )}
          </div>
        </div>

        <div className="bg-container rounded-lg p-6 md:p-8 lg:p-12 shadow-[0_10px_10px_-10px_rgba(72,84,159,0.1)] md:mb-0 transition-colors">
          <div className="flex flex-col md:flex-row md:justify-between mb-8 md:mb-5">
            <div className="mb-8 md:mb-0">
              <h1 className="font-bold text-text-main text-base mb-1 transition-colors">
                <span className="text-text-accent">#</span>{invoice.id}
              </h1>
              <p className="text-text-secondary text-[12px] transition-colors">{invoice.description}</p>
            </div>
            <div className="text-text-secondary text-[12px] md:text-right transition-colors leading-6">
              <p>{invoice.senderAddress.street}</p>
              <p>{invoice.senderAddress.city}</p>
              <p>{invoice.senderAddress.postCode}</p>
              <p>{invoice.senderAddress.country}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3 md:mb-12 mb-10">
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-text-secondary text-[12px] mb-3 block transition-colors">Invoice Date</span>
                <span className="text-text-main text-[15px] font-bold transition-colors">{invoice.createdAt}</span>
              </div>
              <div className="mt-8">
                <span className="text-text-secondary text-[12px] mb-3 block transition-colors">Payment Due</span>
                <span className="text-text-main text-[15px] font-bold transition-colors">{invoice.paymentDue}</span>
              </div>
            </div>

            <div>
              <span className="text-text-secondary text-[12px] mb-3 block transition-colors">Bill To</span>
              <span className="text-text-main text-[15px] font-bold mb-2 block transition-colors">{invoice.clientName}</span>
              <div className="text-text-secondary text-[12px] transition-colors leading-6">
                <p>{invoice.clientAddress.street}</p>
                <p>{invoice.clientAddress.city}</p>
                <p>{invoice.clientAddress.postCode}</p>
                <p>{invoice.clientAddress.country}</p>
              </div>
            </div>

            <div className="col-span-2 md:col-span-1">
              <span className="text-text-secondary text-[12px] mb-3 block transition-colors">Sent to</span>
              <span className="text-text-main text-[15px] font-bold transition-colors">{invoice.clientEmail}</span>
            </div>
          </div>

          <div className="bg-btn-secondary-bg rounded-t-lg p-6 md:p-8 transition-colors">
            <div className="hidden md:grid md:grid-cols-[3fr_1fr_1fr_1fr] mb-8 text-text-secondary text-[12px] transition-colors">
              <span>Item Name</span>
              <span className="text-center">QTY.</span>
              <span className="text-right">Price</span>
              <span className="text-right">Total</span>
            </div>
            <div className="space-y-6">
              {invoice.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between md:grid md:grid-cols-[3fr_1fr_1fr_1fr]">
                  <div className="flex flex-col md:block">
                    <span className="text-text-main text-[12px] font-bold mb-2 md:mb-0 transition-colors">{item.name}</span>
                    <span className="text-text-secondary text-[12px] font-bold md:hidden transition-colors">{item.quantity} x £ {item.price.toFixed(2)}</span>
                  </div>
                  <span className="hidden md:block text-center text-text-secondary text-[12px] font-bold transition-colors">{item.quantity}</span>
                  <span className="hidden md:block text-right text-text-secondary text-[12px] font-bold transition-colors">£ {item.price.toFixed(2)}</span>
                  <span className="text-text-main text-[12px] font-bold text-right transition-colors">£ {item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-color-grand-total rounded-b-lg p-6 md:px-8 flex items-center justify-between text-white transition-colors duration-300">
            <span className="text-[12px] md:block">Amount Due</span>
            <span className="text-2xl font-bold">£ {invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </main>

      <footer className="shrink-0 bg-container p-6 flex justify-end gap-2 md:hidden shadow-[0_-10px_20px_rgba(72,84,159,0.1)] transition-colors">
        <button onClick={onEdit} className="rounded-full bg-btn-secondary-bg px-6 py-4 text-[12px] font-bold text-btn-secondary-text lg:hover:bg-btn-secondary-hover transition-colors cursor-pointer">Edit</button>
        <button onClick={() => setIsDeleteModalOpen(true)} className="rounded-full bg-[#EC5757] px-6 py-4 text-[12px] font-bold text-white lg:hover:bg-[#FF9797] transition-colors cursor-pointer">Delete</button>
        {invoice.status === 'pending' && (
          <button onClick={() => onMarkAsPaid(invoice.id)} className="rounded-full bg-button px-6 py-4 text-[12px] font-bold text-white lg:hover:bg-button-hover transition-colors cursor-pointer">Mark as Paid</button>
        )}
      </footer>
    </div>
  )
}

export default InvoiceView
