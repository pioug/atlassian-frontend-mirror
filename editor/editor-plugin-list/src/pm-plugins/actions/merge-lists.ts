import { isListNode } from '@atlaskit/editor-common/utils';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

type MergeNextListAtPositionProps = {
	listPosition: number;
	tr: Transaction;
};
export function mergeNextListAtPosition({ tr, listPosition }: MergeNextListAtPositionProps) {
	const listNodeAtPosition = tr.doc.nodeAt(listPosition);
	if (!isListNode(listNodeAtPosition)) {
		return;
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const listPositionResolved = tr.doc.resolve(listPosition + listNodeAtPosition!.nodeSize);

	const { pos, nodeAfter, nodeBefore } = listPositionResolved;
	if (!isListNode(nodeBefore) || !isListNode(nodeAfter)) {
		return;
	}

	if (nodeAfter?.type.name !== nodeBefore?.type.name) {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const previousListPosition = pos - nodeBefore!.nodeSize;
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		tr.setNodeMarkup(previousListPosition, nodeAfter!.type);
	}

	tr.join(pos);
}
