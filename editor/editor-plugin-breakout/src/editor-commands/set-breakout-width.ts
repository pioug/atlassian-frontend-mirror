import type { BreakoutMode, Command } from '@atlaskit/editor-common/types';

// TODO: ED-28029 - add fixes for expands and codeblocks
export function setBreakoutWidth(
	width: number,
	mode: BreakoutMode,
	pos: number,
	isLivePage?: boolean,
): Command {
	return (state, dispatch) => {
		const node = state.doc.nodeAt(pos);
		if (!node) {
			return false;
		}

		const tr = state.tr.setNodeMarkup(pos, node.type, node.attrs, [
			state.schema.marks.breakout.create({ width, mode }),
		]);

		if (dispatch) {
			dispatch(tr);
		}

		return true;
	};
}
