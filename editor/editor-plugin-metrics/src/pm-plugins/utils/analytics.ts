import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	type ActiveSessionEventPayload,
	type ActiveSessionEventAttributes,
} from '@atlaskit/editor-common/analytics';
import { Fragment } from '@atlaskit/editor-prosemirror/model';

import type { MetricsState } from '../main';

import { getNodeChanges } from './get-node-changes';

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
	currentContent,
	pluginState,
}: {
	currentContent: Fragment;
	pluginState: MetricsState;
}): ActiveSessionEventPayload => {
	const nodeChanges = getNodeChanges({ currentContent, pluginState });

	let nodeInsertionCount = 0;
	let nodeDeletionCount = 0;

	Object.entries(nodeChanges).forEach(([_, change]) => {
		if (change > 0) {
			nodeInsertionCount += change;
		} else if (change < 0) {
			nodeDeletionCount += Math.abs(change);
		}
	});

	return {
		action: ACTION.ENDED,
		actionSubject: ACTION_SUBJECT.ACTIVITY_SESSION,
		actionSubjectId: ACTION_SUBJECT_ID.ACTIVITY,
		attributes: {
			efficiency: {
				totalActiveTime: pluginState.activeSessionTime,
				totalActionCount: pluginState.totalActionCount,
				actionByTypeCount: {
					...(pluginState.actionTypeCount ?? {}),
					nodeDeletionCount,
					nodeInsertionCount,
				},
			},
			effectiveness: {
				undoCount: pluginState.actionTypeCount.undoCount,
				repeatedActionCount: 0,
				safeInsertCount: 0,
			},
			contentSizeChanged: pluginState.contentSizeChanged,
		},
		eventType: EVENT_TYPE.TRACK,
	};
};
