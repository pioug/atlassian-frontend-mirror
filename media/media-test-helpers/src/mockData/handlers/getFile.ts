import {
  MockContext,
  exactMatch,
  fillInResponse,
  MediaCollectionFile,
} from '..';
import { MockRequest, MockResponse } from 'xhr-mock';

export const getFile = (context: () => MockContext) => (
  req: MockRequest,
  res: MockResponse,
) => {
  const requestDataTemplate = (collectionName: string) => (
    file: MediaCollectionFile,
  ) => ({
    method: 'GET',
    url: {
      path: `/file/${file.id}`,
      query: {
        collection: collectionName,
      },
    },
    headers: {
      accept: 'application/json, text/plain, */*',
    },
    body: null,
  });

  const availableFiles: Array<MediaCollectionFile> = [
    ...context().userContext.collection,
    ...context().tenantContext.collection,
  ];

  const userData: Array<any> = context().userContext.collection.map(
    requestDataTemplate(context().userContext.collectionName),
  );
  const tenantData: Array<any> = context().tenantContext.collection.map(
    requestDataTemplate(context().tenantContext.collectionName),
  );
  const data = [...tenantData, ...userData];
  const matchingDataItem = data.reduce(
    (ret, dataItem) => (exactMatch(req, dataItem) ? dataItem : ret),
    undefined,
  );
  if (matchingDataItem) {
    const fileId = (/\/file\/(.*)/.exec(req.url().path || '') || [])[1];
    const resdata = {
      status: 200,
      reason: '',
      headers: {
        date: 'Tue, 20 Feb 2018 01',
        'x-content-type-options': 'nosniff',
        server: 'nginx/1.12.2',
        'x-b3-traceid': '9f37ad476c47648e',
        'access-control-allow-origin': '*',
        'x-download-options': 'noopen',
        'x-frame-options': 'SAMEORIGIN',
        'content-type': 'application/json',
        status: '200',
        'access-control-expose-headers':
          'Accept-Ranges, Content-Encoding, Content-Length, Content-Range',
        'x-b3-spanid': '9f37ad476c47648e',
        'strict-transport-security': 'max-age=15552000; includeSubDomains',
        'x-dns-prefetch-control': 'off',
        'content-length': '1088',
        'x-xss-protection': '1; mode=block',
      },
      body: JSON.stringify({
        data: {
          mediaType: 'image',
          mimeType: 'image/jpeg',
          name: availableFiles.reduce(
            (ret, item) => (item.id === fileId ? item : ret),
            { details: { name: '' } },
          ).details.name,
          size: availableFiles.reduce(
            (ret, item) => (item.id === fileId ? item : ret),
            { details: { size: 0 } },
          ).details.size,
          processingStatus: 'succeeded',
          artifacts: {
            'meta.json': {
              url: `/file/${fileId}/artifact/meta.json/binary`,
              processingStatus: 'succeeded',
            },
            'thumb_120.jpg': {
              url: `/file/${fileId}/artifact/thumb_120.jpg/binary`,
              processingStatus: 'succeeded',
            },
            'thumb.jpg': {
              url: `/file/${fileId}/artifact/thumb_120.jpg/binary`,
              processingStatus: 'succeeded',
            },
            'image.jpg': {
              url: `/file/${fileId}/artifact/image.jpg/binary`,
              processingStatus: 'succeeded',
            },
            'thumb_320.jpg': {
              url: `/file/${fileId}/artifact/thumb_320.jpg/binary`,
              processingStatus: 'succeeded',
            },
            'thumb_large.jpg': {
              url: `/file/${fileId}/artifact/thumb_320.jpg/binary`,
              processingStatus: 'succeeded',
            },
          },
          id: fileId,
        },
      }),
    };

    fillInResponse(res, resdata);

    return res;
  }

  return undefined;
};
