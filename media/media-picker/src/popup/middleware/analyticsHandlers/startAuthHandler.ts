import { Action } from 'redux';

import { isStartAuthAction } from '../../actions/startAuth';
import { HandlerResult } from '.';

export default (action: Action): HandlerResult => {
  if (isStartAuthAction(action)) {
    return [
      {
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'linkCloudAccountButton',
        attributes: {
          cloudType: action.serviceName,
        },
      },
    ];
  }
};
