import { mockStore, asMockReturnValue } from '@atlaskit/media-test-helpers';
import getPreviewMiddleware, { getPreview } from '../../getPreview';
import { sendUploadEvent } from '../../../actions/sendUploadEvent';
import { GetPreviewAction } from '../../../actions/getPreview';
import { Preview } from '../../../../types';
import {
  FileState,
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

  const defaultFileState: FileState = {
    status: 'processing',
    id: '123',
    name: 'file-name',
    size: 10,
    artifacts: {},
    mediaType: 'image',
    mimeType: 'image/png',
    representations: { image: {} },
  };

  const defaultImageMetadata: Promise<ImageMetadata> = Promise.resolve({
    original: {
      url: 'some-preview-src',
      width: 10,
      height: 10,
    },
    pending: false,
  });

  const setup = () => {
    const store = mockStore();
    const { userMediaClient } = store.getState();
    asMockReturnValue(
      userMediaClient.config.authProvider,
      Promise.resolve(auth),
    );
    asMockReturnValue(
      userMediaClient.file.getFileState,
      createFileStateSubject(defaultFileState),
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

  it('should dispatch send upload event action with upload-preview-update event', async () => {
    const { store, action } = setup();
    getPreview(store, action);
    await defaultImageMetadata;
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
});
