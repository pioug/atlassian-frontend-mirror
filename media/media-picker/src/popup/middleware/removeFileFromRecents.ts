import { RECENTS_COLLECTION } from '@atlaskit/media-client/constants';
import { Store, Dispatch, Action } from 'redux';
import { State } from '../domain';
import { isRemoveFileFromRecentsAction } from '../actions/removeFileFromRecents';

export const removeFileFromRecents = (store: Store<State>) => (
  next: Dispatch<State>,
) => (action: Action) => {
  if (isRemoveFileFromRecentsAction(action)) {
    store
      .getState()
      .userMediaClient.collection.removeFile(
        action.userFileId || action.id,
        RECENTS_COLLECTION,
        action.occurrenceKey,
      );
  }

  return next(action);
};
