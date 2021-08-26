import { FileState, RequestMetadata } from '@atlaskit/media-client';
import {
  FileAttributes,
  WithFileAttributes,
  FailureAttributes,
  ANALYTICS_MEDIA_CHANNEL,
} from '@atlaskit/media-common';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { PrimaryErrorReason } from '../errors';

import {
  name as packageName,
  version as packageVersion,
} from '../version.json';

import { MediaViewerEventPayload } from './events';

const componentName = 'mediaViewer';

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
} & WithFileAttributes;

export function fireAnalytics(
  payload: MediaViewerEventPayload,
  props: WithAnalyticsEventsProps,
) {
  const { createAnalyticsEvent } = props;
  if (createAnalyticsEvent) {
    const ev = createAnalyticsEvent(payload);
    ev.fire(ANALYTICS_MEDIA_CHANNEL);
  }
}
