import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	type ActiveSessionEventPayload,
} from '@atlaskit/editor-common/analytics';
import { Fragment } from '@atlaskit/editor-prosemirror/model';

import type { MetricsState } from '../main';

import { getNodeChanges } from './get-node-changes';

export const getAnalyticsPayload = ({
	currentContent,
	pluginState,
}: {
	currentContent: Fragment;
	pluginState: MetricsState;
}): ActiveSessionEventPayload => {
	const nodeChanges = getNodeChanges({ currentContent, pluginState });

	const getActionCountByTypeSum = () => {
		let actionCountByTypeSum = 0;
		Object.entries(pluginState.actionTypeCount).forEach(([_actionType, count]) => {
			actionCountByTypeSum += count;
		});

		return pluginState.totalActionCount - actionCountByTypeSum;
	};

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
					other: getActionCountByTypeSum(),
				},
			},
			effectiveness: {
				undoCount: pluginState.actionTypeCount.undoCount,
				repeatedActionCount: pluginState.repeatedActionCount,
				safeInsertCount: pluginState.safeInsertCount,
			},
			contentSizeChanged: pluginState.contentSizeChanged,
		},
		eventType: EVENT_TYPE.TRACK,
	};
};
