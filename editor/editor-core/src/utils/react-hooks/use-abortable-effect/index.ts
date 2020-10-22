import React, { useEffect, useMemo, useCallback } from 'react';

const safeError = (message: string) => {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(message);
  }

  // eslint-disable-next-line no-console
  console.error(message);
};

const createAbortController = (): AbortController => {
  if (typeof AbortController === 'undefined') {
    safeError('Missing AbortController');
  }

  return new AbortController();
};

type AbortableEffectWithCancel = (signal: AbortSignal) => () => void;
type AbortableEffect = (signal: AbortSignal) => void;

/**
 * Similar to useEffect but integrated with the AbortController to make it useful for async operations.
 * On unmount, the abort function will be called and the signal will be passed down to the function so
 * we get the chance to cancel any operation we want.
 *
 * Note: This hook follows the signature of useEffect so it can be linted if enabled through the
 * `additionalHooks` config.
 *
 * @param callback
 * @param deps
 */
export function useAbortableEffect(
  callback: AbortableEffectWithCancel | AbortableEffect,
  deps: React.DependencyList,
) {
  const abortController = useMemo(
    () => createAbortController(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  );
  const abort = useCallback(() => abortController.abort(), [abortController]);
  // AFP-2511 TODO: Fix automatic suppressions below
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fn = useCallback(callback, deps);

  useEffect(() => {
    const teardown = fn(abortController.signal);

    return () => {
      if (typeof teardown === 'function') {
        teardown();
      }

      abort();
    };
  }, [
    abortController,
    abort,
    fn,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...deps,
  ]);
}
