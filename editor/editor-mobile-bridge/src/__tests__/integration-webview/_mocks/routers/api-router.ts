import { Router, KakapoResponse } from 'kakapo';
import { TouchFileDescriptor, ItemsPayload } from '@atlaskit/media-client';
import { MediaDatabaseSchema } from '../database';
import { mapDataUriToBlob, defaultBaseUrl } from '../utils';
import { testImageDataURI } from '../database/testImageDataURI';

export function createApiRouter(): Router<MediaDatabaseSchema> {
  const requestDelay = 10;
  const router = new Router<MediaDatabaseSchema>(
    {
      host: defaultBaseUrl,
      requestDelay,
    },
    { strategies: ['fetch'] },
  );

  router.get('/file/:fileId/image', ({ params, query }, database) => {
    const { fileId } = params;
    const { 'max-age': maxAge = 3600 } = query;
    const record = database.findOne('collectionItem', { id: fileId });
    const blob =
      record && record.data && record.data.blob
        ? record.data.blob
        : mapDataUriToBlob(testImageDataURI);

    return new KakapoResponse(200, blob, {
      'content-type': blob.type,
      'content-length': blob.size.toString(),
      'cache-control': `private, max-age=${maxAge}`,
    });
  });

  router.get('/file/:fileId/image/metadata', () => {
    return {
      metadata: {
        pending: false,
        preview: {},
        original: {
          height: 4096,
          width: 4096,
        },
      },
    };
  });

  router.post('/items', ({ body }, database) => {
    const { descriptors } = JSON.parse(body) as {
      descriptors: TouchFileDescriptor[];
    };
    const fileItems = descriptors
      .map((descriptor: any) => {
        const record = database.findOne('collectionItem', {
          id: descriptor.id,
        });
        if (record && record.data) {
          return {
            type: 'file',
            id: descriptor.id,
            collection: descriptor.collection,
            details: record.data.details,
          };
        }
        return null;
      })
      .filter(fileItem => fileItem !== null);

    return {
      data: {
        items: fileItems,
      } as ItemsPayload,
    };
  });

  return router;
}
