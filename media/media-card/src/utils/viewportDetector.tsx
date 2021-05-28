import React, { FC, useEffect } from 'react';
import { LazyContent } from './lazyContent';

type ViewportDetectorProps = {
  targetRef: HTMLElement | null;
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

const Observer: FC<ViewportDetectorProps> = ({
  onVisible,
  children,
  targetRef,
}) => {
  useEffect(() => {
    // IntersectionObserver uses root and target elements to detect intersections, defaulting root to the viewport
    const intersectionObserver = new IntersectionObserver(
      createIntersectionObserverCallback(onVisible),
    );
    targetRef && intersectionObserver.observe(targetRef);
    return () => {
      intersectionObserver.disconnect();
    };
  }, [targetRef, onVisible]);

  return <>{children}</>;
};

export const createViewportDetector = (
  isIntersectionObserverSupported: boolean,
): React.FC<ViewportDetectorProps> => ({ children, targetRef, onVisible }) =>
  isIntersectionObserverSupported ? (
    <Observer targetRef={targetRef} onVisible={onVisible}>
      {children}
    </Observer>
  ) : (
    <LazyContent placeholder={<>{children}</>} onRender={onVisible}>
      {children}
    </LazyContent>
  );

export const ViewportDetector = createViewportDetector(
  typeof IntersectionObserver !== 'undefined',
);
