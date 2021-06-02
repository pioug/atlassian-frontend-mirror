import { Database } from 'kakapo';
import uuidV4 from 'uuid/v4';

import { ClientBasedAuth } from '@atlaskit/media-core';
import { MediaCollection } from '@atlaskit/media-client';

import { createCollection } from './collection';
import { CollectionItem, createCollectionItem } from './collection-item';
import { createUpload, Upload } from './upload';
import { Chunk, createChunk } from './chunk';
import { defaultBaseUrl } from '../../mediaClientProvider';
import { MockCollections } from '../media-mock';
import { defaultCollectionName } from '../../collectionNames';
import { RECENTS_COLLECTION } from '@atlaskit/media-client/constants';

export { createCollection } from './collection';
export {
  createCollectionItem,
  createEmptyCollectionItem,
} from './collection-item';
export type {
  CollectionItem,
  CreateCollectionItemOptions,
} from './collection-item';

export const tenantAuth: ClientBasedAuth = {
  clientId: uuidV4(),
  token: 'some-tenant-token',
  baseUrl: defaultBaseUrl,
};

export const userAuth: ClientBasedAuth = {
  clientId: uuidV4(),
  token: 'some-user-token',
  baseUrl: defaultBaseUrl,
};

export const userAuthProvider = () => Promise.resolve(userAuth);
export const tenantAuthProvider = () => Promise.resolve(tenantAuth);

export type MediaDatabaseSchema = {
  collection: MediaCollection;
  collectionItem: CollectionItem;
  upload: Upload;
  chunk: Chunk;
};

export function createDatabase(
  collections: MockCollections = {},
): Database<MediaDatabaseSchema> {
  const database = new Database<MediaDatabaseSchema>();

  database.register('collectionItem', createCollectionItem);
  database.register('collection', createCollection);
  database.register('upload', createUpload);
  database.register('chunk', createChunk);

  if (Object.keys(collections).length > 0) {
    Object.keys(collections).forEach((collectionName) => {
      database.push('collection', {
        name: collectionName,
        createdAt: Date.now(),
      });
      collections[collectionName].forEach(
        ({ id, name, blob, mediaType, mimeType, processingStatus }) =>
          database.push(
            'collectionItem',
            createCollectionItem({
              id,
              collectionName,
              blob,
              occurrenceKey: uuidV4(),
              mediaType,
              mimeType,
              name,
              processingStatus,
            }),
          ),
      );
    });
  } else {
    database.push('collection', {
      name: RECENTS_COLLECTION,
      createdAt: Date.now(),
    });
    database.push('collection', {
      name: defaultCollectionName,
      createdAt: Date.now(),
    });
  }

  return database;
}
