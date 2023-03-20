import { useRef } from 'react';

/**
 *
 * Hook to run code once in a functional component.
 * Emulates the behaviour of a `constructor` in a class component
 * Place this at the top of your functional component so that it is run first.
 *
 * @param callback Callback function to run once
 */
export default function useConstructor(callback: () => void): void {
  const hasRun = useRef(false);
  if (!hasRun.current) {
    callback();
    hasRun.current = true;
  }
}
