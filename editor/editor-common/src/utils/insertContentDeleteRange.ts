import type { Fragment, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { TextSelection, type Transaction } from '@atlaskit/editor-prosemirror/state';

export const insertContentDeleteRange = (
	tr: Transaction,
	getSelectionResolvedPos: (tr: Transaction) => ResolvedPos,
	insertions: [Fragment, number][],
	deletions: [number, number][],
): void => {
	insertions.forEach((contentInsert) => {
		const [content, pos] = contentInsert;

		tr.insert(tr.mapping.map(pos), content);
	});

	deletions.forEach((deleteRange) => {
		const [firstPos, lastPos] = deleteRange;

		tr.delete(tr.mapping.map(firstPos), tr.mapping.map(lastPos));
	});

	tr.setSelection(new TextSelection(getSelectionResolvedPos(tr)));
};
