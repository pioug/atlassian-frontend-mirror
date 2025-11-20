import React, { type PropsWithChildren, useEffect, useCallback, useState } from 'react';

import UFOInteractionIgnore from '@atlaskit/react-ufo/interaction-ignore';

import getDocument from './document';

export type ViewportDetectorProps = PropsWithChildren<{
	cardEl: HTMLElement | null;
	onVisible: () => void;
}>;

const ABS_VIEWPORT_ANCHOR_OFFSET_TOP = 900; //px

const createIntersectionObserverCallback =
	(onVisible: () => void): IntersectionObserverCallback =>
	(entries, observer) => {
		for (let entry of entries) {
			if (entry.isIntersecting) {
				onVisible();
				observer.disconnect();
				break;
			}
		}
	};

const ViewportObserver = ({ onVisible, cardEl, children }: ViewportDetectorProps) => {
	const [isVisible, setIsVisible] = useState(false);

	const onVisibleCallback = useCallback(() => {
		setIsVisible(true);

		onVisible();
	}, [onVisible]);

	useEffect(() => {
		let intersectionObserver: IntersectionObserver;
		try {
			intersectionObserver = new IntersectionObserver(
				createIntersectionObserverCallback(onVisibleCallback),
				{
					root: getDocument(),
					rootMargin: `${ABS_VIEWPORT_ANCHOR_OFFSET_TOP}px`,
				},
			);
		} catch (error: any) {
			intersectionObserver = new IntersectionObserver(
				createIntersectionObserverCallback(onVisibleCallback),
				{
					root: null,
					rootMargin: `${ABS_VIEWPORT_ANCHOR_OFFSET_TOP}px`,
				},
			);
		}

		cardEl && intersectionObserver.observe(cardEl);

		return () => {
			intersectionObserver.disconnect();
		};
	}, [cardEl, onVisibleCallback]);

	return <UFOInteractionIgnore ignore={!isVisible}>{children}</UFOInteractionIgnore>;
};

export const ViewportDetector = ({
	cardEl,
	onVisible,
	children,
}: ViewportDetectorProps): React.JSX.Element => {
	if (typeof IntersectionObserver === 'undefined') {
		return <>{children}</>;
	}

	return (
		<ViewportObserver cardEl={cardEl} onVisible={onVisible}>
			{children}
		</ViewportObserver>
	);
};
