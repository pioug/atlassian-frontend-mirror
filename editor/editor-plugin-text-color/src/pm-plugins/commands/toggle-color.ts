import { removeMark, toggleMark } from '@atlaskit/editor-common/mark';
import type { Command } from '@atlaskit/editor-common/types';

import { ACTIONS, pluginKey } from '../main';
import { overrideMarks } from '../utils/constants';
import { getDisabledState } from '../utils/disabled';

export const toggleColor =
	(color: string): Command =>
	(state, dispatch) => {
		const { textColor } = state.schema.marks;

		let tr = state.tr;

		const disabledState = getDisabledState(state);
		if (disabledState) {
			if (dispatch) {
				dispatch(tr.setMeta(pluginKey, { action: ACTIONS.DISABLE }));
			}
			return false;
		}

		if (dispatch) {
			overrideMarks.forEach((mark) => {
				const { marks } = tr.doc.type.schema;
				if (marks[mark]) {
					removeMark(marks[mark])({ tr });
				}
			});

			toggleMark(textColor, { color })({ tr });
			dispatch(tr);
		}
		return true;
	};
