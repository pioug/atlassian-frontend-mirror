import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import { TypeAheadPlugin } from '../typeAheadPluginType';

export type CloseActionType = ACTION.INSERTED | ACTION.CANCELLED | ACTION.VIEW_MORE;
export type InputMethodType = INPUT_METHOD.KEYBOARD | INPUT_METHOD.MOUSE;

export const fireTypeAheadClosedAnalyticsEvent = (
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined,
	closeAction: CloseActionType | null,
	hasQuery: boolean,
	inputMethod: InputMethodType | null,
) => {
	api?.analytics?.actions.fireAnalyticsEvent({
		action: ACTION.CLOSED,
		actionSubject: ACTION_SUBJECT.TYPEAHEAD,
		actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_QUICK_INSERT,
		attributes: {
			inputMethod,
			closeAction,
			hasQuery,
		},
		eventType: EVENT_TYPE.TRACK,
	});
};
