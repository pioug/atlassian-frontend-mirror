import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags';

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
) => {
	const additionalAttributes = fg('platform_editor_controls_patch_analytics')
		? {
				invocationMethod,
			}
		: {};

	api?.analytics?.actions.fireAnalyticsEvent({
		action: ACTION.CLOSED,
		actionSubject: ACTION_SUBJECT.TYPEAHEAD,
		actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_QUICK_INSERT,
		attributes: {
			inputMethod,
			closeAction,
			hasQuery,
			...additionalAttributes,
		},
		eventType: EVENT_TYPE.TRACK,
	});
};
