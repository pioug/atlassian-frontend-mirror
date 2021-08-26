import { isFileIdentifier, Identifier } from '@atlaskit/media-client';

export const getIdentifierCollection = (
  identifier: Identifier,
  defaultCollectionName: string,
): string | undefined =>
  isFileIdentifier(identifier)
    ? identifier.collectionName || defaultCollectionName
    : undefined;
