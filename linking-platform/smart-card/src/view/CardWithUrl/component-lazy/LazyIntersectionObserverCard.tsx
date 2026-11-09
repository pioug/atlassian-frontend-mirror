import React, { useCallback, useState } from 'react';

import { useSmartLinkContext } from '@atlaskit/link-provider/use-smart-link-context';
import type { CardType } from '@atlaskit/linking-common/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { startUfoExperience } from '../../../state/analytics/startUfoExperience';
import useIntersectionObserver from '../../../state/hooks/use-intersection-observer';
import { useSmartLinkSeenEvent } from '../../../state/hooks/use-smart-link-seen-event';
import { usePrefetch } from '../../../state/hooks/usePrefetch';
import { shouldSample } from '../../../utils/shouldSample';
import type { OnErrorCallback } from '../../types';
import CardLoaderWrapper from '../card-loader-wrapper';
import { CardWithUrlContent } from '../component';
import { type CardWithUrlContentProps } from '../types';
import { LoadingCardLink } from './LoadingCardLink';

/** Statuses that came from a resolver response, so the card can show them again without loading. */
const SETTLED_STATUSES: ReadonlySet<CardType> = new Set<CardType>([
	'resolved',
	'unauthorized',
	'forbidden',
	'not_found',
]);

export const LazyIntersectionObserverCard: React.FC<CardWithUrlContentProps> = (
	props: CardWithUrlContentProps,
): React.JSX.Element => {
	const [isIntersected, setIsIntersected] = useState(false);
	const [shouldSendRenderedUFOEvent] = useState(shouldSample());
	const { appearance, children, id, onError: onErrorCallback, ui, url } = props;
	const { store } = useSmartLinkContext();
	// A link the store has already settled (e.g. a remounted card) renders at once, not as the
	// loading placeholder, so its rendered experience starts before the card can succeed it.
	const [isSettledOnMount] = useState(() => {
		const status = store?.getState()[url]?.status;
		const settled =
			!!status &&
			SETTLED_STATUSES.has(status) &&
			fg('platform_smartlink_render_settled_link_on_mount');
		if (settled && shouldSendRenderedUFOEvent) {
			startUfoExperience('smart-link-rendered', id);
		}
		return settled;
	});
	const prefetch = usePrefetch(url, appearance);
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
				if (shouldSendRenderedUFOEvent && !isSettledOnMount) {
					startUfoExperience('smart-link-rendered', id);
				}
				onSeenIntersecting();
				setIsIntersected(true);
			} else {
				prefetch();
			}
		},
		[id, isSettledOnMount, onSeenIntersecting, prefetch, shouldSendRenderedUFOEvent],
	);

	const ref = useIntersectionObserver({ onIntersection });

	let content: React.JSX.Element;
	if (isSettledOnMount) {
		content = (
			<ComponentObserver ref={ref}>
				<CardWithUrlContent {...props} onError={onError} />
			</ComponentObserver>
		);
	} else if (isIntersected) {
		content = <CardWithUrlContent {...props} onError={onError} />;
	} else {
		content = (
			<ComponentObserver ref={ref}>
				<LoadingCardLink {...props} />
			</ComponentObserver>
		);
	}

	return <CardLoaderWrapper appearance={appearance}>{content}</CardLoaderWrapper>;
};
