/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useLayoutEffect } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { succeedUfoExperience, ufoExperience } from '../../../common/analytics/experiences';
import { ANALYTICS_CHANNEL } from '../../../common/constants';
import createEventPayload from '../../../common/utils/analytics/analytics.codegen';
import { useLinkPickerSessionId } from '../../../controllers/session-provider';

/**
 * UFO + Analytics tracking for component mount (and unmount)
 */
export function TrackMount() {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const linkPickerSessionId = useLinkPickerSessionId();

	useLayoutEffect(() => {
		succeedUfoExperience(ufoExperience.mounted, linkPickerSessionId);
	}, [linkPickerSessionId]);

	useLayoutEffect(() => {
		// Anything in here is fired on component mount.
		createAnalyticsEvent(createEventPayload('ui.inlineDialog.viewed.linkPicker', {})).fire(
			ANALYTICS_CHANNEL,
		);

		return () => {
			// Anything in here is fired on component unmount.
			createAnalyticsEvent(createEventPayload('ui.inlineDialog.closed.linkPicker', {})).fire(
				ANALYTICS_CHANNEL,
			);
		};
	}, [createAnalyticsEvent]);

	return null;
}
