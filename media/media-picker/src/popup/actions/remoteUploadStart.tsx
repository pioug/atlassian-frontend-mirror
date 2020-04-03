import { Action } from 'redux';

export const REMOTE_UPLOAD_START = 'REMOTE_UPLOAD_START';

export interface RemoteUploadStartAction extends Action {
  readonly type: 'REMOTE_UPLOAD_START';
  readonly tenantFileId: string;
}

export function remoteUploadStart(
  tenantFileId: string,
): RemoteUploadStartAction {
  return {
    type: REMOTE_UPLOAD_START,
    tenantFileId,
  };
}
