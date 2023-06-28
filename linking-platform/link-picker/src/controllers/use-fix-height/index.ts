import { useLayoutEffect, useRef } from 'react';

export const useFixHeight = (shouldFixHeight: boolean) => {
  const ref = useRef<HTMLDivElement>(null);
  const currentHeight: React.MutableRefObject<number | null> =
    useRef<number>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      currentHeight.current = ref.current.getBoundingClientRect().height;
    }
  });

  return {
    ref,
    style: shouldFixHeight
      ? { minHeight: currentHeight.current || 'auto' }
      : undefined,
  };
};
