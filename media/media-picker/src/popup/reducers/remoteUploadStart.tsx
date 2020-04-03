import {
  REMOTE_UPLOAD_START,
  RemoteUploadStartAction,
} from '../actions/remoteUploadStart';
import { State } from '../domain';

export default function remoteUploadStart(
  state: State,
  action: RemoteUploadStartAction,
): State {
  if (action.type === REMOTE_UPLOAD_START) {
    const { tenantFileId } = action;
    const remoteUploads = { ...state.remoteUploads };

    remoteUploads[tenantFileId] = {
      timeStarted: Date.now(),
    };

    return { ...state, remoteUploads };
  }

  return state;
}
