import { Action } from 'redux';
import { WsUploadEvents } from '../tools/websocket/upload/wsUploadEvents';
import { MediaFile } from '../../types';

export const HANDLE_CLOUD_FETCHING_EVENT = 'HANDLE_CLOUD_FETCHING_EVENT';

export interface HandleCloudFetchingEventAction<
  T extends keyof WsUploadEvents
> {
  readonly type: 'HANDLE_CLOUD_FETCHING_EVENT';
  readonly file: MediaFile;
  readonly event: T;
  readonly payload: WsUploadEvents[T];
}

export function isHandleCloudFetchingEventAction<
  T extends keyof WsUploadEvents
>(action: Action): action is HandleCloudFetchingEventAction<T> {
  return action.type === HANDLE_CLOUD_FETCHING_EVENT;
}

export function handleCloudFetchingEvent<T extends keyof WsUploadEvents>(
  file: MediaFile,
  event: T,
  payload: WsUploadEvents[T],
): HandleCloudFetchingEventAction<T> {
  return {
    type: HANDLE_CLOUD_FETCHING_EVENT,
    file,
    event,
    payload,
  };
}
