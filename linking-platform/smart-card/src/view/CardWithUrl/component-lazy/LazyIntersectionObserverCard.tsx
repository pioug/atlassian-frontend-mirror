import React, { useCallback, useState } from 'react';

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

export const LazyIntersectionObserverCard: React.FC<CardWithUrlContentProps> = (
	props: CardWithUrlContentProps,
): React.JSX.Element => {
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
