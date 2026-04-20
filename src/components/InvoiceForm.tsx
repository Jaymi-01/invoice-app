import React, { useState } from 'react'
import { Trash, CaretLeft, CaretDown } from '@phosphor-icons/react'

interface InvoiceFormProps {
  isOpen: boolean
  onClose: () => void
}

const terms = [
  'Net 1 Day',
  'Net 7 Days',
  'Net 14 Days',
  'Net 30 Days'
]

const InvoiceForm = ({ isOpen, onClose }: InvoiceFormProps) => {
  const [selectedTerm, setSelectedTerm] = useState(terms[3])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed top-[72px] bottom-0 left-0 right-0 z-40 lg:top-0 lg:left-[103px]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      ></div>

      {/* Form Panel */}
      <div className="relative flex h-full w-full max-w-[616px] flex-col bg-white md:rounded-r-[20px]">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-14 md:py-16">
          <button 
            onClick={onClose}
            className="mb-6 flex items-center text-[12px] font-bold tracking-tight text-[#0C0E1E] md:hidden"
          >
            <CaretLeft weight="bold" size={12} className="mr-2 text-button" />
            Go back
          </button>

          <h1 className="mb-6 text-2xl font-bold tracking-tight text-[#0C0E1E] md:mb-12">New Invoice</h1>

          <form id="invoice-form" className="space-y-10">
            {/* Bill From */}
            <section>
              <h3 className="mb-6 text-[12px] font-bold tracking-tight text-button">Bill From</h3>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                <div className="col-span-2 md:col-span-3">
                  <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">Street Address</label>
                  <input type="text" className="w-full rounded-[4px] border border-[#DFE3FA] px-5 py-4 text-[12px] font-bold text-[#0C0E1E] focus:border-button focus:outline-none" />
                </div>
                <div>
                  <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">City</label>
                  <input type="text" className="w-full rounded-[4px] border border-[#DFE3FA] px-5 py-4 text-[12px] font-bold text-[#0C0E1E] focus:border-button focus:outline-none" />
                </div>
                <div>
                  <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">Post Code</label>
                  <input type="text" className="w-full rounded-[4px] border border-[#DFE3FA] px-5 py-4 text-[12px] font-bold text-[#0C0E1E] focus:border-button focus:outline-none" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">Country</label>
                  <input type="text" className="w-full rounded-[4px] border border-[#DFE3FA] px-5 py-4 text-[12px] font-bold text-[#0C0E1E] focus:border-button focus:outline-none" />
                </div>
              </div>
            </section>

            {/* Bill To */}
            <section>
              <h3 className="mb-6 text-[12px] font-bold tracking-tight text-button">Bill To</h3>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                <div className="col-span-2 md:col-span-3">
                  <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">Client's Name</label>
                  <input type="text" className="w-full rounded-[4px] border border-[#DFE3FA] px-5 py-4 text-[12px] font-bold text-[#0C0E1E] focus:border-button focus:outline-none" />
                </div>
                <div className="col-span-2 md:col-span-3">
                  <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">Client's Email</label>
                  <input type="email" placeholder="e.g. email@example.com" className="w-full rounded-[4px] border border-[#DFE3FA] px-5 py-4 text-[12px] font-bold text-[#0C0E1E] focus:border-button focus:outline-none" />
                </div>
                <div className="col-span-2 md:col-span-3">
                  <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">Street Address</label>
                  <input type="text" className="w-full rounded-[4px] border border-[#DFE3FA] px-5 py-4 text-[12px] font-bold text-[#0C0E1E] focus:border-button focus:outline-none" />
                </div>
                <div>
                  <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">City</label>
                  <input type="text" className="w-full rounded-[4px] border border-[#DFE3FA] px-5 py-4 text-[12px] font-bold text-[#0C0E1E] focus:border-button focus:outline-none" />
                </div>
                <div>
                  <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">Post Code</label>
                  <input type="text" className="w-full rounded-[4px] border border-[#DFE3FA] px-5 py-4 text-[12px] font-bold text-[#0C0E1E] focus:border-button focus:outline-none" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">Country</label>
                  <input type="text" className="w-full rounded-[4px] border border-[#DFE3FA] px-5 py-4 text-[12px] font-bold text-[#0C0E1E] focus:border-button focus:outline-none" />
                </div>
              </div>
            </section>

            {/* Dates & Description */}
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">Invoice Date</label>
                <input type="date" className="w-full rounded-[4px] border border-[#DFE3FA] px-5 py-4 text-[12px] font-bold text-[#0C0E1E] focus:border-button focus:outline-none" />
              </div>
              <div className="relative">
                <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">Payment Terms</label>
                <div className="relative">
                  <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex w-full items-center justify-between rounded-[4px] border border-[#DFE3FA] px-5 py-4 text-[12px] font-bold text-[#0C0E1E] focus:border-button cursor-pointer"
                  >
                    <span>{selectedTerm}</span>
                    <CaretDown weight="bold" size={12} className={`text-button transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 z-10 mt-2 w-full rounded-[8px] bg-white shadow-[0_10px_20px_rgba(72,84,159,0.25)] overflow-hidden">
                      {terms.map((term, index) => (
                        <div key={term}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTerm(term)
                              setIsDropdownOpen(false)
                            }}
                            className={`w-full px-5 py-4 text-left text-[12px] font-bold transition-colors hover:text-button ${
                              selectedTerm === term ? 'text-button' : 'text-[#0C0E1E]'
                            }`}
                          >
                            {term}
                          </button>
                          {index !== terms.length - 1 && (
                            <div className="mx-0 h-[1px] bg-[#DFE3FA]"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">Project Description</label>
                <input type="text" placeholder="e.g. Graphic Design Service" className="w-full rounded-[4px] border border-[#DFE3FA] px-5 py-4 text-[12px] font-bold text-[#0C0E1E] focus:border-button focus:outline-none" />
              </div>
            </section>

            {/* Item List */}
            <section>
              <h2 className="mb-4 text-[18px] font-bold tracking-tight text-[#777F98]">Item List</h2>
              <div className="space-y-12 md:space-y-4">
                <div className="grid grid-cols-[64px_100px_1fr_auto] gap-x-4 gap-y-6 items-end md:grid-cols-[2.5fr_1fr_1.5fr_1fr_auto]">
                  <div className="col-span-4 order-2 md:col-span-1 md:order-1">
                    <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">Item Name</label>
                    <input type="text" className="w-full rounded-[4px] border border-[#DFE3FA] px-5 py-4 text-[12px] font-bold text-[#0C0E1E] focus:border-button focus:outline-none" />
                  </div>
                  <div className="order-1 md:order-2">
                    <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">Qty.</label>
                    <input type="number" className="w-full rounded-[4px] border border-[#DFE3FA] px-2 py-4 text-center text-[12px] font-bold text-[#0C0E1E] focus:border-button focus:outline-none" />
                  </div>
                  <div className="order-1 md:order-3">
                    <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">Price</label>
                    <input type="number" className="w-full rounded-[4px] border border-[#DFE3FA] px-4 py-4 text-[12px] font-bold text-[#0C0E1E] focus:border-button focus:outline-none" />
                  </div>
                  <div className="order-1 md:order-4">
                    <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">Total</label>
                    <p className="py-4 text-[12px] font-bold text-[#7E88C3]">0.00</p>
                  </div>
                  <div className="order-1 flex justify-end pb-4 md:order-5">
                    <button type="button" className="text-[#888EB0] hover:text-[#EC5757]">
                      <Trash size={16} weight="bold" />
                    </button>
                  </div>
                </div>

                <button 
                  type="button"
                  className="w-full rounded-full bg-discard-button py-4 text-[12px] font-bold text-[#7E88C3] hover:bg-[#DFE3FA]"
                >
                  + Add New Item
                </button>
              </div>
            </section>
          </form>
        </div>

        {/* Footer */}
        <footer className="flex shrink-0 items-center justify-between bg-white px-6 py-8 shadow-[0_-10px_20px_rgba(72,84,159,0.1)] md:px-14 md:shadow-none">
          <button 
            type="button"
            onClick={onClose}
            className="rounded-full bg-discard-button px-4 py-4 text-[12px] font-bold text-[#7E88C3] hover:bg-[#DFE3FA]"
          >
            Discard
          </button>
          <div className="flex gap-2">
            <button type="button" className="rounded-full bg-draft-button px-4 py-4 text-[12px] font-bold text-[#888EB0] hover:bg-[#0C0E1E]">
              Save as Draft
            </button>
            <button form="invoice-form" type="submit" className="rounded-full bg-button px-4 py-4 text-[12px] font-bold text-white hover:bg-button-hover">
              Save & Send
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default InvoiceForm
