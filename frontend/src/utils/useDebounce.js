import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values
 * @param {string} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @returns {string} - The debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
