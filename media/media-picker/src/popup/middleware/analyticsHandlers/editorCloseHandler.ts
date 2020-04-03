import { Action } from 'redux';
import { isEditorCloseAction } from '../../actions/editorClose';
import { buttonClickPayload, HandlerResult } from '.';

export default (action: Action): HandlerResult => {
  if (isEditorCloseAction(action)) {
    return [
      {
        ...buttonClickPayload,
        actionSubjectId: `mediaEditor${action.selection}Button`,
      },
    ];
  }
};
