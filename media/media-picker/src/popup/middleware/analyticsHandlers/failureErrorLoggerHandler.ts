import { Action } from 'redux';

import { isFailureErrorAction } from '../../actions/failureErrorLogger';
import { HandlerResult } from '.';

export default (action: Action): HandlerResult => {
  if (isFailureErrorAction(action)) {
    const { error, info = undefined } = action;

    return [
      {
        eventType: 'operational',
        action: 'unhandledError',
        actionSubject: 'error',
        attributes: {
          status: 'fail',
          failReason: 'unknown',
          browserInfo: !!(
            window &&
            window.navigator &&
            window.navigator.userAgent
          )
            ? window.navigator.userAgent
            : 'unknown',
          error: error instanceof Error ? error.message : error,
          info,
        },
      },
    ];
  }
};
