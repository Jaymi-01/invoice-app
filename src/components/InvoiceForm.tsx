import React, { useState } from 'react'
import { Trash, CaretLeft, CaretDown, CaretRight } from '@phosphor-icons/react'
import type { Invoice, Item } from '../types'

interface InvoiceFormProps {
  isOpen: boolean
  onClose: () => void
  onAddInvoice: (invoice: Invoice) => void
  onUpdateInvoice: (invoice: Invoice) => void
  invoiceToEdit?: Invoice | null
}

const terms = ['Net 1 Day', 'Net 7 Days', 'Net 14 Days', 'Net 30 Days']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface InputFieldProps {
  label: string
  name: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: boolean
  placeholder?: string
  colSpan?: string
}

const InputField = ({ label, name, value, onChange, error, placeholder, colSpan = "" }: InputFieldProps) => (
  <div className={colSpan}>
    <div className="flex justify-between items-center mb-2">
      <label className={`text-[12px] font-medium transition-colors ${error ? 'text-[#EC5757]' : 'text-text-secondary'}`}>{label}</label>
      {error && <span className="text-[10px] font-bold text-[#EC5757]">can't be empty</span>}
    </div>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full rounded-[4px] border bg-container px-5 py-4 text-[12px] font-bold text-text-main focus:outline-none transition-colors ${
        error ? 'border-[#EC5757]' : 'border-input-border focus:border-button'
      }`}
    />
  </div>
)

const InvoiceForm = ({ isOpen, onClose, onAddInvoice, onUpdateInvoice, invoiceToEdit }: InvoiceFormProps) => {
  const initialFormState = {
    fromStreet: invoiceToEdit?.senderAddress.street || '',
    fromCity: invoiceToEdit?.senderAddress.city || '',
    fromPostCode: invoiceToEdit?.senderAddress.postCode || '',
    fromCountry: invoiceToEdit?.senderAddress.country || '',
    clientName: invoiceToEdit?.clientName || '',
    clientEmail: invoiceToEdit?.clientEmail || '',
    toStreet: invoiceToEdit?.clientAddress.street || '',
    toCity: invoiceToEdit?.clientAddress.city || '',
    toPostCode: invoiceToEdit?.clientAddress.postCode || '',
    toCountry: invoiceToEdit?.clientAddress.country || '',
    description: invoiceToEdit?.description || '',
  }

  const [formData, setFormData] = useState(initialFormState)
  const [items, setItems] = useState<Item[]>(() => 
    invoiceToEdit?.items || [{ id: '1', name: '', quantity: 1, price: 0, total: 0 }]
  )
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [selectedTerm, setSelectedTerm] = useState(() => 
    invoiceToEdit ? `Net ${invoiceToEdit.paymentTerms} Day${invoiceToEdit.paymentTerms > 1 ? 's' : ''}` : terms[3]
  )
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [invoiceDate, setInvoiceDate] = useState(() => 
    invoiceToEdit ? new Date(invoiceToEdit.createdAt) : new Date()
  )
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [viewDate, setViewDate] = useState(new Date())

  const handleClose = () => {
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

  const handleSaveDraft = () => {
    const total = items.reduce((acc, item) => acc + item.total, 0)
    const termValue = parseInt(selectedTerm.split(' ')[1])
    const dueDate = new Date(invoiceDate)
    dueDate.setDate(dueDate.getDate() + (isNaN(termValue) ? 30 : termValue))

    const newInvoice: Invoice = {
      id: invoiceToEdit ? invoiceToEdit.id : generateID(),
      createdAt: formatDate(invoiceDate),
      paymentDue: formatDate(dueDate),
      description: formData.description || '',
      paymentTerms: isNaN(termValue) ? 30 : termValue,
      clientName: formData.clientName || '',
      clientEmail: formData.clientEmail || '',
      status: 'draft',
      senderAddress: {
        street: formData.fromStreet || '',
        city: formData.fromCity || '',
        postCode: formData.fromPostCode || '',
        country: formData.fromCountry || ''
      },
      clientAddress: {
        street: formData.toStreet || '',
        city: formData.toCity || '',
        postCode: formData.toPostCode || '',
        country: formData.toCountry || ''
      },
      items: items,
      total: total
    }

    if (invoiceToEdit) {
      onUpdateInvoice(newInvoice)
    } else {
      onAddInvoice(newInvoice)
    }
    handleClose()
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

      const invoiceData: Invoice = {
        id: invoiceToEdit ? invoiceToEdit.id : generateID(),
        createdAt: formatDate(invoiceDate),
        paymentDue: formatDate(dueDate),
        description: formData.description,
        paymentTerms: termValue,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        status: invoiceToEdit ? invoiceToEdit.status : 'pending',
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
      
      if (invoiceToEdit) {
        onUpdateInvoice(invoiceData)
      } else {
        onAddInvoice(invoiceData)
      }
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed top-[72px] bottom-0 left-0 right-0 z-40 lg:top-0 lg:left-[103px]">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose}></div>
      <div className="relative flex h-full w-full max-w-[616px] lg:max-w-[719px] flex-col bg-background dark:bg-dark-bg md:rounded-r-[20px] transition-colors duration-300">
        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-14 md:py-16 lg:p-14">
          <button onClick={handleClose} className="mb-6 flex items-center text-[12px] font-bold tracking-tight text-text-main md:hidden transition-colors">
            <CaretLeft weight="bold" size={12} className="mr-2 text-button" /> Go back
          </button>
          <h1 className="mb-6 text-2xl font-bold tracking-tight text-text-main md:mb-12 transition-colors">
            {invoiceToEdit ? (
              <>Edit <span className="text-text-secondary">#</span>{invoiceToEdit.id}</>
            ) : 'New Invoice'}
          </h1>

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
                <label className="mb-2 block text-[12px] font-medium text-text-secondary transition-colors">Invoice Date</label>
                <div onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="flex w-full items-center justify-between rounded-[4px] border border-input-border bg-container px-5 py-4 text-[12px] font-bold text-text-main cursor-pointer transition-colors">
                  <span>{formatDate(invoiceDate)}</span>
                  <CaretDown weight="bold" size={12} className="text-button" />
                </div>
                {isCalendarOpen && (
                  <div className="absolute top-full left-0 z-20 mt-2 w-full rounded-[8px] bg-container p-6 shadow-[0_10px_20px_rgba(72,84,159,0.25)] transition-colors">
                    <div className="mb-8 flex items-center justify-between">
                      <button type="button" onClick={() => changeMonth(-1)} className="text-button"><CaretLeft weight="bold" size={12} /></button>
                      <span className="text-[12px] font-bold text-text-main transition-colors">{months[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
                      <button type="button" onClick={() => changeMonth(1)} className="text-button"><CaretRight weight="bold" size={12} /></button>
                    </div>
                    <div className="grid grid-cols-7 gap-y-4 text-center">
                      {generateCalendarDays().map((date, i) => (
                        <div key={i}>{date && (
                          <button type="button" onClick={() => { setInvoiceDate(date); setIsCalendarOpen(false); }} className={`text-[12px] font-bold lg:hover:text-button transition-colors ${date.toDateString() === invoiceDate.toDateString() ? 'text-button' : 'text-text-main'}`}>
                            {date.getDate()}
                          </button>
                        )}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="mb-2 block text-[12px] font-medium text-text-secondary transition-colors">Payment Terms</label>
                <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex w-full items-center justify-between rounded-[4px] border border-input-border bg-container px-5 py-4 text-[12px] font-bold text-text-main cursor-pointer transition-colors">
                  <span>{selectedTerm}</span>
                  <CaretDown weight="bold" size={12} className={`text-button transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 z-10 mt-2 w-full rounded-[8px] bg-container shadow-[0_10px_20px_rgba(72,84,159,0.25)] overflow-hidden transition-colors">
                    {terms.map((term, index) => (
                      <div key={term}>
                        <button type="button" onClick={() => { setSelectedTerm(term); setIsDropdownOpen(false); }} className={`w-full px-5 py-4 text-left text-[12px] font-bold lg:hover:text-button transition-colors ${selectedTerm === term ? 'text-button' : 'text-text-main'}`}>
                          {term}
                        </button>
                        {index !== terms.length - 1 && <div className="h-[1px] bg-input-border opacity-50 transition-colors"></div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <InputField label="Project Description" name="description" value={formData.description} onChange={handleInputChange} error={errors.description} placeholder="e.g. Graphic Design Service" colSpan="md:col-span-2" />
            </section>

            <section>
              <h2 className="mb-4 text-[18px] font-bold tracking-tight text-[#777F98] transition-colors">Item List</h2>
              <div className="space-y-12 md:space-y-4">
                {items.map(item => (
                  <div key={item.id} className="grid grid-cols-[64px_100px_1fr_auto] gap-x-4 gap-y-6 items-end md:grid-cols-[3fr_1fr_1.5fr_1fr_auto]">
                    <div className="col-span-4 order-2 md:col-span-1 md:order-1">
                      <label className={`mb-2 block text-[12px] font-medium transition-colors ${errors[`item-${item.id}`] && !item.name ? 'text-[#EC5757]' : 'text-text-secondary'}`}>Item Name</label>
                      <input type="text" value={item.name} onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} className={`w-full rounded-[4px] border bg-container px-5 py-4 text-[12px] font-bold text-text-main focus:outline-none transition-colors ${errors[`item-${item.id}`] && !item.name ? 'border-[#EC5757]' : 'border-input-border focus:border-button'}`} />
                    </div>
                    <div className="order-1 md:order-2">
                      <label className="mb-2 block text-[12px] font-medium text-text-secondary transition-colors">Qty.</label>
                      <input type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} className="w-full rounded-[4px] border border-input-border bg-container px-2 py-4 text-center text-[12px] font-bold text-text-main focus:border-button focus:outline-none transition-colors" />
                    </div>
                    <div className="order-1 md:order-3">
                      <label className="mb-2 block text-[12px] font-medium text-text-secondary transition-colors">Price</label>
                      <input type="number" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', e.target.value)} className="w-full rounded-[4px] border border-input-border bg-container px-4 py-4 text-[12px] font-bold text-text-main focus:border-button focus:outline-none transition-colors" />
                    </div>
                    <div className="order-1 md:order-4">
                      <label className="mb-2 block text-[12px] font-medium text-text-secondary transition-colors">Total</label>
                      <p className="py-4 text-[12px] font-bold text-text-secondary transition-colors">{item.total.toFixed(2)}</p>
                    </div>
                    <div className="order-1 flex justify-end pb-4 md:order-5">
                      <button type="button" onClick={() => removeItem(item.id)} className="text-[#888EB0] lg:hover:text-[#EC5757] transition-colors cursor-pointer"><Trash size={16} weight="bold" /></button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addNewItem} className="w-full rounded-full bg-btn-secondary-bg px-4 py-4 text-[12px] font-bold text-btn-secondary-text lg:hover:bg-btn-secondary-hover transition-colors cursor-pointer">+ Add New Item</button>
              </div>
              {Object.keys(errors).length > 0 && <p className="mt-8 text-[10px] font-semibold text-[#EC5757] transition-colors">- All fields must be added</p>}
            </section>
          </form>
        </div>

        <footer className="flex shrink-0 items-center justify-between bg-container px-6 py-8 shadow-[0_-10px_20px_rgba(72,84,159,0.1)] md:px-14 md:shadow-none transition-colors duration-300">
          {invoiceToEdit ? (
            <>
              <div className="flex-1"></div>
              <div className="flex gap-2">
                <button type="button" onClick={handleClose} className="rounded-full bg-btn-secondary-bg px-6 py-4 text-[12px] font-bold text-btn-secondary-text lg:hover:bg-btn-secondary-hover transition-colors cursor-pointer">Cancel</button>
                <button form="invoice-form" type="submit" className="rounded-full bg-button px-6 py-4 text-[12px] font-bold text-white lg:hover:bg-button-hover transition-colors cursor-pointer">Save Changes</button>
              </div>
            </>
          ) : (
            <>
              <button type="button" onClick={handleClose} className="rounded-full bg-btn-secondary-bg px-4 py-4 text-[12px] font-bold text-btn-secondary-text lg:hover:bg-btn-secondary-hover transition-colors cursor-pointer">Discard</button>
              <div className="flex gap-2">
                <button type="button" onClick={handleSaveDraft} className="rounded-full bg-btn-dark-bg px-4 py-4 text-[12px] font-bold text-btn-dark-text lg:hover:bg-btn-dark-hover transition-colors cursor-pointer">Save as Draft</button>
                <button form="invoice-form" type="submit" className="rounded-full bg-button px-4 py-4 text-[12px] font-bold text-white lg:hover:bg-button-hover transition-colors cursor-pointer">Save & Send</button>
              </div>
            </>
          )}
        </footer>
      </div>
    </div>
  )
}

export default InvoiceForm
