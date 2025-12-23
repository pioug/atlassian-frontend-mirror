import { useMemo } from 'react';

import { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/analytics-next';

import { SmartLinkEvents } from '../../utils/analytics/analytics';

export function useSmartLinkEvents() {
	/**
	 * this utility maybe extended in the future to include
	 * more contextual info about SLs
	 */
	const events = useMemo(() => new SmartLinkEvents(), []);
	return events;
}

export function useFire3PWorkflowsClickEvent(
	firstPartyIdentifier: string | undefined,
	thirdPartyARI: string | undefined,
) {
	const { createAnalyticsEvent } = useAnalyticsEventsNext();

	return (): void => {
		const smartlinkClickAnalyticsEvent = createAnalyticsEvent({
			action: 'clicked',
			actionSubject: 'smartLink',
			actionSubjectId: 'smartlinkClickAnalyticsWorkflows',
			eventType: 'ui',
			attributes: {
				eventName: 'smartLinkClickAnalyticsThirdPartyWorkflows',
				firstPartyIdentifier: firstPartyIdentifier,
			},
			nonPrivacySafeAttributes: {
				thirdPartyARI: thirdPartyARI,
			},
		});
		smartlinkClickAnalyticsEvent.fire('media');
	};
}
