import { Fragment } from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';

import type { Command } from '../types';

export function insertNewLine(): Command {
	return function (state, dispatch) {
		const { $from } = state.selection;
		const parent = $from.parent;
		const { hardBreak } = state.schema.nodes;

		if (hardBreak) {
			const hardBreakNode = hardBreak.createChecked();

			if (parent && parent.type.validContent(Fragment.from(hardBreakNode))) {
				if (dispatch) {
					dispatch(state.tr.replaceSelectionWith(hardBreakNode, false));
				}
				return true;
			}
		}

		if (state.selection instanceof TextSelection) {
			if (dispatch) {
				dispatch(state.tr.insertText('\n'));
			}
			return true;
		}

		return false;
	};
}
