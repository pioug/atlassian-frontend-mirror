import { useEffect, useRef, useState } from 'react';

/**
 * Get the scrollbar width of the container that the ref is assigned.
 *
 * ```js
 * const { width, ref } = useScrollbarWidth();
 * ```
 *
 * @returns Scrollbar width of the container and the element ref.
 */
export default function useScrollbarWidth() {
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const elementRef = useRef<HTMLDivElement | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!elementRef.current) {
      return;
    }

    const width =
      elementRef.current.offsetWidth - elementRef.current.scrollWidth;

    if (width === scrollbarWidth) {
      return;
    }

    setScrollbarWidth(width);
  });

  return {
    width: scrollbarWidth,
    ref: elementRef,
  };
}
