import { FileReference } from '../domain';
import { Action } from 'redux';

export const EDITOR_SHOW_LOADING = 'EDITOR_SHOW_LOADING';

export interface EditorShowLoadingAction extends Action {
  readonly type: 'EDITOR_SHOW_LOADING';
  readonly originalFile: FileReference;
}

export function editorShowLoading(
  originalFile: FileReference,
): EditorShowLoadingAction {
  return {
    type: EDITOR_SHOW_LOADING,
    originalFile,
  };
}
