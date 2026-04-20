import React from 'react'
import Header from './components/Header'
import Invoices from './components/Invoices'

const App = () => {
  return (
    <div className="min-h-screen bg-background font-league">
      <Header />
      <div className="lg:pl-[103px]">
        <Invoices />
      </div>
    </div>
  )
}

export default App