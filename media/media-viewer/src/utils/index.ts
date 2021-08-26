import {
  FileIdentifier,
  Identifier,
  isFileIdentifier,
  MediaCollectionItem,
  MediaType,
  getMediaTypeFromMimeType,
} from '@atlaskit/media-client';
import { getType } from 'mime';

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
  return items.findIndex((item) => {
    if (isFileIdentifier(item) && isFileIdentifier(selectedItem)) {
      return item.id === selectedItem.id;
    }

    if (!isFileIdentifier(item) && !isFileIdentifier(selectedItem)) {
      return item.dataURI === selectedItem.dataURI;
    }

    return false;
  });
};

export const getMediaTypeFromFilename = (filename: string): MediaType => {
  const mimeType = getMimeTypeFromFilename(filename);
  return getMediaTypeFromMimeType(mimeType);
};

export const getMimeTypeFromFilename = (filename: string): string => {
  const extension = filename.split('.').pop();
  if (!extension) {
    return '';
  }

  const mimeType = getType(extension);
  if (!mimeType) {
    return '';
  }

  return mimeType;
};

export const getFolderParent = (path: string): string => {
  const pathParts = path.substring(0, path.length - 1).split('/');
  pathParts.pop();
  const parent = pathParts.pop();

  if (!parent) {
    return ''; // root
  }

  return parent + '/';
};

export const extractArchiveFolderName = (folderName: string): string => {
  const index = folderName.lastIndexOf('.');
  return index > -1 ? folderName.substring(0, index) + '/' : folderName + '/';
};

export const getFormattedFolderName = (folderName: string): string => {
  // We assume name ends with '/' unless it is the root directory
  if (folderName === '') {
    return '';
  }

  const name = folderName.substring(0, folderName.length - 1);
  const index = name.lastIndexOf('/');
  if (index === -1) {
    return name;
  }
  return name.substring(index + 1);
};

export const isMacPrivateFile = (fileName: string): boolean => {
  return fileName.startsWith('__MACOSX') || fileName.includes('.DS_Store');
};

export const rejectAfter = <T>(
  fn: () => Promise<T>,
  delay = 5000,
): Promise<T> => {
  return new Promise<T>(async (resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error('timed out')), delay);

    try {
      resolve(await fn());
    } catch (error) {
      reject(error);
    } finally {
      clearTimeout(timeoutId);
    }
  });
};
