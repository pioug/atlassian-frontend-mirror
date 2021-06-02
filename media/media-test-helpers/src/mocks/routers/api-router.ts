// eslint-disable-line no-console
import {
  Router,
  KakapoResponse,
  KakapoRequest,
  RouterHandler,
  Database,
  DataRecord,
} from 'kakapo';
import uuid from 'uuid/v4';

import {
  getMediaTypeFromMimeType,
  MediaCollectionItemFullDetails,
  isMediaCollectionItemFullDetails,
  TouchFileDescriptor,
  ItemsPayload,
  ResponseFileItem,
} from '@atlaskit/media-client';

import {
  MediaDatabaseSchema,
  createCollection,
  createCollectionItem,
  createEmptyCollectionItem,
  CollectionItem,
} from '../database';
import { vrVideoDetails } from '../../exampleMediaItems';
import { defaultBaseUrl } from '../../mediaClientProvider';
import { createUpload } from '../database/upload';
import { logRequest } from '../../utils/logging';
import {
  getTextFileType,
  getFakeFileName,
  mockDataUri,
} from '../../utils/mockData';
import { mapDataUriToBlob } from '../../utils';

class RouterWithLogging<MediaDatabaseSchema> extends Router<
  MediaDatabaseSchema
> {
  register(
    method: string,
    path: string,
    originalHandler: RouterHandler<MediaDatabaseSchema>,
  ) {
    const handler: RouterHandler<MediaDatabaseSchema> = (
      request: KakapoRequest,
      database: Database<MediaDatabaseSchema>,
    ) => {
      let response: KakapoResponse;
      let requestWithBodyObject: any;
      let error: any;

      try {
        response = originalHandler(request, database);
        let body = request.body;
        try {
          body = JSON.parse(body);
        } catch (e) {}
        requestWithBodyObject = { request: { ...request, body } };
      } catch (e) {
        error = e;
      }

      logRequest({
        path,
        method,
        request: requestWithBodyObject,
        response: response!,
        error,
        database,
      });

      if (error) {
        throw error;
      } else {
        return response!;
      }
    };
    return super.register(method, path, handler);
  }
}

export function createApiRouter(
  isSlowServer?: boolean,
  urlsReturnErrorsTo?: string[],
): Router<MediaDatabaseSchema> {
  const requestDelay = isSlowServer ? 200 : 10;

  const router = new RouterWithLogging<MediaDatabaseSchema>(
    {
      host: defaultBaseUrl,
      requestDelay,
    },
    { strategies: ['fetch'] },
  );

  router.post('/collection', ({ body }, database) => {
    const { name } = JSON.parse(body);
    const collection = createCollection(name);
    database.push('collection', collection);
    return { data: collection };
  });

  // TODO [EDM-1151]: Implement router.get('/file/binary') for videos

  router.post('/file/binary', ({ headers, body, query }, database) => {
    const { 'Content-Type': mimeType } = headers;
    const { collection, name, occurrenceKey } = query;
    const item = createCollectionItem({
      collectionName: collection,
      name,
      mimeType,
      occurrenceKey,
      blob: body,
    });

    database.push('collectionItem', item);

    return {
      data: {
        id: item.id,
        ...item.details,
      },
    };
  });

  router.get(
    '/collection/:collectionName/items',
    ({ params, query }, database) => {
      const { limit, inclusiveStartKey } = query;
      const { collectionName } = params;
      const startIndex =
        (inclusiveStartKey && parseInt(inclusiveStartKey, 10)) || 0;
      const endIndex = startIndex + parseInt(limit, 10);
      const contents = database
        .find('collectionItem', {
          collectionName,
        })
        .map((record) => record.data);

      const nextInclusiveStartKey =
        contents.length > endIndex ? endIndex : undefined;

      return {
        data: {
          nextInclusiveStartKey,
          contents: contents.slice(startIndex, endIndex),
        },
      };
    },
  );

  const isSvgFile = (record: DataRecord<CollectionItem>): boolean => {
    return !!(record.data.blob && record.data.blob.type === 'image/svg+xml');
  };

  router.get('/file/:fileId/image', ({ params, query }, database) => {
    const { fileId } = params;
    const { width, height, 'max-age': maxAge = 3600 } = query;
    const record = database.findOne('collectionItem', { id: fileId });
    let blob: Blob;
    if (!record || !record.data.blob || isSvgFile(record)) {
      const dataUri = mockDataUri(width, height);

      blob = mapDataUriToBlob(dataUri);
    } else if (fileId === vrVideoDetails.id) {
      blob = mapDataUriToBlob(vrVideoDetails.previewDataUri);
    } else {
      blob = record.data.blob;
    }

    return new KakapoResponse(200, blob, {
      'content-type': blob.type,
      'content-length': blob.size.toString(),
      'cache-control': `private, max-age=${maxAge}`,
    });
  });

  router.get('/file/:fileId/image/metadata', async ({ params }, database) => {
    const { fileId } = params;
    const record = database.findOne('collectionItem', { id: fileId });
    const defaultDimensions = {
      height: 4096,
      width: 4096,
    };
    let dimensions = Promise.resolve(defaultDimensions);

    if (record && record.data.blob && !isSvgFile(record)) {
      dimensions = new Promise((resolve) => {
        const image = new Image();
        image.src = URL.createObjectURL(record.data.blob);
        image.onload = () =>
          resolve({ height: image.height, width: image.width });
      });
    }

    return {
      metadata: {
        pending: false,
        preview: {},
        original: await dimensions,
      },
    };
  });

  router.get('/picker/accounts', () => {
    return {
      data: [],
    };
  });

  router.head('/chunk/:chunkId', ({ params }, database) => {
    const { chunkId } = params;
    if (database.findOne('chunk', { id: chunkId })) {
      return new KakapoResponse(200, undefined, {});
    } else {
      return new KakapoResponse(404, undefined, {});
    }
  });

  router.put('/chunk/:chunkId', ({ params, body }, database) => {
    const { chunkId } = params;

    database.push('chunk', {
      id: chunkId,
      blob: body,
    });

    return new KakapoResponse(201, undefined, {});
  });

  /** This function waits for shouldWaitUpload to be false before it resolves the promise.
   * Otherwise it recursively calls itself with a 10ms timeout until it is false.*/
  async function awaitUpload(resolver?: Function) {
    return new Promise((resolve) => {
      if ((window as any).mediaMockControlsBackdoor.shouldWaitUpload) {
        setTimeout(() => awaitUpload(resolver || resolve), 10);
        return;
      }
      if (
        resolver &&
        !(window as any).mediaMockControlsBackdoor.shouldWaitUpload
      ) {
        resolver();
      }
      resolve();
    });
  }

  router.post('/chunk/probe', async ({ body }, database) => {
    const { chunks } = JSON.parse(body);
    const allChunks = database.all('chunk');
    const existingChunks: string[] = [];
    const nonExistingChunks: string[] = [];

    allChunks.forEach(({ data: { id } }) => {
      if (chunks.indexOf(id) > -1) {
        existingChunks.push(id);
      } else {
        nonExistingChunks.push(id);
      }
    });
    await awaitUpload();
    return {
      data: {
        results: [
          ...existingChunks.map(() => ({ exists: true })),
          ...nonExistingChunks.map(() => ({ exists: false })),
        ],
      },
    };
  });

  router.post('/upload', ({ query }, database) => {
    const { createUpTo = '1' } = query;

    const records = database.create('upload', Number.parseInt(createUpTo, 10));
    const data = records.map((record) => record.data);

    return {
      data,
    };
  });

  router.put('/upload/:uploadId/chunks', ({ params, body }, database) => {
    const { uploadId } = params;
    const { chunks /*, offset*/ } = JSON.parse(body);

    const record = database.findOne('upload', { id: uploadId });

    if (record) {
      database.update('upload', record.id, {
        chunks: [...record.data.chunks, ...chunks],
      });

      return new KakapoResponse(200, undefined, {});
    } else {
      return new KakapoResponse(404, undefined, {});
    }
  });

  router.post('/file', ({ query }, database) => {
    const { collection } = query;
    const item = createCollectionItem({
      collectionName: collection,
    });
    database.push('collectionItem', item);
    return new KakapoResponse(
      201,
      {
        data: {
          id: item.id,
          insertedAt: Date.now(),
        },
      },
      {},
    );
  });

  router.post('/file/upload', ({ query, body }, database) => {
    const { collection, replaceFileId } = query;
    const { name, mimeType, uploadId } = JSON.parse(body);

    const uploadRecord = database.findOne('upload', { id: uploadId });
    if (!uploadRecord) {
      return new KakapoResponse(
        404,
        { message: `upload ${uploadId} is not found` },
        {},
      );
    }
    const fileRecord = database.findOne('collectionItem', {
      id: replaceFileId,
    });
    if (fileRecord === undefined) {
      return new KakapoResponse(
        404,
        { message: `file ${replaceFileId} is not found` },
        {},
      );
    }

    const totalBlob = uploadRecord.data.chunks.reduce(
      (memo: Blob, chunkId: string) => {
        const chunkRecord = database.findOne('chunk', { id: chunkId });
        if (!chunkRecord || !chunkRecord.data.blob) {
          return memo;
        }

        return new Blob([memo, chunkRecord.data.blob], { type: memo.type });
      },
      new Blob([], { type: mimeType }),
    );

    const mediaType = getMediaTypeFromMimeType(mimeType);
    const newDetails: MediaCollectionItemFullDetails = {
      ...(fileRecord.data.details || {}),
      name,
      mimeType,
      size: totalBlob.size,
      artifacts: {},
      mediaType,
      representations: { image: {} },
      // This is to make MediaViewer work with newly uploaded video files
      processingStatus: mediaType === 'video' ? 'pending' : 'succeeded',
    };

    database.update('collectionItem', fileRecord.id, {
      collectionName: collection,
      blob: totalBlob,
      details: newDetails,
    });

    return {
      data: {
        ...newDetails,
        id: replaceFileId,
      },
    };
  });

  router.get('/file/:fileId', ({ params, query }, database) => {
    const { fileId } = params;
    const { collection } = query;

    const record = database.findOne('collectionItem', {
      id: fileId,
      collectionName: collection,
    });

    if (record) {
      return {
        data: {
          id: fileId,
          ...record.data.details,
        },
      };
    } else {
      return new KakapoResponse(404, undefined, {});
    }
  });

  router.post('/items', ({ body }, database) => {
    const { descriptors } = JSON.parse(body) as {
      descriptors: TouchFileDescriptor[];
    };
    const fileItems = descriptors
      .map((descriptor: any) => {
        const record = database.findOne('collectionItem', {
          id: descriptor.id,
          // TODO [MS-2249]: add collectionName: descriptor.collection check
        });
        if (record) {
          return {
            type: 'file',
            id: descriptor.id,
            collection: descriptor.collection,
            details: record.data.details,
          } as ResponseFileItem;
        }
        return null;
      })
      .filter((fileItem): fileItem is ResponseFileItem => fileItem !== null);

    return {
      data: {
        items: fileItems,
      } as ItemsPayload,
    };
  });

  router.post('/file/copy/withToken', (request, database) => {
    const { body, query } = request;
    const { sourceFile } = JSON.parse(body);
    let {
      collection: destinationCollection,
      replaceFileId,
      occurrenceKey,
    } = query;

    if (
      (replaceFileId && !occurrenceKey) ||
      (!replaceFileId && occurrenceKey)
    ) {
      return new KakapoResponse(404, undefined, {});
    }

    const sourceRecord = database.findOne('collectionItem', {
      id: sourceFile.id,
      collectionName: sourceFile.collection,
    });

    if (!replaceFileId && !occurrenceKey) {
      replaceFileId = uuid();
      occurrenceKey = uuid();

      database.push(
        'collectionItem',
        createEmptyCollectionItem({
          id: replaceFileId,
          collectionName: destinationCollection,
          occurrenceKey,
        }),
      );
    }

    const existingRecord = database.findOne('collectionItem', {
      id: replaceFileId,
      collectionName: destinationCollection,
      occurrenceKey,
    });

    if (sourceRecord && existingRecord) {
      const extension = getTextFileType();
      const { id, details, blob } = sourceRecord.data;
      const {
        name = getFakeFileName(extension),
        size = (blob && blob.size) || 0,
        mediaType = 'image',
        mimeType = 'image/jpeg',
        processingStatus = 'succeeded',
        artifacts = {
          'thumb_320.jpg': {
            url: `/file/${id}/artifact/thumb_320.jpg/binary`,
            processingStatus: 'succeeded',
          },
          'thumb_large.jpg': {
            url: `/file/${id}/artifact/thumb_320.jpg/binary`,
            processingStatus: 'succeeded',
          },
          'thumb_120.jpg': {
            url: `/file/${id}/artifact/thumb_120.jpg/binary`,
            processingStatus: 'succeeded',
          },
          'thumb.jpg': {
            url: `/file/${id}/artifact/thumb_120.jpg/binary`,
            processingStatus: 'succeeded',
          },
          'meta.json': {
            url: `/file/${id}/artifact/meta.json/binary`,
            processingStatus: 'succeeded',
          },
          'image.jpg': {
            url: `/file/${id}/artifact/image.jpg/binary`,
            processingStatus: 'succeeded',
          },
        },
        representations = { image: {} },
        createdAt = -1,
      } = isMediaCollectionItemFullDetails(details) ? details : {};

      database.update('collectionItem', existingRecord.id, {
        id: replaceFileId,
        insertedAt: sourceRecord.data.insertedAt,
        occurrenceKey,
        details,
        blob,
        collectionName: destinationCollection,
      });

      return {
        data: {
          id: replaceFileId,
          mediaType,
          mimeType,
          name,
          processingStatus,
          size,
          artifacts,
          representations,
          createdAt,
        },
      };
    } else {
      return new KakapoResponse(404, undefined, {});
    }
  });

  router.post('/upload/createWithFiles', ({ body }, database) => {
    const bodyJson = JSON.parse(body);
    const descriptors: TouchFileDescriptor[] = bodyJson.descriptors;

    const created = descriptors.map((descriptor) => {
      database.push(
        'collectionItem',
        createEmptyCollectionItem({
          id: descriptor.fileId,
          collectionName: descriptor.collection,
          occurrenceKey: descriptor.occurrenceKey,
        }),
      );

      const uploadRecord = createUpload();
      database.push('upload', uploadRecord);
      return {
        fileId: descriptor.fileId,
        uploadId: uploadRecord.id,
      };
    });

    return {
      data: {
        created,
      },
    };
  });

  urlsReturnErrorsTo &&
    urlsReturnErrorsTo.forEach((url) => {
      const return500 = () =>
        new KakapoResponse(500, { message: 'As you wish, master!' });
      router.delete(url, return500);
      router.get(url, return500);
      router.post(url, return500);
      router.put(url, return500);
    });

  return router;
}
