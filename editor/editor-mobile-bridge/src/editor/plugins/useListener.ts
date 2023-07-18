import { useRef, useEffect, DependencyList } from 'react';

export const useListener = (
  cb: () => (() => void) | void,
  dependencies: DependencyList,
) => {
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    return cb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};
