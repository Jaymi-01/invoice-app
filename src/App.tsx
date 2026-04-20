import React, { useState } from 'react'
import Header from './components/Header'
import Invoices from './components/Invoices'
import InvoiceForm from './components/InvoiceForm'
import type { Invoice } from './types'

const App = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>([])

  const addInvoice = (invoice: Invoice) => {
    setInvoices([invoice, ...invoices])
  }

  return (
    <div className="min-h-screen bg-background font-league">
      <Header />
      <div className="lg:pl-[103px]">
        <Invoices 
          invoices={invoices} 
          onOpenForm={() => setIsFormOpen(true)} 
        />
      </div>
      <InvoiceForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onAddInvoice={addInvoice}
      />
    </div>
  )
}



export default App