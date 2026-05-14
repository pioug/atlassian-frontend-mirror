import React, { useCallback, useEffect, useRef, useState } from 'react';

import { componentWithFG } from '@atlaskit/platform-feature-flags-react';

import { usePrefetch } from '../../../state';
import { startUfoExperience } from '../../../state/analytics/ufoExperiences';
import useIntersectionObserver from '../../../state/hooks/use-intersection-observer';
import { useSmartLinkSeenEvent } from '../../../state/hooks/use-smart-link-seen-event';
import { shouldSample } from '../../../utils/shouldSample';
import type { OnErrorCallback } from '../../types';
import CardLoaderWrapper from '../card-loader-wrapper';
import { CardWithUrlContent } from '../component';
import { type CardWithUrlContentProps } from '../types';

import { LoadingCardLink } from './LoadingCardLink';

// This property enables the intersection observer to be run once the
// HTML element being observed is within `X` px of the target container it is
// being compared to. Since the default container is the `document`, we set this
// up to check once a Smart Link is within `X` px from the bottom of the viewport.
const ROOT_MARGIN_VERTICAL = '360px';

function LazyIntersectionObserverCardOld(props: CardWithUrlContentProps): React.JSX.Element {
	const ref = useRef<HTMLDivElement | null>(null);

	const [isIntersecting, setIsIntersecting] = useState(false);
	const [shouldSendRenderedUFOEvent] = useState(shouldSample());
	const { appearance, url, id } = props;
	const prefetch = usePrefetch(url);

	const Component = appearance === 'inline' ? 'span' : 'div';
	const ComponentObserver = Component;

	const onIntersection: IntersectionObserverCallback = useCallback(
		(entries, observer) => {
			const isVisible = entries.some((entry) => entry.isIntersecting);
			if (isVisible) {
				if (shouldSendRenderedUFOEvent) {
					startUfoExperience('smart-link-rendered', id);
				}
				setIsIntersecting(true);
				observer.disconnect();
			} else {
				prefetch();
			}
		},
		[id, prefetch, shouldSendRenderedUFOEvent],
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

const LazyIntersectionObserverCardNew = (props: CardWithUrlContentProps): React.JSX.Element => {
	const [isIntersected, setIsIntersected] = useState(false);
	const [shouldSendRenderedUFOEvent] = useState(shouldSample());
	const { appearance, children, id, onError: onErrorCallback, ui, url } = props;
	const prefetch = usePrefetch(url);
	const ComponentObserver = appearance === 'inline' ? 'span' : 'div';

	const { onIntersecting: onSeenIntersecting, onStatusSettled } = useSmartLinkSeenEvent({
		appearance,
		children,
		id,
		ui,
		url,
	});

	const onError: OnErrorCallback = useCallback(
		(data) => {
			if (data?.status) {
				onStatusSettled(data.status);
			}
			onErrorCallback?.(data);
		},
		[onStatusSettled, onErrorCallback],
	);

	const onIntersection = useCallback(
		(isIntersecting: boolean) => {
			if (isIntersecting) {
				if (shouldSendRenderedUFOEvent) {
					startUfoExperience('smart-link-rendered', id);
				}
				onSeenIntersecting();
				setIsIntersected(true);
			} else {
				prefetch();
			}
		},
		[id, onSeenIntersecting, prefetch, shouldSendRenderedUFOEvent],
	);

	const ref = useIntersectionObserver({ onIntersection });

	const content = isIntersected ? (
		<CardWithUrlContent {...props} onError={onError} />
	) : (
		<ComponentObserver ref={ref}>
			<LoadingCardLink {...props} />
		</ComponentObserver>
	);

	return <CardLoaderWrapper appearance={appearance}>{content}</CardLoaderWrapper>;
};

export const LazyIntersectionObserverCard: React.FC<CardWithUrlContentProps> = componentWithFG(
	'platform_sl_event_ui_seen',
	LazyIntersectionObserverCardNew,
	LazyIntersectionObserverCardOld,
);
