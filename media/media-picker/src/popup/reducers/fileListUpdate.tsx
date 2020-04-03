import {
  FILE_LIST_UPDATE,
  FileListUpdateAction,
} from '../actions/fileListUpdate';
import { State } from '../domain';
import { pathsEqual } from '../tools/pathsEqual';

export default function fileListUpdate(
  state: State,
  action: FileListUpdateAction,
): State {
  if (action.type === FILE_LIST_UPDATE) {
    if (
      pathsEqual(action.path, state.view.path) &&
      action.accountId === state.view.service.accountId &&
      state.view.currentCursor === action.currentCursor
    ) {
      return {
        ...state,
        view: {
          ...state.view,
          items: action.items,
          isLoading: false,
          currentCursor: action.currentCursor,
          nextCursor: action.nextCursor,
        },
      };
    }
  }

  return state;
}
