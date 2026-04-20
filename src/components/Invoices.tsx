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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-[#33D69F14] text-paid'
      case 'pending':
        return 'bg-[#FF8F0014] text-pending'
      case 'draft':
        return 'bg-[#373B5314] text-[#373B53] dark:text-text-secondary dark:bg-[#DFE3FA14]'
      default:
        return 'bg-[#373B5314] text-[#373B53]'
    }
  }

  return (
    <main className="px-6 py-8 lg:max-w-[730px] lg:mx-auto lg:py-16">
      <header className="flex items-center justify-between mb-8 lg:mb-16">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main lg:text-3xl">Invoices</h1>
          <p className="text-text-secondary text-[13px] mt-1">
            {filteredInvoices.length === 0 ? 'No invoices' : `${filteredInvoices.length} ${filteredInvoices.length === 1 ? 'invoice' : 'invoices'}`}
          </p>
        </div>

        <div className="flex items-center">
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center mr-5 lg:mr-10 focus:outline-none cursor-pointer group"
            >
              <span className="font-bold text-text-main mr-3 text-[13px] lg:text-sm group-hover:text-text-accent transition-colors">Filter</span>
              <CaretDown weight="bold" size={12} className={`text-button transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterOpen && (
              <div className="absolute top-full right-0 z-10 mt-6 w-40 rounded-lg bg-container p-6 shadow-[0_10px_20px_rgba(72,84,159,0.25)]">
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
                          : 'bg-input-border dark:bg-dark-bg border-transparent group-hover:border-button'
                      }`}>
                        {filters.includes(status) && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.5 4.5L3.83333 6.83333L8.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="ml-3 text-[12px] font-bold capitalize text-text-main group-hover:text-button transition-colors">{status}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={onOpenForm}
            className="flex items-center bg-button rounded-full p-1.5 lg:p-2 focus:outline-none cursor-pointer hover:bg-button-hover transition-colors"
          >
            <div className="bg-white rounded-full p-1 mr-2 lg:mr-4">
              <Plus weight="bold" size={16} className="text-button" />
            </div>
            <span className="font-bold text-white text-[13px] mr-2 lg:text-sm lg:mr-4">New</span>
          </button>
        </div>
      </header>

      {filteredInvoices.length === 0 ? (
        <section className="flex flex-col items-center justify-center mt-20 lg:mt-24">
          <img 
            src={emptyImg} 
            alt="No invoices Illustration" 
            className="w-[193px] mb-10 lg:w-[242px] lg:mb-16"
          />
        </section>
      ) : (
        <section className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <div 
              key={invoice.id} 
              onClick={() => onSelectInvoice(invoice)}
              className="bg-container rounded-lg p-6 shadow-[0_10px_10px_-10px_rgba(72,84,159,0.1)] border border-transparent hover:border-button transition-all cursor-pointer md:flex md:items-center md:justify-between md:px-8"
            >
              <div className="flex justify-between items-center mb-6 md:mb-0 md:gap-10">
                <span className="font-bold text-text-main text-[12px] md:w-20">
                  <span className="text-text-accent">#</span>{invoice.id}
                </span>
                <span className="text-text-secondary dark:text-text-main text-[12px] font-medium md:hidden">{invoice.clientName}</span>
                <span className="text-text-secondary text-[12px] font-medium hidden md:block md:w-32">Due {invoice.paymentDue}</span>
                <span className="text-text-secondary dark:text-text-main text-[12px] font-medium hidden md:block md:w-32">{invoice.clientName}</span>
              </div>
              
              <div className="flex justify-between items-center md:flex-1 md:justify-end md:gap-10">
                <div className="flex flex-col">
                  <span className="text-text-secondary text-[12px] font-medium md:hidden mb-2">Due {invoice.paymentDue}</span>
                  <span className="text-text-main text-base font-bold md:w-32 md:text-right">£ {invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                
                <div className="flex items-center gap-5">
                  <div className={`flex items-center justify-center w-[104px] py-3 rounded-md capitalize font-bold text-[12px] ${getStatusStyles(invoice.status)}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      invoice.status === 'paid' ? 'bg-paid' : 
                      invoice.status === 'pending' ? 'bg-pending' : 'bg-[#373B53] dark:bg-text-secondary'
                    }`}></div>
                    {invoice.status}
                  </div>
                  <CaretRight weight="bold" size={12} className="text-button hidden md:block" />
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  )
}

export default Invoices
