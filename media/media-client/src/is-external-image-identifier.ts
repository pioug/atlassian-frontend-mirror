import type { ExternalImageIdentifier, Identifier } from './identifier';

export const isExternalImageIdentifier = (
	identifier: Identifier,
): identifier is ExternalImageIdentifier => {
	return identifier.mediaItemType === 'external-image';
};
