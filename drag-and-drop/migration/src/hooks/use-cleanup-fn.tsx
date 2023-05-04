import { useCallback, useEffect, useRef } from 'react';

import type { CleanupFn } from '../internal-types';

const noop = () => {};

export function useCleanupFn() {
  const cleanupFnRef = useRef(noop);

  const setCleanupFn = useCallback((cleanupFn: CleanupFn) => {
    cleanupFnRef.current = cleanupFn;
  }, []);

  const runCleanupFn = useCallback(() => {
    cleanupFnRef.current();
    setCleanupFn(noop);
  }, [setCleanupFn]);

  useEffect(() => {
    return runCleanupFn;
  }, [runCleanupFn]);

  return { setCleanupFn, runCleanupFn };
}
