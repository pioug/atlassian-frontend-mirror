import { Action } from 'redux';
import { Path, ServiceFolderItem, ServiceName } from '../domain';

export const FILE_LIST_UPDATE = 'FILE_LIST_UPDATE';

export interface FileListUpdateAction extends Action {
  readonly type: 'FILE_LIST_UPDATE';
  readonly accountId: string;
  readonly path: Path;
  readonly items: ServiceFolderItem[];
  readonly serviceName: ServiceName;

  readonly currentCursor?: string;
  readonly nextCursor?: string;
}

export function isFileListUpdateAction(
  action: Action,
): action is FileListUpdateAction {
  return action.type === FILE_LIST_UPDATE;
}

export function fileListUpdate(
  accountId: string,
  path: Path,
  items: ServiceFolderItem[],
  serviceName: ServiceName,
  currentCursor?: string,
  nextCursor?: string,
): FileListUpdateAction {
  return {
    type: FILE_LIST_UPDATE,
    accountId,
    path,
    items,
    currentCursor,
    nextCursor,
    serviceName,
  };
}
