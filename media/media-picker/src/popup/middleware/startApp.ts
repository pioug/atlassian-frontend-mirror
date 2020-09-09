import { Dispatch, MiddlewareAPI, Action } from 'redux';

import { isStartAppAction } from '../actions/startApp';
import { updatePopupUrls } from '../actions/updatePopupUrls';

import { State } from '../domain';

export default function () {
  return (store: MiddlewareAPI<State>) => (next: Dispatch<State>) => (
    action: Action,
  ) => {
    if (isStartAppAction(action)) {
      const { redirectUrl } = store.getState();
      store.dispatch(updatePopupUrls({ redirectUrl }));
    }
    return next(action);
  };
}
