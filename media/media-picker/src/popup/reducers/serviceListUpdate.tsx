import {
  UPDATE_SERVICE_LIST,
  UpdateServiceListAction,
} from '../actions/updateServiceList';
import { State } from '../domain';

export default function serviceListUpdate(
  state: State,
  action: UpdateServiceListAction,
): State {
  if (action.type === UPDATE_SERVICE_LIST) {
    return {
      ...state,
      accounts: action.accounts,
      view: {
        ...state.view,
        isLoading: false,
        hasError: false,
      },
    };
  } else {
    return state;
  }
}
