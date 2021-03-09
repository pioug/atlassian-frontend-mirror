import {
  FileDetails,
  FileStatus,
  MediaClientErrorReason,
  getMediaClientErrorReason,
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

export enum RenderEventAction {
  COMMENCED = 'commenced',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

export type FileUriFailReason = 'local-uri' | 'remote-uri' | `unknown-uri`;
export type FailedMediaClientFailReason = 'upload' | 'metadata-fetch';

export type RenderEventFailReason =
  | FailedMediaClientFailReason
  | 'failed-processing'
  | FileUriFailReason
  | 'external-uri';

export type RenderFailedEventPayload = OperationalEventPayload<
  WithFileAttributes &
    FailureAttributes & {
      failReason: RenderEventFailReason;
      error?: MediaClientErrorReason | 'unknown';
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

export type RenderEventPayload =
  | RenderCommencedEventPayload
  | RenderSucceededEventPayload
  | RenderFailedEventPayload;

export type CopiedFileEventPayload = UIEventPayload<{}, 'copied', string>;

export type ClickedEventPayload = UIEventPayload<
  { label?: string },
  'clicked',
  string
>;

export type MediaCardAnalyticsEventPayload =
  | RenderEventPayload
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

export const isRenderFailedEventPayload = (
  payload?: RenderEventPayload,
): payload is RenderFailedEventPayload => payload?.action === 'failed';

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

export const getRenderFailedMediaClientFailReason = (
  fileStatus?: FileStatus,
): FailedMediaClientFailReason => {
  // If the last status got is uploading and there is an error, we can tell that uploading failed.
  // Any other case, including "no filestatus", it is a metadata fetch problem.
  switch (fileStatus) {
    case 'uploading':
      return 'upload';
    default:
      return 'metadata-fetch';
  }
};

export const getRenderFailedMediaClientPayload = (
  fileAttributes: FileAttributes,
  error: Error,
): RenderFailedEventPayload => ({
  eventType: 'operational',
  action: RenderEventAction.FAILED,
  actionSubject: 'mediaCardRender',
  attributes: {
    fileAttributes,
    status: 'fail',
    failReason: getRenderFailedMediaClientFailReason(fileAttributes.fileStatus),
    error: getMediaClientErrorReason(error),
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
