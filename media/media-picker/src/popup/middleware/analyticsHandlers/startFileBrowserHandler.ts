import { Action } from 'redux';

import { isStartFileBrowserAction } from '../../actions/startFileBrowser';
import { HandlerResult } from '.';

export default (action: Action): HandlerResult => {
  if (isStartFileBrowserAction(action)) {
    return [
      {
        eventType: 'screen',
        actionSubject: 'localFileBrowserModal',
        name: 'localFileBrowserModal',
        attributes: {},
      },
      {
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'localFileBrowserButton',
        attributes: {},
      },
    ];
  }
};
