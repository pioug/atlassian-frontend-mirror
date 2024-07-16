import { useMemo } from 'react';

import { FabricChannel } from '@atlaskit/analytics-listeners';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../../analytics';

export const useLinkOverlayAnalyticsEvents = () => {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	return useMemo(
		() => ({
			fireActionClickEvent: (linkAction: string) => {
				createAnalyticsEvent({
					action: ACTION.CLICKED,
					actionSubject: ACTION_SUBJECT.BUTTON,
					eventType: EVENT_TYPE.UI,
					attributes: { action: linkAction },
				}).fire(FabricChannel.media);
			},
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
