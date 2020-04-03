import {
  expectFunctionToHaveBeenCalledWith,
  mockPopupUploadEventEmitter,
  mockStore,
} from '@atlaskit/media-test-helpers';
import sendUploadEventMiddleware from '../../sendUploadEvent';
import { sendUploadEvent } from '../../../actions/sendUploadEvent';
import { MediaError } from '../../../../types';
import { SCALE_FACTOR_DEFAULT } from '../../../../util/getPreviewFromImage';
import { MediaFile } from '../../../../types';
// avoid polluting test logs with error message in console
// please ensure you fix it if you expect console.error to be thrown
// eslint-disable-next-line no-console
let consoleError = console.error;

describe('sendUploadEvent middleware', () => {
  const fileId = 'some-file-id';
  const file: MediaFile = {
    id: 'some-file-id',
    name: 'some-file-name',
    size: 12345,
    creationDate: Date.now(),
    type: 'image/jpg',
  };
  const setup = () => ({
    eventEmitter: mockPopupUploadEventEmitter(),
    store: mockStore(),
    next: jest.fn(),
  });

  it('should do nothing given unknown action', () => {
    const { eventEmitter, store, next } = setup();
    const action = {
      type: 'UNKNOWN',
    };

    sendUploadEventMiddleware(eventEmitter)(store)(next)(action);

    expect(eventEmitter.emitClosed).not.toBeCalled();
    expect(eventEmitter.emitUploadsStart).not.toBeCalled();
    expect(eventEmitter.emitUploadPreviewUpdate).not.toBeCalled();
    expect(eventEmitter.emitUploadEnd).not.toBeCalled();
    expect(eventEmitter.emitUploadError).not.toBeCalled();

    expect(next).toBeCalledWith(action);
  });

  it('should emit upload preview update event', () => {
    const { eventEmitter, store, next } = setup();
    const preview = {
      dimensions: {
        width: 1980,
        height: 1080,
      },
      scaleFactor: SCALE_FACTOR_DEFAULT,
    };

    sendUploadEventMiddleware(eventEmitter)(store)(next)(
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

    expect(eventEmitter.emitUploadPreviewUpdate).toBeCalledWith(
      {
        ...file,
        id: fileId,
      },
      preview,
    );
  });

  it('should emit upload end event', () => {
    const { eventEmitter, store, next } = setup();

    sendUploadEventMiddleware(eventEmitter)(store)(next)(
      sendUploadEvent({
        event: {
          name: 'upload-end',
          data: {
            file,
          },
        },
        fileId,
      }),
    );

    expect(eventEmitter.emitUploadEnd).toBeCalledWith({
      ...file,
      id: fileId,
    });
  });

  it('should emit upload error event', () => {
    const { eventEmitter, store, next } = setup();
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    const error: MediaError = {
      name: 'upload_fail',
      description: 'some-description',
    };

    sendUploadEventMiddleware(eventEmitter)(store)(next)(
      sendUploadEvent({
        event: {
          name: 'upload-error',
          data: {
            fileId,
            error,
          },
        },
        fileId,
      }),
    );

    expectFunctionToHaveBeenCalledWith(eventEmitter.emitUploadError, [
      fileId,
      error,
    ]);
    // eslint-disable-next-line no-console
    console.error = consoleError;
  });
});
