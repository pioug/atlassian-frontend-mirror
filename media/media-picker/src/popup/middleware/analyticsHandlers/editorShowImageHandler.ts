import { Action } from 'redux';

import { isEditorShowImageAction } from '../../actions/editorShowImage';
import { HandlerResult } from '.';

export default (action: Action): HandlerResult => {
  if (isEditorShowImageAction(action)) {
    const { imageUrl = undefined, originalFile = undefined } = action;
    return [
      {
        eventType: 'screen',
        actionSubject: 'fileEditorModal',
        name: 'fileEditorModal',
        attributes: {
          imageUrl,
          originalFile,
        },
      },
    ];
  }
};
