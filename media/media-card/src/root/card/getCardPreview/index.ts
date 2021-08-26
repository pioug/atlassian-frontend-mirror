import {
  MediaClient,
  FilePreview,
  ImageResizeMode,
  isPreviewableFileState,
  FileState,
  isPreviewableType,
  isImageRepresentationReady,
} from '@atlaskit/media-client';
import {
  MediaFeatureFlags,
  isMimeTypeSupportedByBrowser,
} from '@atlaskit/media-common';
import { NumericalCardDimensions } from '../../..';
import { CardDimensions } from '../../../utils/cardDimensions';
import { CardPreview } from './types';
import cardPreviewCache from './cache';
import {
  getCardPreviewFromFilePreview,
  getCardPreviewFromBackend,
  isSupportedLocalPreview,
} from './helpers';
import {
  MediaCardError,
  isUnsupportedLocalPreviewError,
} from '../../../errors';
import { CardStatus, FilePreviewStatus } from '../../../types';

export type { CardPreview } from './types';
export {
  getCardPreviewFromFilePreview,
  getCardPreviewFromBackend,
  isSupportedLocalPreview,
} from './helpers';

// TODO: align these checks with helpers from Media Client
// https://product-fabric.atlassian.net/browse/BMPT-1300
export const extractFilePreviewStatus = (
  fileState: FileState,
  featureFlags?: MediaFeatureFlags,
): FilePreviewStatus => {
  const hasFilesize = 'size' in fileState && !!fileState.size;
  const { mediaType } = ('mediaType' in fileState && fileState) || {};
  const { mimeType } = ('mimeType' in fileState && fileState) || {};

  const isPreviewable =
    !!mediaType && isPreviewableType(mediaType, featureFlags);

  /**
   * Local preview is available only if it's supported by browser and supported by Media Card (isSupportedLocalPreview)
   * For example, SVGs are mime type NOT supported by browser but media type supported by Media Card (image)
   * Then, local Preview NOT available
   */
  const hasLocalPreview =
    isPreviewableFileState(fileState) &&
    isSupportedLocalPreview(mediaType) &&
    !!mimeType &&
    isMimeTypeSupportedByBrowser(mimeType);

  const hasRemotePreview = isImageRepresentationReady(fileState);
  const hasPreview = hasLocalPreview || hasRemotePreview;

  const isSupportedByBrowser =
    !!mimeType && isMimeTypeSupportedByBrowser(mimeType);

  return {
    hasFilesize,
    isPreviewable,
    hasPreview,
    isSupportedByBrowser,
  };
};

export const shouldGetCardPreview = (
  cardStatus: CardStatus,
  { isPreviewable, hasPreview, isSupportedByBrowser }: FilePreviewStatus,
) => {
  return (
    cardStatus === 'loading-preview' ||
    (cardStatus === 'uploading' && hasPreview && isPreviewable) ||
    /**
     * For Video, we can have local or remote preview while processing.
     * Then, we only want to show the thumbnail if the file is supported by the browser,
     * this way we prevent playing unsupported videos that are not procesed
     */
    (cardStatus === 'processing' &&
      hasPreview &&
      isPreviewable &&
      isSupportedByBrowser)
  );
};

export const getCardPreviewFromCache = cardPreviewCache.get;

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
  collectionName?: string;
  dimensions?: CardDimensions;
  requestedDimensions: NumericalCardDimensions;
  resizeMode?: ImageResizeMode;
  isRemotePreviewReady: boolean;
  filePreview?: FilePreview | Promise<FilePreview>;
  addContextToDataURI: (dataURI: string) => string;
  onLocalPreviewError?: (error: MediaCardError) => void;
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
  collectionName,
  requestedDimensions,
  isRemotePreviewReady,
  addContextToDataURI,
  filePreview,
  dimensions = {},
  resizeMode,
  onLocalPreviewError,
}: CardPreviewParams): Promise<CardPreview> => {
  let cardPreview = cardPreviewCache.get(id, dimensions);
  if (cardPreview) {
    return { ...cardPreview, source: 'cache' };
  }

  try {
    cardPreview =
      filePreview && (await getCardPreviewFromFilePreview(filePreview));
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

  if (!cardPreview) {
    if (!isRemotePreviewReady) {
      /**
       * We throw this in case this function has been called
       * without checking isRemotePreviewReady first.
       * If remote preview is not ready, the call to getCardPreviewFromBackend
       * will generate a console error due to a 404 code
       */
      throw new MediaCardError('remote-preview-not-ready');
    }

    cardPreview = await getCardPreviewFromBackend(
      mediaClient,
      id,
      requestedDimensions,
      collectionName,
      resizeMode,
    );
  }
  /**
   * In case we've retrieved cardPreview using one of the two methods above,
   * we want to embed some meta context into dataURI for Copy/Paste to work.
   */
  cardPreview = {
    ...cardPreview,
    dataURI: addContextToDataURI(cardPreview.dataURI),
  };
  // We store new cardPreview into cache
  cardPreviewCache.set(id, dimensions, cardPreview);
  return cardPreview;
};
