import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Invoices from './components/Invoices'
import InvoiceForm from './components/InvoiceForm'
import InvoiceView from './components/InvoiceView'
import type { Invoice } from './types'

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : false
  })

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('invoices')
    return saved ? JSON.parse(saved) : []
  })
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices))
  }, [invoices])

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  const addInvoice = (invoice: Invoice) => {
    setInvoices([invoice, ...invoices])
  }

  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(invoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv))
    if (selectedInvoice?.id === updatedInvoice.id) {
      setSelectedInvoice(updatedInvoice)
    }
  }

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter(inv => inv.id !== id))
    setSelectedInvoice(null)
  }

  const markAsPaid = (id: string) => {
    const updated = invoices.map(inv => 
      inv.id === id ? { ...inv, status: 'paid' as const } : inv
    )
    setInvoices(updated)
    const current = updated.find(inv => inv.id === id)
    if (current) setSelectedInvoice(current)
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg font-league transition-colors duration-300">
      <Header isDark={isDarkMode} onToggleTheme={toggleTheme} />
      <div className="lg:pl-[103px]">
        {selectedInvoice ? (
          <InvoiceView 
            invoice={selectedInvoice} 
            onBack={() => setSelectedInvoice(null)} 
            onEdit={() => setIsFormOpen(true)}
            onDelete={deleteInvoice}
            onMarkAsPaid={markAsPaid}
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
