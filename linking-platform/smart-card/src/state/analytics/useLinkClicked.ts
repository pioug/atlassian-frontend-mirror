import { useCallback } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import type { LinkProps } from '@atlaskit/link/link';

import { fireLinkClickedEvent } from '../../utils/analytics/fireLinkClickedEvent';

export enum ClickButton {
	Left = 0,
	Middle = 1,
	Right = 2,
}

export const useLinkClicked = <T extends Exclude<LinkProps['onClick'], undefined>>(
	/**
	 * Handler to
	 */
	handler?: T,
	/**
	 * Filter which mouse events should trigger the link clicked event
	 */
	predicate?: (event: React.MouseEvent) => boolean,
): ((...args: Parameters<T>) => void) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	return useCallback(
		(...args: Parameters<T>) => {
			const [event] = args;
			handler?.apply(null, args);
			if (!predicate || predicate?.(event)) {
				fireLinkClickedEvent(createAnalyticsEvent)(event);
			}
		},
		[handler, predicate, createAnalyticsEvent],
	);
};
