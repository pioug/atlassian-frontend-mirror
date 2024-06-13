import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { Command, ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import { type HighlightPlugin } from '../plugin';
import { HighlightPluginAction, highlightPluginKey } from '../pm-plugins/main';

export const setPalette =
	(api: ExtractInjectionAPI<HighlightPlugin>, isPaletteOpen: boolean): Command =>
	(state, dispatch) => {
		const isDisabled = highlightPluginKey.getState(state)?.disabled;

		if (!isDisabled) {
			const tr = state.tr;
			api.analytics?.actions.attachAnalyticsEvent(createAnalyticsEvent(isPaletteOpen))(tr);
			tr.setMeta(highlightPluginKey, {
				type: HighlightPluginAction.TOGGLE_PALETTE,
				isPaletteOpen,
			});
			if (dispatch) {
				dispatch(tr);
			}
			return true;
		}
		return false;
	};

const createAnalyticsEvent = (isOpen: boolean): AnalyticsEventPayload => {
	return {
		action: isOpen ? ACTION.OPENED : ACTION.CLOSED,
		actionSubject: ACTION_SUBJECT.TOOLBAR,
		actionSubjectId: ACTION_SUBJECT_ID.FORMAT_BACKGROUND_COLOR,
		eventType: EVENT_TYPE.TRACK,
		attributes: {
			inputMethod: INPUT_METHOD.TOOLBAR,
		},
	};
};
