import { SCREEN_EVENT_TYPE } from '@atlaskit/analytics-gas-types';
import { Action } from 'redux';
import { HandlerResult } from '.';
import { isShowPopupAction } from '../../actions/showPopup';

export default (action: Action): HandlerResult => {
  if (isShowPopupAction(action)) {
    return [
      {
        name: 'mediaPickerModal',
        eventType: SCREEN_EVENT_TYPE,
      },
      {
        name: 'recentFilesBrowserModal',
        eventType: SCREEN_EVENT_TYPE,
      },
    ];
  }
};
