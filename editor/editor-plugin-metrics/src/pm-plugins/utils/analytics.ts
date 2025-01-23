import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	type ActiveSessionEventPayload,
	type ActiveSessionEventAttributes,
} from '@atlaskit/editor-common/analytics';

import type { MetricsState } from '../main';

type Props = {
	pluginState: MetricsState;
	contentSizeChanged: number;
};

export const getPayloadAttributes = ({
	pluginState,
	contentSizeChanged,
}: Props): ActiveSessionEventAttributes => ({
	efficiency: {
		totalActiveTime: pluginState.activeSessionTime,
		totalActionCount: pluginState.totalActionCount,
		actionByTypeCount: pluginState.actionTypeCount,
	},
	effectiveness: {
		undoCount: pluginState.actionTypeCount.undoCount,
		repeatedActionCount: 0,
		safeInsertCount: 0,
	},
	contentSizeChanged,
});

export const getAnalyticsPayload = ({
	pluginState,
}: {
	pluginState: MetricsState;
}): ActiveSessionEventPayload => ({
	action: ACTION.ENDED,
	actionSubject: ACTION_SUBJECT.ACTIVITY_SESSION,
	actionSubjectId: ACTION_SUBJECT_ID.ACTIVITY,
	attributes: {
		efficiency: {
			totalActiveTime: pluginState.activeSessionTime,
			totalActionCount: pluginState.totalActionCount,
			actionByTypeCount: pluginState.actionTypeCount,
		},
		effectiveness: {
			undoCount: pluginState.actionTypeCount.undoCount,
			repeatedActionCount: 0,
			safeInsertCount: 0,
		},
		contentSizeChanged: pluginState.contentSizeChanged,
	},
	eventType: EVENT_TYPE.TRACK,
});
