import { Action } from 'redux';
import { ServiceName, Path } from '../domain';

export const CHANGE_CLOUD_ACCOUNT_FOLDER = 'CHANGE_CLOUD_ACCOUNT_FOLDER';

export interface ChangeCloudAccountFolderAction extends Action {
  readonly type: 'CHANGE_CLOUD_ACCOUNT_FOLDER';
  readonly serviceName: ServiceName;
  readonly accountId: string;
  readonly path: Path;
}

export function changeCloudAccountFolder(
  serviceName: ServiceName,
  accountId: string,
  path: Path,
): ChangeCloudAccountFolderAction {
  return {
    type: CHANGE_CLOUD_ACCOUNT_FOLDER,
    serviceName,
    accountId,
    path,
  };
}

export function isChangeCloudAccountFolderAction(
  action: Action,
): action is ChangeCloudAccountFolderAction {
  return action.type === CHANGE_CLOUD_ACCOUNT_FOLDER;
}
