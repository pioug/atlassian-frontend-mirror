import { Action } from 'redux';

import { isEditorCloseAction } from '../../actions/editorClose';
import { HandlerResult } from '.';

export default (action: Action): HandlerResult => {
  if (isEditorCloseAction(action)) {
    return [
      {
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: `mediaEditor${action.selection}Button`,
        attributes: {},
      },
    ];
  }
};
