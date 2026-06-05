import clamp from 'lodash/clamp';

import type { ReadonlyTransaction, Transaction } from '@atlaskit/editor-prosemirror/state';

export const getStepRange = (
	transaction: Transaction | ReadonlyTransaction,
): { from: number; to: number } | null => {
	let from = -1;
	let to = -1;

	transaction.mapping.maps.forEach((stepMap, index) => {
		stepMap.forEach((oldStart, oldEnd) => {
			const newStart = transaction.mapping.slice(index).map(oldStart, -1);
			const newEnd = transaction.mapping.slice(index).map(oldEnd);

			const docSize = transaction.doc.content.size;
			from = clamp(newStart < from || from === -1 ? newStart : from, 0, docSize);
			to = clamp(newEnd > to || to === -1 ? newEnd : to, 0, docSize);
		});
	});

	if (from !== -1) {
		return { from, to };
	}

	return null;
};
