import { Action } from 'redux';

export const EDITOR_CLOSE = 'EDITOR_CLOSE';
export type Selection = 'Save' | 'Close';
export interface EditorClose {
  type: string;
  selection: Selection;
}

export function isEditorCloseAction(action: Action): action is EditorClose {
  return action.type === EDITOR_CLOSE;
}

export function editorClose(selection: Selection): EditorClose {
  return {
    type: EDITOR_CLOSE,
    selection,
  };
}
