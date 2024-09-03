import { useMemo } from 'react';

import { FabricChannel } from '@atlaskit/analytics-listeners/types';
import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';

import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../../analytics';

export const useLinkOverlayAnalyticsEvents = () => {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	return useMemo(
		() => ({
			/**
			 * When a user clicks go to link or configure link buttons.
			 *
			 * When a link is "wide" the overlay button is the configure button.
			 * When a link is "narrow" the configure button is inside the dropdown.
			 *
			 * @param linkAction 'goToLink' when somebody clicks on the Go to link button
			 * in the chevron menu; 'configureLink' when somebody clicks on the Configure button (whether it's the overlay or in the dropdown)
			 */
			fireActionClickEvent: (linkAction: 'goToLink' | 'configureLink') => {
				createAnalyticsEvent({
					action: ACTION.CLICKED,
					actionSubject: ACTION_SUBJECT.BUTTON,
					eventType: EVENT_TYPE.UI,
					attributes: { action: linkAction },
				}).fire(FabricChannel.media);
			},
			/**
			 * When a user clicks on the dropdown for a short link, or when a user clicks on the configure button for a wide link.
			 */
			fireLinkClickEvent: () => {
				createAnalyticsEvent({
					action: ACTION.CLICKED,
					actionSubject: ACTION_SUBJECT.LINK,
					eventType: EVENT_TYPE.UI,
				}).fire(FabricChannel.media);
			},
			fireToolbarViewEvent: () => {
				createAnalyticsEvent({
					action: ACTION.VIEWED,
					actionSubject: ACTION_SUBJECT.INLINE_DIALOG,
					actionSubjectId: ACTION_SUBJECT_ID.SMART_LINK_TOOLBAR,
					eventType: EVENT_TYPE.UI,
					attributes: {
						linkType: 'smallLink',
					},
				}).fire(FabricChannel.media);
			},
		}),
		[createAnalyticsEvent],
	);
};
