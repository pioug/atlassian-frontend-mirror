import React, { useCallback } from 'react';

import useIntersectionObserver from '../../../state/hooks/use-intersection-observer';
import { useSmartLinkSeenEvent } from '../../../state/hooks/use-smart-link-seen-event';
import type { CardProps } from '../../Card';
import type { OnErrorCallback } from '../../types';
import CardLoaderWrapper from '../card-loader-wrapper';

type WithCardIntersectionObserverProps = Pick<
	CardProps,
	'appearance' | 'children' | 'onError' | 'id' | 'ui' | 'url'
>;

const withCardIntersectionObserver =
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

export default withCardIntersectionObserver;
