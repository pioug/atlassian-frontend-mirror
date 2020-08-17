import { FilePreview } from '@atlaskit/media-client';
import { Action } from 'redux';
import { MediaFile } from '../../types';

export const FINALIZE_UPLOAD = 'FINALIZE_UPLOAD';

export interface FinalizeUploadSource {
  readonly id: string;
  readonly collection?: string;
}

export interface FinalizeUploadAction extends Action {
  readonly type: typeof FINALIZE_UPLOAD;
  readonly file: MediaFile;
  readonly replaceFileId: string;
  readonly source: FinalizeUploadSource;
  readonly preview?: FilePreview | Promise<FilePreview>;
}

export function isFinalizeUploadAction(
  action: Action,
): action is FinalizeUploadAction {
  return action.type === FINALIZE_UPLOAD;
}

export function finalizeUpload(
  file: MediaFile,
  replaceFileId: string,
  source: FinalizeUploadSource,
  preview?: FilePreview | Promise<FilePreview>,
): FinalizeUploadAction {
  return {
    type: FINALIZE_UPLOAD,
    file,
    replaceFileId,
    source,
    preview,
  };
}
