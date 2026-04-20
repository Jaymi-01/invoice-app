import React from 'react'
import { Plus, CaretDown } from '@phosphor-icons/react'
import emptyImg from '../assets/email-campaign.png'

interface InvoicesProps {
  onOpenForm: () => void
}

const Invoices = ({ onOpenForm }: InvoicesProps) => {
  return (
    <main className="px-6 py-8 lg:max-w-[730px] lg:mx-auto lg:py-16">
      <header className="flex items-center justify-between mb-16 lg:mb-16">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0C0E1E] lg:text-3xl">Invoices</h1>
          <p className="text-[#888EB0] text-[13px] mt-1">No invoices</p>
        </div>

        <div className="flex items-center">
          <button className="flex items-center mr-5 lg:mr-10 focus:outline-none cursor-pointer">
            <span className="font-bold text-[#0C0E1E] mr-3 text-[13px] lg:text-sm">Filter</span>
            <CaretDown weight="bold" size={12} className="text-button" />
          </button>

          <button 
            onClick={onOpenForm}
            className="flex items-center bg-button rounded-full p-1.5 lg:p-2 focus:outline-none cursor-pointer"
          >
            <div className="bg-white rounded-full p-1 mr-2 lg:mr-4">
              <Plus weight="bold" size={16} className="text-button" />
            </div>
            <span className="font-bold text-white text-[13px] mr-2 lg:text-sm lg:mr-4">New</span>
          </button>
        </div>
      </header>

      <section className="flex flex-col items-center justify-center mt-20 lg:mt-24">
        <img 
          src={emptyImg} 
          alt="No invoices Illustration" 
          className="w-[193px] mb-10 lg:w-[242px] lg:mb-16"
        />
      </section>
    </main>
  )
}

export default Invoices
