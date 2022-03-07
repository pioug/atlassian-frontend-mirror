import React, { useEffect, forwardRef } from 'react';

/**
 * As IntersectionObserver::rootMargin doesn't work within IFrames, we use an empty div + dynamic offsetTop to eagerly detect cards entering viewport.
 * Using this approach, we can lazy load cards ABS_VIEWPORT_ANCHOR_OFFSET_TOP px before they enter viewport.
 */
export const ABS_VIEWPORT_ANCHOR_OFFSET_TOP = 900; //px

export const ViewportAnchor = forwardRef<HTMLDivElement, { offsetTop: number }>(
  (props, ref) => {
    if (typeof IntersectionObserver === 'undefined') {
      return null;
    }

    return (
      <div
        ref={ref}
        className="media-card-viewport-anchor"
        style={{ position: 'relative', top: `${props.offsetTop}px` }}
      />
    );
  },
);

export type ViewportDetectorProps = {
  cardEl: HTMLElement | null;
  preAnchorRef: React.RefObject<HTMLDivElement>;
  postAnchorRef: React.RefObject<HTMLDivElement>;
  onVisible: () => void;
};

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
  preAnchorRef,
  postAnchorRef,
}) => {
  useEffect(() => {
    // IntersectionObserver uses root and target elements to detect intersections, defaulting root to the viewport
    const intersectionObserver = new IntersectionObserver(
      createIntersectionObserverCallback(onVisible),
    );

    preAnchorRef?.current && intersectionObserver.observe(preAnchorRef.current);
    postAnchorRef?.current &&
      intersectionObserver.observe(postAnchorRef.current);
    cardEl && intersectionObserver.observe(cardEl);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [cardEl, preAnchorRef, postAnchorRef, onVisible]);

  return <>{children}</>;
};

export const ViewportDetector: React.FC<ViewportDetectorProps> = ({
  cardEl,
  preAnchorRef,
  postAnchorRef,
  onVisible,
  children,
}) => {
  if (typeof IntersectionObserver === 'undefined') {
    return <>{children}</>;
  }

  return (
    <ViewportObserver
      cardEl={cardEl}
      preAnchorRef={preAnchorRef}
      postAnchorRef={postAnchorRef}
      onVisible={onVisible}
    >
      {children}
    </ViewportObserver>
  );
};
