import React from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	type DispatchAnalyticsEvent,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';

export function useAnalyticsEvents(dispatchAnalyticsEvent?: DispatchAnalyticsEvent) {
	const onUploadAnalytics = React.useCallback(() => {
		dispatchAnalyticsEvent?.({
			action: ACTION.CLICKED,
			actionSubject: ACTION_SUBJECT.BUTTON,
			actionSubjectId: ACTION_SUBJECT_ID.UPLOAD_MEDIA_FROM_URL,
			eventType: EVENT_TYPE.UI,
		});
	}, [dispatchAnalyticsEvent]);

	const onUploadSuccessAnalytics = React.useCallback(() => {
		dispatchAnalyticsEvent?.({
			action: ACTION.UPLOAD_SUCCEEDED,
			actionSubject: ACTION_SUBJECT.MEDIA,
			actionSubjectId: ACTION_SUBJECT_ID.UPLOAD_MEDIA_FROM_URL,
			eventType: EVENT_TYPE.OPERATIONAL,
		});
	}, [dispatchAnalyticsEvent]);

	const onUploadFailureAnalytics = React.useCallback(
		(reason: string) => {
			dispatchAnalyticsEvent?.({
				action: ACTION.UPLOAD_FAILED,
				actionSubject: ACTION_SUBJECT.MEDIA,
				actionSubjectId: ACTION_SUBJECT_ID.UPLOAD_MEDIA_FROM_URL,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: { reason },
			});
		},
		[dispatchAnalyticsEvent],
	);

	return React.useMemo(
		() => ({ onUploadAnalytics, onUploadSuccessAnalytics, onUploadFailureAnalytics }),
		[onUploadAnalytics, onUploadSuccessAnalytics, onUploadFailureAnalytics],
	);
}
