import { useEffect, useState } from 'react';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default function useOverflowable(
  truncationWidth: number | undefined,
  buttonRef: any,
) {
  const [hasOverflow, setOverflow] = useState(false);
  // Recalculate hasOverflow on every render cycle
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (truncationWidth && buttonRef.current) {
      const shouldOverflow = buttonRef.current.clientWidth >= truncationWidth;

      if (shouldOverflow !== hasOverflow) {
        setOverflow(shouldOverflow);
      }
    }
  });
  return hasOverflow;
}
