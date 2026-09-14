import { type Identifier } from '@atlaskit/media-client';

import { isSameIdentifier } from './isSameIdentifier';

// TODO MS-1752 - current implementation makes viewer navigation to misbehave
// if passed a file with the same id (with different occurrenceKeys) or with the same dataURI twice
export const getSelectedIndex = (items: Identifier[], selectedItem: Identifier): number => {
	return items.findIndex((item) => isSameIdentifier(item, selectedItem));
};
