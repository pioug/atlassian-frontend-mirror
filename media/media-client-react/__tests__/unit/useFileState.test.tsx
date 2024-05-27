import React from 'react';

import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { disableFetchMocks } from 'jest-fetch-mock';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import {
  getFileStreamsCache,
  MediaClient,
  type ResponseFileItem,
} from '@atlaskit/media-client';
import { mediaStore } from '@atlaskit/media-state';

import {
  MediaClientContext,
  MediaClientProvider,
  useFileState,
} from '../../src';

disableFetchMocks();

const testFileId = '5e82cf3e-6bc3-4d6d-8830-8e25ac5589de';
const collectionName = 'MediaServicesSample';
const baseUrl = 'http://localhost:9000';

const succeededData: ResponseFileItem = {
  type: 'file',
  id: testFileId,
  collection: collectionName,
  details: {
    mediaType: 'image',
    mimeType: 'image/png',
    name: 'test-image.png',
    size: 158,
    processingStatus: 'succeeded',
    artifacts: {
      'image.jpg': {
        url: '/file/5e82cf3e-6bc3-4d6d-8830-8e25ac5589de/artifact/image.jpg/binary',
        processingStatus: 'succeeded',
      },
      'image.png': {
        url: '/file/5e82cf3e-6bc3-4d6d-8830-8e25ac5589de/artifact/image.png/binary',
        processingStatus: 'succeeded',
      },
    },
    representations: {
      image: {},
    },
    createdAt: 1692768921463,
  },
};

const pendingData: ResponseFileItem = {
  type: 'file',
  id: testFileId,
  collection: collectionName,
  details: {
    mediaType: 'unknown',
    mimeType: 'video/mp4',
    name: 'test-video.mp4',
    size: 46649,
    processingStatus: 'pending',
    artifacts: {},
    representations: {},
    createdAt: 1692776325208,
  },
};

const server = setupServer(
  rest.post(`${baseUrl}/items`, (_, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        data: {
          items: [succeededData],
        },
      }),
    ),
  ),
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  getFileStreamsCache().removeAll();
  mediaStore.setState(state => {
    state.files = {};
  });
});

afterAll(() => server.close());

describe('useFileState', () => {
  it('should return the correct file state when passing invalid file id', async () => {
    const mediaConfig = {
      authProvider: () =>
        Promise.resolve({
          clientId: 'clientId',
          token: 'token',
          baseUrl,
        }),
    };
    const wrapper = ({ children }: any) => (
      <MediaClientProvider clientConfig={mediaConfig}>
        {children}
      </MediaClientProvider>
    );

    const { result } = renderHook(
      () => useFileState('dummpyId', { collectionName }),
      { wrapper },
    );
    await waitFor(() =>
      expect(result.current.fileState).toEqual({
        details: {
          collectionName: 'MediaServicesSample',
          id: 'dummpyId',
          occurrenceKey: undefined,
          reason: 'invalidFileId',
        },
        id: 'dummpyId',
        message: 'invalidFileId',
        occurrenceKey: undefined,
        reason: 'invalidFileId',
        status: 'error',
      }),
    );
  });

  it('should return the file state from cache only if cache already exists in the cache', async () => {
    const mediaClient = new MediaClient({
      authProvider: () =>
        Promise.resolve({
          clientId: 'clientId',
          token: 'token',
          baseUrl,
        }),
    });

    spyOn(mediaClient.mediaStore, 'getItems');

    const testState = {
      id: testFileId,
      status: 'processing',
      name: 'test file',
      size: 312312,
      mediaType: 'unknown',
      mimeType: 'video/mp4',
    } as any;

    mediaStore.setState(state => {
      state.files[testFileId] = testState;
    });

    const wrapper = ({ children }: any) => (
      <MediaClientContext.Provider value={mediaClient}>
        {children}
      </MediaClientContext.Provider>
    );

    const { result } = renderHook(
      () => useFileState(testFileId, { collectionName }),
      { wrapper },
    );

    expect(result.current.fileState).toEqual(testState);
    expect(mediaClient.mediaStore.getItems).not.toBeCalled();
  });

  it('should return the correct file state for a succeeded processing status', async () => {
    const mediaConfig = {
      authProvider: () =>
        Promise.resolve({
          clientId: 'clientId',
          token: 'token',
          baseUrl,
        }),
    };
    const wrapper = ({ children }: any) => (
      <MediaClientProvider clientConfig={mediaConfig}>
        {children}
      </MediaClientProvider>
    );

    const { result } = renderHook(
      () => useFileState(testFileId, { collectionName }),
      { wrapper },
    );
    await waitFor(() =>
      expect(result.current.fileState).toEqual({
        artifacts: succeededData.details.artifacts,
        createdAt: succeededData.details.createdAt,
        id: succeededData.id,
        mediaType: succeededData.details.mediaType,
        metadataTraceContext: {
          spanId: expect.any(String),
          traceId: expect.any(String),
        },
        mimeType: succeededData.details.mimeType,
        name: succeededData.details.name,
        representations: succeededData.details.representations,
        size: succeededData.details.size,
        status: 'processed',
      }),
    );
  });

  it('should return the correct file state for a pending processing status', async () => {
    server.use(
      rest.post(`${baseUrl}/items`, (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            data: {
              items: [pendingData],
            },
          }),
        ),
      ),
    );
    const mediaConfig = {
      authProvider: () =>
        Promise.resolve({
          clientId: 'clientId',
          token: 'token',
          baseUrl,
        }),
    };
    const wrapper = ({ children }: any) => (
      <MediaClientProvider clientConfig={mediaConfig}>
        {children}
      </MediaClientProvider>
    );

    const { result } = renderHook(
      () => useFileState(testFileId, { collectionName }),
      { wrapper },
    );
    await waitFor(() =>
      expect(result.current.fileState).toEqual({
        artifacts: {},
        createdAt: pendingData.details.createdAt,
        id: pendingData.id,
        mediaType: pendingData.details.mediaType,
        metadataTraceContext: {
          spanId: expect.any(String),
          traceId: expect.any(String),
        },
        mimeType: pendingData.details.mimeType,
        name: pendingData.details.name,
        representations: pendingData.details.representations,
        size: pendingData.details.size,
        status: 'processing',
      }),
    );
  });

  it('should return the correct file state for emptyItems response', async () => {
    server.use(
      rest.post(`${baseUrl}/items`, (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            data: {
              items: [],
            },
          }),
        ),
      ),
    );
    const mediaConfig = {
      authProvider: () =>
        Promise.resolve({
          clientId: 'clientId',
          token: 'token',
          baseUrl,
        }),
    };
    const wrapper = ({ children }: any) => (
      <MediaClientProvider clientConfig={mediaConfig}>
        {children}
      </MediaClientProvider>
    );

    const { result } = renderHook(
      () => useFileState(testFileId, { collectionName }),
      { wrapper },
    );
    await waitFor(() =>
      expect(result.current.fileState).toEqual({
        details: {
          collectionName: collectionName,
          id: testFileId,
          occurrenceKey: undefined,
          reason: 'emptyItems',
        },
        id: testFileId,
        message: 'emptyItems',
        occurrenceKey: undefined,
        reason: 'emptyItems',
        status: 'error',
      }),
    );
  });

  it('should return the correct file state for emptyFile response', async () => {
    server.use(
      rest.post(`${baseUrl}/items`, (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            data: {
              items: [
                {
                  type: 'file',
                  id: testFileId,
                  collection: collectionName,
                  details: {
                    createdAt: Date.now() - 12 * 1000 * 60 * 60 - 1, // 12hrs from now
                  },
                },
              ],
            },
          }),
        ),
      ),
    );
    const mediaConfig = {
      authProvider: () =>
        Promise.resolve({
          clientId: 'clientId',
          token: 'token',
          baseUrl,
        }),
    };
    const wrapper = ({ children }: any) => (
      <MediaClientProvider clientConfig={mediaConfig}>
        {children}
      </MediaClientProvider>
    );

    const { result } = renderHook(
      () => useFileState(testFileId, { collectionName }),
      { wrapper },
    );

    await waitFor(() =>
      expect(result.current.fileState).toEqual({
        details: {
          collectionName: collectionName,
          id: testFileId,
          occurrenceKey: undefined,
          reason: 'zeroVersionFile',
        },
        id: testFileId,
        message: 'zeroVersionFile',
        occurrenceKey: undefined,
        reason: 'zeroVersionFile',
        status: 'error',
      }),
    );
  });
  describe('network errors', () => {
    it('400', async () => {
      server.use(
        rest.post(`${baseUrl}/items`, (_, res, ctx) => res(ctx.status(400))),
      );
      const mediaConfig = {
        authProvider: () =>
          Promise.resolve({
            clientId: 'clientId',
            token: 'token',
            baseUrl,
          }),
      };
      const wrapper = ({ children }: any) => (
        <MediaClientProvider clientConfig={mediaConfig}>
          {children}
        </MediaClientProvider>
      );

      const { result } = renderHook(
        () => useFileState(testFileId, { collectionName }),
        { wrapper },
      );

      await waitFor(() =>
        expect(result.current.fileState).toEqual({
          details: {
            attempts: undefined,
            clientExhaustedRetries: undefined,
            endpoint: '/items',
            innerError: undefined,
            mediaEnv: 'unknown',
            mediaRegion: 'unknown',
            method: 'POST',
            reason: 'serverBadRequest',
            statusCode: 400,
          },
          id: testFileId,
          message: 'serverBadRequest',
          occurrenceKey: undefined,
          reason: 'serverBadRequest',
          status: 'error',
        }),
      );
    });

    it('404', async () => {
      server.use(
        rest.post(`${baseUrl}/items`, (_, res, ctx) => res(ctx.status(404))),
      );
      const mediaConfig = {
        authProvider: () =>
          Promise.resolve({
            clientId: 'clientId',
            token: 'token',
            baseUrl,
          }),
      };
      const wrapper = ({ children }: any) => (
        <MediaClientProvider clientConfig={mediaConfig}>
          {children}
        </MediaClientProvider>
      );

      const { result } = renderHook(
        () => useFileState(testFileId, { collectionName }),
        { wrapper },
      );

      await waitFor(() =>
        expect(result.current.fileState).toEqual({
          details: {
            attempts: undefined,
            clientExhaustedRetries: undefined,
            endpoint: '/items',
            innerError: undefined,
            mediaEnv: 'unknown',
            mediaRegion: 'unknown',
            method: 'POST',
            reason: 'serverNotFound',
            statusCode: 404,
          },
          id: testFileId,
          message: 'serverNotFound',
          occurrenceKey: undefined,
          reason: 'serverNotFound',
          status: 'error',
        }),
      );
    });

    it('500', async () => {
      server.use(
        rest.post(`${baseUrl}/items`, (_, res, ctx) => res(ctx.status(500))),
      );
      const mediaConfig = {
        authProvider: () =>
          Promise.resolve({
            clientId: 'clientId',
            token: 'token',
            baseUrl,
          }),
      };
      const wrapper = ({ children }: any) => (
        <MediaClientProvider clientConfig={mediaConfig}>
          {children}
        </MediaClientProvider>
      );

      const { result } = renderHook(
        () => useFileState(testFileId, { collectionName }),
        { wrapper },
      );

      // We don't expect any result in this situation.
      // As for a 500 error, the system will keep trying until it hits the maximum attempts.
      await waitFor(() => expect(result.current.fileState).toEqual(undefined));
    });
  });

  describe('options', () => {
    it('skipRemote', () => {
      const mediaClient = new MediaClient({
        authProvider: () =>
          Promise.resolve({
            clientId: 'clientId',
            token: 'token',
            baseUrl,
          }),
      });

      spyOn(mediaClient.mediaStore, 'getItems');
      const wrapper = ({ children }: any) => (
        <MediaClientContext.Provider value={mediaClient}>
          {children}
        </MediaClientContext.Provider>
      );

      const { result } = renderHook(
        () => useFileState(testFileId, { collectionName, skipRemote: true }),
        { wrapper },
      );

      expect(result.current.fileState).toEqual(undefined);
      expect(mediaClient.mediaStore.getItems).not.toBeCalled();
    });
  });
});
