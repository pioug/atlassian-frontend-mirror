import type { EditorAnalyticsAPI, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { Command } from '@atlaskit/editor-common/types';

import { createHorizontalRule } from './input-rule';

export const insertHorizontalRule =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(
		inputMethod:
			| INPUT_METHOD.QUICK_INSERT
			| INPUT_METHOD.TOOLBAR
			| INPUT_METHOD.INSERT_MENU
			| INPUT_METHOD.FORMATTING
			| INPUT_METHOD.SHORTCUT,
	): Command =>
	(state, dispatch) => {
		const tr = createHorizontalRule(
			state,
			state.selection.from,
			state.selection.to,
			inputMethod,
			editorAnalyticsAPI,
		);
		if (tr) {
			if (dispatch) {
				dispatch(tr);
			}
			return true;
		}

		return false;
	};
