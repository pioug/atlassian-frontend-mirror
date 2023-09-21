import {
  MediaClient,
  FilePreview,
  isPreviewableFileState,
  FileState,
  addFileAttrsToUrl,
  MediaStoreGetFileImageParams,
  MediaBlobUrlAttrs,
  FileIdentifier,
} from '@atlaskit/media-client';
import {
  MediaFeatureFlags,
  isMimeTypeSupportedByBrowser,
  SSR,
  MediaTraceContext,
} from '@atlaskit/media-common';
import { ImageResizeMode } from '@atlaskit/media-client';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { CardDimensions } from '../../types';
import cardPreviewCache from './cache';
import {
  getCardPreviewFromFilePreview,
  getCardPreviewFromBackend,
} from './helpers';
import {
  MediaCardError,
  SsrPreviewError,
  isUnsupportedLocalPreviewError,
} from '../../errors';
import { CardStatus, CardPreview, CardPreviewSource } from '../../types';
import { isBigger } from '../../utils/dimensionComparer';
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
  onLocalPreviewError: (error: MediaCardError) => void;
  isRemotePreviewReady: boolean;
  imageUrlParams: MediaStoreGetFileImageParams;
  mediaBlobUrlAttrs?: MediaBlobUrlAttrs;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  featureFlags?: MediaFeatureFlags;
  traceContext?: MediaTraceContext;
};

const extendAndCachePreview = (
  id: string,
  mode: ImageResizeMode | undefined,
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
    case 'ssr-server':
      source = 'cache-ssr-server';
      break;
    case 'ssr-client':
      source = 'cache-ssr-client';
      break;
    default:
      source = preview.source;
  }
  // We want to embed some meta context into dataURI for Copy/Paste to work.
  const dataURI = mediaBlobUrlAttrs
    ? addFileAttrsToUrl(preview.dataURI, mediaBlobUrlAttrs)
    : preview.dataURI;
  // We store new cardPreview into cache
  cardPreviewCache.set(id, mode, { ...preview, source, dataURI });
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
  createAnalyticsEvent,
  featureFlags,
  traceContext,
}: CardPreviewParams): Promise<CardPreview> => {
  const mode = imageUrlParams.mode;
  const cachedPreview = cardPreviewCache.get(id, mode);
  const dimensionsAreBigger = isBigger(cachedPreview?.dimensions, dimensions);

  if (cachedPreview && !dimensionsAreBigger) {
    return cachedPreview;
  }

  try {
    if (filePreview) {
      const localPreview = await getCardPreviewFromFilePreview(filePreview);
      return extendAndCachePreview(
        id,
        mode,
        { ...localPreview, dimensions },
        mediaBlobUrlAttrs,
      );
    }
  } catch (e: any) {
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

  const remotePreview = await fetchAndCacheRemotePreview(
    mediaClient,
    id,
    dimensions,
    imageUrlParams,
    mediaBlobUrlAttrs,
    traceContext,
  );

  return remotePreview;
};

export const shouldResolvePreview = ({
  status,
  fileState,
  prevDimensions,
  dimensions,
  identifier,
  fileImageMode,
  hasCardPreview,
  isBannedLocalPreview,
  featureFlags,
  wasResolvedUpfrontPreview,
}: {
  status: CardStatus;
  fileState: FileState;
  prevDimensions?: CardDimensions;
  dimensions?: CardDimensions;
  identifier: FileIdentifier;
  fileImageMode?: ImageResizeMode;
  hasCardPreview: boolean;
  isBannedLocalPreview: boolean;
  featureFlags?: MediaFeatureFlags;
  wasResolvedUpfrontPreview: boolean;
}) => {
  const statusIsPreviewable = isPreviewableStatus(
    status,
    extractFilePreviewStatus(fileState, isBannedLocalPreview),
  );

  const dimensionsAreBigger = isBigger(prevDimensions, dimensions);
  // We should not fetch the preview if the upfront one hasn't been resolved yet (it could be resolving now), even if there are new dimensions.
  return (
    wasResolvedUpfrontPreview &&
    statusIsPreviewable &&
    (!hasCardPreview || dimensionsAreBigger)
  );
};

export const getSSRCardPreview = (
  ssr: SSR,
  mediaClient: MediaClient,
  id: string,
  params: MediaStoreGetFileImageParams,
  mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
): CardPreview => {
  let dataURI: string;
  try {
    const rawDataURI = mediaClient.getImageUrlSync(id, params);
    // We want to embed some meta context into dataURI for Copy/Paste to work.
    dataURI = mediaBlobUrlAttrs
      ? addFileAttrsToUrl(rawDataURI, mediaBlobUrlAttrs)
      : rawDataURI;
    const source = ssr === 'client' ? 'ssr-client' : 'ssr-server';
    return { dataURI, source, orientation: 1 };
  } catch (e) {
    const reason = ssr === 'server' ? 'ssr-server-uri' : 'ssr-client-uri';
    throw new SsrPreviewError(reason, e instanceof Error ? e : undefined);
  }
};

export const isLocalPreview = (preview: CardPreview) => {
  const localSources: CardPreviewSource[] = ['local', 'cache-local'];
  return localSources.includes(preview.source);
};

export const isSSRPreview = (preview: CardPreview) =>
  isSSRClientPreview(preview) ||
  isSSRServerPreview(preview) ||
  isSSRDataPreview(preview);

export const isSSRServerPreview = (preview: CardPreview) => {
  const ssrClientSources: CardPreviewSource[] = [
    'ssr-server',
    'cache-ssr-server',
  ];
  return ssrClientSources.includes(preview.source);
};

export const isSSRClientPreview = (preview: CardPreview) => {
  const ssrClientSources: CardPreviewSource[] = [
    'ssr-client',
    'cache-ssr-client',
  ];
  return ssrClientSources.includes(preview.source);
};

export const isSSRDataPreview = (preview: CardPreview) =>
  preview.source === 'ssr-data';

export const fetchAndCacheRemotePreview = async (
  mediaClient: MediaClient,
  id: string,
  dimensions: CardDimensions,
  params: MediaStoreGetFileImageParams,
  mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
  traceContext?: MediaTraceContext,
) => {
  const remotePreview = await getCardPreviewFromBackend(
    mediaClient,
    id,
    params,
    traceContext,
  );
  return extendAndCachePreview(
    id,
    params.mode,
    { ...remotePreview, dimensions },
    mediaBlobUrlAttrs,
  );
};
