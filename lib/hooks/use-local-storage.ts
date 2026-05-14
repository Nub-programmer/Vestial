'use client'

import { useState, useEffect } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Local React state mirrors whatever we keep in localStorage.
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isMounted, setIsMounted] = useState(false)

  // Same feel as setState, but also persists to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Support updater callbacks like setState(prev => next).
      const valueToStore = value instanceof Function ? value(storedValue) : value

      setStoredValue(valueToStore)

      // Guard for SSR / non-browser environments.
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Read existing value once on mount.
  useEffect(() => {
    try {
      const item =
        typeof window !== 'undefined' ? window.localStorage.getItem(key) : null
      if (item) {
        setStoredValue(JSON.parse(item))
      }
      setIsMounted(true)
    } catch (error) {
      console.log(error)
      setIsMounted(true)
    }
  }, [key])

  // Avoid hydration mismatch by waiting until mount to use browser state.
  return [isMounted ? storedValue : initialValue, setValue]
}
