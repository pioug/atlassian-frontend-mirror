import { useRef } from 'react';

export default function useLazyRef<T>(fn: () => T): T {
  const ref = useRef<T>();

  if (!ref.current) {
    ref.current = fn();
  }

  return ref.current;
}
