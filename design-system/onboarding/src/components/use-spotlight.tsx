import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';

import { SpotlightContext } from './spotlight-manager';

/**
 * Enables advanced usage of spotlights.
 *
 * Provides the following methods:
 * - `isTargetRendered`
 *
 *    Checks if the given spotlight target is currently
 *    being rendered.
 */
export default function useSpotlight() {
  const { targets } = useContext(SpotlightContext);
  const targetRef = useRef(targets);

  useEffect(() => {
    targetRef.current = targets;
  }, [targets]);

  const isTargetRendered = useCallback(
    (target: string) => !!targetRef.current[target],
    [],
  );

  return useMemo(
    () => ({
      isTargetRendered,
    }),
    [isTargetRendered],
  );
}
