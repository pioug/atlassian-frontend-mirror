import { SCREEN_EVENT_TYPE } from '@atlaskit/analytics-gas-types';
import { Action } from 'redux';
import { buttonClickPayload, HandlerResult } from '.';
import { isStartFileBrowserAction } from '../../actions/startFileBrowser';

export default (action: Action): HandlerResult => {
  if (isStartFileBrowserAction(action)) {
    return [
      {
        name: 'localFileBrowserModal',
        eventType: SCREEN_EVENT_TYPE,
      },
      {
        ...buttonClickPayload,
        actionSubjectId: 'localFileBrowserButton',
      },
    ];
  }
};
