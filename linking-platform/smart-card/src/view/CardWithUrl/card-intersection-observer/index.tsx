import React, { useCallback, useState } from 'react';

import useIntersectionObserver from '../../../state/hooks/use-intersection-observer';
import { isIntersectionObserverSupported } from '../../../utils';
import type { CardProps } from '../../Card';
import CardLoaderWrapper from '../card-loader-wrapper';

type WithCardIntersectionObserverProps = {
	appearance: CardProps['appearance'];
};

const withCardIntersectionObserver =
	<T extends WithCardIntersectionObserverProps>(Component: React.ComponentType<T>) =>
	(props: T) => {
		// TODO: NAVX-4682: Add feature parity to LazyIntersectionObserverCard for no lazy loading
		const [isIntersected, setIsIntersected] = useState(false);

		const onIntersecting = useCallback(() => {
			setIsIntersected(true);
		}, []);

		const ref = useIntersectionObserver({ onIntersecting });

		return (
			<CardLoaderWrapper appearance={props.appearance} ref={ref}>
				<Component {...props} isIntersected={isIntersected} />
			</CardLoaderWrapper>
		);
	};

const withCardIntersectionObserverFallback =
	<T extends WithCardIntersectionObserverProps>(Component: React.ComponentType<T>) =>
	(props: T) => (
		<CardLoaderWrapper appearance={props.appearance}>
			<Component {...props} />
		</CardLoaderWrapper>
	);

export default <T extends WithCardIntersectionObserverProps>(
	Component: React.ComponentType<T>,
): ((props: T) => React.JSX.Element) =>
	isIntersectionObserverSupported()
		? withCardIntersectionObserver(Component)
		: withCardIntersectionObserverFallback(Component);
