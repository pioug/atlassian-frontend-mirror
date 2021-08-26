import React, {
  useMemo,
  useEffect,
  useContext,
  useLayoutEffect,
  createContext,
} from 'react';
import { browser } from '@atlaskit/editor-common';

const Context = createContext<ResizeObserver | null>(null);

interface ElementResizable extends Element {
  onResize?: (entry: ResizeObserverEntry) => void;
}
interface OverrideResizeObserverEntry extends ResizeObserverEntry {
  readonly target: ElementResizable;
}

export const ResizeObserverContext = Context;
export const ResizeObserverProvider: React.FC = React.memo(({ children }) => {
  const instance = useMemo(() => {
    if (!browser.supportsResizeObserver) {
      return null;
    }

    return new window.ResizeObserver(
      (entries: ReadonlyArray<OverrideResizeObserverEntry>) => {
        entries.forEach((entry) => {
          const { onResize } = entry.target;

          if (onResize) {
            onResize(entry);
          }
        });
      },
    );
  }, []);

  useEffect(() => {
    return () => {
      if (instance) {
        instance.disconnect();
      }
    };
  }, [instance]);

  return <Context.Provider value={instance}>{children}</Context.Provider>;
});

export const useResizeObserver = <T extends ElementResizable>(
  targetRef: React.MutableRefObject<T> | null,
  onResize: (entry: ResizeObserverEntry) => void,
) => {
  const resizeObserver = useContext<ResizeObserver | null>(Context);

  useLayoutEffect(() => {
    if (!targetRef || !targetRef.current || resizeObserver === null) {
      return;
    }

    const { current: target } = targetRef;

    target.onResize = onResize;

    resizeObserver.observe(target);
    return () => {
      resizeObserver.unobserve(target);
      delete target.onResize;
    };
  }, [targetRef, resizeObserver, onResize]);
};
