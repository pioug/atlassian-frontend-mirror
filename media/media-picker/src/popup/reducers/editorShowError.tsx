import { Action } from 'redux';

import { State } from '../domain';

import { isEditorShowErrorAction } from '../actions/editorShowError';

export default function editorShowError<A extends Action>(
  state: State,
  action: A,
): State {
  if (isEditorShowErrorAction(action)) {
    const { editorData } = state;
    const { error } = action;
    return {
      ...state,
      editorData: {
        ...editorData,
        error,
      },
    };
  }

  return state;
}
