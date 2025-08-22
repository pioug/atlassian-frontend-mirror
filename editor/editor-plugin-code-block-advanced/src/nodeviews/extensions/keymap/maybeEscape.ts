import { type EditorView as CodeMirror } from '@codemirror/view';

import { RelativeSelectionPos } from '@atlaskit/editor-common/selection';
import type { getPosHandlerNode } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Selection } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

interface MaybeEscapeProps {
	cm: CodeMirror;
	dir: -1 | 1;
	getNode: () => PMNode;
	getPos: getPosHandlerNode;
	onMaybeNodeSelection: () => void;
	selectCodeBlockNode: (relativeSelectionPos: RelativeSelectionPos | undefined) => void;
	unit: 'line' | 'char';
	view: EditorView;
}

export const maybeEscapeKeymap = ({
	unit,
	dir,
	view,
	cm,
	getPos,
	getNode,
	onMaybeNodeSelection,
	selectCodeBlockNode,
}: MaybeEscapeProps): boolean => {
	if (unit === 'char') {
		onMaybeNodeSelection();
	}
	const node = getNode();
	const { state } = cm;
	let main: { empty: boolean; from: number; head: number; to: number; } = state.selection.main;
	if (!main.empty) {
		return false;
	}
	if (unit === 'line') {
		main = { ...state.doc.lineAt(main.head), head: 0, empty: false };
	}
	if (dir < 0 ? main.from > 0 : main.to < state.doc.length) {
		return false;
	}
	const targetPos = (getPos?.() ?? 0) + (dir < 0 ? 0 : node.nodeSize);
	if (unit === 'char') {
		view.focus();
		selectCodeBlockNode(dir === -1 ? RelativeSelectionPos.Start : RelativeSelectionPos.End);
		return true;
	} else {
		createParagraphIfEndOfDoc(view, targetPos);
		const tr = view.state.tr;
		const selection = Selection.near(tr.doc.resolve(targetPos), dir);

		tr.setSelection(selection).scrollIntoView();
		view.dispatch(tr);
		view.focus();
		return true;
	}
};

const createParagraphIfEndOfDoc = (view: EditorView, targetPos: number) => {
	if (targetPos === view.state.doc.content.size) {
		const paragraph = view.state.schema.nodes.paragraph.createChecked({});
		const tr = view.state.tr.insert(targetPos, paragraph);
		// Note: we purposefully do a multi-dispatch here, otherwise we get stuck in codemirror
		view.dispatch(tr);
	}
};
