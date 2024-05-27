import {
  type FileDetails,
  type FileStatus,
  type MediaClientErrorReason,
  getMediaClientErrorReason,
  type RequestMetadata,
  isRequestError,
} from '@atlaskit/media-client';
import {
  ANALYTICS_MEDIA_CHANNEL,
  type FileAttributes,
  type PerformanceAttributes,
  type OperationalEventPayload,
  type UIEventPayload,
  type WithFileAttributes,
  type WithPerformanceAttributes,
  type SuccessAttributes,
  type FailureAttributes,
  type ScreenEventPayload,
  type ScreenAttributes,
  type MediaTraceContext,
  type WithTraceContext,
  sanitiseAnalyticsPayload,
} from '@atlaskit/media-common/analytics';

import {
  type CreateUIAnalyticsEvent,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  isMediaCardError,
  type MediaCardError,
  type MediaCardErrorPrimaryReason,
  getFileStateErrorReason,
  isMediaFileStateError,
} from '../../errors';
import { type CardPreviewSource, type CardDimensions, type CardStatus } from '../../types';

export type CardPreviewAttributes = {
  fileId: string;
  prevDimensions: CardDimensions | undefined;
  currentDimensions: CardDimensions | undefined;
  dimensionsPercentageDiff?: CardDimensions | undefined;
  source: CardPreviewSource;
};

type WithCardPreviewCacheAttributes = {
  cardPreviewAttributes: CardPreviewAttributes;
};

export type FileUriFailReason = 'local-uri' | 'remote-uri' | `unknown-uri`;
export type FailedErrorFailReason = MediaCardErrorPrimaryReason | 'nativeError';

export type MediaCardErrorInfo = {
  failReason: FailedErrorFailReason;
  error: MediaClientErrorReason | 'nativeError';
  errorDetail: string;
  metadataTraceContext?: MediaTraceContext;
};

export type SSRStatusFail = MediaCardErrorInfo & {
  status: 'fail';
};

type SSRStatusSuccess = SuccessAttributes;

type SSRStatusUnknown = { status: 'unknown' };

type SSRStatusAttributes = SSRStatusSuccess | SSRStatusFail | SSRStatusUnknown;

export type SSRStatus = {
  server: SSRStatusAttributes;
  client: SSRStatusAttributes;
};

export type WithSSRReliability = {
  ssrReliability?: SSRStatus;
};

export type RenderFailedEventPayload = OperationalEventPayload<
  WithFileAttributes &
    WithPerformanceAttributes &
    WithSSRReliability &
    WithTraceContext &
    FailureAttributes & {
      failReason: FailedErrorFailReason | 'failed-processing';
      error?: MediaClientErrorReason | 'nativeError';
      request?: RequestMetadata;
    },
  'failed',
  'mediaCardRender'
>;

export type ErrorEventPayload = OperationalEventPayload<
  WithFileAttributes &
    WithPerformanceAttributes &
    WithSSRReliability &
    WithTraceContext &
    FailureAttributes & {
      cardStatus: CardStatus;
      failReason: FailedErrorFailReason | 'failed-processing';
      error?: MediaClientErrorReason | 'nativeError';
      request?: RequestMetadata;
    },
  'nonCriticalFail',
  'mediaCardRender'
>;

export type ErrorBoundaryErrorInfo = {
  componentStack: string;
};

export type AnalyticsErrorBoundaryAttributes = {
  error?: Error | string;
  info?: ErrorBoundaryErrorInfo;
  browserInfo: string;
  failReason: string;
};

export type AnalyticsErrorBoundaryCardPayload = OperationalEventPayload<
  AnalyticsErrorBoundaryAttributes,
  'failed',
  'mediaCardRender'
>;

export type AnalyticsErrorBoundaryInlinePayload = OperationalEventPayload<
  AnalyticsErrorBoundaryAttributes,
  'failed',
  'mediaInlineRender'
>;

export type RenderInlineCardSucceededEventPayload = OperationalEventPayload<
  WithFileAttributes & WithPerformanceAttributes & SuccessAttributes,
  'succeeded',
  'mediaInlineRender'
>;

export type RenderInlineCardFailedEventPayload = OperationalEventPayload<
  WithFileAttributes &
    WithPerformanceAttributes &
    FailureAttributes & {
      failReason: FailedErrorFailReason | 'failed-processing';
      error?: MediaClientErrorReason | 'nativeError';
      request?: RequestMetadata;
    },
  'failed',
  'mediaInlineRender'
>;

export type RenderSucceededEventPayload = OperationalEventPayload<
  WithFileAttributes &
    WithPerformanceAttributes &
    WithSSRReliability &
    SuccessAttributes &
    WithTraceContext,
  'succeeded',
  'mediaCardRender'
>;

export type RenderCommencedEventPayload = OperationalEventPayload<
  WithFileAttributes & WithPerformanceAttributes & WithTraceContext,
  'commenced',
  'mediaCardRender'
>;

export type CacheHitEventPayload = OperationalEventPayload<
  WithCardPreviewCacheAttributes,
  'cache-hit',
  'mediaCardCache'
>;

export type RemoteSuccessEventPayload = OperationalEventPayload<
  WithCardPreviewCacheAttributes,
  'Remote-success',
  'mediaCardCache'
>;

export type CopiedFileEventPayload = UIEventPayload<{}, 'copied', string>;

export type ClickedEventPayload = UIEventPayload<
  { label?: string },
  'clicked',
  string
>;

export type RenderScreenEventPayload = Omit<
  ScreenEventPayload<ScreenAttributes, 'mediaCardRenderScreen'>,
  'attributes'
> & {
  attributes: {
    type: string | undefined;
    fileAttributes: FileAttributes;
  };
};

export type MediaCardAnalyticsEventPayload =
  | RenderCommencedEventPayload
  | RenderSucceededEventPayload
  | RenderFailedEventPayload
  | CopiedFileEventPayload
  | ClickedEventPayload
  | RenderScreenEventPayload
  | CacheHitEventPayload
  | RemoteSuccessEventPayload
  | ErrorEventPayload
  | AnalyticsErrorBoundaryCardPayload
  | AnalyticsErrorBoundaryInlinePayload
  | RenderInlineCardFailedEventPayload
  | RenderInlineCardSucceededEventPayload;

export const getFileAttributes = (
  metadata: FileDetails,
  fileStatus?: FileStatus,
): FileAttributes => ({
  fileMediatype: metadata.mediaType,
  fileMimetype: metadata.mimeType,
  fileId: metadata.id,
  fileSize: metadata.size,
  fileStatus,
});

export const getRenderPreviewableCardPayload = (
  fileAttributes: FileAttributes,
): RenderScreenEventPayload => ({
  eventType: 'screen',
  action: 'viewed',
  actionSubject: 'mediaCardRenderScreen',
  name: 'mediaCardRenderScreen',
  attributes: {
    type: fileAttributes.fileMediatype,
    fileAttributes,
  },
});

export const getRenderCommencedEventPayload = (
  fileAttributes: FileAttributes,
  performanceAttributes: PerformanceAttributes,
  traceContext: MediaTraceContext,
): RenderCommencedEventPayload => {
  return {
    eventType: 'operational',
    action: 'commenced',
    actionSubject: 'mediaCardRender',
    attributes: {
      fileAttributes,
      performanceAttributes,
      traceContext: {
        traceId: traceContext.traceId,
      },
    },
  };
};

export const getRenderSucceededEventPayload = (
  fileAttributes: FileAttributes,
  performanceAttributes: PerformanceAttributes,
  ssrReliability: SSRStatus,
  traceContext: MediaTraceContext,
  metadataTraceContext?: MediaTraceContext,
): RenderSucceededEventPayload => ({
  eventType: 'operational',
  action: 'succeeded',
  actionSubject: 'mediaCardRender',
  attributes: {
    fileAttributes,
    performanceAttributes,
    status: 'success',
    ssrReliability,
    traceContext,
    metadataTraceContext,
  },
});

export const getCacheHitEventPayload = (
  cardPreviewAttributes: CardPreviewAttributes,
): CacheHitEventPayload => ({
  eventType: 'operational',
  action: 'cache-hit',
  actionSubject: 'mediaCardCache',
  attributes: {
    cardPreviewAttributes,
  },
});

export const getRemoteSuccessEventPayload = (
  cardPreviewAttributes: CardPreviewAttributes,
): RemoteSuccessEventPayload => ({
  eventType: 'operational',
  action: 'Remote-success',
  actionSubject: 'mediaCardCache',
  attributes: {
    cardPreviewAttributes,
  },
});

export const getRenderFailedExternalUriPayload = (
  fileAttributes: FileAttributes,
  performanceAttributes: PerformanceAttributes,
): RenderFailedEventPayload => ({
  eventType: 'operational',
  action: 'failed',
  actionSubject: 'mediaCardRender',
  attributes: {
    fileAttributes,
    performanceAttributes,
    status: 'fail',
    failReason: 'external-uri',
  },
});

export const getRenderErrorFailReason = (
  error: MediaCardError,
): FailedErrorFailReason => {
  if (isMediaCardError(error)) {
    return error.primaryReason;
  } else {
    return 'nativeError';
  }
};

export const getRenderErrorErrorReason = (
  error: MediaCardError,
): MediaClientErrorReason | 'nativeError' => {
  if (isMediaCardError(error) && error.secondaryError) {
    const mediaClientReason = isMediaFileStateError(error.secondaryError)
      ? getFileStateErrorReason(error.secondaryError)
      : getMediaClientErrorReason(error.secondaryError);
    if (mediaClientReason !== 'unknown') {
      return mediaClientReason;
    }
  }
  return 'nativeError';
};

export const getRenderErrorErrorDetail = (error: MediaCardError): string => {
  if (isMediaCardError(error) && error.secondaryError) {
    return error.secondaryError.message;
  } else {
    return error.message;
  }
};

export const getErrorTraceContext = (
  error: MediaCardError,
): MediaTraceContext | undefined => {
  if (isMediaCardError(error) && !!error.secondaryError) {
    if (isRequestError(error.secondaryError)) {
      return error.secondaryError.metadata?.traceContext;
    } else if (isMediaFileStateError(error.secondaryError)) {
      return error.secondaryError.details?.metadata?.traceContext;
    }
  }
};

export const getRenderErrorRequestMetadata = (
  error: MediaCardError,
): RequestMetadata | undefined => {
  if (isMediaCardError(error) && !!error.secondaryError) {
    if (isRequestError(error.secondaryError)) {
      return error.secondaryError.metadata;
    } else if (isMediaFileStateError(error.secondaryError)) {
      return error.secondaryError.details?.metadata;
    }
  }
};

export const extractErrorInfo = (
  error: MediaCardError,
  metadataTraceContext?: MediaTraceContext,
): MediaCardErrorInfo => {
  return {
    failReason: getRenderErrorFailReason(error),
    error: getRenderErrorErrorReason(error),
    errorDetail: getRenderErrorErrorDetail(error),
    metadataTraceContext: metadataTraceContext ?? getErrorTraceContext(error),
  };
};

export const getRenderErrorEventPayload = (
  fileAttributes: FileAttributes,
  performanceAttributes: PerformanceAttributes,
  error: MediaCardError,
  ssrReliability: SSRStatus,
  traceContext: MediaTraceContext,
  metadataTraceContext?: MediaTraceContext,
): RenderFailedEventPayload => ({
  eventType: 'operational',
  action: 'failed',
  actionSubject: 'mediaCardRender',
  attributes: {
    fileAttributes,
    performanceAttributes,
    status: 'fail',
    ...extractErrorInfo(error, metadataTraceContext),
    request: getRenderErrorRequestMetadata(error),
    ssrReliability,
    traceContext,
  },
});

export const getErrorEventPayload = (
  cardStatus: CardStatus,
  fileAttributes: FileAttributes,
  error: MediaCardError,
  ssrReliability: SSRStatus,
  traceContext: MediaTraceContext,
  metadataTraceContext?: MediaTraceContext,
): ErrorEventPayload => ({
  eventType: 'operational',
  action: 'nonCriticalFail',
  actionSubject: 'mediaCardRender',
  attributes: {
    fileAttributes,
    status: 'fail',
    ...extractErrorInfo(error, metadataTraceContext),
    request: getRenderErrorRequestMetadata(error),
    ssrReliability,
    traceContext,
    cardStatus,
  },
});

export const getRenderFailedFileStatusPayload = (
  fileAttributes: FileAttributes,
  performanceAttributes: PerformanceAttributes,
  ssrReliability: SSRStatus,
  traceContext: MediaTraceContext,
  metadataTraceContext?: MediaTraceContext,
): RenderFailedEventPayload => ({
  eventType: 'operational',
  action: 'failed',
  actionSubject: 'mediaCardRender',
  attributes: {
    fileAttributes,
    performanceAttributes,
    status: 'fail',
    failReason: 'failed-processing',
    ssrReliability,
    traceContext,
    metadataTraceContext,
  },
});

export const getCopiedFilePayload = (
  fileId: string,
): CopiedFileEventPayload => ({
  eventType: 'ui',
  action: 'copied',
  actionSubject: 'file',
  actionSubjectId: fileId,
  attributes: {},
});

export function fireMediaCardEvent(
  payload: MediaCardAnalyticsEventPayload,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
) {
  if (createAnalyticsEvent) {
    const event = createAnalyticsEvent(sanitiseAnalyticsPayload(payload));
    event.fire(ANALYTICS_MEDIA_CHANNEL);
  }
}

export const createAndFireMediaCardEvent = (
  payload: MediaCardAnalyticsEventPayload,
) => {
  return createAndFireEvent(ANALYTICS_MEDIA_CHANNEL)(
    sanitiseAnalyticsPayload(payload),
  );
};
