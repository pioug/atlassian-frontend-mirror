import { transferCodeBlockWrappedValue } from '@atlaskit/editor-common/code-block';
import type { BreakoutMode, Command } from '@atlaskit/editor-common/types';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';

import { findSupportedNodeForBreakout } from '../pm-plugins/utils/find-breakout-node';
import { updateExpandedState } from '../pm-plugins/utils/single-player-expand';

export function setBreakoutMode(mode: BreakoutMode, isLivePage?: boolean): Command {
	return (state, dispatch) => {
		const node = findSupportedNodeForBreakout(state.selection);

		if (!node) {
			return false;
		}
		const tr = state.tr.setNodeMarkup(node.pos, node.node.type, node.node.attrs, [
			state.schema.marks.breakout.create({ mode }),
		]);

		if (node.node.type === state.schema.nodes.expand) {
			updateExpandedState(tr, node, isLivePage);
		} else if (
			!fg('editor_code_block_wrapping_language_change_bug') &&
			node.node.type === state.schema.nodes.codeBlock
		) {
			const newNode = tr.doc.nodeAt(node.pos);
			const oldNode = node.node;
			if (newNode) {
				transferCodeBlockWrappedValue(oldNode, newNode);
			}
		}

		tr.setMeta('scrollIntoView', false);

		if (state.selection instanceof NodeSelection) {
			if (state.selection.$anchor.pos === node.pos) {
				tr.setSelection(NodeSelection.create(tr.doc, node.pos));
			}
		}

		if (dispatch) {
			dispatch(tr);
		}

		return true;
	};
}
