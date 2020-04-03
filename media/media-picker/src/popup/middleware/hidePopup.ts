import { Store, Action, Dispatch } from 'redux';
import { isHidePopupAction } from '../actions/hidePopup';
import { State } from '../domain';
import { PopupUploadEventEmitter } from '../../components/types';

export default (eventEmitter: PopupUploadEventEmitter) => (_: Store<State>) => (
  next: Dispatch<State>,
) => (action: Action) => {
  if (isHidePopupAction(action)) {
    eventEmitter.emitClosed();
  }
  return next(action);
};
