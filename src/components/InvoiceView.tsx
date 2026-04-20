import React from 'react'
import { CaretLeft } from '@phosphor-icons/react'
import type { Invoice } from '../types'

interface InvoiceViewProps {
  invoice: Invoice
  onBack: () => void
  onEdit: () => void
}

const InvoiceView = ({ invoice, onBack, onEdit }: InvoiceViewProps) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-[#33D69F14] text-paid'
      case 'pending': return 'bg-[#FF8F0014] text-pending'
      case 'draft': return 'bg-[#373B5314] text-[#373B53]'
      default: return 'bg-[#373B5314] text-[#373B53]'
    }
  }

  return (
    <main className="px-6 py-8 lg:max-w-[730px] lg:mx-auto lg:py-16">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center text-[12px] font-bold tracking-tight text-[#0C0E1E] group"
      >
        <CaretLeft weight="bold" size={12} className="mr-4 text-button group-hover:text-[#7E88C3]" />
        Go back
      </button>

      {/* Status Bar */}
      <div className="flex items-center justify-between bg-white rounded-lg p-6 shadow-[0_10px_10px_-10px_rgba(72,84,159,0.1)] mb-4">
        <div className="flex items-center justify-between w-full md:w-auto md:gap-4">
          <span className="text-[#858BB2] text-[12px] font-medium">Status</span>
          <div className={`flex items-center justify-center w-[104px] py-3 rounded-md capitalize font-bold text-[12px] ${getStatusStyles(invoice.status)}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              invoice.status === 'paid' ? 'bg-paid' : 
              invoice.status === 'pending' ? 'bg-pending' : 'bg-[#373B53]'
            }`}></div>
            {invoice.status}
          </div>
        </div>
        <div className="hidden md:flex gap-2">
          <button onClick={onEdit} className="rounded-full bg-discard-button px-6 py-4 text-[12px] font-bold text-[#7E88C3] hover:bg-[#DFE3FA] transition-colors">Edit</button>
          <button className="rounded-full bg-[#EC5757] px-6 py-4 text-[12px] font-bold text-white hover:bg-[#FF9797] transition-colors">Delete</button>
          <button className="rounded-full bg-button px-6 py-4 text-[12px] font-bold text-white hover:bg-button-hover transition-colors">Mark as Paid</button>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-lg p-6 shadow-[0_10px_10px_-10px_rgba(72,84,159,0.1)] md:p-12">
        <div className="flex flex-col md:flex-row md:justify-between mb-8">
          <div className="mb-8 md:mb-0">
            <h1 className="font-bold text-[#0C0E1E] text-base mb-1">
              <span className="text-[#7E88C3]">#</span>{invoice.id}
            </h1>
            <p className="text-[#7E88C3] text-[12px]">{invoice.description}</p>
          </div>
          <div className="text-[#7E88C3] text-[12px] md:text-right">
            <p>{invoice.senderAddress.street}</p>
            <p>{invoice.senderAddress.city}</p>
            <p>{invoice.senderAddress.postCode}</p>
            <p>{invoice.senderAddress.country}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 mb-10">
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-[#7E88C3] text-[12px] mb-3 block">Invoice Date</span>
              <span className="text-[#0C0E1E] text-[15px] font-bold">{invoice.createdAt}</span>
            </div>
            <div className="mt-8">
              <span className="text-[#7E88C3] text-[12px] mb-3 block">Payment Due</span>
              <span className="text-[#0C0E1E] text-[15px] font-bold">{invoice.paymentDue}</span>
            </div>
          </div>

          <div>
            <span className="text-[#7E88C3] text-[12px] mb-3 block">Bill To</span>
            <span className="text-[#0C0E1E] text-[15px] font-bold mb-2 block">{invoice.clientName}</span>
            <div className="text-[#7E88C3] text-[12px]">
              <p>{invoice.clientAddress.street}</p>
              <p>{invoice.clientAddress.city}</p>
              <p>{invoice.clientAddress.postCode}</p>
              <p>{invoice.clientAddress.country}</p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <span className="text-[#7E88C3] text-[12px] mb-3 block">Sent to</span>
            <span className="text-[#0C0E1E] text-[15px] font-bold">{invoice.clientEmail}</span>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-[#F9FAFE] rounded-t-lg p-6 md:p-8">
          <div className="hidden md:grid grid-cols-4 mb-8 text-[#7E88C3] text-[12px]">
            <span>Item Name</span>
            <span className="text-center">QTY.</span>
            <span className="text-right">Price</span>
            <span className="text-right">Total</span>
          </div>
          <div className="space-y-6">
            {invoice.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between md:grid md:grid-cols-4">
                <div className="flex flex-col md:block">
                  <span className="text-[#0C0E1E] text-[12px] font-bold mb-2 md:mb-0">{item.name}</span>
                  <span className="text-[#7E88C3] text-[12px] font-bold md:hidden">{item.quantity} x £ {item.price.toFixed(2)}</span>
                </div>
                <span className="hidden md:block text-center text-[#7E88C3] text-[12px] font-bold">{item.quantity}</span>
                <span className="hidden md:block text-right text-[#7E88C3] text-[12px] font-bold">£ {item.price.toFixed(2)}</span>
                <span className="text-[#0C0E1E] text-[12px] font-bold text-right">£ {item.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-[#373B53] rounded-b-lg p-6 md:px-8 flex items-center justify-between text-white">
          <span className="text-[12px] md:hidden">Grand Total</span>
          <span className="hidden md:block text-[12px]">Amount Due</span>
          <span className="text-2xl font-bold">£ {invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Mobile Actions Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-6 flex justify-center gap-2 md:hidden">
        <button onClick={onEdit} className="rounded-full bg-discard-button px-6 py-4 text-[12px] font-bold text-[#7E88C3] hover:bg-[#DFE3FA] transition-colors">Edit</button>
        <button className="rounded-full bg-[#EC5757] px-6 py-4 text-[12px] font-bold text-white hover:bg-[#FF9797] transition-colors">Delete</button>
        <button className="rounded-full bg-button px-6 py-4 text-[12px] font-bold text-white hover:bg-button-hover transition-colors">Mark as Paid</button>
      </div>
      <div className="h-24 md:hidden"></div>
    </main>
  )
}

export default InvoiceView
