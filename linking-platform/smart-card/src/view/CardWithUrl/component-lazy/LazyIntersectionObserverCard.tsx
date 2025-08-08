import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { usePrefetch } from '../../../state';
import { startUfoExperience } from '../../../state/analytics/ufoExperiences';
import { useSmartCardState } from '../../../state/store';
import { shouldSample } from '../../../utils/shouldSample';
import { CardWithUrlContent } from '../component';
import { type CardWithUrlContentProps } from '../types';

import { LoadingCardLink } from './LoadingCardLink';

// This property enables the intersection observer to be run once the
// HTML element being observed is within `X` px of the target container it is
// being compared to. Since the default container is the `document`, we set this
// up to check once a Smart Link is within `X` px from the bottom of the viewport.
const ROOT_MARGIN_VERTICAL = '360px';

declare global {
	interface Window {
		__SSR_RENDERED__?: boolean;
	}
}

// Returns true on SSR and SPA if page was SSR'd
const isPageSSRd = () => {
	return Boolean(process.env.REACT_SSR || window.__SSR_RENDERED__);
};

export function LazyIntersectionObserverCard(props: CardWithUrlContentProps) {
	const { appearance, url, id } = props;

	const ref = useRef<HTMLDivElement | null>(null);

	const state = useSmartCardState(url);
	// If page was SSR we don't need to enable intersection for already resolved cards,
	// to avoid flickering.
	const [isIntersecting, setIsIntersecting] = useState(isPageSSRd() && state.status === 'resolved');
	const [shouldSendRenderedUFOEvent] = useState(shouldSample());
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

	const isSartUfoExperienceSend = useRef(false);
	// We need to use `useLayoutEffect` here to ensure that the UFO start event is sent
	// before another component is rendered.
	useLayoutEffect(() => {
		if (isIntersecting && !isSartUfoExperienceSend.current) {
			isSartUfoExperienceSend.current = true;

			if (shouldSendRenderedUFOEvent) {
				startUfoExperience('smart-link-rendered', id);
			}
		}
	}, [id, isIntersecting, shouldSendRenderedUFOEvent]);

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
