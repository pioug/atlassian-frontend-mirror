import { transferCodeBlockWrappedValue } from '@atlaskit/editor-common/code-block';
import type { BreakoutMode, Command } from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags';

import { updateExpandedStateNew } from '../pm-plugins/utils/single-player-expand';

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

		if (node.type === state.schema.nodes.expand) {
			updateExpandedStateNew({ tr, node, pos, isLivePage });
		} else if (node.type === state.schema.nodes.codeBlock) {
			const newNode = tr.doc.nodeAt(pos);
			const oldNode = node;
			if (newNode) {
				transferCodeBlockWrappedValue(oldNode, newNode);
			}
		}

		if (fg('platform_editor_breakout_resizing_hello_release')) {
			tr.setMeta('scrollIntoView', false);
		}

		if (dispatch) {
			dispatch(tr);
		}

		return true;
	};
}
