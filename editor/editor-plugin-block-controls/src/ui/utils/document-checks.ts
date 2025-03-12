import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export const isNestedNodeSelected = (view: EditorView) => {
	const selection = view.state.selection;
	return selection instanceof NodeSelection && selection.$from.depth > 1;
};

export const isSelectionInNode = (start: number, view: EditorView) => {
	const node = view.state.doc.nodeAt(start);
	if (node === null) {
		return false;
	}
	const endPos = start + node.nodeSize;
	const startPos = start;
	const { $from, $to } = view.state.selection;

	return $from.pos >= startPos && endPos >= $to.pos;
};

export const isNonEditableBlock = (start: number, view: EditorView) => {
	const node = view.state.doc.nodeAt(start);
	if (node === null) {
		return false;
	}

	// We want to treat some elements as if they are non-editable blocks for
	// the purposes of quick insert.
	switch (node.type.name) {
		// mediaSingle and mediaGroup always contain a media child node, which is
		// both a block and an atom. mediaSingle can also have a caption child node
		// which is an editable block.
		case 'mediaGroup':
		case 'mediaSingle':
			return true;
	}

	return node.isBlock && (node.isAtom || node.isLeaf);
};
