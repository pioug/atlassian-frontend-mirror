import { Action } from 'redux';

import { isShowPopupAction } from '../../actions/showPopup';
import { HandlerResult } from '.';

export default (action: Action): HandlerResult => {
  if (isShowPopupAction(action)) {
    return [
      {
        eventType: 'screen',
        actionSubject: 'mediaPickerModal',
        name: 'mediaPickerModal',
        attributes: {},
      },
      {
        eventType: 'screen',
        actionSubject: 'recentFilesBrowserModal',
        name: 'recentFilesBrowserModal',
        attributes: {},
      },
    ];
  }
};
