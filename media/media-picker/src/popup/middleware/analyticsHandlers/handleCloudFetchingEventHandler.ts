import {
  TRACK_EVENT_TYPE,
  OPERATIONAL_EVENT_TYPE,
} from '@atlaskit/analytics-gas-types';
import { Action, MiddlewareAPI } from 'redux';
import { State } from '../../domain';
import { isHandleCloudFetchingEventAction } from '../../actions/handleCloudFetchingEvent';
import { MediaFile } from '../../../types';
import { HandlerResult } from '.';
import {
  FailurePayload,
  SuccessPayload,
} from '../../../components/localUploadReact';
import { RemoteUploadFailPayload } from '../../tools/websocket/upload/wsUploadEvents';

const commonPayload = {
  actionSubject: 'mediaUpload',
  actionSubjectId: 'cloudMedia',
};

const fileAttributes = (file: MediaFile) => ({
  fileId: file.id,
  fileSize: file.size,
  fileMimetype: file.type,
  fileSource: 'mediapicker',
});

export default (action: Action, store: MiddlewareAPI<State>): HandlerResult => {
  if (isHandleCloudFetchingEventAction(action)) {
    const { event, payload, file } = action;
    const remoteUpload = store.getState().remoteUploads[payload.tenantFileId];
    const { timeStarted } = remoteUpload || { timeStarted: undefined };
    const uploadDurationMsec =
      timeStarted !== undefined ? Date.now() - timeStarted : -1;
    const commonAttributes = {
      sourceType: 'cloud',
      serviceName: payload.serviceName,
    };
    if (event === 'RemoteUploadStart') {
      return [
        {
          action: 'commenced',
          ...commonPayload,
          attributes: {
            fileAttributes: fileAttributes(file),
            ...commonAttributes,
          },
          eventType: OPERATIONAL_EVENT_TYPE,
        },
      ];
    } else if (event === 'RemoteUploadEnd') {
      return [
        {
          action: 'uploaded',
          ...commonPayload,
          attributes: {
            fileAttributes: fileAttributes(file),
            ...commonAttributes,
            status: 'success',
            uploadDurationMsec,
          } as SuccessPayload,
          eventType: TRACK_EVENT_TYPE,
        },
      ];
    } else if (event === 'RemoteUploadFail') {
      return [
        {
          action: 'uploaded',
          ...commonPayload,
          attributes: {
            fileAttributes: fileAttributes(file),
            ...commonAttributes,
            status: 'fail',
            uploadDurationMsec,
            failReason: (payload as RemoteUploadFailPayload).description,
          } as FailurePayload,
          eventType: TRACK_EVENT_TYPE,
        },
      ];
    } else {
      return [];
    }
  }
};
