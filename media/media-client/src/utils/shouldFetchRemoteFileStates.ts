import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';

import { FilePreview } from '../models/file-state';
import { MediaType } from '../models/media';
import {
  isMimeTypeSupportedByBrowser,
  isMimeTypeSupportedByServer,
} from '@atlaskit/media-common/mediaTypeUtils';
import { getVideoDimensionsFromBlob } from './getVideoDimensionsFromBlob';

/**
 * Async helper determining if we should fetch remote fileStates from the backend:
 * - we poll the backend for all supported documents,
 * - we poll the backend is mimeType isn't natively supported by the browser,
 * - we poll the backend if we don't have a local preview available.
 * - we poll the backend if we have a video with which we can't extract dimensions,
 *
 * Polling the backend periodically refreshes the cached fileState until the file is processed.
 * Polling is needed for the use cases above to properly render the file in our components.
 *
 */
export async function shouldFetchRemoteFileStates(
  mediaType: MediaType,
  mimeType: string,
  preview?: FilePreview | Promise<FilePreview>,
): Promise<boolean> {
  if (
    (mediaType === 'doc' ||
      !isMimeTypeSupportedByBrowser(mimeType) ||
      !preview) &&
    isMimeTypeSupportedByServer(mimeType)
  ) {
    return true;
  }

  if (mediaType === 'video' && !!preview) {
    const content = (await preview).value;

    if (!(content instanceof Blob)) {
      return false;
    }

    try {
      const { width, height } = await getVideoDimensionsFromBlob(content);
      return !width && !height;
    } catch (e) {
      // any exception from getVideoDimensionsFromBlob() may imply that local video isn't playable
      // hence we'll need remote fileStates to grab a "processed" video
      return true;
    }
  }

  return false;
}

export function shouldFetchRemoteFileStatesObservable(
  mediaType: MediaType,
  mimeType: string,
  preview?: FilePreview | Promise<FilePreview>,
): Observable<boolean> {
  return from(shouldFetchRemoteFileStates(mediaType, mimeType, preview));
}
