import { Action } from 'redux';

import { ServiceName, Path } from '../domain';

const FETCH_NEXT_CLOUD_FILES_PAGE = 'FETCH_NEXT_CLOUD_FILES_PAGE';

export interface FetchNextCloudFilesPageAction extends Action {
  readonly type: 'FETCH_NEXT_CLOUD_FILES_PAGE';
  readonly serviceName: ServiceName;
  readonly accountId: string;
  readonly path: Path;
  readonly nextCursor: string;
}

export function fetchNextCloudFilesPage(
  serviceName: ServiceName,
  accountId: string,
  path: Path,
  nextCursor: string,
): FetchNextCloudFilesPageAction {
  return {
    type: FETCH_NEXT_CLOUD_FILES_PAGE,
    serviceName,
    accountId,
    path,
    nextCursor,
  };
}

export function isFetchNextCloudFilesPageAction(
  action: Action,
): action is FetchNextCloudFilesPageAction {
  return action.type === FETCH_NEXT_CLOUD_FILES_PAGE;
}
