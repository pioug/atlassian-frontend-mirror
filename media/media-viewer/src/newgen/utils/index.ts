import {
  FileIdentifier,
  Identifier,
  isFileIdentifier,
  MediaCollectionItem,
} from '@atlaskit/media-client';

export const toIdentifier = (
  item: MediaCollectionItem,
  collectionName: string,
): FileIdentifier => {
  return {
    id: item.id,
    mediaItemType: 'file',
    occurrenceKey: item.occurrenceKey,
    collectionName,
  };
};

// TODO MS-1752 - current implementation makes viewer navigation to misbehave
// if passed a file with the same id (with different occurrenceKeys) or with the same dataURI twice
export const getSelectedIndex = (
  items: Identifier[],
  selectedItem: Identifier,
) => {
  return items.findIndex(item => {
    if (isFileIdentifier(item) && isFileIdentifier(selectedItem)) {
      return item.id === selectedItem.id;
    }

    if (!isFileIdentifier(item) && !isFileIdentifier(selectedItem)) {
      return item.dataURI === selectedItem.dataURI;
    }

    return false;
  });
};
