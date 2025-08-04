"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const PhoneInput = React.forwardRef(({ className, value, onChange, onBlur, placeholder, ...props }, ref) => {
  const inputRef = React.useRef(null)
  const [displayValue, setDisplayValue] = React.useState('')
  const [isFocused, setIsFocused] = React.useState(false)

  // Clean phone number to only digits
  const cleanPhoneNumber = (phone) => {
    return phone.replace(/\D/g, '')
  }

  // Format phone number for display
  const formatPhoneNumber = (phone) => {
    const cleaned = cleanPhoneNumber(phone)
    if (cleaned.length === 0) return ''
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
  }

  // Update display value when value changes
  React.useEffect(() => {
    if (value) {
      setDisplayValue(formatPhoneNumber(value))
    } else {
      setDisplayValue('')
    }
  }, [value])

  // Handle input change
  const handleInputChange = (e) => {
    const inputValue = e.target.value
    const cleaned = cleanPhoneNumber(inputValue)
    
    // Limit to 10 digits
    if (cleaned.length <= 10) {
      const formatted = formatPhoneNumber(cleaned)
      setDisplayValue(formatted)
      onChange?.(formatted)
    }
  }

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const cleaned = cleanPhoneNumber(pastedText)
    if (cleaned.length <= 10) {
      const formatted = formatPhoneNumber(cleaned)
      setDisplayValue(formatted)
      onChange?.(formatted)
    }
  }

  // Handle keydown for better UX
  const handleKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter, and navigation keys
    if ([8, 9, 27, 13, 46, 37, 39].indexOf(e.keyCode) !== -1 ||
        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true)) {
      return
    }
    
    // Allow only numbers
    if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
      return
    }
    
    e.preventDefault()
  }

  return (
    <div className={cn("relative", className)}>
      <input
        ref={inputRef}
        type="tel"
        value={displayValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder || "(555) 123-4567"}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
          "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-200",
          isFocused && "border-ring ring-ring/20"
        )}
        {...props}
      />
    </div>
  )
})

PhoneInput.displayName = "PhoneInput"

export { PhoneInput } 