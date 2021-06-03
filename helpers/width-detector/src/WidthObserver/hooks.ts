import React from 'react';
import { browser } from './utils';

type Response = [
  (node?: Element | null) => void,
  boolean,
  HTMLElement | undefined,
  IntersectionObserverEntry | undefined,
];

type State = {
  inView: boolean;
  target?: HTMLElement;
  entry?: IntersectionObserverEntry;
};

export function useInView(options: IntersectionObserverInit = {}): Response {
  const ref = React.useRef<HTMLElement>();
  const observerInstance = React.useRef<IntersectionObserver>();
  const [state, setState] = React.useState<State>({
    inView: false,
    entry: undefined,
    target: undefined,
  });
  const { threshold, root, rootMargin } = options;

  const setRef = React.useCallback(
    (node) => {
      const { supportsIntersectionObserver } = browser;
      if (!supportsIntersectionObserver) {
        setState({
          inView: true,
          entry: undefined,
          target: node,
        });
        return null;
      }

      observerInstance.current = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          if (entries && entries.length) {
            const intersection = entries[0];
            const { isIntersecting, intersectionRatio } = intersection;

            if (intersectionRatio >= 0) {
              let inView = intersectionRatio >= (threshold || 0);

              if (isIntersecting !== undefined) {
                inView = inView && isIntersecting;
              }

              setState({
                inView,
                entry: intersection,
                target: node,
              });
            }
          }
        },
        {
          threshold,
          root,
          rootMargin,
        },
      );

      if (ref.current) {
        observerInstance.current.unobserve(ref.current);
      }

      if (node) {
        observerInstance.current.observe(node);
      }

      // Store a reference to the node
      ref.current = node;
    },
    [threshold, root, rootMargin],
  );

  /**
   * Unsubscribe IntersectionObserver before unmounting a component.
   */
  React.useEffect(() => {
    return () => {
      if (observerInstance.current && ref.current) {
        observerInstance.current.unobserve(ref.current);
      }
    };
  }, []);

  return [setRef, state.inView, state.target, state.entry];
}
