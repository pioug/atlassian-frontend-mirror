import { Action } from 'redux';

import { EditorError } from '../domain';

export const EDITOR_SHOW_ERROR = 'EDITOR_SHOW_ERROR';

export interface EditorShowErrorAction extends Action {
  readonly type: 'EDITOR_SHOW_ERROR';
  readonly error: EditorError;
}

export function isEditorShowErrorAction(
  action: Action,
): action is EditorShowErrorAction {
  return action.type === EDITOR_SHOW_ERROR;
}

export function editorShowError(
  message: string,
  retryHandler?: () => void,
): EditorShowErrorAction {
  return {
    type: EDITOR_SHOW_ERROR,
    error: {
      message,
      retryHandler,
    },
  };
}
