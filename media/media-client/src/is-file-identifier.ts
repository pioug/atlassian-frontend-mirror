import type { FileIdentifier, Identifier } from './identifier';

export const isFileIdentifier = (identifier: Identifier): identifier is FileIdentifier => {
	return identifier.mediaItemType === 'file';
};
