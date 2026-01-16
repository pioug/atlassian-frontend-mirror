import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export const shiftArrowUpWorkaround = (view: EditorView, event: KeyboardEvent): boolean => {
	const {
		doc,
		selection: { $head, $anchor },
		tr,
		schema: {
			nodes: { codeBlock },
		},
	} = view.state;

	// Position we want to check (directly after our current position)
	const pos = Math.max($head.pos - 1, 1);
	const isNodeBefore = doc.resolve(pos).nodeBefore?.type === codeBlock;
	const maybeProblematicNode = isNodeBefore ? doc.resolve(pos).nodeBefore : doc.resolve(pos).node();

	if (maybeProblematicNode?.type === codeBlock) {
		const nodeSize = maybeProblematicNode.nodeSize;
		const startPos = isNodeBefore ? pos : $head.pos;

		tr.setSelection(TextSelection.create(doc, $anchor.pos, Math.max(startPos - nodeSize, 0)));
		view.dispatch(tr);
		event.preventDefault();
		return true;
	}
	return false;
};

export const shiftArrowDownWorkaround = (view: EditorView, event: KeyboardEvent): boolean => {
	const {
		doc,
		selection: { $head, $anchor },
		tr,
		schema: {
			nodes: { codeBlock },
		},
	} = view.state;

	// Position we want to check (directly after our current position)
	const pos = $head.pos + 1;
	const isNodeAfter = doc.resolve(pos).nodeAfter?.type === codeBlock;
	const maybeProblematicNode = isNodeAfter ? doc.resolve(pos).nodeAfter : doc.resolve(pos).node();

	if (maybeProblematicNode?.type === codeBlock) {
		const nodeSize = maybeProblematicNode.nodeSize;
		const startPos = isNodeAfter ? pos : $head.pos;

		tr.setSelection(
			TextSelection.create(doc, $anchor.pos, Math.min(startPos + nodeSize, doc.content.size)),
		);
		view.dispatch(tr);
		event.preventDefault();
		return true;
	}
	return false;
};
