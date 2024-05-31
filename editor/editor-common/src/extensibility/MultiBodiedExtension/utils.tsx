import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';

import { ACTION_SUBJECT, EVENT_TYPE } from '../../analytics';
import type { ACTION, AnalyticsDispatch } from '../../analytics';
import type { EventDispatcher } from '../../event-dispatcher';
import { createDispatch } from '../../event-dispatcher';
import { analyticsEventKey } from '../../utils';

type AnalyticsActionTypes =
	| ACTION.ADD_CHILD
	| ACTION.CHANGE_ACTIVE
	| ACTION.DELETED
	| ACTION.REMOVE_CHILD
	| ACTION.UPDATE_PARAMETERS
	| ACTION.GET_CHILDERN;

export const sendMBEAnalyticsEvent = (
	action: AnalyticsActionTypes,
	node: PmNode,
	eventDispatcher: EventDispatcher,
) => {
	const analyticsDispatch: AnalyticsDispatch = createDispatch(eventDispatcher);
	analyticsDispatch(analyticsEventKey, {
		payload: {
			action,
			actionSubject: ACTION_SUBJECT.MULTI_BODIED_EXTENSION,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				extensionType: node.attrs.extensionType,
				extensionKey: node.attrs.extensionKey,
				localId: node.attrs.localId,
				currentFramesCount: node.content.childCount,
			},
		},
	});
};
