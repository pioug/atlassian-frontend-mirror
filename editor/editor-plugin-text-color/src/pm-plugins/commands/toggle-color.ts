import { removeMark, toggleMark } from '@atlaskit/editor-common/mark';
import { FORMAT_SELECTION_SYNC_META } from '@atlaskit/editor-common/selection';
import type { Command } from '@atlaskit/editor-common/types';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { ACTIONS, pluginKey } from '../main';
import { overrideMarks } from '../utils/constants';
import { getDisabledState } from '../utils/disabled';

export const toggleColor =
	(color: string): Command =>
	(state, dispatch) => {
		const { textColor } = state.schema.marks;

		const tr = state.tr;

		const disabledState = getDisabledState(state);
		if (disabledState) {
			if (dispatch) {
				dispatch(tr.setMeta(pluginKey, { action: ACTIONS.DISABLE }));
			}
			return false;
		}

		if (dispatch) {
			if (!expValEquals('platform_editor_lovability_text_bg_color', 'isEnabled', true)) {
				overrideMarks.forEach((mark) => {
					const { marks } = tr.doc.type.schema;
					if (marks[mark]) {
						removeMark(marks[mark])({ tr });
					}
				});
			}

			toggleMark(textColor, { color })({ tr });

			if (
				tr.docChanged &&
				expValEquals('platform_editor_fix_selection_text_color_change', 'isEnabled', true)
			) {
				tr.setMeta(FORMAT_SELECTION_SYNC_META, true);
			}

			dispatch(tr);
		}
		return true;
	};
