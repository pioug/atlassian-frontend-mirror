import { Dispatch, Middleware } from 'redux';

import { PopupUploadEventEmitter } from '../../components/types';
import { State } from '../domain';
import { isSendUploadEventAction } from '../actions/sendUploadEvent';
import { copyMediaFileForUpload } from '../../domain/file';
import { handleError } from '../../util/handleError';

export default function (eventEmitter: PopupUploadEventEmitter): Middleware {
  return () => (next: Dispatch<State>) => (action: any) => {
    if (isSendUploadEventAction(action)) {
      const { event, fileId } = action.payload;

      switch (event.name) {
        case 'upload-preview-update': {
          const { preview } = event.data;
          const file = copyMediaFileForUpload(event.data.file, fileId);
          eventEmitter.emitUploadPreviewUpdate(file, preview);
          break;
        }
        case 'upload-end': {
          const file = copyMediaFileForUpload(event.data.file, fileId);
          eventEmitter.emitUploadEnd(file);
          break;
        }
        case 'upload-error': {
          const { error } = event.data;
          eventEmitter.emitUploadError(fileId, error);
          handleError(error.name, error.description, error.rawError);
          break;
        }
      }
    }
    return next(action);
  };
}
