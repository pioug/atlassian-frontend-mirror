import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics/types/enums';
// oxlint-disable-next-line import/no-duplicates
import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics/types/events';
import type { Command } from '@atlaskit/editor-common/types/command';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';

import type { HighlightPlugin } from '../highlightPluginType';
import { HighlightPluginAction, highlightPluginKey } from '../pm-plugins/main';

export const togglePalette =
	(api: ExtractInjectionAPI<HighlightPlugin>) =>
	({ inputMethod }: { inputMethod: INPUT_METHOD }): Command =>
	(state, dispatch) => {
		const isPaletteOpen = highlightPluginKey.getState(state)?.isPaletteOpen;

		return setPalette(api)({ isPaletteOpen: !isPaletteOpen, inputMethod })(state, dispatch);
	};

export const setPalette =
	(api: ExtractInjectionAPI<HighlightPlugin>) =>
	({
		isPaletteOpen,
		inputMethod,
	}: {
		inputMethod: INPUT_METHOD;
		isPaletteOpen: boolean;
	}): Command =>
	(state, dispatch) => {
		const isDisabled = highlightPluginKey.getState(state)?.disabled;

		if (!isDisabled) {
			const tr = state.tr;
			tr.setMeta(highlightPluginKey, {
				type: HighlightPluginAction.SET_PALETTE,
				isPaletteOpen,
			});
			api.analytics?.actions.attachAnalyticsEvent(createAnalyticsEvent(isPaletteOpen, inputMethod))(
				tr,
			);
			tr.setMeta('addToHistory', false);
			if (dispatch) {
				dispatch(tr);
			}
			return true;
		}
		return false;
	};

const createAnalyticsEvent = (
	isPaletteOpen: boolean,
	inputMethod: INPUT_METHOD,
): AnalyticsEventPayload => {
	return {
		action: isPaletteOpen ? ACTION.OPENED : ACTION.CLOSED,
		actionSubject: ACTION_SUBJECT.TOOLBAR,
		actionSubjectId: ACTION_SUBJECT_ID.FORMAT_BACKGROUND_COLOR,
		eventType: EVENT_TYPE.TRACK,
		attributes: {
			inputMethod,
		},
	};
};
