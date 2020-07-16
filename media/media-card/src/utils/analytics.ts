import {
  FileDetails,
  MediaType,
  FileState,
  Identifier,
} from '@atlaskit/media-client';
import {
  MediaAnalyticsData,
  MediaCardFeatureFlags,
} from '@atlaskit/analytics-namespaced-context';
import { CardStatus } from '../';

import { GasCorePayload } from '@atlaskit/analytics-gas-types';
import {
  version as packageVersion,
  name as packageName,
} from '../version.json';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
  createAndFireEvent,
} from '@atlaskit/analytics-next';

import { ANALYTICS_MEDIA_CHANNEL } from '../root/media-card-analytics-error-boundary';

export interface MediaCardAnalyticsFileAttributes {
  fileSource: string;
  fileMediatype?: MediaType;
  fileMimetype?: string;
  fileId?: string;
  fileStatus?: FileState['status'];
  fileSize?: number;
}

export type MediaCardAnalyticsPayload = Partial<GasCorePayload> & {
  action?: string;
  attributes?: GasCorePayload['attributes'] & {
    fileAttributes?: MediaCardAnalyticsFileAttributes;
    failReason?: AnalyticsLoadingFailReason;
    error?: string;
    featureFlags?: MediaCardFeatureFlags;
  };
};

export function getBaseAnalyticsContext(
  componentName = 'mediaCard',
): GasCorePayload['attributes'] {
  /*
    This Context provides data needed to build packageHierarchy in Atlaskit Analytics Listener and Media Analytics Listener
  */
  return {
    packageVersion,
    packageName,
    componentName,
    component: componentName,
  };
}

export const getFileAttributes = (
  metadata?: FileDetails,
  fileStatus?: FileState['status'],
): MediaCardAnalyticsFileAttributes => ({
  fileSource: 'mediaCard',
  fileMediatype: metadata && metadata.mediaType,
  fileMimetype: metadata && metadata.mimeType,
  fileId: metadata && metadata.id,
  fileSize: metadata && metadata.size,
  fileStatus,
});

export function getMediaCardAnalyticsContext(
  metadata?: FileDetails,
  fileStatus?: FileState,
  featureFlags?: MediaCardFeatureFlags,
): MediaAnalyticsData {
  return {
    fileAttributes: getFileAttributes(
      metadata,
      fileStatus && fileStatus.status,
    ),
    featureFlags,
  };
}

export function createAndFireCustomMediaEvent(
  payload: MediaCardAnalyticsPayload,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
) {
  if (createAnalyticsEvent) {
    const event = createAnalyticsEvent(payload);
    event.fire(ANALYTICS_MEDIA_CHANNEL);
  }
}

type CreateAndFireMediaEvent = (
  basePayload: MediaCardAnalyticsPayload,
) => (createAnalyticsEvent: CreateUIAnalyticsEvent) => UIAnalyticsEvent;

export const createAndFireMediaEvent: CreateAndFireMediaEvent = payload => {
  return createAndFireEvent(ANALYTICS_MEDIA_CHANNEL)(payload);
};

export type AnalyticsLoadingAction = 'succeeded' | 'failed';
export type AnalyticsLoadingFailReason =
  | 'media-client-error'
  | 'file-status-error'
  | 'file-uri-error';

export type AnalyticsLoadingStatus = {
  action: AnalyticsLoadingAction;
  failReason?: AnalyticsLoadingFailReason;
  error?: string;
};

export type AnalyticsLoadingStatusArgs = {
  cardStatus: CardStatus;
  metadata: FileDetails;
  fileState?: FileState;
  dataURI?: string;
  error?: Error | string;
};

/**
 * This function decides if we can fire an event at this stage,
 * returning a base for the corresponding payload,
 * or void in case we can't fire any event
 * based on arguments provided
 */
export const getAnalyticsLoadingStatus = ({
  cardStatus,
  metadata,
  fileState,
  dataURI,
  error,
}: AnalyticsLoadingStatusArgs): AnalyticsLoadingStatus | void => {
  // If we do have dataURI and there is an error, we should not fire a failed event.
  // Render something is the priority. Any supported file by the browser that has been
  // failed to process, we should try to render.
  if (!dataURI && ['error', 'failed-processing'].includes(cardStatus)) {
    const action = 'failed';
    if (error) {
      const message = error instanceof Error ? error.message : error;
      return { action, failReason: 'media-client-error', error: message };
    }

    const errorMessage =
      fileState && 'message' in fileState && fileState.message;
    if (errorMessage) {
      return { action, failReason: 'file-status-error', error: errorMessage };
    }

    if (!metadata.name) {
      return {
        action,
        failReason: 'file-status-error',
        error:
          'Does not have minimal metadata (filename and filesize) OR metadata/media-type is undefined',
      };
    }

    return {
      action,
      failReason: 'file-status-error',
      error: 'unknown error',
    };
  }
  // If we have no dataURI and the card is complete, we can say that
  // we intend to not display an image, therefore the fetching is a success.
  if (!dataURI && cardStatus === 'complete') {
    return {
      action: 'succeeded',
    };
  }
};

export const getCopiedFileAnalyticsPayload = (
  identifier: Identifier,
  featureFlags?: MediaCardFeatureFlags,
): MediaCardAnalyticsPayload => {
  const payload: MediaCardAnalyticsPayload = {
    eventType: 'ui',
    action: 'copied',
    actionSubject: 'file',
    actionSubjectId:
      identifier.mediaItemType === 'file'
        ? identifier.id
        : identifier.mediaItemType,
  };
  if (featureFlags) {
    payload.attributes = { featureFlags };
  }
  return payload;
};

export const getMediaCardCommencedAnalyticsPayload = (
  actionSubjectId: string,
  featureFlags?: MediaCardFeatureFlags,
): MediaCardAnalyticsPayload => {
  const payload: MediaCardAnalyticsPayload = {
    eventType: 'operational',
    action: 'commenced',
    actionSubject: 'mediaCardRender',
    actionSubjectId,
  };
  if (featureFlags) {
    payload.attributes = { featureFlags };
  }
  return payload;
};

export type LoadingStatusPayloadArgs = {
  action: string;
  actionSubjectId?: string;
  fileAttributes?: MediaCardAnalyticsFileAttributes;
  failReason?: AnalyticsLoadingFailReason;
  error?: string;
  featureFlags?: MediaCardFeatureFlags;
};

export type LoadingStatusPayload = (
  args: LoadingStatusPayloadArgs,
) => MediaCardAnalyticsPayload;

export const getLoadingStatusAnalyticsPayload: LoadingStatusPayload = ({
  action,
  actionSubjectId,
  fileAttributes,
  failReason,
  error,
  featureFlags,
}) => {
  const payload: MediaCardAnalyticsPayload = {
    eventType: 'operational',
    action,
    actionSubject: 'mediaCardRender',
    actionSubjectId,
  };
  if (fileAttributes) {
    payload.attributes = { ...payload.attributes, fileAttributes };
  }
  if (featureFlags) {
    payload.attributes = { ...payload.attributes, featureFlags };
  }
  if (failReason) {
    payload.attributes = { ...payload.attributes, failReason };
  }
  if (error) {
    payload.attributes = { ...payload.attributes, error };
  }
  return payload;
};
