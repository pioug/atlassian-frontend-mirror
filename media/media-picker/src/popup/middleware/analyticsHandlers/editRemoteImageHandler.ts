import { Action } from 'redux';

import { isEditRemoteImageAction } from '../../actions/editRemoteImage';
import { HandlerResult } from '.';

export default (action: Action): HandlerResult => {
  if (isEditRemoteImageAction(action)) {
    const { collectionName, item: { id: fileId = undefined } = {} } = action;
    return [
      {
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'annotateFileButton',
        attributes: {
          fileId,
          collectionName,
        },
      },
    ];
  }
};
