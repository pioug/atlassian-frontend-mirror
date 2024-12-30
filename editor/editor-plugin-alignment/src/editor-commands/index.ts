import { changeImageAlignment, toggleBlockMark } from '@atlaskit/editor-common/commands';
import type { Command, CommandDispatch } from '@atlaskit/editor-common/types';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { Selection } from '@atlaskit/editor-prosemirror/state';

import type { AlignmentState } from '../pm-plugins/types';

/**
 * Iterates over the commands one after the other,
 * passes the tr through and dispatches the cumulated transaction
 */
function cascadeCommands(cmds: Command[]): Command {
	return (state: EditorState, dispatch?: CommandDispatch) => {
		const { tr: baseTr } = state;
		let shouldDispatch = false;

		const onDispatchAction = (tr: Transaction) => {
			const selectionJSON = tr.selection.toJSON();
			baseTr.setSelection(Selection.fromJSON(baseTr.doc, selectionJSON));
			tr.steps.forEach((st) => {
				baseTr.step(st);
			});
			shouldDispatch = true;
		};

		cmds.forEach((cmd) => cmd(state, onDispatchAction));

		if (dispatch && shouldDispatch) {
			dispatch(baseTr);
			return true;
		}

		return false;
	};
}

export const isAlignable =
	(align?: AlignmentState): Command =>
	(state, dispatch) => {
		const {
			nodes: { paragraph, heading },
			marks: { alignment },
		} = state.schema;
		return toggleBlockMark(
			alignment,
			() => (!align ? undefined : align === 'start' ? false : { align }),
			[paragraph, heading],
		)(state, dispatch);
	};

export const changeAlignment =
	(align?: AlignmentState): Command =>
	(state, dispatch) => {
		const {
			nodes: { paragraph, heading },
			marks: { alignment },
		} = state.schema;

		return cascadeCommands([
			changeImageAlignment(align),
			toggleBlockMark(
				alignment,
				() => (!align ? undefined : align === 'start' ? false : { align }),
				[paragraph, heading],
			),
		])(state, dispatch);
	};
