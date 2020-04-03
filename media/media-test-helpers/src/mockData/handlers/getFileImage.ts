import {
  MockContext,
  exactMatch,
  fillInResponse,
  dataURItoBlob,
  RequestData,
  MediaCollectionFile,
} from '..';
import { MockRequest, MockResponse } from 'xhr-mock';
import { files } from '../staticCommon';

export const getFileImage = (context: () => MockContext) => (
  req: MockRequest,
  res: MockResponse,
) => {
  const requestDataTemplate = (collectionName: string) => (
    file: MediaCollectionFile,
  ) => ({
    method: 'GET',
    url: {
      path: `/file/${file.id}/image`,
      query: {
        collection: collectionName,
      },
    },
    headers: {
      accept: 'image/webp,image/*,*/*;q=0.8',
    },
    body: null,
  });
  const userData: Array<any> = context().userContext.collection.map(
    requestDataTemplate(context().userContext.collectionName),
  );
  const tenantData: Array<any> = context().tenantContext.collection.map(
    requestDataTemplate(context().tenantContext.collectionName),
  );
  const data: Array<RequestData> = [...userData, ...tenantData];
  const matchingDataItem = data.reduce<RequestData | undefined>(
    (ret, dataItem) => (exactMatch(req, dataItem) ? dataItem : ret),
    undefined,
  );
  if (matchingDataItem) {
    const resdata = {
      status: 200,
      reason: '',
      headers: {
        date: 'Tue, 20 Feb 2018 01',
        'x-content-type-options': 'nosniff',
        server: 'nginx/1.12.2',
        'x-b3-traceid': '9cd99f83c26eb3e7',
        'access-control-allow-origin': '*',
        'x-download-options': 'noopen',
        'x-frame-options': 'SAMEORIGIN',
        'content-type': 'image/webp',
        status: '200',
        'access-control-expose-headers':
          'Accept-Ranges, Content-Encoding, Content-Length, Content-Range',
        'cache-control': 'private, max-age=3600',
        'x-b3-spanid': '9cd99f83c26eb3e7',
        'x-dns-prefetch-control': 'off',
        'content-length': '5558',
        'x-xss-protection': '1; mode=block',
      },
      body: dataURItoBlob(
        files.reduce(
          (ret, file) =>
            `/file/${file.id}/image` ===
            (matchingDataItem.url || { path: '' }).path
              ? file
              : ret,
          { dataUri: '' },
        ).dataUri,
      ),
    };

    fillInResponse(res, resdata);

    return res;
  }

  return undefined;
};
