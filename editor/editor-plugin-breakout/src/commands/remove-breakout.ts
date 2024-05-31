import type { Command } from '@atlaskit/editor-common/types';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';

import { findSupportedNodeForBreakout } from '../utils/find-breakout-node';
import { updateExpandedState } from '../utils/single-player-expand';

export function removeBreakout(isLivePage?: boolean): Command {
	return (state, dispatch) => {
		const node = findSupportedNodeForBreakout(state.selection);

		if (!node) {
			return false;
		}

		const marks = node.node.marks.filter((m) => m.type.name !== 'breakout');
		const tr = state.tr.setNodeMarkup(node.pos, node.node.type, node.node.attrs, marks);

		updateExpandedState(tr, node, isLivePage);

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
