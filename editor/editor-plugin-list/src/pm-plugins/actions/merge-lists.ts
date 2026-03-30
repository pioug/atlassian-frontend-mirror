import {
	getFirstParagraphBlockMarkAttrs,
	reconcileBlockMarkForContainerAtPos,
} from '@atlaskit/editor-common/lists';
import { isListNode } from '@atlaskit/editor-common/utils';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

type MergeNextListAtPositionProps = {
	listPosition: number;
	tr: Transaction;
};
export function mergeNextListAtPosition({ tr, listPosition }: MergeNextListAtPositionProps): void {
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

	const previousListPosition = pos - nodeBefore.nodeSize;

	if (nodeAfter && nodeAfter.type.name !== nodeBefore?.type.name) {
		tr.setNodeMarkup(previousListPosition, nodeAfter.type);
	}

	tr.join(pos);

	if (
		tr.doc.type.schema.marks.fontSize &&
		expValEquals('platform_editor_small_font_size', 'isEnabled', true)
	) {
		const upperListFontSizeAttrs = getFirstParagraphBlockMarkAttrs(
			nodeBefore,
			tr.doc.type.schema.marks.fontSize,
		);

		reconcileBlockMarkForContainerAtPos(
			tr,
			previousListPosition,
			tr.doc.type.schema.marks.fontSize,
			upperListFontSizeAttrs,
		);
	}
}
