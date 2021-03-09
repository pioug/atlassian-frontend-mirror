import { Action, MiddlewareAPI } from 'redux';
import { FileAttributes } from '@atlaskit/media-common';

import { State } from '../../domain';
import { isHandleCloudFetchingEventAction } from '../../actions/handleCloudFetchingEvent';
import { MediaFile } from '../../../types';
import { HandlerResult } from '.';
import { RemoteUploadFailPayload } from '../../tools/websocket/upload/wsUploadEvents';

const getFileAttributes = (file: MediaFile): FileAttributes => ({
  fileId: file.id,
  fileSize: file.size,
  fileMimetype: file.type,
});

export default (action: Action, store: MiddlewareAPI<State>): HandlerResult => {
  if (isHandleCloudFetchingEventAction(action)) {
    const { event, payload, file } = action;
    const remoteUpload = store.getState().remoteUploads[payload.tenantFileId];
    const { timeStarted } = remoteUpload || { timeStarted: undefined };
    const uploadDurationMsec =
      timeStarted !== undefined ? Date.now() - timeStarted : -1;

    if (event === 'RemoteUploadStart') {
      return [
        {
          eventType: 'operational',
          action: 'commenced',
          actionSubject: 'mediaUpload',
          actionSubjectId: 'cloudMedia',
          attributes: {
            fileAttributes: getFileAttributes(file),
            sourceType: 'cloud',
            serviceName: payload.serviceName,
          },
        },
      ];
    }

    if (event === 'RemoteUploadEnd') {
      return [
        {
          eventType: 'operational',
          action: 'succeeded',
          actionSubject: 'mediaUpload',
          actionSubjectId: 'cloudMedia',
          attributes: {
            status: 'success',
            fileAttributes: getFileAttributes(file),
            sourceType: 'cloud',
            serviceName: payload.serviceName,
            uploadDurationMsec,
          },
        },
      ];
    }

    if (event === 'RemoteUploadFail') {
      return [
        {
          eventType: 'operational',
          action: 'failed',
          actionSubject: 'mediaUpload',
          actionSubjectId: 'cloudMedia',
          attributes: {
            status: 'fail',
            failReason: 'remote_upload_fail',
            error: (payload as RemoteUploadFailPayload).description,
            fileAttributes: getFileAttributes(file),
            uploadDurationMsec,
            sourceType: 'cloud',
            serviceName: payload.serviceName,
          },
        },
      ];
    }

    return [];
  }
};
