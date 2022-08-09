import { useEffect, useRef } from 'react';

export function usePrevious<T>(
  value: T | null | undefined,
): T | null | undefined {
  const ref = useRef<T | undefined | null>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
