import { useMemo } from 'react';

import { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/analytics-next';

import { SmartLinkEvents } from '../../utils/analytics/analytics';

export function useSmartLinkEvents(): SmartLinkEvents {
	/**
	 * this utility maybe extended in the future to include
	 * more contextual info about SLs
	 */
	const events = useMemo(() => new SmartLinkEvents(), []);
	return events;
}

export type Fire3PWorkflowsClickEventOptions = {
	/** True for middle-clicks (button === 1) captured via `onAuxClick`. */
	isAuxClick?: boolean;
	/** True for right-clicks captured via `onContextMenu`. */
	isContextMenu?: boolean;
};

export function useFire3PWorkflowsClickEvent(
	firstPartyIdentifier: string | undefined,
	thirdPartyARI: string | undefined,
) {
	const { createAnalyticsEvent } = useAnalyticsEventsNext();

	return ({
		isAuxClick = false,
		isContextMenu = false,
	}: Fire3PWorkflowsClickEventOptions = {}): void => {
		const smartlinkClickAnalyticsEvent = createAnalyticsEvent({
			action: 'clicked',
			actionSubject: 'smartLink',
			actionSubjectId: 'smartlinkClickAnalyticsWorkflows',
			eventType: 'ui',
			attributes: {
				eventName: 'smartLinkClickAnalyticsThirdPartyWorkflows',
				firstPartyIdentifier: firstPartyIdentifier,
				isAuxClick,
				isContextMenu,
			},
			nonPrivacySafeAttributes: {
				thirdPartyARI: thirdPartyARI,
			},
		});
		smartlinkClickAnalyticsEvent.fire('media');
	};
}
