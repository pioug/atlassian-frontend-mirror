import { useEffect, useRef } from 'react';

// Hook to track the number of renders in tests
export const useRenderCounter = (): number => {
  const ref = useRef(1);
  useEffect(() => {
    ref.current++;
  });
  return ref.current;
};
