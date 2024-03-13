import React, { PropsWithChildren, useEffect } from 'react';
import getDocument from './document';

export type ViewportDetectorProps = PropsWithChildren<{
  cardEl: HTMLElement | null;
  onVisible: () => void;
}>;

const ABS_VIEWPORT_ANCHOR_OFFSET_TOP = 900; //px

const createIntersectionObserverCallback =
  (onVisible: () => void): IntersectionObserverCallback =>
  (entries, observer) => {
    for (let entry of entries) {
      if (entry.isIntersecting) {
        onVisible();
        observer.disconnect();
        break;
      }
    }
  };

const ViewportObserver = ({
  onVisible,
  cardEl,
  children,
}: ViewportDetectorProps) => {
  useEffect(() => {
    let intersectionObserver: IntersectionObserver;
    try {
      intersectionObserver = new IntersectionObserver(
        createIntersectionObserverCallback(onVisible),
        {
          root: getDocument(),
          rootMargin: `${ABS_VIEWPORT_ANCHOR_OFFSET_TOP}px`,
        },
      );
    } catch (error: any) {
      intersectionObserver = new IntersectionObserver(
        createIntersectionObserverCallback(onVisible),
        {
          root: null,
          rootMargin: `${ABS_VIEWPORT_ANCHOR_OFFSET_TOP}px`,
        },
      );
    }

    cardEl && intersectionObserver.observe(cardEl);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [cardEl, onVisible]);

  return <>{children}</>;
};

export const ViewportDetector = ({
  cardEl,
  onVisible,
  children,
}: ViewportDetectorProps) => {
  if (typeof IntersectionObserver === 'undefined') {
    return <>{children}</>;
  }

  return (
    <ViewportObserver cardEl={cardEl} onVisible={onVisible}>
      {children}
    </ViewportObserver>
  );
};
