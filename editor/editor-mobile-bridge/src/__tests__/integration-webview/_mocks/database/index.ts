import { Database } from 'kakapo';
import uuidV4 from 'uuid/v4';
import { ClientBasedAuth } from '@atlaskit/media-core';
import { CollectionItem, createCollectionItem } from './collection-item';
import { MockCollections } from '../types';
import { defaultBaseUrl } from '../utils';
export type {
  CollectionItem,
  CreateCollectionItemOptions,
  createCollectionItem,
} from './collection-item';
export const tenantAuth: ClientBasedAuth = {
  clientId: uuidV4(),
  token: 'some-tenant-token',
  baseUrl: defaultBaseUrl,
};

export const tenantAuthProvider = () => Promise.resolve(tenantAuth);

export type MediaDatabaseSchema = {
  collectionItem: CollectionItem | undefined;
};

export function createDatabase(
  collections: MockCollections = {},
): Database<MediaDatabaseSchema> {
  const database = new Database<MediaDatabaseSchema>();

  database.register('collectionItem', createCollectionItem);

  if (Object.keys(collections).length > 0) {
    Object.keys(collections).forEach(collectionName => {
      collections[collectionName].forEach(
        ({ id, name, blob, mimeType, processingStatus }) =>
          database.push(
            'collectionItem',
            createCollectionItem({
              id,
              collectionName,
              blob,
              occurrenceKey: uuidV4(),
              mimeType,
              name,
              processingStatus,
            }),
          ),
      );
    });
  }

  return database;
}
