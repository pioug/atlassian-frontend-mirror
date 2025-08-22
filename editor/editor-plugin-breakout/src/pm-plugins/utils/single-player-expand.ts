import { expandedState } from '@atlaskit/editor-common/expand';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

interface UpdateExpandedStateNew {
	isLivePage?: boolean;
	node: PMNode;
	pos: number;
	tr: Transaction;
}

export const updateExpandedStateNew = ({ tr, node, pos, isLivePage }: UpdateExpandedStateNew) => {
	if (isLivePage || fg('platform-editor-single-player-expand')) {
		const wasExpandExpanded = expandedState.get(node);
		const newExpand = tr.doc.nodeAt(pos);
		if (wasExpandExpanded !== undefined && newExpand) {
			expandedState.set(newExpand, wasExpandExpanded);
		}
	}
};

export const updateExpandedState = (
	tr: Transaction,
	node: ContentNodeWithPos,
	isLivePage?: boolean,
) => {
	if (editorExperiment('platform_editor_breakout_resizing', true)) {
		updateExpandedStateNew({ tr, node: node.node, pos: node.pos, isLivePage });
	} else {
		if (isLivePage || fg('platform-editor-single-player-expand')) {
			const wasExpandExpanded = expandedState.get(node.node);
			const newExpand = tr.doc.nodeAt(node.pos);
			if (wasExpandExpanded !== undefined && newExpand) {
				expandedState.set(newExpand, wasExpandExpanded);
			}
		}
	}
};
