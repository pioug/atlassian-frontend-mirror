import { UploadEvent } from '../../domain/uploadEvent';
import { Action } from 'redux';

export const SEND_UPLOAD_EVENT = 'SEND_UPLOAD_EVENT';

export type SendUploadEventActionPayload = {
  readonly event: UploadEvent;
  readonly fileId: string;
};

export type SendUploadEventAction = {
  readonly type: typeof SEND_UPLOAD_EVENT;
  readonly payload: SendUploadEventActionPayload;
};

export function isSendUploadEventAction(
  action: Action,
): action is SendUploadEventAction {
  return action.type === SEND_UPLOAD_EVENT;
}

export function sendUploadEvent(
  payload: SendUploadEventActionPayload,
): SendUploadEventAction {
  return {
    type: SEND_UPLOAD_EVENT,
    payload,
  };
}
