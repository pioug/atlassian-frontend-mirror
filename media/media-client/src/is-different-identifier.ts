import deepEqual from 'deep-equal';

import type { Identifier } from './identifier';
import { isFileIdentifier } from './is-file-identifier';

export const isDifferentIdentifier = (a: Identifier, b: Identifier): boolean => {
	if (isFileIdentifier(a) && isFileIdentifier(b)) {
		return (
			a.id !== b.id || a.collectionName !== b.collectionName || a.occurrenceKey !== b.occurrenceKey
		);
	} else {
		return !deepEqual(a, b);
	}
};
