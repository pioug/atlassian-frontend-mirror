import {
  mockStore,
  asMockReturnValue,
  nextTick,
} from '@atlaskit/media-test-helpers';
import getPreviewMiddleware, { getPreview } from '../../getPreview';
import { sendUploadEvent } from '../../../actions/sendUploadEvent';
import { GetPreviewAction } from '../../../actions/getPreview';
import { Preview, NonImagePreview } from '../../../../types';
import {
  FileState,
  ProcessingFileState,
  PreviewableFileState,
  ErrorFileState,
  ImageMetadata,
  createFileStateSubject,
} from '@atlaskit/media-client';
import { Auth } from '@atlaskit/media-core';

describe('getPreviewMiddleware', () => {
  const auth: Auth = {
    clientId: 'some-client-id',
    token: 'some-token',
    baseUrl: '',
  };
  const file = {
    id: 'some-file-id',
    name: 'some-file-name',
    type: 'some-file-type',
    creationDate: Date.now(),
    size: 12345,
  };
  const collection = 'some-collection';
  const fileId = 'some-file-id';
  const preview: Preview = {
    dimensions: {
      width: 10,
      height: 10,
    },
    scaleFactor: 1,
  };

  const defaultFileState: ProcessingFileState = {
    status: 'processing',
    id: '123',
    name: 'file-name',
    size: 10,
    artifacts: {},
    mediaType: 'image',
    mimeType: 'image/png',
    representations: { image: {} },
  };

  const imageNotReadyFileState: ProcessingFileState & PreviewableFileState = {
    status: 'processing',
    id: '123',
    name: 'file-name',
    size: 10,
    artifacts: {},
    mediaType: 'image',
    mimeType: 'image/png',
    preview: {
      value: new Blob([], { type: 'image/png' }),
    },
    representations: {},
  };

  const notPreviewableFileState: ProcessingFileState = {
    status: 'processing',
    id: '123',
    name: 'file-name',
    size: 10,
    artifacts: {},
    mediaType: 'archive',
    mimeType: 'application/zip',
    representations: {},
  };

  const errorFileState: ErrorFileState = {
    status: 'error',
    id: '123',
  };

  const defaultImageMetadata: Promise<ImageMetadata> = Promise.resolve({
    original: {
      url: 'some-preview-src',
      width: 10,
      height: 10,
    },
    pending: false,
  });

  const setup = (fileState: FileState = defaultFileState) => {
    const store = mockStore();
    const { userMediaClient } = store.getState();
    asMockReturnValue(
      userMediaClient.config.authProvider,
      Promise.resolve(auth),
    );
    asMockReturnValue(
      userMediaClient.file.getFileState,
      createFileStateSubject(fileState),
    );
    asMockReturnValue(userMediaClient.getImageMetadata, defaultImageMetadata);

    return {
      store,
      next: jest.fn(),
      action: {
        type: 'GET_PREVIEW',
        file,
        collection,
        fileId,
      } as GetPreviewAction,
    };
  };

  it('should do nothing given unknown action', () => {
    const { store, next } = setup();
    const action = {
      type: 'UNKNOWN',
    };

    getPreviewMiddleware()(store)(next)(action);

    expect(store.dispatch).not.toBeCalled();
    expect(next).toBeCalledWith(action);
  });

  it('should dispatch upload-preview-update with defaultFileState', async () => {
    const { store, action } = setup();
    getPreview(store, action);
    await nextTick();
    expect(store.dispatch).toBeCalledWith(
      sendUploadEvent({
        event: {
          name: 'upload-preview-update',
          data: {
            file,
            preview,
          },
        },
        fileId,
      }),
    );
  });

  it('should dispatch upload-preview-update with imageNotReadyFileState', async () => {
    const { store, action } = setup(imageNotReadyFileState);
    getPreview(store, action);
    await nextTick();
    const preview: NonImagePreview = {
      file: (await imageNotReadyFileState.preview).value as Blob,
    };
    expect(store.dispatch).toBeCalledWith(
      sendUploadEvent({
        event: {
          name: 'upload-preview-update',
          data: {
            file,
            preview,
          },
        },
        fileId,
      }),
    );
  });

  it('should dispatch upload-preview-update with notPreviewableFileState', async () => {
    const { store, action } = setup(notPreviewableFileState);
    getPreview(store, action);
    await nextTick();
    expect(store.dispatch).toBeCalledWith(
      sendUploadEvent({
        event: {
          name: 'upload-preview-update',
          data: {
            file,
            preview: { file: undefined },
          },
        },
        fileId,
      }),
    );
  });

  it('should not dispatch upload-preview-update with errorFileState', async () => {
    const { store, action } = setup(errorFileState);
    getPreview(store, action);
    await nextTick();
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
