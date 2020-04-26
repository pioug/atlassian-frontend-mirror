import { useCallback, useRef } from 'react';

export type Element = HTMLElement | null;
export type CallbackRef = (instance: Element) => void;

/**
 * Will return a tuple of the element and the callback ref to set.
 * This is used as a work around for using `useRef` directly with Typescript
 * as the types don't flow through as one would expect.
 */
export const useElementRef = (): [Element, CallbackRef] => {
  const elementRef = useRef<Element>(null);
  const setRef: CallbackRef = useCallback((ref: Element) => {
    elementRef.current = ref;
  }, []);

  return [elementRef.current, setRef];
};
