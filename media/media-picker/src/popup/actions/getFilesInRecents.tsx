import { Action } from 'redux';
import { MediaCollectionItem } from '@atlaskit/media-client';

export const GET_FILES_IN_RECENTS = 'GET_FILES_IN_RECENTS';

export interface GetFilesInRecentsAction extends Action {
  type: 'GET_FILES_IN_RECENTS';
}

export const isGetFilesInRecentsAction = (
  action: Action,
): action is GetFilesInRecentsAction => {
  return action.type === GET_FILES_IN_RECENTS;
};

export const getFilesInRecents = (): GetFilesInRecentsAction => {
  return {
    type: GET_FILES_IN_RECENTS,
  };
};

export const GET_FILES_IN_RECENTS_FULLFILLED =
  'GET_FILES_IN_RECENTS_FULLFILLED';

export interface GetFilesInRecentsFullfilledAction extends Action {
  readonly type: 'GET_FILES_IN_RECENTS_FULLFILLED';
  readonly items: MediaCollectionItem[];
}

export const isGetFilesInRecentsFullfilledAction = (
  action: Action,
): action is GetFilesInRecentsFullfilledAction => {
  return action.type === GET_FILES_IN_RECENTS_FULLFILLED;
};

export function getFilesInRecentsFullfilled(
  items: MediaCollectionItem[],
): GetFilesInRecentsFullfilledAction {
  return {
    type: GET_FILES_IN_RECENTS_FULLFILLED,
    items,
  };
}

export const GET_FILES_IN_RECENTS_FAILED = 'GET_FILES_IN_RECENTS_FAILED';

export interface GetFilesInRecentsFailedAction extends Action {
  readonly type: 'GET_FILES_IN_RECENTS_FAILED';
}

export const isGetFilesInRecentsFailedAction = (
  action: Action,
): action is GetFilesInRecentsFailedAction => {
  return action.type === GET_FILES_IN_RECENTS_FAILED;
};

export function getFilesInRecentsFailed(): GetFilesInRecentsFailedAction {
  return {
    type: GET_FILES_IN_RECENTS_FAILED,
  };
}
