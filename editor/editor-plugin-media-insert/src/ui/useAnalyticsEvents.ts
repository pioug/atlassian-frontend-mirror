import React from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	type DispatchAnalyticsEvent,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';

type Source = 'local' | 'url';

export function useAnalyticsEvents(dispatchAnalyticsEvent?: DispatchAnalyticsEvent) {
	const onUploadButtonClickedAnalytics = React.useCallback(() => {
		dispatchAnalyticsEvent?.({
			action: ACTION.CLICKED,
			actionSubject: ACTION_SUBJECT.BUTTON,
			actionSubjectId: ACTION_SUBJECT_ID.UPLOAD_MEDIA,
			eventType: EVENT_TYPE.UI,
		});
	}, [dispatchAnalyticsEvent]);

	const onUploadCommencedAnalytics = React.useCallback(
		(mediaUploadSource: Source) => {
			dispatchAnalyticsEvent?.({
				action: ACTION.UPLOAD_COMMENCED,
				actionSubject: ACTION_SUBJECT.MEDIA,
				actionSubjectId: ACTION_SUBJECT_ID.UPLOAD_MEDIA,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: { mediaUploadSource },
			});
		},
		[dispatchAnalyticsEvent],
	);

	const onUploadSuccessAnalytics = React.useCallback(
		(mediaUploadSource: Source) => {
			dispatchAnalyticsEvent?.({
				action: ACTION.UPLOAD_SUCCEEDED,
				actionSubject: ACTION_SUBJECT.MEDIA,
				actionSubjectId: ACTION_SUBJECT_ID.UPLOAD_MEDIA,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: { mediaUploadSource },
			});
		},
		[dispatchAnalyticsEvent],
	);

	const onUploadFailureAnalytics = React.useCallback(
		(reason: string, mediaUploadSource: Source) => {
			dispatchAnalyticsEvent?.({
				action: ACTION.UPLOAD_FAILED,
				actionSubject: ACTION_SUBJECT.MEDIA,
				actionSubjectId: ACTION_SUBJECT_ID.UPLOAD_MEDIA,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: { reason, mediaUploadSource },
			});
		},
		[dispatchAnalyticsEvent],
	);

	return React.useMemo(
		() => ({
			onUploadButtonClickedAnalytics,
			onUploadCommencedAnalytics,
			onUploadSuccessAnalytics,
			onUploadFailureAnalytics,
		}),
		[
			onUploadButtonClickedAnalytics,
			onUploadCommencedAnalytics,
			onUploadSuccessAnalytics,
			onUploadFailureAnalytics,
		],
	);
}
