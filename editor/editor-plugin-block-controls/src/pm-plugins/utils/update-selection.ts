import { GapCursorSelection, Side } from '@atlaskit/editor-common/selection';
import { TextSelection, type Transaction } from '@atlaskit/editor-prosemirror/state';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';

export const getInsertLayoutStep = (tr: Transaction) =>
	tr.steps.find(
		(step) =>
			step instanceof ReplaceStep &&
			['layoutSection', 'layoutColumn'].includes(step.slice.content.firstChild?.type.name || ''),
	);

export const updateSelection = (tr: Transaction, to: number, insertAtRight?: boolean) => {
	const $to = tr.doc.resolve(to);
	const toNode = $to.nodeAfter;
	let lastNode = toNode?.content.lastChild;
	if (!toNode || !lastNode) {
		return tr;
	}

	let offset = toNode.nodeSize;

	// drop at the start of the layoutSection or to create a new layoutSection
	if (toNode.type.name === 'layoutSection') {
		if (insertAtRight) {
			lastNode = toNode.content.lastChild?.lastChild;
			offset = toNode.nodeSize - 1;
		} else {
			lastNode = toNode.content.firstChild?.lastChild;
			offset = 1 + (toNode.content.firstChild?.nodeSize || 0);
		}
	}

	if (['paragraph', 'heading'].includes(lastNode?.type.name || '')) {
		tr.setSelection(TextSelection.near(tr.doc.resolve(to + offset - 2)));
	} else if (lastNode) {
		tr.setSelection(new GapCursorSelection(tr.doc.resolve(to + offset - 1), Side.RIGHT));
	}

	return tr;
};
