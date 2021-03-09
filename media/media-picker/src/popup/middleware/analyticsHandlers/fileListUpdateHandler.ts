import { Action } from 'redux';

import { isFileListUpdateAction } from '../../actions/fileListUpdate';
import { HandlerResult } from '.';

export default (action: Action): HandlerResult => {
  if (isFileListUpdateAction(action)) {
    return [
      {
        eventType: 'screen',
        actionSubject: 'cloudBrowserModal',
        name: 'cloudBrowserModal',
        attributes: {
          cloudType: action.serviceName,
        },
      },
    ];
  }
};
