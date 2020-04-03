import { State } from '../domain';

import { EDITOR_SHOW_LOADING } from '../actions/editorShowLoading';

export default function editorShowLoading(state: State, action: any): State {
  if (action.type === EDITOR_SHOW_LOADING) {
    return { ...state, editorData: { originalFile: action.originalFile } };
  }

  return state;
}
