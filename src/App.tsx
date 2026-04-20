import React, { useState } from 'react'
import Header from './components/Header'
import Invoices from './components/Invoices'
import InvoiceForm from './components/InvoiceForm'

const App = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background font-league">
      <Header />
      <div className="lg:pl-[103px]">
        <Invoices onOpenForm={() => setIsFormOpen(true)} />
      </div>
      <InvoiceForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  )
}


export default App