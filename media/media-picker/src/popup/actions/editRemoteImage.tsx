import { Action } from 'redux';
import { FileReference } from '../domain';

export const EDIT_REMOTE_IMAGE = 'EDIT_REMOTE_IMAGE';

export interface EditRemoteImageAction extends Action {
  readonly type: 'EDIT_REMOTE_IMAGE';
  readonly item: FileReference;
  readonly collectionName: string;
}

export function isEditRemoteImageAction(
  action: Action,
): action is EditRemoteImageAction {
  return action.type === EDIT_REMOTE_IMAGE;
}

export function editRemoteImage(
  item: FileReference,
  collectionName: string,
): EditRemoteImageAction {
  return {
    type: EDIT_REMOTE_IMAGE,
    item,
    collectionName,
  };
}
