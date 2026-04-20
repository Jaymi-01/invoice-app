import React, { useState } from 'react'
import { Plus, CaretDown, CaretRight } from '@phosphor-icons/react'
import emptyImg from '../assets/email-campaign.png'
import type { Invoice } from '../types'

interface InvoicesProps {
  invoices: Invoice[]
  onOpenForm: () => void
  onSelectInvoice: (invoice: Invoice) => void
}

const Invoices = ({ invoices, onOpenForm, onSelectInvoice }: InvoicesProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<string[]>([])

  const toggleFilter = (status: string) => {
    if (filters.includes(status)) {
      setFilters(filters.filter(f => f !== status))
    } else {
      setFilters([...filters, status])
    }
  }

  const filteredInvoices = invoices.filter(inv => 
    filters.length === 0 || filters.includes(inv.status)
  )

  const getStatusStyles = (status: 'paid' | 'pending' | 'draft') => {
    switch (status) {
      case 'paid':
        return 'bg-[#33D69F14] text-paid'
      case 'pending':
        return 'bg-[#FF8F0014] text-pending'
      case 'draft':
        return 'bg-btn-draft-bg/10 text-btn-draft-bg dark:text-text-secondary dark:bg-text-secondary/10'
      default:
        return 'bg-btn-draft-bg/10 text-btn-draft-bg'
    }
  }

  return (
    <main className="px-6 py-8 md:px-12 md:py-14 lg:px-0 lg:max-w-[730px] lg:mx-auto lg:py-16 transition-all">
      <header className="flex items-center justify-between mb-8 md:mb-14 lg:mb-16">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main lg:text-3xl transition-colors">Invoices</h1>
          <p className="text-text-secondary text-[13px] mt-1 transition-colors">
            {filteredInvoices.length === 0 
              ? 'No invoices' 
              : `There are ${filteredInvoices.length} total invoices`}
          </p>
        </div>

        <div className="flex items-center">
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center mr-5 md:mr-10 focus:outline-none cursor-pointer group"
            >
              <span className="font-bold text-text-main mr-3 text-[13px] lg:text-sm lg:group-hover:text-text-accent transition-colors">
                Filter <span className="hidden md:inline">by status</span>
              </span>
              <CaretDown weight="bold" size={12} className={`text-button transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterOpen && (
              <div className="absolute top-full right-0 z-10 mt-6 w-40 rounded-lg bg-container p-6 shadow-[0_10px_20px_rgba(72,84,159,0.25)] transition-colors">
                {['draft', 'pending', 'paid'].map((status) => (
                  <label key={status} className="flex items-center mb-4 last:mb-0 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={filters.includes(status)}
                        onChange={() => toggleFilter(status)}
                      />
                      <div className={`w-4 h-4 rounded-sm border transition-colors flex items-center justify-center ${
                        filters.includes(status) 
                          ? 'bg-button border-button' 
                          : 'bg-input-border border-transparent lg:group-hover:border-button'
                      }`}>
                        {filters.includes(status) && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.5 4.5L3.83333 6.83333L8.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="ml-3 text-[12px] font-bold capitalize text-text-main lg:group-hover:text-button transition-colors cursor-pointer">{status}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={onOpenForm}
            className="flex items-center bg-button rounded-full p-1.5 md:p-2 focus:outline-none cursor-pointer lg:hover:bg-button-hover transition-colors"
          >
            <div className="bg-white rounded-full p-1 mr-2 md:mr-4">
              <Plus weight="bold" size={16} className="text-button" />
            </div>
            <span className="font-bold text-white text-[13px] mr-2 md:text-sm md:mr-4">New <span className="hidden md:inline">Invoice</span></span>
          </button>
        </div>
      </header>

      {filteredInvoices.length === 0 ? (
        <section className="flex flex-col items-center justify-center mt-20 md:mt-40 lg:mt-24">
          <img 
            src={emptyImg} 
            alt="No invoices Illustration" 
            className="w-[193px] mb-10 md:w-[242px] lg:mb-16"
          />
          <h2 className="text-xl font-bold text-text-main mb-6 tracking-tight lg:text-2xl transition-colors">There is nothing here</h2>
          <p className="text-text-secondary text-center text-[13px] max-w-[180px] md:max-w-none transition-colors">
            Create an invoice by clicking the <span className="font-bold">New Invoice</span> button and get started
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <div 
              key={invoice.id} 
              onClick={() => onSelectInvoice(invoice)}
              className="bg-container rounded-lg p-6 md:px-8 md:py-4 shadow-[0_10px_10px_-10px_rgba(72,84,159,0.1)] border border-transparent lg:hover:border-button transition-all cursor-pointer md:grid md:grid-cols-[0.5fr_1fr_1fr_1fr_1fr_auto] md:items-center md:gap-4"
            >
              <span className="font-bold text-text-main text-[12px] mb-6 md:mb-0 transition-colors order-1">
                <span className="text-text-accent">#</span>{invoice.id}
              </span>

              <span className="text-text-secondary text-[12px] font-medium transition-colors order-2">
                Due {invoice.paymentDue}
              </span>

              <span className="text-text-secondary dark:text-text-main text-[12px] font-medium transition-colors order-3 md:text-left text-right">
                {invoice.clientName}
              </span>
              
              <span className="text-text-main text-base font-bold transition-colors order-4 md:text-right">
                £ {invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              
              <div className="flex items-center md:justify-end gap-5 order-5 mt-6 md:mt-0">
                <div className={`flex items-center justify-center w-[104px] py-3 rounded-md capitalize font-bold text-[12px] transition-colors ${getStatusStyles(invoice.status as any)}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    invoice.status === 'paid' ? 'bg-paid' : 
                    invoice.status === 'pending' ? 'bg-pending' : 'bg-text-secondary'
                  }`}></div>
                  {invoice.status}
                </div>
              </div>
              
              <div className="hidden md:flex justify-end order-6">
                <CaretRight weight="bold" size={12} className="text-button" />
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  )
}

export default Invoices
