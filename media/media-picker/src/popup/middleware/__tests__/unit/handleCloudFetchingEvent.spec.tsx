import {
  expectFunctionToHaveBeenCalledWith,
  mockStore,
} from '@atlaskit/media-test-helpers';
import { RECENTS_COLLECTION } from '@atlaskit/media-client/constants';
import { handleCloudFetchingEvent } from '../../handleCloudFetchingEvent';
import {
  HANDLE_CLOUD_FETCHING_EVENT,
  HandleCloudFetchingEventAction,
} from '../../../actions/handleCloudFetchingEvent';
import { finalizeUpload } from '../../../actions/finalizeUpload';
import { sendUploadEvent } from '../../../actions/sendUploadEvent';

describe('handleCloudFetchingEvent', () => {
  const tenantFileId = 'some-tenant-file-id';
  const userFileId = 'some-user-file-id';
  const serviceName = 'dropbox';
  const client = { id: 'some-client-id', token: 'some-client-token' };
  const description = 'some-error-description';
  const file = {
    id: tenantFileId,
    name: 'some-name',
    size: 12345,
    creationDate: Date.now(),
    type: 'image/jpg',
  };

  const setup = () => {
    return {
      store: mockStore(),
      next: jest.fn(),
    };
  };

  it('should dispatch finalizeUpload and getPreview when receives RemoteUploadEnd event', () => {
    const { store, next } = setup();
    const action: HandleCloudFetchingEventAction<'RemoteUploadEnd'> = {
      type: HANDLE_CLOUD_FETCHING_EVENT,
      file,
      event: 'RemoteUploadEnd',
      payload: { userFileId, tenantFileId, serviceName },
    };
    const remoteUploads = {
      'some-unique-identifier-id': {},
    };

    (store.getState as jest.Mock<any>).mockReturnValue({
      client,
      remoteUploads,
    });

    handleCloudFetchingEvent(store)(next)(action);

    const uploadedFile = {
      ...file,
      id: userFileId,
    };

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expectFunctionToHaveBeenCalledWith(store.dispatch, [
      finalizeUpload(uploadedFile, tenantFileId, {
        id: userFileId,
        collection: RECENTS_COLLECTION,
      }),
    ]);
  });

  it('should report upload-error to the parent channel when receives RemoteUploadFail event', () => {
    const { store, next } = setup();
    const action: HandleCloudFetchingEventAction<'RemoteUploadFail'> = {
      type: HANDLE_CLOUD_FETCHING_EVENT,
      file,
      event: 'RemoteUploadFail',
      payload: { tenantFileId, description, serviceName },
    };

    handleCloudFetchingEvent(store)(next)(action);

    expectFunctionToHaveBeenCalledWith(store.dispatch, [
      sendUploadEvent({
        event: {
          name: 'upload-error',
          data: {
            fileId: tenantFileId,
            error: {
              fileId: tenantFileId,
              name: 'remote_upload_fail',
              description,
            },
          },
        },
        fileId: tenantFileId,
      }),
    ]);
  });

  it('should call next(action) if the action type matches', () => {
    const { store, next } = setup();
    const action = {
      type: HANDLE_CLOUD_FETCHING_EVENT,
      event: 'unknown',
    };

    handleCloudFetchingEvent(store)(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should call next(action) if the action type does not match', () => {
    const { store, next } = setup();
    const action = {
      type: 'some-other-type',
    };

    handleCloudFetchingEvent(store)(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });
});
