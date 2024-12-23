import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type Transaction } from '@atlaskit/editor-prosemirror/state';

import { type BlockControlsPlugin } from '../../blockControlsPluginType';

export const fireMoveNodeAnalytics = (
	tr: Transaction,
	inputMethod: string,
	fromDepth: number,
	fromNodeType: string,
	toDepth?: number,
	toNodeType?: string,
	isSameParent?: boolean,
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
) => {
	return api?.analytics?.actions?.attachAnalyticsEvent({
		eventType: EVENT_TYPE.TRACK,
		action: ACTION.MOVED,
		actionSubject: ACTION_SUBJECT.ELEMENT,
		actionSubjectId: ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
		attributes: {
			nodeDepth: fromDepth,
			nodeType: fromNodeType,
			destinationNodeDepth: toDepth,
			destinationNodeType: toNodeType,
			isSameParent: isSameParent,
			inputMethod,
		},
	})(tr);
};

export const fireInsertLayoutAnalytics = (
	tr: Transaction,
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
) => {
	api?.analytics?.actions?.attachAnalyticsEvent({
		action: ACTION.INSERTED,
		actionSubject: ACTION_SUBJECT.DOCUMENT,
		actionSubjectId: ACTION_SUBJECT_ID.LAYOUT,
		attributes: {
			inputMethod: INPUT_METHOD.DRAG_AND_DROP,
		},
		eventType: EVENT_TYPE.TRACK,
	})(tr);
};
