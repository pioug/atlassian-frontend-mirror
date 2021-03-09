import { Action } from 'redux';

export const FAILURE_ERROR = 'FAILURE_ERROR';

// TODO: can be removed part of https://product-fabric.atlassian.net/browse/BMPT-1170
export interface FailureErrorAction extends Action {
  readonly type: 'FAILURE_ERROR';
  readonly error: Error | string;
  readonly info?: string;
}

export function isFailureErrorAction(
  action: Action,
): action is FailureErrorAction {
  return action.type === FAILURE_ERROR;
}

export function failureErrorLogger(payload: {
  error: Error | string;
  info?: string;
}): FailureErrorAction {
  return {
    type: FAILURE_ERROR,
    error: payload.error,
    info: payload.info,
  };
}
