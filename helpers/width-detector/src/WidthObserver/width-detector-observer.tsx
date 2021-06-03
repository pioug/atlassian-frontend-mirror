import React from 'react';
import { useInView } from './hooks';
import { WidthObserverProps } from './types';
import { browser } from './utils';

export const WidthDetectorObserver = React.memo(
  ({ setWidth, offscreen }: WidthObserverProps) => {
    const { supportsResizeObserver } = browser;
    const [inViewRef, inView, target] = useInView({
      /* Optional options */
      threshold: 0,
    });

    const observer = React.useRef(() => {
      if (typeof window === 'undefined' || !supportsResizeObserver) {
        return null;
      }

      // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/40909
      // @ts-ignore
      return new ResizeObserver((entries) => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }

        const { width } = entries[0].contentRect;

        setWidth(Math.round(width));
      });
    });

    React.useEffect(() => {
      const { current: currentObserver } = observer;
      const resizeObserver = currentObserver();

      if (resizeObserver === null) {
        return;
      }

      if (target) {
        if (inView || offscreen) {
          resizeObserver.observe(target);
        } else {
          resizeObserver.unobserve(target);
        }
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, [target, inView, offscreen]);

    return (
      <div
        style={{
          display: 'block',
          width: '100%',
          position: 'absolute',
        }}
        ref={inViewRef}
      />
    );
  },
);
