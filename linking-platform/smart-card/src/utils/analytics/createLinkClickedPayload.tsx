import React from 'react';

import { type AnalyticsPayload } from '../types';
import { buttonMap } from './click';
import { getKeys } from './getKeys';
import { getLinkClickOutcome } from './getLinkClickOutcome';
import { type UiLinkClickedEventProps } from './types';

const linkClickedEvent = ({
	clickType,
	clickOutcome,
	keysHeld,
	defaultPrevented,
}: UiLinkClickedEventProps): AnalyticsPayload => ({
	action: 'clicked',
	actionSubject: 'link',
	eventType: 'ui',
	attributes: {
		clickType,
		clickOutcome,
		keysHeld,
		defaultPrevented,
	},
});

export const createLinkClickedPayload = (event: React.MouseEvent): AnalyticsPayload | undefined => {
	// Through the `detail` property, we're able to determine if the event is (most likely) triggered via keyboard
	// https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail
	const isKeyboard = event.nativeEvent.detail === 0;
	const clickType = isKeyboard ? 'keyboard' : buttonMap.get(event.button);

	if (!clickType) {
		return;
	}
	const clickOutcome = getLinkClickOutcome(event, clickType);
	const keysHeld = getKeys(event);
	const defaultPrevented = event.defaultPrevented;

	const linkClickedEventResult = linkClickedEvent({
		clickType,
		clickOutcome,
		keysHeld,
		defaultPrevented,
	});

	// if the current target is an anchor tag, we can get the href from it and use that as the url being navigated too.
	if (event.currentTarget instanceof HTMLAnchorElement) {
		const url = event.currentTarget.href;
		return {
			...linkClickedEventResult,
			nonPrivacySafeAttributes: {
				url,
			},
		};
	} else {
		// We can't get the href from the event target, so dont include the url or any non privacy safe attributes
		return linkClickedEventResult;
	}
};
