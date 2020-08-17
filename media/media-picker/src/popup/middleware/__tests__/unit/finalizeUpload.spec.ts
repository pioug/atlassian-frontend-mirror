import * as MediaClientModule from '@atlaskit/media-client';
import { Auth } from '@atlaskit/media-core';
import {
  getFileStreamsCache,
  ProcessedFileState,
  globalMediaEventEmitter,
  MediaType,
  FilePreview,
} from '@atlaskit/media-client';
import {
  mockStore,
  expectFunctionToHaveBeenCalledWith,
  asMock,
  fakeMediaClient,
} from '@atlaskit/media-test-helpers';
import { sendUploadEvent } from '../../../actions/sendUploadEvent';
import { resetView } from '../../../actions';
import finalizeUploadMiddleware, { finalizeUpload } from '../../finalizeUpload';
import {
  FinalizeUploadAction,
  FinalizeUploadSource,
  FINALIZE_UPLOAD,
} from '../../../actions/finalizeUpload';
import { MediaFile } from '../../../../types';
import { State } from '../../../domain';

describe('finalizeUploadMiddleware', () => {
  const fileId = 'some-file-id';
  const mediaType: MediaType = 'image';
  const mimeType = 'image/png';
  const auth: Auth = {
    clientId: 'some-client-id',
    token: 'some-token',
    baseUrl: 'some-base-url',
  };
  const preview: FilePreview = {
    value: new Blob([], { type: mimeType }),
    origin: 'local',
  };
  const file: MediaFile = {
    id: fileId,
    name: 'some-file-name',
    size: 12345,
    creationDate: Date.now(),
    type: mediaType,
    occurrenceKey: 'some-occurence-key',
  };
  const copiedFile: MediaFile = {
    ...file,
    id: 'some-copied-file-id',
  };
  const copiedFileState: ProcessedFileState = {
    ...copiedFile,
    status: 'processed',
    artifacts: {},
    mediaType,
    mimeType,
    preview,
  };
  const collection = 'some-collection';

  const replaceFileId = 'some-replace-file-id';
  const source: FinalizeUploadSource = {
    id: fileId,
    collection,
  };
  const setup = (state: Partial<State> = {}) => {
    const store = mockStore(state);
    const { userMediaClient, tenantMediaClient } = store.getState();
    const globalEmitSpy = jest.spyOn(globalMediaEventEmitter, 'emit');
    (userMediaClient.config.authProvider as jest.Mock<any>).mockReturnValue(
      Promise.resolve(auth),
    );

    tenantMediaClient.file.getCurrentState = jest.fn(() =>
      Promise.resolve(copiedFileState),
    );

    jest
      .spyOn(MediaClientModule, 'FileFetcherImpl' as any)
      .mockImplementation(() => ({
        copyFile: () => Promise.resolve(copiedFile),
      }));

    return {
      store,
      next: jest.fn(),
      action: {
        type: FINALIZE_UPLOAD,
        file,
        replaceFileId,
        source,
        preview,
      } as FinalizeUploadAction,
      userMediaClient,
      tenantMediaClient,
      globalEmitSpy,
      preview,
    };
  };

  beforeEach(() => {
    getFileStreamsCache().removeAll();
    return jest.clearAllMocks();
  });

  it('should do nothing given unknown action', () => {
    const { store, next } = setup();
    const action = {
      type: 'UNKNOWN',
    };

    finalizeUploadMiddleware()(store)(next)(action);

    expect(store.dispatch).not.toBeCalled();
    expect(next).toBeCalledWith(action);
  });

  it('should send upload end event with metadata', async () => {
    const { store, action } = setup();

    await finalizeUpload(store, action);
    expect(store.dispatch).toBeCalledWith(
      sendUploadEvent({
        event: {
          name: 'upload-end',
          data: {
            file,
          },
        },
        fileId: replaceFileId,
      }),
    );
  });

  it('should send upload error event given some error happens', async () => {
    const tenantMediaClient = fakeMediaClient();
    const { store, action } = setup({ tenantMediaClient });
    const error = new Error('some-error-message');

    jest
      .spyOn(tenantMediaClient.file, 'copyFile' as any)
      .mockImplementation(() => Promise.reject(error));

    await finalizeUpload(store, action);

    expect(tenantMediaClient.file.copyFile).toBeCalledTimes(1);
    expect(store.dispatch).toBeCalledWith(
      sendUploadEvent({
        event: {
          name: 'upload-error',
          data: {
            fileId: replaceFileId,
            error: {
              name: 'object_create_fail',
              description: error.message,
            },
          },
        },
        fileId: replaceFileId,
      }),
    );
  });

  it('should call copyFile the right params', async () => {
    const tenantMediaClient = fakeMediaClient();
    const { store, action, userMediaClient, preview } = setup({
      config: { uploadParams: { collection: 'some-tenant-collection' } },
      tenantMediaClient,
    });

    await finalizeUpload(store, action);

    expect(tenantMediaClient.file.copyFile).toBeCalledTimes(1);
    expectFunctionToHaveBeenCalledWith(tenantMediaClient.file.copyFile, [
      {
        id: 'some-file-id',
        collection: 'some-collection',
        authProvider: userMediaClient.config.authProvider,
      },
      {
        collection: 'some-tenant-collection',
        replaceFileId,
        occurrenceKey: file.occurrenceKey,
        authProvider: tenantMediaClient.config.authProvider,
      },
      {
        preview,
      },
    ]);
  });

  it('should call reset view', async () => {
    const { store, action } = setup();

    await finalizeUpload(store, action);

    expect(store.dispatch).toHaveBeenCalledWith(resetView());
  });

  it('should emit file-added in tenant mediaClient and globalMediaEventEmitter', async () => {
    const { store, action, tenantMediaClient, globalEmitSpy } = setup();

    await finalizeUpload(store, action);

    expect(globalEmitSpy).toBeCalledTimes(1);
    expect(globalEmitSpy).toHaveBeenCalledWith(
      'file-added',
      expect.objectContaining(copiedFileState),
    );

    expect(tenantMediaClient.emit).toBeCalledTimes(1);
    expect(asMock(tenantMediaClient.emit)).toHaveBeenCalledWith(
      'file-added',
      expect.objectContaining(copiedFileState),
    );
  });
});
