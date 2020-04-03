import {
  fillInResponse,
  exactMatch,
  MockContext,
  InternalFile,
  MediaCollectionFile,
} from '..';
import { MockRequest, MockResponse } from 'xhr-mock';
import * as uuid from 'uuid';
import { files, fileUri } from '../staticCommon';

export const copyWithToken = (context: () => MockContext) => (
  req: MockRequest,
  res: MockResponse,
) => {
  const data: Array<any> = context().userContext.collection.map(
    (item: any) => ({
      method: 'POST',
      url: {
        path: '/file/copy/withToken',
        query: {
          collection: context().tenantContext.collectionName,
        },
      },
      headers: {
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/json; charset=utf-8',
        'x-client-id': context().tenantContext.auth.clientId,
        authorization: `Bearer ${context().tenantContext.auth.token}`,
      },
      body: JSON.stringify({
        sourceFile: {
          id: item.id,
          collection: context().userContext.collectionName,
          owner: {
            id: context().userContext.auth.clientId,
            token: context().userContext.auth.token,
          },
        },
      }),
    }),
  );

  const availableFiles: Array<MediaCollectionFile> = [
    ...context().userContext.collection,
  ];

  const matchingDataItem = data.reduce(
    (ret, dataItem) => (exactMatch(req, dataItem) ? dataItem : ret),
    undefined,
  );

  if (matchingDataItem) {
    const intFile: InternalFile = {
      id: uuid.v4(),
      occurrenceKey: uuid.v4(),
      name: availableFiles.reduce(
        (ret, item) =>
          item.id === JSON.parse(matchingDataItem.body).sourceFile.id
            ? item
            : ret,
        { details: { name: '' } },
      ).details.name,
      size: availableFiles.reduce(
        (ret, item) =>
          item.id === JSON.parse(matchingDataItem.body).sourceFile.id
            ? item
            : ret,
        { details: { size: 0 } },
      ).details.size,
      dataUri: fileUri,
    };

    const resdata = {
      status: 201,
      reason: '',
      headers: {
        date: 'Tue, 20 Feb 2018 22',
        server: 'nginx/1.12.2',
        'x-b3-traceid': 'c45152400f941ae6',
        'access-control-allow-origin': '*',
        'content-type': 'application/json',
        status: '201',
        'access-control-expose-headers':
          'Accept-Ranges, Content-Encoding, Content-Length, Content-Range',
        'x-b3-spanid': 'c45152400f941ae6',
        'content-length': '951',
      },
      body: JSON.stringify({
        data: {
          mediaType: 'image',
          mimeType: 'image/jpeg',
          name: intFile.name,
          size: intFile.size,
          processingStatus: 'succeeded',
          artifacts: {
            'thumb_320.jpg': {
              url: `/file/${intFile.id}/artifact/thumb_320.jpg/binary`,
              processingStatus: 'succeeded',
            },
            'thumb_large.jpg': {
              url: `/file/${intFile.id}/artifact/thumb_320.jpg/binary`,
              processingStatus: 'succeeded',
            },
            'thumb_120.jpg': {
              url: `/file/${intFile.id}/artifact/thumb_120.jpg/binary`,
              processingStatus: 'succeeded',
            },
            'thumb.jpg': {
              url: `/file/${intFile.id}/artifact/thumb_120.jpg/binary`,
              processingStatus: 'succeeded',
            },
            'meta.json': {
              url: `/file/${intFile.id}/artifact/meta.json/binary`,
              processingStatus: 'succeeded',
            },
            'image.jpg': {
              url: `/file/${intFile.id}/artifact/image.jpg/binary`,
              processingStatus: 'succeeded',
            },
          },
          id: intFile.id,
        },
      }),
    };

    files.push(intFile);

    context().tenantContext.collection.push({
      id: intFile.id,
      occurrenceKey: intFile.occurrenceKey,
      type: 'file',
      details: {
        size: intFile.size,
        name: intFile.name,
      },
      author: {
        id: '655362:b9e0e0b5-c639-4fcb-96f2-06fe6ae794be',
        userName: 'vvlasov@atlassian.com',
        displayName: 'Vladimir Vlasov',
        active: true,
      },
      insertedAt: 1516747839493,
    });

    fillInResponse(res, resdata);

    return res;
  }

  return undefined;
};
