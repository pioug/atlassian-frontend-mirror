import React, { useEffect } from 'react';
import getDocument from './document';

export type ViewportDetectorProps = {
  cardEl: HTMLElement | null;
  onVisible: () => void;
};

const ABS_VIEWPORT_ANCHOR_OFFSET_TOP = 900; //px

const createIntersectionObserverCallback = (
  onVisible: () => void,
): IntersectionObserverCallback => (entries, observer) => {
  for (let entry of entries) {
    if (entry.isIntersecting) {
      onVisible();
      observer.disconnect();
      break;
    }
  }
};

const ViewportObserver: React.FC<ViewportDetectorProps> = ({
  onVisible,
  cardEl,
  children,
}) => {
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
      const errorMessage =
        "Failed to construct 'IntersectionObserver': member root is not of type Element";
      if (error.message?.includes(errorMessage)) {
        intersectionObserver = new IntersectionObserver(
          createIntersectionObserverCallback(onVisible),
          {
            root: null,
            rootMargin: `${ABS_VIEWPORT_ANCHOR_OFFSET_TOP}px`,
          },
        );
      } else {
        throw error;
      }
    }

    cardEl && intersectionObserver.observe(cardEl);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [cardEl, onVisible]);

  return <>{children}</>;
};

export const ViewportDetector: React.FC<ViewportDetectorProps> = ({
  cardEl,
  onVisible,
  children,
}) => {
  if (typeof IntersectionObserver === 'undefined') {
    return <>{children}</>;
  }

  return (
    <ViewportObserver cardEl={cardEl} onVisible={onVisible}>
      {children}
    </ViewportObserver>
  );
};
