import { FileReference } from '../domain';
import { Action } from 'redux';

export const EDITOR_SHOW_IMAGE = 'EDITOR_SHOW_IMAGE';

export interface EditorShowImageAction extends Action {
  readonly type: 'EDITOR_SHOW_IMAGE';
  readonly imageUrl: string;
  readonly originalFile?: FileReference;
}

export function isEditorShowImageAction(
  action: Action,
): action is EditorShowImageAction {
  return action.type === EDITOR_SHOW_IMAGE;
}

export function editorShowImage(
  imageUrl: string,
  originalFile?: FileReference,
): EditorShowImageAction {
  return {
    type: EDITOR_SHOW_IMAGE,
    imageUrl,
    originalFile,
  };
}
