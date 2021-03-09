import { MediaCollectionItemFullDetails } from '../models/media';

/**
 * EMPTY_FILE_HOURS_ELAPSED_TOLERANCE - how many hours since this file was
 * created until we give up on expecting metadata?
 *
 * Yes, this is not an exact science. Any value under this tolerance will
 * go undetected, however this is still suitable to catch the majority of
 * cases where empty (files which never finished upload) are being reloaded.
 *
 * Continuous bad renders of empty files will eat our card render SLIs, so until
 * there is a better response from backend we use this technique.
 *
 * Being encapsulated in this function, we can always improve the detection transparently.
 */
export const EMPTY_FILE_HOURS_ELAPSED_TOLERANCE_MS =
  12 * 1000 * 60 * 60; /* 12 hours */

export function isEmptyFile(
  fileDetails: MediaCollectionItemFullDetails,
  now: number = Date.now(),
): Boolean {
  const {
    artifacts,
    mediaType,
    mimeType,
    name,
    processingStatus,
    representations,
    size,
    createdAt,
  } = fileDetails;
  if (
    !artifacts &&
    !mediaType &&
    !mimeType &&
    !name &&
    !processingStatus &&
    !representations &&
    !size &&
    typeof createdAt === 'number'
  ) {
    const msSinceFileCreation = now - createdAt;
    if (msSinceFileCreation > EMPTY_FILE_HOURS_ELAPSED_TOLERANCE_MS) {
      return true;
    }
  }
  return false;
}
