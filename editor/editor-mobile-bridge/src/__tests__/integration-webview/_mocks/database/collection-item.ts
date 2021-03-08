import {
  MediaCollectionItem,
  MediaFileProcessingStatus,
  MediaType,
} from '@atlaskit/media-client';
import { getPastDate } from '../utils';

export type CollectionItem = MediaCollectionItem & {
  readonly collectionName?: string;
  readonly blob?: Blob;
};

export type CreateCollectionItemOptions = {
  readonly name: string;
  readonly mimeType: string;
  readonly mediaType: MediaType;
  readonly collectionName: string;
  readonly occurrenceKey: string;
  readonly blob: Blob;
  readonly id: string;
  readonly processingStatus?: MediaFileProcessingStatus;
};

export function createCollectionItem(
  options?: CreateCollectionItemOptions,
): CollectionItem | undefined {
  if (!options) {
    return;
  }
  const {
    name,
    mimeType,
    collectionName,
    occurrenceKey,
    blob,
    id,
    processingStatus,
    mediaType,
  } = options;
  return {
    id,
    insertedAt: getPastDate().valueOf(),
    occurrenceKey,
    details: {
      name,
      size: blob.size,
      mimeType,
      mediaType: mediaType || 'image',
      artifacts: {},
      processingStatus,
      representations: {
        image: {},
      },
    },
    collectionName,
    blob,
  };
}
