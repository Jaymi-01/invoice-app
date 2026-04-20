import React, { useState } from 'react'
import { Trash, CaretLeft, CaretDown, CaretRight } from '@phosphor-icons/react'
import type { Invoice, Item } from '../types'

interface InvoiceFormProps {
  isOpen: boolean
  onClose: () => void
  onAddInvoice: (invoice: Invoice) => void
}

const terms = ['Net 1 Day', 'Net 7 Days', 'Net 14 Days', 'Net 30 Days']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const InputField = ({ label, name, value, onChange, error, placeholder, colSpan = "" }: any) => (
  <div className={colSpan}>
    <div className="flex justify-between items-center mb-2">
      <label className={`text-[12px] font-medium ${error ? 'text-[#EC5757]' : 'text-[#7E88C3]'}`}>{label}</label>
      {error && <span className="text-[10px] font-bold text-[#EC5757]">can't be empty</span>}
    </div>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full rounded-[4px] border px-5 py-4 text-[12px] font-bold text-[#0C0E1E] focus:outline-none ${
        error ? 'border-[#EC5757]' : 'border-[#DFE3FA] focus:border-button'
      }`}
    />
  </div>
)

const InvoiceForm = ({ isOpen, onClose, onAddInvoice }: InvoiceFormProps) => {
  const initialFormState = {
    fromStreet: '',
    fromCity: '',
    fromPostCode: '',
    fromCountry: '',
    clientName: '',
    clientEmail: '',
    toStreet: '',
    toCity: '',
    toPostCode: '',
    toCountry: '',
    description: '',
  }

  const [formData, setFormData] = useState(initialFormState)
  const [items, setItems] = useState<Item[]>([
    { id: '1', name: '', quantity: 1, price: 0, total: 0 }
  ])
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [selectedTerm, setSelectedTerm] = useState(terms[3])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [invoiceDate, setInvoiceDate] = useState(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [viewDate, setViewDate] = useState(new Date())

  const handleClose = () => {
    setFormData(initialFormState)
    setItems([{ id: '1', name: '', quantity: 1, price: 0, total: 0 }])
    setErrors({})
    setIsDropdownOpen(false)
    setIsCalendarOpen(false)
    onClose()
  }

  const formatDate = (date: Date) => `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`

  const generateID = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const nums = '0123456789'
    let id = ''
    for (let i = 0; i < 2; i++) id += chars.charAt(Math.floor(Math.random() * chars.length))
    for (let i = 0; i < 4; i++) id += nums.charAt(Math.floor(Math.random() * nums.length))
    return id
  }

  const generateCalendarDays = () => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i))
    return days
  }

  const changeMonth = (offset: number) => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1))

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (value.trim()) setErrors(prev => ({ ...prev, [name]: false }))
  }

  const handleItemChange = (id: string, field: keyof Item, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'price') {
          newItem.total = Number(newItem.quantity) * Number(newItem.price)
        }
        return newItem
      }
      return item
    }))
    if (field === 'name' && String(value).trim()) {
      setErrors(prev => ({ ...prev, [`item-${id}`]: false }))
    }
  }

  const addNewItem = () => {
    setItems([...items, { id: Math.random().toString(), name: '', quantity: 1, price: 0, total: 0 }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(item => item.id !== id))
  }

  const validateForm = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, boolean> = {}
    let hasError = false

    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = true
        hasError = true
      }
    })

    items.forEach(item => {
      if (!item.name.trim() || item.quantity <= 0 || item.price <= 0) {
        newErrors[`item-${item.id}`] = true
        hasError = true
      }
    })

    setErrors(newErrors)

    if (!hasError) {
      const total = items.reduce((acc, item) => acc + item.total, 0)
      const termValue = parseInt(selectedTerm.split(' ')[1])
      const dueDate = new Date(invoiceDate)
      dueDate.setDate(dueDate.getDate() + termValue)

      const newInvoice: Invoice = {
        id: generateID(),
        createdAt: formatDate(invoiceDate),
        paymentDue: formatDate(dueDate),
        description: formData.description,
        paymentTerms: termValue,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        status: 'pending',
        senderAddress: {
          street: formData.fromStreet,
          city: formData.fromCity,
          postCode: formData.fromPostCode,
          country: formData.fromCountry
        },
        clientAddress: {
          street: formData.toStreet,
          city: formData.toCity,
          postCode: formData.toPostCode,
          country: formData.toCountry
        },
        items: items,
        total: total
      }
      onAddInvoice(newInvoice)
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed top-[72px] bottom-0 left-0 right-0 z-40 lg:top-0 lg:left-[103px]">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose}></div>
      <div className="relative flex h-full w-full max-w-[616px] flex-col bg-white md:rounded-r-[20px]">
        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-14 md:py-16">
          <button onClick={handleClose} className="mb-6 flex items-center text-[12px] font-bold tracking-tight text-[#0C0E1E] md:hidden">
            <CaretLeft weight="bold" size={12} className="mr-2 text-button" /> Go back
          </button>
          <h1 className="mb-6 text-2xl font-bold tracking-tight text-[#0C0E1E] md:mb-12">New Invoice</h1>

          <form id="invoice-form" onSubmit={validateForm} className="space-y-10">
            <section>
              <h3 className="mb-6 text-[12px] font-bold tracking-tight text-button">Bill From</h3>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                <InputField label="Street Address" name="fromStreet" value={formData.fromStreet} onChange={handleInputChange} error={errors.fromStreet} colSpan="col-span-2 md:col-span-3" />
                <InputField label="City" name="fromCity" value={formData.fromCity} onChange={handleInputChange} error={errors.fromCity} />
                <InputField label="Post Code" name="fromPostCode" value={formData.fromPostCode} onChange={handleInputChange} error={errors.fromPostCode} />
                <InputField label="Country" name="fromCountry" value={formData.fromCountry} onChange={handleInputChange} error={errors.fromCountry} colSpan="col-span-2 md:col-span-1" />
              </div>
            </section>

            <section>
              <h3 className="mb-6 text-[12px] font-bold tracking-tight text-button">Bill To</h3>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                <InputField label="Client's Name" name="clientName" value={formData.clientName} onChange={handleInputChange} error={errors.clientName} colSpan="col-span-2 md:col-span-3" />
                <InputField label="Client's Email" name="clientEmail" value={formData.clientEmail} onChange={handleInputChange} error={errors.clientEmail} placeholder="e.g. email@example.com" colSpan="col-span-2 md:col-span-3" />
                <InputField label="Street Address" name="toStreet" value={formData.toStreet} onChange={handleInputChange} error={errors.toStreet} colSpan="col-span-2 md:col-span-3" />
                <InputField label="City" name="toCity" value={formData.toCity} onChange={handleInputChange} error={errors.toCity} />
                <InputField label="Post Code" name="toPostCode" value={formData.toPostCode} onChange={handleInputChange} error={errors.toPostCode} />
                <InputField label="Country" name="toCountry" value={formData.toCountry} onChange={handleInputChange} error={errors.toCountry} colSpan="col-span-2 md:col-span-1" />
              </div>
            </section>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="relative">
                <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">Invoice Date</label>
                <div onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="flex w-full items-center justify-between rounded-[4px] border border-[#DFE3FA] px-5 py-4 text-[12px] font-bold text-[#0C0E1E] cursor-pointer">
                  <span>{formatDate(invoiceDate)}</span>
                  <CaretDown weight="bold" size={12} className="text-button" />
                </div>
                {isCalendarOpen && (
                  <div className="absolute top-full left-0 z-20 mt-2 w-full rounded-[8px] bg-white p-6 shadow-[0_10px_20px_rgba(72,84,159,0.25)]">
                    <div className="mb-8 flex items-center justify-between">
                      <button type="button" onClick={() => changeMonth(-1)} className="text-button"><CaretLeft weight="bold" size={12} /></button>
                      <span className="text-[12px] font-bold text-[#0C0E1E]">{months[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
                      <button type="button" onClick={() => changeMonth(1)} className="text-button"><CaretRight weight="bold" size={12} /></button>
                    </div>
                    <div className="grid grid-cols-7 gap-y-4 text-center">
                      {generateCalendarDays().map((date, i) => (
                        <div key={i}>{date && (
                          <button type="button" onClick={() => { setInvoiceDate(date); setIsCalendarOpen(false); }} className={`text-[12px] font-bold hover:text-button ${date.toDateString() === invoiceDate.toDateString() ? 'text-button' : 'text-[#0C0E1E]'}`}>
                            {date.getDate()}
                          </button>
                        )}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">Payment Terms</label>
                <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex w-full items-center justify-between rounded-[4px] border border-[#DFE3FA] px-5 py-4 text-[12px] font-bold text-[#0C0E1E] cursor-pointer">
                  <span>{selectedTerm}</span>
                  <CaretDown weight="bold" size={12} className={`text-button transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 z-10 mt-2 w-full rounded-[8px] bg-white shadow-[0_10px_20px_rgba(72,84,159,0.25)] overflow-hidden">
                    {terms.map((term, index) => (
                      <div key={term}>
                        <button type="button" onClick={() => { setSelectedTerm(term); setIsDropdownOpen(false); }} className={`w-full px-5 py-4 text-left text-[12px] font-bold hover:text-button ${selectedTerm === term ? 'text-button' : 'text-[#0C0E1E]'}`}>
                          {term}
                        </button>
                        {index !== terms.length - 1 && <div className="h-[1px] bg-[#DFE3FA]"></div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <InputField label="Project Description" name="description" value={formData.description} onChange={handleInputChange} error={errors.description} placeholder="e.g. Graphic Design Service" colSpan="md:col-span-2" />
            </section>

            <section>
              <h2 className="mb-4 text-[18px] font-bold tracking-tight text-[#777F98]">Item List</h2>
              <div className="space-y-12 md:space-y-4">
                {items.map(item => (
                  <div key={item.id} className="grid grid-cols-[64px_100px_1fr_auto] gap-x-4 gap-y-6 items-end md:grid-cols-[2.5fr_1fr_1.5fr_1fr_auto]">
                    <div className="col-span-4 order-2 md:col-span-1 md:order-1">
                      <label className={`mb-2 block text-[12px] font-medium ${errors[`item-${item.id}`] && !item.name ? 'text-[#EC5757]' : 'text-[#7E88C3]'}`}>Item Name</label>
                      <input type="text" value={item.name} onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} className={`w-full rounded-[4px] border px-5 py-4 text-[12px] font-bold text-[#0C0E1E] focus:outline-none ${errors[`item-${item.id}`] && !item.name ? 'border-[#EC5757]' : 'border-[#DFE3FA] focus:border-button'}`} />
                    </div>
                    <div className="order-1 md:order-2">
                      <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">Qty.</label>
                      <input type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} className="w-full rounded-[4px] border border-[#DFE3FA] px-2 py-4 text-center text-[12px] font-bold text-[#0C0E1E] focus:border-button focus:outline-none" />
                    </div>
                    <div className="order-1 md:order-3">
                      <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">Price</label>
                      <input type="number" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', e.target.value)} className="w-full rounded-[4px] border border-[#DFE3FA] px-4 py-4 text-[12px] font-bold text-[#0C0E1E] focus:border-button focus:outline-none" />
                    </div>
                    <div className="order-1 md:order-4">
                      <label className="mb-2 block text-[12px] font-medium text-[#7E88C3]">Total</label>
                      <p className="py-4 text-[12px] font-bold text-[#7E88C3]">{item.total.toFixed(2)}</p>
                    </div>
                    <div className="order-1 flex justify-end pb-4 md:order-5">
                      <button type="button" onClick={() => removeItem(item.id)} className="text-[#888EB0] hover:text-[#EC5757]"><Trash size={16} weight="bold" /></button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addNewItem} className="w-full rounded-full bg-discard-button py-4 text-[12px] font-bold text-[#7E88C3] hover:bg-[#DFE3FA]">+ Add New Item</button>
              </div>
              {errors.items && <p className="mt-8 text-[10px] font-semibold text-[#EC5757]">- An item must be added</p>}
              {Object.keys(errors).length > 0 && <p className="mt-4 text-[10px] font-semibold text-[#EC5757]">- All fields must be added</p>}
            </section>
          </form>
        </div>

        <footer className="flex shrink-0 items-center justify-between bg-white px-6 py-8 shadow-[0_-10px_20px_rgba(72,84,159,0.1)] md:px-14 md:shadow-none">
          <button type="button" onClick={handleClose} className="rounded-full bg-discard-button px-4 py-4 text-[12px] font-bold text-[#7E88C3] hover:bg-[#DFE3FA]">Discard</button>
          <div className="flex gap-2">
            <button type="button" className="rounded-full bg-draft-button px-4 py-4 text-[12px] font-bold text-[#888EB0] hover:bg-[#0C0E1E]">Save as Draft</button>
            <button form="invoice-form" type="submit" className="rounded-full bg-button px-4 py-4 text-[12px] font-bold text-white hover:bg-button-hover">Save & Send</button>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default InvoiceForm
