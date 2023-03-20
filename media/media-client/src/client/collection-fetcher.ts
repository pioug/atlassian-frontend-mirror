import { ReplaySubject } from 'rxjs/ReplaySubject';
import { getFileStreamsCache } from '../file-streams-cache';
import { FileDetails, FileItem } from '../models/item';
import { MediaCollectionItem } from '../models/media';
import { MediaStore, MediaStoreGetCollectionItemsParams } from './media-store';
import { MediaSubscribable } from '../utils/mediaSubscribable';
import { MediaTraceContext } from '@atlaskit/media-common';
import { DeprecatedError } from '../utils/deprecatedEndpointError';

export interface MediaCollectionFileItemDetails extends FileDetails {
  occurrenceKey: string;
}

export interface MediaCollectionFileItem extends FileItem {
  details: MediaCollectionFileItemDetails;
}

export interface MediaCollection {
  id: string;
  items: Array<MediaCollectionItem>;
}

export interface CollectionCacheEntry {
  items: MediaCollectionItem[];
  subject: ReplaySubject<MediaCollectionItem[]>;
  isLoadingNextPage: boolean;
  nextInclusiveStartKey?: string;
}

export type CollectionCache = {
  [collectionName: string]: CollectionCacheEntry;
};

export const collectionCache: CollectionCache = {};

export class CollectionFetcher {
  constructor(readonly mediaStore: MediaStore) {}

  private removeFromCache(id: string, collectionName: string) {
    const collectionCacheIndex = collectionCache[
      collectionName
    ].items.findIndex((item) => item.id === id);

    if (collectionCacheIndex === -1) {
      return;
    }

    getFileStreamsCache().remove(id);
    collectionCache[collectionName].items.splice(collectionCacheIndex, 1);
  }

  /**
   * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-170 Internal documentation for deprecation (no external access)}
   * This method is no longer working. Will be removed in the next release
   */
  getItems(
    collectionName: string,
    params?: MediaStoreGetCollectionItemsParams,
    traceContext?: MediaTraceContext,
  ): MediaSubscribable<MediaCollectionItem[]> {
    throw new DeprecatedError('collection/:name/items');
  }

  async removeFile(
    id: string,
    collectionName: string,
    occurrenceKey?: string,
    traceContext?: MediaTraceContext,
  ) {
    await this.mediaStore.removeCollectionFile(
      id,
      collectionName,
      occurrenceKey,
      traceContext,
    );
    this.removeFromCache(id, collectionName);
    const collection = collectionCache[collectionName];
    collection.subject.next(collection.items);
  }

  /**
   * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-170 Internal documentation for deprecation (no external access)}
   * This method is no longer working. Will be removed in the next release
   */
  async loadNextPage(
    collectionName: string,
    params?: MediaStoreGetCollectionItemsParams,
    traceContext?: MediaTraceContext,
  ) {
    throw new DeprecatedError('collection/:name/items');
  }
}
