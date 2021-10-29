import {
  MediaClient,
  FilePreview,
  isPreviewableFileState,
  FileState,
  addFileAttrsToUrl,
  MediaStoreGetFileImageParams,
  MediaBlobUrlAttrs,
} from '@atlaskit/media-client';
import {
  MediaFeatureFlags,
  isMimeTypeSupportedByBrowser,
} from '@atlaskit/media-common';
import { CardDimensions } from '../../../utils/cardDimensions';
import cardPreviewCache from './cache';
import {
  getCardPreviewFromFilePreview,
  getCardPreviewFromBackend,
} from './helpers';
import {
  MediaCardError,
  isUnsupportedLocalPreviewError,
} from '../../../errors';
import { CardStatus, CardPreview } from '../../../types';
import { isBigger } from '../../../utils/dimensionComparer';
import {
  extractFilePreviewStatus,
  isPreviewableStatus,
} from './filePreviewStatus';

export {
  getCardPreviewFromFilePreview,
  getCardPreviewFromBackend,
  isSupportedLocalPreview,
} from './helpers';

export { extractFilePreviewStatus } from './filePreviewStatus';

export const getCardPreviewFromCache = cardPreviewCache.get;
export const removeCardPreviewFromCache = cardPreviewCache.remove;

/**
 * Will return the preview if available and supported by the browser
 * See extractFilePreviewStatus "hasLocalPreview" logic
 */
export const getFilePreviewFromFileState = (fileState: FileState) =>
  'mimeType' in fileState &&
  isMimeTypeSupportedByBrowser(fileState.mimeType) &&
  isPreviewableFileState(fileState)
    ? fileState.preview
    : undefined;

export type CardPreviewParams = {
  mediaClient: MediaClient;
  id: string;
  dimensions?: CardDimensions;
  filePreview?: FilePreview | Promise<FilePreview>;
  onLocalPreviewError?: (error: MediaCardError) => void;
  isRemotePreviewReady: boolean;
  imageUrlParams: MediaStoreGetFileImageParams;
  mediaBlobUrlAttrs?: MediaBlobUrlAttrs;
};

const extendAndCachePreview = (
  id: string,
  dimensions: CardDimensions,
  preview: CardPreview,
  mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
): CardPreview => {
  let source: CardPreview['source'];
  switch (preview.source) {
    case 'local':
      source = 'cache-local';
      break;
    case 'remote':
      source = 'cache-remote';
      break;
    default:
      source = preview.source;
  }
  // We want to embed some meta context into dataURI for Copy/Paste to work.
  const dataURI = mediaBlobUrlAttrs
    ? addFileAttrsToUrl(preview.dataURI, mediaBlobUrlAttrs)
    : preview.dataURI;
  // We store new cardPreview into cache
  cardPreviewCache.set(id, dimensions, { ...preview, source, dataURI });
  return { ...preview, dataURI };
};

/**
 * This function will try to return a Card preview, either from cache, local preview or remote preview.
 * It should only be called if there is a chance to get either a remote or a local preview, or both.
 * This, in order to ensure there is always going to be a valid return value OR throw an error if the process fails.
 * It is worth noting that local preview failures break the process if there is no remote preview available.
 * In that case we throw an error immediately.
 * Otherwise, if the local preview fails but there is a remote preview available, the failure does not break the process.
 * In that case, we still want to report the local preview error to the caller, for feature realiability track.
 * hence the use of the optional callback onLocalPreviewError
 */
export const getCardPreview = async ({
  mediaClient,
  id,
  dimensions = {},
  filePreview,
  onLocalPreviewError,
  isRemotePreviewReady,
  imageUrlParams,
  mediaBlobUrlAttrs,
}: CardPreviewParams): Promise<CardPreview> => {
  const cachedPreview = cardPreviewCache.get(id, dimensions);
  if (cachedPreview) {
    return cachedPreview;
  }

  try {
    if (filePreview) {
      const localPreview = await getCardPreviewFromFilePreview(filePreview);
      return extendAndCachePreview(
        id,
        dimensions,
        localPreview,
        mediaBlobUrlAttrs,
      );
    }
  } catch (e) {
    /**
     * We report the error if:
     * - local preview is supported and fails
     * - local preview is unsupported and remote preview is NOT READY
     *   i.e. the function was called for "no reason".
     * We DON'T report the error if:
     * - local preview is unsupported and remote preview IS READY
     *   i.e. local preview is available and not supported,
     *   but we are after the remote preview instead.
     */
    if (
      !isUnsupportedLocalPreviewError(e) ||
      (isUnsupportedLocalPreviewError(e) && !isRemotePreviewReady)
    ) {
      onLocalPreviewError && onLocalPreviewError(e);
    }
    /**
     * No matter the reason why the local preview failed, we break the process
     * if there is no remote preview available
     */
    if (!isRemotePreviewReady) {
      throw e;
    }
  }
  if (!isRemotePreviewReady) {
    /**
     * We throw this in case this function has been called
     * without checking isRemotePreviewReady first.
     * If remote preview is not ready, the call to getCardPreviewFromBackend
     * will generate a console error due to a 404 code
     */
    throw new MediaCardError('remote-preview-not-ready');
  }

  const remotePreview = await getCardPreviewFromBackend(
    mediaClient,
    id,
    imageUrlParams,
  );
  return extendAndCachePreview(
    id,
    dimensions,
    remotePreview,
    mediaBlobUrlAttrs,
  );
};

export const shouldResolvePreview = ({
  status,
  fileState,
  dimensions,
  prevDimensions,
  hasCardPreview,
  isBannedLocalPreview,
  featureFlags,
}: {
  status: CardStatus;
  fileState: FileState;
  dimensions?: CardDimensions;
  prevDimensions?: CardDimensions;
  hasCardPreview: boolean;
  isBannedLocalPreview: boolean;
  featureFlags?: MediaFeatureFlags;
}) => {
  const statusIsPreviewable = isPreviewableStatus(
    status,
    extractFilePreviewStatus(fileState, isBannedLocalPreview, featureFlags),
  );
  const dimensionsAreBigger = isBigger(prevDimensions, dimensions);
  return statusIsPreviewable && (!hasCardPreview || dimensionsAreBigger);
};
