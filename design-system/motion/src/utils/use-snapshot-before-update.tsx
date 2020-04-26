import { useRef } from 'react';

import { useLayoutEffect } from '../utils/use-layout-effect';

/**
 * This hook tries to emulate the getSnapshotBeforeUpdate lifecycle method.
 */
export const useSnapshotBeforeUpdate = (cb: Function) => {
  const isFirstRender = useRef(true);
  if (!isFirstRender.current) {
    cb();
  }

  useLayoutEffect(() => {
    isFirstRender.current = false;
  }, []);
};
