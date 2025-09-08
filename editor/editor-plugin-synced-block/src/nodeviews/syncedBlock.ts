import type { getPosHandler, getPosHandlerNode } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

class SyncedBlockNodeView {
	node: PMNode;
	view: EditorView;
	getPos: getPosHandlerNode;

	constructor(node: PMNode, view: EditorView, getPos: getPosHandlerNode) {
		this.node = node;
		this.view = view;
		this.getPos = getPos;
	}
}

export const getSyncedBlockNodeView =
	() =>
	(node: PMNode, view: EditorView, getPos: getPosHandler): SyncedBlockNodeView => {
		return new SyncedBlockNodeView(node, view, getPos as getPosHandlerNode);
	};
