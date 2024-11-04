import { expandedState } from '@atlaskit/editor-common/expand';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags';

export const updateExpandedState = (
	tr: Transaction,
	node: ContentNodeWithPos,
	isLivePage?: boolean,
) => {
	if (isLivePage || fg('platform-editor-single-player-expand')) {
		const wasExpandExpanded = expandedState.get(node.node);
		const newExpand = tr.doc.nodeAt(node.pos);
		if (wasExpandExpanded !== undefined && newExpand) {
			expandedState.set(newExpand, wasExpandExpanded);
		}
	}
};
