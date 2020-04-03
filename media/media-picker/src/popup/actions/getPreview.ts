import { Action } from 'redux';

import { MediaFile } from '../../types';

export const GET_PREVIEW = 'GET_PREVIEW';

export type GetPreviewAction = {
  readonly type: typeof GET_PREVIEW;
  readonly fileId: string;
  readonly file: MediaFile;
  readonly collection: string;
};

export function isGetPreviewAction(action: Action): action is GetPreviewAction {
  return action.type === GET_PREVIEW;
}

export function getPreview(
  tenantFileId: string,
  file: MediaFile,
  collection: string,
): GetPreviewAction {
  return {
    type: GET_PREVIEW,
    fileId: tenantFileId,
    file,
    collection,
  };
}
