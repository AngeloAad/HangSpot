import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedVaoue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedVaoue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
