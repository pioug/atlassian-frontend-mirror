import { Action } from 'redux';
import { isStartAuthAction } from '../../actions/startAuth';
import { buttonClickPayload, HandlerResult } from '.';

export default (action: Action): HandlerResult => {
  if (isStartAuthAction(action)) {
    return [
      {
        ...buttonClickPayload,
        actionSubjectId: 'linkCloudAccountButton',
        attributes: {
          cloudType: action.serviceName,
        },
      },
    ];
  }
};
