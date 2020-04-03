import { Action } from 'redux';
import { isFileListUpdateAction } from '../../actions/fileListUpdate';
import { SCREEN_EVENT_TYPE } from '@atlaskit/analytics-gas-types';
import { HandlerResult } from '.';

export default (action: Action): HandlerResult => {
  if (isFileListUpdateAction(action)) {
    return [
      {
        name: 'cloudBrowserModal',
        eventType: SCREEN_EVENT_TYPE,
        attributes: {
          cloudType: action.serviceName,
        },
      },
    ];
  }
};
