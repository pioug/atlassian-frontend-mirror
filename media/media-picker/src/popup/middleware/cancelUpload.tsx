import { MiddlewareAPI, Dispatch, Action } from 'redux';

import { isCancelUploadAction } from '../actions/cancelUpload';
import { State } from '../domain';

export default (store: MiddlewareAPI<State>) => (next: Dispatch<State>) => (
  action: Action,
) => {
  if (isCancelUploadAction(action)) {
    const { tenantFileId } = action.payload;
    const { onCancelUpload } = store.getState();
    onCancelUpload(tenantFileId);
  }

  return next(action);
};
