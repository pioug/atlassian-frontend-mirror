import {
  FileDetails,
  FileStatus,
  MediaClientErrorReason,
  getMediaClientErrorReason,
  RequestMetadata,
  isRequestError,
} from '@atlaskit/media-client';
import {
  ANALYTICS_MEDIA_CHANNEL,
  FileAttributes,
  OperationalEventPayload,
  UIEventPayload,
  WithFileAttributes,
  SuccessAttributes,
  FailureAttributes,
} from '@atlaskit/media-common';
import {
  CreateUIAnalyticsEvent,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  isMediaCardError,
  MediaCardError,
  MediaCardErrorPrimaryReason,
} from '../errors';

export enum RenderEventAction {
  COMMENCED = 'commenced',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

export type FileUriFailReason = 'local-uri' | 'remote-uri' | `unknown-uri`;
export type FailedErrorFailReason = MediaCardErrorPrimaryReason | 'nativeError';

export type RenderEventFailReason =
  | FailedErrorFailReason
  | 'failed-processing'
  | FileUriFailReason
  | 'external-uri';

export type RenderFailedEventPayload = OperationalEventPayload<
  WithFileAttributes &
    FailureAttributes & {
      failReason: RenderEventFailReason;
      error?: MediaClientErrorReason | 'nativeError';
      request?: RequestMetadata;
    },
  RenderEventAction.FAILED,
  'mediaCardRender'
>;

export type RenderSucceededEventPayload = OperationalEventPayload<
  WithFileAttributes & SuccessAttributes,
  RenderEventAction.SUCCEEDED,
  'mediaCardRender'
>;

export type RenderCommencedEventPayload = OperationalEventPayload<
  WithFileAttributes,
  RenderEventAction.COMMENCED,
  'mediaCardRender'
>;

export type CopiedFileEventPayload = UIEventPayload<{}, 'copied', string>;

export type ClickedEventPayload = UIEventPayload<
  { label?: string },
  'clicked',
  string
>;

export type MediaCardAnalyticsEventPayload =
  | RenderCommencedEventPayload
  | RenderSucceededEventPayload
  | RenderFailedEventPayload
  | CopiedFileEventPayload
  | ClickedEventPayload;

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

export const getRenderCommencedEventPayload = (
  fileAttributes: FileAttributes,
): RenderCommencedEventPayload => ({
  eventType: 'operational',
  action: RenderEventAction.COMMENCED,
  actionSubject: 'mediaCardRender',
  attributes: { fileAttributes },
});

export const getRenderSucceededEventPayload = (
  fileAttributes: FileAttributes,
): RenderSucceededEventPayload => ({
  eventType: 'operational',
  action: RenderEventAction.SUCCEEDED,
  actionSubject: 'mediaCardRender',
  attributes: {
    fileAttributes,
    status: 'success',
  },
});

export const getFailedFileUriFailReason = (
  fileStatus?: FileStatus,
): FileUriFailReason => {
  if (!fileStatus) {
    // This fail reason will come from a bug, most likely.
    return `unknown-uri`;
  } else if (fileStatus === 'uploading') {
    return 'local-uri';
  }
  return 'remote-uri';
};

export const getRenderFailedFileUriPayload = (
  fileAttributes: FileAttributes,
): RenderFailedEventPayload => ({
  eventType: 'operational',
  action: RenderEventAction.FAILED,
  actionSubject: 'mediaCardRender',
  attributes: {
    fileAttributes,
    status: 'fail',
    failReason: getFailedFileUriFailReason(fileAttributes.fileStatus),
  },
});

export const getRenderFailedExternalUriPayload = (
  fileAttributes: FileAttributes,
): RenderFailedEventPayload => ({
  eventType: 'operational',
  action: RenderEventAction.FAILED,
  actionSubject: 'mediaCardRender',
  attributes: {
    fileAttributes,
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
    const mediaClientReason = getMediaClientErrorReason(error.secondaryError);
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

export const getRenderErrorRequestMetadata = (
  error: MediaCardError,
): RequestMetadata | undefined => {
  if (
    isMediaCardError(error) &&
    !!error.secondaryError &&
    isRequestError(error.secondaryError)
  ) {
    return error.secondaryError.metadata;
  }
};

export const getRenderErrorEventPayload = (
  fileAttributes: FileAttributes,
  error: MediaCardError,
): RenderFailedEventPayload => ({
  eventType: 'operational',
  action: RenderEventAction.FAILED,
  actionSubject: 'mediaCardRender',
  attributes: {
    fileAttributes,
    status: 'fail',
    failReason: getRenderErrorFailReason(error),
    error: getRenderErrorErrorReason(error),
    errorDetail: getRenderErrorErrorDetail(error),
    request: getRenderErrorRequestMetadata(error),
  },
});

export const getRenderFailedFileStatusPayload = (
  fileAttributes: FileAttributes,
): RenderFailedEventPayload => ({
  eventType: 'operational',
  action: RenderEventAction.FAILED,
  actionSubject: 'mediaCardRender',
  attributes: {
    fileAttributes,
    status: 'fail',
    failReason: 'failed-processing',
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
    const event = createAnalyticsEvent(payload);
    event.fire(ANALYTICS_MEDIA_CHANNEL);
  }
}

export const createAndFireMediaCardEvent = (
  payload: MediaCardAnalyticsEventPayload,
) => {
  return createAndFireEvent(ANALYTICS_MEDIA_CHANNEL)(payload);
};
