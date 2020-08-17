import { FilePreview } from '../models/file-state';
import { MediaType } from '../models/media';
import { isMimeTypeSupportedByBrowser } from './isMimeTypeSupportedByBrowser';
import { isMimeTypeSupportedByServer } from './isMimeTypeSupportedByServer';

/**
 * Helper determining if we should fetch remote fileStates from the backend:
 * - we poll the backend for all documents,
 * - we poll the backend is mimeType isn't natively supported by the browser,
 * - we poll the backend if we don't have a local preview available.
 *
 * Polling the backend periodically refreshes the cached fileState until the file is processed.
 * Polling is needed for the 3 use cases above to properly render the file in our components.
 *
 */
export const shouldFetchRemoteFileStates = (
  mediaType: MediaType,
  mimeType: string,
  preview: FilePreview | Promise<FilePreview> | undefined,
) =>
  (mediaType === 'doc' ||
    !isMimeTypeSupportedByBrowser(mimeType) ||
    !preview) &&
  isMimeTypeSupportedByServer(mimeType);
