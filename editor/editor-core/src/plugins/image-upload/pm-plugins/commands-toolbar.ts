import type { Command } from '../../../types';
import type { UploadHandlerReference } from '../types';
import { insertExternalImage } from './commands';

export const insertActionForToolbar = (
  uploadHandlerReference: UploadHandlerReference,
): Command => {
  return (state, dispatch): boolean => {
    if (!uploadHandlerReference.current) {
      return false;
    }

    uploadHandlerReference.current(undefined, (options) => {
      insertExternalImage(options)(state, dispatch);
    });

    return true;
  };
};
