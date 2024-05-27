import { type FileState, type RequestMetadata } from '@atlaskit/media-client';

import {
  type FileAttributes,
  type WithFileAttributes,
  type FailureAttributes,
  ANALYTICS_MEDIA_CHANNEL,
  type WithTraceContext,
  sanitiseAnalyticsPayload,
} from '@atlaskit/media-common/analytics';
import { type CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { type PrimaryErrorReason } from '../errors';

import { type MediaViewerEventPayload } from './events';

const componentName = 'mediaViewer';
const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export {
  packageName,
  packageVersion,
  componentName,
  componentName as component,
};

export function getFileAttributes(fileState?: FileState): FileAttributes {
  if (!fileState) {
    return {
      fileId: 'undefined',
    };
  }
  const { id: fileId } = fileState;
  switch (fileState.status) {
    case 'uploading':
    case 'failed-processing':
    case 'processing':
    case 'processed':
      const {
        mediaType: fileMediatype,
        mimeType: fileMimetype,
        size: fileSize,
      } = fileState;
      return {
        fileId,
        fileMediatype,
        fileMimetype,
        fileSize,
      };
    case 'error':
      return {
        fileId,
      };
  }
}

/** This type takes FailureAttributes and redefines `failReason` to be the strong media-viewer type */
export type MediaViewerFailureAttributes = Omit<
  FailureAttributes,
  'failReason'
> & {
  failReason: PrimaryErrorReason;
  request?: RequestMetadata;
} & WithFileAttributes &
  WithTraceContext;

export function fireAnalytics(
  payload: MediaViewerEventPayload,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
) {
  if (createAnalyticsEvent) {
    const ev = createAnalyticsEvent(sanitiseAnalyticsPayload(payload));
    ev.fire(ANALYTICS_MEDIA_CHANNEL);
  }
}
