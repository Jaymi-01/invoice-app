import React, { useState } from 'react'
import Header from './components/Header'
import Invoices from './components/Invoices'
import InvoiceForm from './components/InvoiceForm'
import InvoiceView from './components/InvoiceView'
import type { Invoice } from './types'

const App = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const addInvoice = (invoice: Invoice) => {
    setInvoices([invoice, ...invoices])
  }

  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(invoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv))
    setSelectedInvoice(updatedInvoice)
  }

  return (
    <div className="min-h-screen bg-background font-league">
      <Header />
      <div className="lg:pl-[103px]">
        {selectedInvoice ? (
          <InvoiceView 
            invoice={selectedInvoice} 
            onBack={() => setSelectedInvoice(null)} 
            onEdit={() => setIsFormOpen(true)}
          />
        ) : (
          <Invoices 
            invoices={invoices} 
            onOpenForm={() => {
              setSelectedInvoice(null)
              setIsFormOpen(true)
            }}
            onSelectInvoice={(invoice) => setSelectedInvoice(invoice)}
          />
        )}
      </div>
      <InvoiceForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onAddInvoice={addInvoice}
        onUpdateInvoice={updateInvoice}
        invoiceToEdit={selectedInvoice}
      />
    </div>
  )
}



export default App