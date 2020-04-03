import { Action } from 'redux';

import { State } from '../domain';
import { isEditorCloseAction } from '../actions';

export default function editorClose(state: State, action: Action): State {
  if (isEditorCloseAction(action)) {
    return {
      ...state,
      editorData: undefined,
    };
  }

  return state;
}
