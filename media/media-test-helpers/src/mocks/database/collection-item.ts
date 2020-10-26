import * as uuid from 'uuid';
import {
  MediaType,
  MediaCollectionItem,
  MediaFileProcessingStatus,
} from '@atlaskit/media-client';
import {
  getHackerNoun,
  getPastDate,
  fakeImage,
  getFakeFileName,
  getTextFileType,
} from '../../utils/mockData';

import { mapDataUriToBlob } from '../../utils';

export type CollectionItem = MediaCollectionItem & {
  readonly collectionName?: string;
  readonly blob?: Blob;
};

export type CreateCollectionItemOptions = {
  readonly name?: string;
  readonly mediaType?: MediaType;
  readonly mimeType?: string;
  readonly collectionName?: string;
  readonly occurrenceKey?: string;
  readonly blob?: Blob;
  readonly id?: string;
  readonly processingStatus?: MediaFileProcessingStatus;
};

export function createEmptyCollectionItem({
  id,
  collectionName,
  occurrenceKey,
}: CreateCollectionItemOptions): CollectionItem {
  return {
    id: id || uuid.v4(),
    insertedAt: getPastDate().valueOf(),
    occurrenceKey: occurrenceKey || uuid.v4(),
    collectionName: collectionName || getHackerNoun(),
    details: {
      name: '',
      size: 0,
    },
  };
}

export function createCollectionItem({
  name,
  mediaType,
  mimeType,
  collectionName,
  occurrenceKey,
  blob = new Blob(['Hello World'], { type: 'text/plain' }),
  id,
  processingStatus = 'succeeded',
}: CreateCollectionItemOptions = {}): CollectionItem {
  const extension = getTextFileType();
  return {
    id: id || uuid.v4(),
    insertedAt: getPastDate().valueOf(),
    occurrenceKey: occurrenceKey || uuid.v4(),
    details: {
      name: name || getFakeFileName(extension),
      size: blob.size,
      mimeType,
      mediaType,
      artifacts: {},
      processingStatus,
      representations:
        processingStatus === 'succeeded'
          ? {
              image: {},
            }
          : {},
    },
    collectionName: collectionName || getHackerNoun(),
    blob: blob || mapDataUriToBlob(fakeImage),
  };
}
