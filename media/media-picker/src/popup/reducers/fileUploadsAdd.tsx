import { Action } from 'redux';

import { isFileUploadsStartAction } from '../actions/fileUploadsStart';
import { LocalUpload, State, SelectedItem } from '../domain';

export default function fileUploadsAdd(state: State, action: Action): State {
  if (isFileUploadsStartAction(action)) {
    const { uploads, selectedItems, lastUploadIndex } = state;

    const files = action.files;
    const newUploads: { [id: string]: LocalUpload } = {};

    let newLastUploadIndex = lastUploadIndex;
    files.forEach(({ id, name, type, size, occurrenceKey }) => {
      newUploads[id] = {
        file: {
          metadata: {
            id,
            name,
            mimeType: type,
            size,
            occurrenceKey,
          },
        },
        timeStarted: Date.now(),
        index: newLastUploadIndex++, // this index helps to sort upload items, so that latest come first
      };
    });

    const newSelectedItems: SelectedItem[] = files.map(
      ({ id, name, type, size, occurrenceKey }) =>
        ({
          date: 0,
          id,
          occurrenceKey,
          mimeType: type,
          name,
          parentId: '',
          size,
          serviceName: 'upload',
        } as SelectedItem),
    );

    return {
      ...state,
      uploads: {
        ...uploads,
        ...newUploads,
      },
      selectedItems: [...selectedItems, ...newSelectedItems],
      lastUploadIndex: newLastUploadIndex,
    };
  } else {
    return state;
  }
}
