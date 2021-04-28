import { useRef } from 'react';

const uniqueReferencedValue = {};

/**
 * Executes the initializer function once and saves its result into a ref.
 *
 * ```js
 * const ref = useLazyRef(() => 10);
 * ```
 *
 * @param initializer
 */
export default function useLazyRef<T>(
  initializer: () => T,
): React.MutableRefObject<T> {
  const ref = useRef<T | typeof uniqueReferencedValue>(uniqueReferencedValue);

  if (ref.current === uniqueReferencedValue) {
    ref.current = initializer();
  }

  return ref as React.MutableRefObject<T>;
}
