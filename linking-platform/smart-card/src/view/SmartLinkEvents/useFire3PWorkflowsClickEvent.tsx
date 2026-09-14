import { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/analytics-next/useAnalyticsEvents';

import type { Fire3PWorkflowsClickEventOptions } from './useSmartLinkEvents';

export function useFire3PWorkflowsClickEvent(
	firstPartyIdentifier: string | undefined,
	thirdPartyARI: string | undefined,
): any {
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
