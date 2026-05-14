import { useCallback, useEffect, useMemo, useRef } from 'react';

import { type CardType } from '@atlaskit/linking-common';

import type { SmartLinkSeenAttributesType } from '../../../common/analytics/generated/analytics.types';
import { useAnalyticsEvents } from '../../../common/analytics/generated/use-analytics-events';
import { useSmartLinkAnalyticsUtils } from '../../../utils/analytics/SmartLinkAnalyticsContext';
import { isFlexibleUiCard } from '../../../utils/flexible';
import type { CardProps } from '../../../view/Card';

type UseSmartLinkSeenEventProps = Pick<CardProps, 'appearance' | 'children' | 'id' | 'ui' | 'url'>;

type UseSmartLinkSeenEventReturn = {
	onIntersecting: () => void;
	onStatusSettled: (status: CardType) => void;
};

/**
 * Fires `ui.smartLink.seen` once when a smart link with status `unauthorized`
 * enters the viewport. Uses refs internally so it never causes re-renders,
 * which is important for SSR.
 */
export function useSmartLinkSeenEvent({
	appearance,
	children,
	id,
	ui,
	url = '',
}: UseSmartLinkSeenEventProps): UseSmartLinkSeenEventReturn {
	const { fireEvent } = useAnalyticsEvents();
	const { getByUrl } = useSmartLinkAnalyticsUtils();

	const getAnalyticsProps = useCallback(() => {
		const isFlexibleUi = isFlexibleUiCard(children, ui);
		const display = isFlexibleUi ? 'flexible' : appearance;
		return { display, id };
	}, [appearance, children, id, ui]);

	const statusRef = useRef<CardType>();
	const analyticsPropsRef = useRef<ReturnType<typeof getAnalyticsProps>>(null!);
	const hasIntersectedRef = useRef(false);
	const hasFiredSeenRef = useRef(false);

	useEffect(() => {
		analyticsPropsRef.current = getAnalyticsProps();
	}, [getAnalyticsProps]);

	const maybeFireSeenEvent = useCallback(() => {
		if (
			!hasFiredSeenRef.current &&
			hasIntersectedRef.current &&
			statusRef.current === 'unauthorized'
		) {
			const payload = getByUrl(url, analyticsPropsRef.current);
			fireEvent('ui.smartLink.seen', payload?.attributes as SmartLinkSeenAttributesType);
			hasFiredSeenRef.current = true;
		}
	}, [fireEvent, getByUrl, url]);

	const onIntersecting = useCallback(() => {
		if (hasIntersectedRef.current) {
			return;
		}
		hasIntersectedRef.current = true;
		maybeFireSeenEvent();
	}, [maybeFireSeenEvent]);

	const onStatusSettled = useCallback(
		(status: CardType) => {
			statusRef.current = status;
			maybeFireSeenEvent();
		},
		[maybeFireSeenEvent],
	);

	return useMemo(() => ({ onIntersecting, onStatusSettled }), [onIntersecting, onStatusSettled]);
}
