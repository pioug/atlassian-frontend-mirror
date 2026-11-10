import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';
import { getActiveInteraction } from '@atlaskit/react-ufo/interaction-metrics';

import { startUfoExperience } from '../../../state/analytics/startUfoExperience';
import useIntersectionObserver from '../../../state/hooks/use-intersection-observer';
import { useSmartLinkSeenEvent } from '../../../state/hooks/use-smart-link-seen-event';
import { clearMarks } from '../../../utils/clear-marks';
import { clearMeasures } from '../../../utils/clear-measures';
import { shouldSample } from '../../../utils/shouldSample';
import type { CardProps } from '../../Card';
import type { OnErrorCallback } from '../../types';
import CardLoaderWrapper from '../card-loader-wrapper';

type WithCardIntersectionObserverProps = Pick<
	CardProps,
	'appearance' | 'children' | 'onError' | 'id' | 'ui' | 'url'
>;

const withCardIntersectionObserverOld =
	<T extends WithCardIntersectionObserverProps>(
		Component: React.ComponentType<T>,
	): ((props: T) => React.JSX.Element) =>
	(props: T): React.JSX.Element => {
		// TODO: NAVX-4682: Add feature parity to LazyIntersectionObserverCard for no lazy loading
		const { appearance, children, id, onError: onErrorCallback, ui, url = '' } = props;

		const { onIntersecting, onStatusSettled } = useSmartLinkSeenEvent({
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

		const ref = useIntersectionObserver({ onIntersecting });

		return (
			<CardLoaderWrapper appearance={props.appearance} ref={ref}>
				<Component {...props} onError={onError} />
			</CardLoaderWrapper>
		);
	};

const withCardIntersectionObserverNew =
	<T extends WithCardIntersectionObserverProps>(
		Component: React.ComponentType<T>,
	): ((props: T) => React.JSX.Element) =>
	(props: T): React.JSX.Element => {
		const { appearance, children, id, onError: onErrorCallback, ui, url = '' } = props;

		const hasStartedRenderedExperience = useRef(false);

		// Unlike LazyIntersectionObserverCard, the content is rendered immediately
		// (server rendered) and may reach its final state before intersecting, so the
		// (sampled) rendered experience is started on mount instead of on intersection.
		// Layout effects run before the content's passive effects (where the experience
		// succeeds) and do not run on the server. The ref guards against StrictMode remounts.
		// The start time is backdated to the active UFO interaction (page load / SPA transition)
		// start, so the duration covers the time the card took to render since the interaction began.
		useLayoutEffect(() => {
			if (hasStartedRenderedExperience.current) {
				return;
			}
			hasStartedRenderedExperience.current = true;

			if (shouldSample()) {
				const interactionStartTime = getActiveInteraction()?.start;
				startUfoExperience(
					'smart-link-rendered',
					id || 'NULL',
					{
						ssr: true,
						timingStrategy: interactionStartTime !== undefined ? 'interaction-start' : 'render',
					},
					interactionStartTime,
				);
			}
			// Only start once on mount
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		useEffect(() => {
			if (!id) {
				return;
			}
			// ComponentWillUnmount
			return () => {
				clearMarks(id);
				clearMeasures(id);
			};
		}, [id]);

		const { onIntersecting, onStatusSettled } = useSmartLinkSeenEvent({
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

		const ref = useIntersectionObserver({ onIntersecting });

		return (
			<CardLoaderWrapper appearance={props.appearance} ref={ref}>
				<Component {...props} onError={onError} />
			</CardLoaderWrapper>
		);
	};

const withCardIntersectionObserver = <T extends WithCardIntersectionObserverProps>(
	Component: React.ComponentType<T>,
): ((props: T) => React.JSX.Element) => {
	const WithCardIntersectionObserverOld = withCardIntersectionObserverOld(Component);
	const WithCardIntersectionObserverNew = withCardIntersectionObserverNew(Component);

	return (props: T): React.JSX.Element => {
		if (fg('platform_smartlink_cardssr_missing_events')) {
			return <WithCardIntersectionObserverNew {...props} />;
		}
		return <WithCardIntersectionObserverOld {...props} />;
	};
};

export default withCardIntersectionObserver;
