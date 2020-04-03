jest.mock('../../utils/checkWebpSupport');

import fetchMock from 'fetch-mock';
import { stringify } from 'query-string';
import { Auth, AuthProvider, AuthContext } from '@atlaskit/media-core';
import {
  CreatedTouchedFile,
  MediaStore,
  MediaUpload,
  MediaChunksProbe,
  MediaFile,
  MediaCollectionItems,
  MediaStoreGetFileParams,
  ItemsPayload,
  ImageMetadata,
  MediaStoreTouchFileBody,
  TouchFileDescriptor,
  TouchedFiles,
  MediaStoreTouchFileParams,
  MediaFileArtifacts,
  checkWebpSupport,
} from '../..';
import { FILE_CACHE_MAX_AGE } from '../../constants';

describe('MediaStore', () => {
  const baseUrl = 'http://some-host';
  const checkWebpSupportMock = checkWebpSupport as jest.Mock;

  afterEach(() => fetchMock.restore());

  describe('given auth provider resolves', () => {
    const clientId = 'some-client-id';
    const token = 'some-token';
    const auth: Auth = { clientId, token, baseUrl };
    const data: MediaFile = {
      id: 'faee2a3a-f37d-11e4-aae2-3c15c2c70ce6',
      mediaType: 'doc',
      mimeType: 'application/pdf',
      name: 'example document.pdf',
      processingStatus: 'pending',
      size: 231392,
      artifacts: {},
      representations: {},
    };
    let authProvider: jest.Mock<AuthProvider>;
    let mediaStore: MediaStore;

    beforeEach(() => {
      authProvider = jest.fn();
      authProvider.mockReturnValue(
        (Promise.resolve(auth) as AuthContext) as AuthProvider,
      );
      mediaStore = new MediaStore({
        // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
        //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
        authProvider,
      });
    });

    describe('createUpload', () => {
      it('should POST to /upload endpoint with correct options', () => {
        const createUpTo = 1;
        const data: MediaUpload[] = [
          { id: 'some-upload-id', created: 123, expires: 456 },
        ];

        fetchMock.mock(`begin:${baseUrl}/upload`, {
          body: {
            data,
          },
          status: 201,
        });

        return mediaStore.createUpload(createUpTo).then(response => {
          expect(response).toEqual({ data });
          expect(fetchMock.lastUrl()).toEqual(
            `${baseUrl}/upload?createUpTo=${createUpTo}`,
          );
          expect(fetchMock.lastOptions()).toEqual({
            method: 'POST',
            headers: {
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
            body: undefined,
          });
        });
      });

      it('should pass collection name to the authContext', async () => {
        mediaStore.request = jest
          .fn()
          .mockReturnValue(Promise.resolve({ json() {} }));
        await mediaStore.createUpload(undefined, 'my-collection');

        expect(mediaStore.request).toBeCalledWith('/upload', {
          authContext: {
            collectionName: 'my-collection',
          },
          headers: {
            Accept: 'application/json',
          },
          method: 'POST',
          params: { createUpTo: 1 },
        });
      });
    });

    describe('uploadChunk', () => {
      it('should PUT to /chunk/:etag endpoint with correct options', () => {
        const etag = 'some-etag';
        const blob = new Blob(['some-blob']);

        fetchMock.mock(`begin:${baseUrl}/chunk`, {
          status: 201,
        });

        return mediaStore.uploadChunk(etag, blob).then(() => {
          expect(fetchMock.lastUrl()).toEqual(`${baseUrl}/chunk/${etag}`);
          expect(fetchMock.lastOptions()).toEqual({
            method: 'PUT',
            headers: {
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
            },
            body: blob,
          });
        });
      });
    });

    describe('probeChunks', () => {
      it('should POST to /chunk/probe endpoint with correct options', () => {
        const etag = 'some-etag';
        const chunks = [etag];
        const data: MediaChunksProbe = {
          results: {
            [etag]: {
              exists: true,
            },
          },
        };

        fetchMock.mock(`begin:${baseUrl}/chunk/probe`, {
          body: {
            data,
          },
          status: 200,
        });

        return mediaStore.probeChunks(chunks).then(response => {
          expect(response).toEqual({ data });
          expect(fetchMock.lastUrl()).toEqual(`${baseUrl}/chunk/probe`);
          expect(fetchMock.lastOptions()).toEqual({
            method: 'POST',
            headers: {
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chunks }),
          });
        });
      });
    });

    describe('createFileFromUpload', () => {
      it('should POST to /file/upload endpoint with correct options', () => {
        const body = {
          uploadId: 'some-upload-id',
          name: 'some-name',
          mimeType: 'application/pdf',
          conditions: {
            hash: 'sha1:da39a3ee5e6b4b0d3255bfef95601890afd80709',
            size: 42,
          },
        };
        const params = {
          collection: 'some-collection',
          occurrenceKey: 'some-occurrence-key',
          expireAfter: 123,
          replaceFileId: 'some-replace-file-id',
          skipConversions: true,
        };

        fetchMock.mock(`begin:${baseUrl}/file/upload`, {
          body: {
            data,
          },
          status: 201,
        });

        return mediaStore.createFileFromUpload(body, params).then(response => {
          expect(response).toEqual({ data });
          expect(fetchMock.lastUrl()).toEqual(
            `${baseUrl}/file/upload?${stringify(params)}`,
          );
          expect(fetchMock.lastOptions()).toEqual({
            method: 'POST',
            headers: {
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });
          expect(authProvider).toHaveBeenCalledWith({
            collectionName: params.collection,
          });
        });
      });
    });

    describe('getFile', () => {
      it('should GET to /file/{fileId} endpoint with correct options', () => {
        const collectionName = 'some-collection-name';
        const fileId = 'faee2a3a-f37d-11e4-aae2-3c15c2c70ce6';
        const params: MediaStoreGetFileParams = {
          collection: collectionName,
        };

        fetchMock.mock(`begin:${baseUrl}/file/${fileId}`, {
          body: {
            data,
          },
          status: 201,
        });

        return mediaStore.getFile(fileId, params).then(response => {
          expect(response).toEqual({ data });
          expect(fetchMock.lastUrl()).toEqual(
            `${baseUrl}/file/${fileId}?collection=${collectionName}`,
          );
          expect(fetchMock.lastOptions()).toEqual(
            expect.objectContaining({
              method: 'GET',
              headers: {
                'X-Client-Id': clientId,
                Authorization: `Bearer ${token}`,
              },
            }),
          );
          expect(authProvider).toHaveBeenCalledWith({ collectionName });
        });
      });
    });

    describe('appendChunksToUpload', () => {
      it('should PUT to /upload/{uploadId}/chunks endpoint with correct options', () => {
        const uploadId = '29c49470-adac-4b16-82ec-301340c7b16a';
        const body = {
          chunks: [
            '0675a983536736a69f835438bcf8629e044f190d-4096',
            'e6295a0966535d295582670afeeb14059969d359-209',
          ],
          hash: 'sha1:b0edf951dd0c86f80d989e20b9dc3060c53d66a6',
          offset: 0,
        };

        fetchMock.mock(`begin:${baseUrl}/upload`, {
          status: 200,
        });

        return mediaStore.appendChunksToUpload(uploadId, body).then(() => {
          expect(fetchMock.lastUrl()).toEqual(
            `${baseUrl}/upload/${uploadId}/chunks`,
          );
          expect(fetchMock.lastOptions()).toEqual({
            method: 'PUT',
            headers: {
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });
        });
      });
    });

    describe('getCollectionItems', () => {
      it('should GET to /collection/{collectionName} endpoint with correct options', () => {
        const collectionName = 'some-collection-name';
        const data: MediaCollectionItems = {
          nextInclusiveStartKey: '121',
          contents: [],
        };

        fetchMock.mock(`begin:${baseUrl}/collection/${collectionName}`, {
          body: {
            data,
          },
          status: 201,
        });

        return mediaStore
          .getCollectionItems(collectionName, {
            limit: 10,
            details: 'full',
            inclusiveStartKey: 'some-inclusive-start-key',
            sortDirection: 'desc',
          })
          .then(response => {
            expect(response).toEqual({ data });
            expect(fetchMock.lastUrl()).toEqual(
              `${baseUrl}/collection/some-collection-name/items?details=full&inclusiveStartKey=some-inclusive-start-key&limit=10&sortDirection=desc`,
            );
            expect(fetchMock.lastOptions()).toEqual({
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'X-Client-Id': clientId,
                Authorization: `Bearer ${token}`,
              },
            });
            expect(authProvider).toHaveBeenCalledWith({ collectionName });
          });
      });

      it('should not return empty files', () => {
        const collectionName = 'some-collection-name';
        const data: MediaCollectionItems = {
          nextInclusiveStartKey: '121',
          contents: [
            {
              id: '1',
              insertedAt: 1,
              occurrenceKey: 'key-1',
              details: {
                size: 1,
                artifacts: {},
                mediaType: 'image',
                mimeType: '',
                name: 'file',
              },
            },
            {
              id: '2',
              insertedAt: 1,
              occurrenceKey: 'key-2',
              details: {
                size: 0,
                artifacts: {},
                mediaType: 'image',
                mimeType: '',
                name: 'file',
              },
            },
            {
              id: '3',
              insertedAt: 1,
              occurrenceKey: 'key-3',
              details: {} as any,
            },
          ],
        };

        fetchMock.mock(`begin:${baseUrl}/collection/${collectionName}`, {
          body: {
            data,
          },
          status: 201,
        });

        return mediaStore
          .getCollectionItems(collectionName, {
            limit: 10,
            details: 'full',
            inclusiveStartKey: 'some-inclusive-start-key',
            sortDirection: 'desc',
          })
          .then(response => {
            // We want to exclude all files without size. Contents contains 3 files, 2 of them empty, so we only care about the first one
            expect(response.data.contents).toHaveLength(1);
            expect(response.data.contents).toEqual([data.contents[0]]);
          });
      });
    });

    describe('touchFiles', () => {
      const createdTouchedFile1: CreatedTouchedFile = {
        fileId: 'some-file-id',
        uploadId: 'some-upload-id',
      };
      const createdTouchedFile2: CreatedTouchedFile = {
        fileId: 'some-other-file-id',
        uploadId: 'some-other-upload-id',
      };
      const params: MediaStoreTouchFileParams = {
        collection: 'some-collection-name',
      };

      const descriptor1: TouchFileDescriptor = {
        fileId: 'some-file-id',
      };
      const descriptor2: TouchFileDescriptor = {
        fileId: 'some-other-file-id',
        occurrenceKey: 'some-occurrence-key',
        collection: 'some-collection',
        deletable: false,
        expireAfter: 42,
      };

      it('should POST to /upload/createWithFiles', () => {
        const data: TouchedFiles = {
          created: [createdTouchedFile1, createdTouchedFile2],
        };
        fetchMock.mock(`begin:${baseUrl}/upload/createWithFiles`, {
          body: {
            data,
          },
          status: 201,
        });

        const body: MediaStoreTouchFileBody = {
          descriptors: [descriptor1, descriptor2],
        };
        return mediaStore.touchFiles(body, params).then(response => {
          expect(response).toEqual({ data });
          expect(fetchMock.lastUrl()).toEqual(
            `${baseUrl}/upload/createWithFiles`,
          );
          expect(fetchMock.lastOptions()).toEqual({
            method: 'POST',
            headers: {
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });
          expect(authProvider).toHaveBeenCalledWith({
            collectionName: params.collection,
          });
        });
      });

      it('should fail if error status is returned', () => {
        const errorBody = {
          error: 'something wrong',
        };
        fetchMock.mock(`begin:${baseUrl}/upload/createWithFiles`, {
          body: errorBody,
          status: 403,
        });

        const body: MediaStoreTouchFileBody = {
          descriptors: [descriptor1],
        };
        return mediaStore.touchFiles(body, params).then(
          result => {
            expect(result).not.toBeDefined();
          },
          async error => {
            expect(error.message).toMatch(
              /.*Got error code 403: {\"error\":\"something wrong\"}.*/,
            );
          },
        );
      });
    });

    describe('getFileImageURL', () => {
      it('should return the file image preview url based on the file id', async () => {
        const url = await mediaStore.getFileImageURL('1234');

        expect(url).toEqual(
          `${baseUrl}/file/1234/image?allowAnimated=true&client=some-client-id&max-age=${FILE_CACHE_MAX_AGE}&mode=crop&token=some-token`,
        );
      });
    });

    describe('getImage', () => {
      const lastOptionsHeaders = () => {
        const lastOptions = fetchMock.lastOptions();
        return (lastOptions && lastOptions.headers) || {};
      };

      it('should return file image preview', async () => {
        fetchMock.mock(`begin:${baseUrl}/file`, {
          body: {
            data,
          },
          status: 201,
        });

        const image = await mediaStore.getImage('123');
        expect(fetchMock.lastUrl()).toEqual(
          `${baseUrl}/file/123/image?allowAnimated=true&max-age=${FILE_CACHE_MAX_AGE}&mode=crop`,
        );
        expect(image).toBeInstanceOf(Blob);
      });

      it('should merge default params with given ones', async () => {
        fetchMock.mock(`begin:${baseUrl}/file`, {
          body: {
            data,
          },
          status: 201,
        });

        await mediaStore.getImage('123', {
          mode: 'full-fit',
          version: 2,
          upscale: true,
        });
        expect(fetchMock.lastUrl()).toEqual(
          `${baseUrl}/file/123/image?allowAnimated=true&max-age=${FILE_CACHE_MAX_AGE}&mode=full-fit&upscale=true&version=2`,
        );
      });

      it('should append width and height params if fetchMaxRes', async () => {
        fetchMock.mock(`begin:${baseUrl}/file`, {
          body: {
            data,
          },
          status: 201,
        });

        await mediaStore.getImage(
          '123',
          {
            mode: 'full-fit',
            version: 2,
            upscale: true,
          },
          undefined,
          true,
        );
        expect(fetchMock.lastUrl()).toEqual(
          `${baseUrl}/file/123/image?allowAnimated=true&height=4096&max-age=${FILE_CACHE_MAX_AGE}&mode=full-fit&upscale=true&version=2&width=4096`,
        );
      });

      it('should override width and height params if fetchMaxRes', async () => {
        fetchMock.mock(`begin:${baseUrl}/file`, {
          body: {
            data,
          },
          status: 201,
        });

        await mediaStore.getImage(
          '123',
          {
            mode: 'crop',
            version: 2,
            upscale: true,
            width: 1000,
            height: 1000,
          },
          undefined,
          true,
        );
        expect(fetchMock.lastUrl()).toEqual(
          `${baseUrl}/file/123/image?allowAnimated=true&height=4096&max-age=${FILE_CACHE_MAX_AGE}&mode=crop&upscale=true&version=2&width=4096`,
        );
      });

      // TODO [MS-1787]: add checkWebpSupport() back
      it.skip('should request webp content when supported', async () => {
        fetchMock.mock(`begin:${baseUrl}/file`, {
          body: {
            data,
          },
          status: 201,
        });
        checkWebpSupportMock.mockResolvedValueOnce(true);

        await mediaStore.getImage('123');

        expect(lastOptionsHeaders()).toHaveProperty(
          'accept',
          'image/webp,image/*,*/*;q=0.8',
        );
      });

      it('should not request webp content when not supported', async () => {
        fetchMock.mock(`begin:${baseUrl}/file`, {
          body: {
            data,
          },
          status: 201,
        });
        checkWebpSupportMock.mockResolvedValueOnce(false);

        await mediaStore.getImage('123');

        expect(lastOptionsHeaders()).not.toHaveProperty('accept');
      });
    });

    describe('getItems', () => {
      it('should POST to /items endpoint with correct options', () => {
        const items = ['1', '2'];
        const data: ItemsPayload[] = [
          {
            items: [
              {
                id: '1',
                collection: 'collection-1',
                type: 'file',
                details: {
                  artifacts: {} as any,
                  mediaType: 'image',
                  mimeType: 'png',
                  name: 'file-1',
                  processingStatus: 'succeeded',
                  size: 1,
                  representations: {},
                },
              },
            ],
          },
        ];

        fetchMock.mock(`begin:${baseUrl}/items`, {
          body: {
            data,
          },
          status: 200,
        });

        return mediaStore.getItems(items, 'collection-1').then(response => {
          expect(response).toEqual({ data });
          expect(fetchMock.lastUrl()).toEqual(`${baseUrl}/items`);
          expect(fetchMock.lastOptions()).toEqual({
            method: 'POST',
            headers: {
              'X-Client-Id': clientId,
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              descriptors: [
                {
                  type: 'file',
                  id: '1',
                  collection: 'collection-1',
                },
                {
                  type: 'file',
                  id: '2',
                  collection: 'collection-1',
                },
              ],
            }),
          });
        });
      });
    });

    describe('getImageMetadata()', () => {
      it('should return image metadata for the given id', async () => {
        const data: ImageMetadata = {
          pending: false,
          original: {
            height: 10,
            width: 10,
            url: 'some-preview',
          },
        };
        fetchMock.mock(`begin:${baseUrl}/file`, {
          body: data,
          status: 201,
        });

        const image = await mediaStore.getImageMetadata('123');
        expect(fetchMock.lastUrl()).toEqual(
          `${baseUrl}/file/123/image/metadata`,
        );
        expect(image).toEqual(data);
      });

      it('should generate right url based on params', async () => {
        const data: ImageMetadata = {
          pending: false,
        };
        fetchMock.mock(`begin:${baseUrl}/file`, {
          body: data,
          status: 201,
        });

        await mediaStore.getImageMetadata('123', {
          collection: 'my-collection',
        });
        expect(fetchMock.lastUrl()).toEqual(
          `${baseUrl}/file/123/image/metadata?collection=my-collection`,
        );
      });
    });

    describe('getFileBinaryURL', () => {
      let url = '';

      beforeEach(async () => {
        url = await mediaStore.getFileBinaryURL('1234', 'some-collection-name');
      });

      it('should return file url', () => {
        expect(url).toEqual(
          `${baseUrl}/file/1234/binary?client=some-client-id&collection=some-collection-name&dl=true&max-age=${FILE_CACHE_MAX_AGE}&token=some-token`,
        );
      });

      it('should call authProvider with given collection name', async () => {
        expect(authProvider).toHaveBeenCalledWith({
          collectionName: 'some-collection-name',
        });
      });
    });

    describe('getArtifactURL()', () => {
      it('should return the right artifact url', async () => {
        const url = await mediaStore.getArtifactURL(
          {
            'video_640.mp4': {
              processingStatus: 'succeeded',
              url: '/sd-video',
            },
          },
          'video_640.mp4',
          'some-collection',
        );

        expect(url).toEqual(
          `${baseUrl}/sd-video?client=some-client-id&collection=some-collection&max-age=${FILE_CACHE_MAX_AGE}&token=some-token`,
        );
      });

      it('should throw if artifact cant be found', async () => {
        const artifacts = {
          'audio.mp3': {},
        } as MediaFileArtifacts;

        await expect(
          mediaStore.getArtifactURL(artifacts, 'video_640.mp4'),
        ).rejects.toThrow('artifact video_640.mp4 not found');
        await expect(
          mediaStore.getArtifactURL(artifacts, 'audio.mp3'),
        ).rejects.toThrow('artifact audio.mp3 not found');
      });
    });
  });

  describe('given auth provider rejects', () => {
    const error = new Error('some-error');
    const authProvider = () => Promise.reject(error);

    describe('request', () => {
      it('should reject with some error', () => {
        const mediaStore = new MediaStore({
          authProvider,
        });

        return expect(mediaStore.request('/some-path')).rejects.toEqual(error);
      });
    });
  });
});
