import { Action, MiddlewareAPI } from 'redux';

import { State } from '../../domain';
import { isHidePopupAction } from '../../actions/hidePopup';
import { HandlerResult } from '.';
import { normalizeRecentFilesAge } from '../../tools/normalizeRecentFilesAge';

export default (action: Action, store: MiddlewareAPI<State>): HandlerResult => {
  if (isHidePopupAction(action)) {
    const { selectedItems = [] } = store.getState();

    const actionSubjectId =
      selectedItems.length > 0 ? 'insertFilesButton' : 'cancelButton';

    const serviceNames =
      selectedItems.length > 0
        ? selectedItems.map((i) => i.serviceName)
        : undefined;

    const files =
      selectedItems.length > 0
        ? selectedItems.map((item) => ({
            serviceName: item.serviceName,
            accountId: item.accountId,
            fileId: item.id,
            fileMimetype: item.mimeType,
            fileSize: item.size,
            fileAge:
              item.serviceName === 'recent_files'
                ? normalizeRecentFilesAge(item.createdAt)
                : undefined,
          }))
        : undefined;

    return [
      {
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId,
        attributes: {
          fileCount: selectedItems.length,
          serviceNames,
          files,
        },
      },
    ];
  }
};
