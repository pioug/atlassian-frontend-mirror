import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	type INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { TypeAheadPlugin } from '../typeAheadPluginType';
import type { TypeAheadInputMethod } from '../types';

export type CloseActionType = ACTION.INSERTED | ACTION.CANCELLED | ACTION.VIEW_MORE;
export type InputMethodType = INPUT_METHOD.KEYBOARD | INPUT_METHOD.MOUSE;

export const fireTypeAheadClosedAnalyticsEvent = (
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined,
	closeAction: CloseActionType | null,
	hasQuery: boolean,
	inputMethod: InputMethodType | null,
	invocationMethod: TypeAheadInputMethod | null = null,
): void => {
	api?.analytics?.actions.fireAnalyticsEvent({
		action: ACTION.CLOSED,
		actionSubject: ACTION_SUBJECT.TYPEAHEAD,
		actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_QUICK_INSERT,
		attributes: {
			inputMethod,
			closeAction,
			hasQuery,
			invocationMethod,
		},
		eventType: EVENT_TYPE.TRACK,
	});
};
