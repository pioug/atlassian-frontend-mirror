import { Action } from 'redux';

import { ServiceFile, SelectedItem, ServiceName } from '../domain';

export const FILE_CLICK = 'FILE_CLICK';

export interface FileClickAction extends Action {
  readonly type: 'FILE_CLICK';
  readonly file: SelectedItem;
}

export function isFileClickAction(action: Action): action is FileClickAction {
  return action.type === FILE_CLICK;
}

export function fileClick(
  file: ServiceFile,
  serviceName: ServiceName,
  accountId?: string,
): FileClickAction {
  return {
    type: FILE_CLICK,
    file: {
      ...file,
      accountId,
      serviceName,
    },
  };
}
