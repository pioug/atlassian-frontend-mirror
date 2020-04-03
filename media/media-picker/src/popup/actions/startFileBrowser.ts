import { Action } from 'redux';

export const START_FILE_BROWSER = 'START_FILE_BROWSER';

export interface StartFileBrowser {
  readonly type: 'START_FILE_BROWSER';
}

export function isStartFileBrowserAction(
  action: Action,
): action is StartFileBrowser {
  return action.type === START_FILE_BROWSER;
}

export function startFileBrowser(): StartFileBrowser {
  return {
    type: START_FILE_BROWSER,
  };
}
