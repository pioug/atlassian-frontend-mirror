import { Action } from 'redux';
import { isEditRemoteImageAction } from '../../actions/editRemoteImage';
import { buttonClickPayload, HandlerResult } from '.';

export default (action: Action): HandlerResult => {
  if (isEditRemoteImageAction(action)) {
    const { collectionName, item: { id = undefined } = {} } = action;
    return [
      {
        ...buttonClickPayload,
        actionSubjectId: 'annotateFileButton',
        attributes: {
          collectionName,
          fileId: id,
        },
      },
    ];
  }
};
