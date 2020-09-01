import {
  getFileStreamsCache,
  isPreviewableFileState,
  isErrorFileState,
  observableToPromise,
} from '@atlaskit/media-client';
import { RECENTS_COLLECTION } from '@atlaskit/media-client/constants';

import { Action, Dispatch, Store } from 'redux';
import { finalizeUpload } from '../actions/finalizeUpload';
import {
  HANDLE_CLOUD_FETCHING_EVENT,
  HandleCloudFetchingEventAction,
} from '../actions/handleCloudFetchingEvent';

import { State } from '../domain';

import {
  WsUploadEvents,
  RemoteUploadProgressPayload,
  RemoteUploadEndPayload,
  RemoteUploadFailPayload,
} from '../tools/websocket/upload/wsUploadEvents';
import { MediaFile } from '../../types';
import { sendUploadEvent } from '../actions/sendUploadEvent';

export type CloudFetchingEventAction = HandleCloudFetchingEventAction<
  keyof WsUploadEvents
>;

const isCloudFetchingEventAction = (
  action: Action,
): action is CloudFetchingEventAction => {
  return action.type === HANDLE_CLOUD_FETCHING_EVENT;
};

const isRemoteUploadProgressAction = (
  action: CloudFetchingEventAction,
): action is HandleCloudFetchingEventAction<'RemoteUploadProgress'> => {
  return action.event === 'RemoteUploadProgress';
};

const isRemoteUploadEndAction = (
  action: CloudFetchingEventAction,
): action is HandleCloudFetchingEventAction<'RemoteUploadEnd'> => {
  return action.event === 'RemoteUploadEnd';
};

const isRemoteUploadFailAction = (
  action: CloudFetchingEventAction,
): action is HandleCloudFetchingEventAction<'RemoteUploadFail'> => {
  return action.event === 'RemoteUploadFail';
};

export const handleCloudFetchingEvent = (store: Store<State>) => (
  next: Dispatch<State>,
) => (action: Action) => {
  // Handle cloud upload progress
  const handleRemoteUploadProgressMessage = (
    file: MediaFile,
    data: RemoteUploadProgressPayload,
  ) => {
    // TODO: MS2927 - handle progress for remote uploads
  };

  // Handle cloud upload end
  const handleRemoteUploadEndMessage = async (
    file: MediaFile,
    payload: RemoteUploadEndPayload,
  ) => {
    const { tenantFileId, userFileId } = payload;
    const source = {
      id: userFileId,
      collection: RECENTS_COLLECTION,
    };
    const uploadedFile: MediaFile = {
      ...file,
      id: userFileId,
    };

    const tenantFileObservable = getFileStreamsCache().get(tenantFileId);

    const tenantFileState = tenantFileObservable
      ? await observableToPromise(tenantFileObservable)
      : undefined;

    const preview =
      tenantFileState && isPreviewableFileState(tenantFileState)
        ? tenantFileState.preview
        : undefined;

    const mimeType =
      tenantFileState && !isErrorFileState(tenantFileState)
        ? tenantFileState.mimeType
        : undefined;

    store.dispatch(
      finalizeUpload(uploadedFile, tenantFileId, source, { preview, mimeType }),
    );
  };

  // Handle cloud upload fail
  const handleRemoteUploadFailMessage = (
    file: MediaFile,
    data: RemoteUploadFailPayload,
  ) => {
    store.dispatch(
      sendUploadEvent({
        event: {
          name: 'upload-error',
          data: {
            fileId: data.tenantFileId,
            error: {
              fileId: data.tenantFileId,
              name: 'remote_upload_fail',
              description: data.description,
            },
          },
        },
        fileId: data.tenantFileId,
      }),
    );
  };

  if (isCloudFetchingEventAction(action)) {
    if (isRemoteUploadProgressAction(action)) {
      handleRemoteUploadProgressMessage(action.file, action.payload);
    } else if (isRemoteUploadEndAction(action)) {
      handleRemoteUploadEndMessage(action.file, action.payload);
    } else if (isRemoteUploadFailAction(action)) {
      handleRemoteUploadFailMessage(action.file, action.payload);
    }
  }

  return next(action);
};
