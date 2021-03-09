import { Action } from 'redux';

import { isChangeServiceAction } from '../../actions/changeService';
import { HandlerResult } from '.';

export default (action: Action): HandlerResult => {
  if (isChangeServiceAction(action)) {
    if (action.serviceName === 'upload') {
      return [
        {
          eventType: 'ui',
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'uploadButton',
          attributes: {},
        },
        {
          eventType: 'screen',
          actionSubject: 'recentFilesBrowserModal',
          name: 'recentFilesBrowserModal',
          attributes: {},
        },
      ];
    } else {
      return [
        {
          eventType: 'ui',
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'cloudBrowserButton',
          attributes: {
            cloudType: action.serviceName,
          },
        },
      ];
    }
  }
};
