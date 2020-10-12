import { useEffect, useRef, useState } from 'react';

/**
 * We use this to get the scrollbar width of the container that the ref is assigned.
 * We then use this to offset the separators when the container has overflowing content or not.
 */
export const useScrollbarWidth = () => {
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
};
