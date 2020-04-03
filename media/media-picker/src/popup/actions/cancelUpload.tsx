import { Action } from 'redux';

export const CANCEL_UPLOAD = 'CANCEL_UPLOAD';

export interface CancelUploadActionPayload {
  readonly tenantFileId: string;
}

export interface CancelUploadAction extends Action {
  readonly type: 'CANCEL_UPLOAD';
  readonly payload: CancelUploadActionPayload;
}

export function isCancelUploadAction(
  action: Action,
): action is CancelUploadAction {
  return action.type === CANCEL_UPLOAD;
}

export function cancelUpload(
  payload: CancelUploadActionPayload,
): CancelUploadAction {
  return {
    type: CANCEL_UPLOAD,
    payload,
  };
}
