import { type MouseEvent } from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	type AnalyticsEventPayload,
	EVENT_TYPE,
	MODE,
	PLATFORMS,
} from '../../analytics';
import { type OnClickCallback } from '../../card';

/**
 * Function that opens a new page and fires the relevant analytics events
 */
export function handleNavigation({
	url,
	event,
	onClickCallback,
	fireAnalyticsEvent,
}: {
	fireAnalyticsEvent: ((payload: AnalyticsEventPayload) => void | undefined) | undefined;
	onClickCallback?: OnClickCallback;
	url: string;
	event: MouseEvent<HTMLAnchorElement>;
}): void {
	if (fireAnalyticsEvent) {
		fireAnalyticsEvent({
			action: ACTION.VISITED,
			actionSubject: ACTION_SUBJECT.LINK,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				platform: PLATFORMS.WEB,
				mode: MODE.EDITOR,
			},
		});
	}
	if (url) {
		try {
			onClickCallback?.({ event, url });
		} catch {}
		/**
		 * Links should navigate by default in live pages if:
		 * - the link is the direct target of the click event
		 * - default handling wasn't prevented with `event.preventDefault()`
		 */
		if (!event.defaultPrevented) {
			window.location.href = url;
		}
	}
}
