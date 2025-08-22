import { type EditorView as CodeMirror } from '@codemirror/view';

import type { getPosHandlerNode } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

interface BackspaceProps {
	cm: CodeMirror;
	getNode: () => PMNode;
	getPos: getPosHandlerNode;
	view: EditorView;
}

export const backspaceKeymap = ({ cm, view, getPos, getNode }: BackspaceProps) => {
	const ranges = cm.state.selection.ranges;

	if (ranges.length > 1) {
		return false;
	}

	const selection = ranges[0];

	if (selection && (!selection.empty || selection.anchor > 0)) {
		return false;
	}

	if (cm.state.doc.lines >= 2) {
		return false;
	}

	const state = view.state;
	const pos = getPos() ?? 0;
	const node = getNode();

	const tr = state.tr.replaceWith(
		pos,
		pos + node.nodeSize,
		state.schema.nodes.paragraph.createChecked({}, node.content),
	);

	tr.setSelection(TextSelection.near(tr.doc.resolve(pos)));

	view.dispatch(tr);
	view.focus();
	return true;
};
