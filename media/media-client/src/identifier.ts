import deepEqual from 'deep-equal';

export type Identifier = FileIdentifier | ExternalImageIdentifier;

export interface FileIdentifier {
  readonly mediaItemType: 'file';
  readonly id: string | Promise<string>;
  readonly occurrenceKey?: string;
  readonly collectionName?: string; // files can exist outside of a collection
}

export interface ExternalImageIdentifier {
  readonly mediaItemType: 'external-image';
  readonly dataURI: string;
  readonly name?: string;
}
export const isFileIdentifier = (
  identifier: Identifier,
): identifier is FileIdentifier => {
  return identifier.mediaItemType === 'file';
};

export const isExternalImageIdentifier = (
  identifier: Identifier,
): identifier is ExternalImageIdentifier => {
  return identifier.mediaItemType === 'external-image';
};

export const isDifferentIdentifier = (
  a: Identifier,
  b: Identifier,
): boolean => {
  if (isFileIdentifier(a) && isFileIdentifier(b)) {
    return (
      a.id !== b.id ||
      a.collectionName !== b.collectionName ||
      a.occurrenceKey !== b.occurrenceKey
    );
  } else {
    return !deepEqual(a, b);
  }
};
