import { isFileIdentifier } from '@atlaskit/media-client';
import type { Identifier } from '@atlaskit/media-client/identifier';

export const getIdentifierCollection = (
	identifier: Identifier,
	defaultCollectionName: string,
): string | undefined =>
	isFileIdentifier(identifier) ? identifier.collectionName || defaultCollectionName : undefined;
