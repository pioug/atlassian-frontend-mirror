import React, { useCallback, useState } from 'react';

import { CardWithUrlContentProps } from '../types';
import { usePrefetch } from '../../../state';
import { CardWithUrlContent } from '../component';
import { LoadingCardLink } from './LazyFallback';

// This property enables the intersection observer to be run once the
// HTML element being observed is within `X` px of the target container it is
// being compared to. Since the default container is the `document`, we set this
// up to check once a Smart Link is within `X` px from the bottom of the viewport.
const ROOT_MARGIN_VERTICAL = '360px';

export function LazyIntersectionObserverCard(props: CardWithUrlContentProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const { showActions, appearance, url } = props;
  const prefetch = usePrefetch(url);

  const Component = appearance === 'inline' ? 'span' : 'div';
  const ComponentObserver = Component;

  const onIntersection: IntersectionObserverCallback = useCallback(
    (entries, observer) => {
      const isVisible = entries.some((entry) => entry.isIntersecting);
      if (isVisible) {
        setIsIntersecting(true);
        observer.disconnect();
      } else {
        prefetch();
      }
    },
    [prefetch],
  );
  const onRef = useCallback(
    (element: HTMLElement | null) => {
      if (!element) {
        return;
      }
      const intersectionObserver = new IntersectionObserver(onIntersection, {
        rootMargin: `${ROOT_MARGIN_VERTICAL} 0px ${ROOT_MARGIN_VERTICAL} 0px`,
      });
      intersectionObserver.observe(element);
      return () => intersectionObserver.disconnect();
    },
    [onIntersection],
  );

  const content = isIntersecting ? (
    <CardWithUrlContent {...props} showActions={showActions} />
  ) : (
    <ComponentObserver ref={onRef}>
      <LoadingCardLink {...props} />
    </ComponentObserver>
  );
  return <Component className="loader-wrapper">{content}</Component>;
}
