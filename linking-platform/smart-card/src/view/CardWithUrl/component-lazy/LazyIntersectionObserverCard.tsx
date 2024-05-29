import React, { useCallback, useEffect, useRef, useState } from 'react';

import { type CardWithUrlContentProps } from '../types';
import { usePrefetch } from '../../../state';
import { CardWithUrlContent } from '../component';
import { LoadingCardLink } from './LoadingCardLink';
import { startUfoExperience } from '../../../state/analytics/ufoExperiences';

// This property enables the intersection observer to be run once the
// HTML element being observed is within `X` px of the target container it is
// being compared to. Since the default container is the `document`, we set this
// up to check once a Smart Link is within `X` px from the bottom of the viewport.
const ROOT_MARGIN_VERTICAL = '360px';

export function LazyIntersectionObserverCard(props: CardWithUrlContentProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const [isIntersecting, setIsIntersecting] = useState(false);
  const { appearance, url, id } = props;
  const prefetch = usePrefetch(url);

  const Component = appearance === 'inline' ? 'span' : 'div';
  const ComponentObserver = Component;

  const onIntersection: IntersectionObserverCallback = useCallback(
    (entries, observer) => {
      const isVisible = entries.some((entry) => entry.isIntersecting);
      if (isVisible) {
        startUfoExperience('smart-link-rendered', id);
        setIsIntersecting(true);
        observer.disconnect();
      } else {
        prefetch();
      }
    },
    [prefetch, id],
  );

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const intersectionObserver = new IntersectionObserver(onIntersection, {
      rootMargin: `${ROOT_MARGIN_VERTICAL} 0px ${ROOT_MARGIN_VERTICAL} 0px`,
    });

    intersectionObserver.observe(ref.current);

    return () => intersectionObserver.disconnect();
  }, [ref, onIntersection]);

  const content = isIntersecting ? (
    <CardWithUrlContent {...props} />
  ) : (
    <ComponentObserver ref={ref}>
      <LoadingCardLink {...props} />
    </ComponentObserver>
  );

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
  return <Component className="loader-wrapper">{content}</Component>;
}
