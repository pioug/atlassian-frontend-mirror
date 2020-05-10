import {
  FileDetails,
  MediaType,
  FileState,
  Identifier,
  isPreviewableType,
} from '@atlaskit/media-client';
import { MediaAnalyticsData } from '@atlaskit/analytics-namespaced-context';
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
  attributes?: GasCorePayload['attributes'] &
    AnalyticsErrorStateAttributes & {
      fileAttributes?: MediaCardAnalyticsFileAttributes;
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
): MediaAnalyticsData {
  return {
    fileAttributes: getFileAttributes(
      metadata,
      fileStatus && fileStatus.status,
    ),
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

export const getAnalyticsStatusFromCardStatus = (
  cardStatus: CardStatus,
): AnalyticsLoadingAction | undefined => {
  switch (cardStatus) {
    case 'error':
    case 'failed-processing':
      return 'failed';
    default:
      return;
  }
};

export type AnalyticsErrorStateAttributes = {
  failReason?: 'media-client-error' | 'file-status-error' | 'file-uri-error';
  error?: string;
};

export const getAnalyticsErrorStateAttributes = (
  previewable: boolean,
  hasMinimalData: boolean,
  fileState?: FileState,
  error?: Error | string,
): AnalyticsErrorStateAttributes => {
  const unknownError = 'unknown error';
  const errorMessage = error instanceof Error ? error.message : error;
  const errorMessageInFileState =
    fileState && 'message' in fileState && fileState.message;

  if (!fileState && !errorMessage) {
    return {};
  }

  if (!fileState) {
    return {
      failReason: 'media-client-error',
      error: errorMessage,
    };
  }

  if (!previewable) {
    if (hasMinimalData) {
      return {};
    }

    if (!errorMessageInFileState) {
      return {
        failReason: 'file-status-error',
        error:
          'Does not have minimal metadata (filename and filesize) OR metadata/media-type is undefined',
      };
    }
  }

  if (fileState && ['error', 'failed-processing'].includes(fileState.status)) {
    return {
      failReason: 'file-status-error',
      error: errorMessageInFileState || unknownError,
    };
  }

  return {};
};

export const getCopiedFileAnalyticsPayload = async (
  identifier: Identifier,
): Promise<MediaCardAnalyticsPayload> => {
  return {
    eventType: 'ui',
    action: 'copied',
    actionSubject: 'file',
    actionSubjectId:
      identifier.mediaItemType === 'file'
        ? await identifier.id
        : identifier.mediaItemType,
  };
};

export const getMediaCardCommencedAnalyticsPayload = (
  actionSubjectId: string,
): MediaCardAnalyticsPayload => {
  return {
    eventType: 'operational',
    action: 'commenced',
    actionSubject: 'mediaCardRender',
    actionSubjectId,
  };
};

export const getAnalyticsStatus = (
  previewable: boolean,
  hasMinimalData: boolean,
  status: CardStatus,
): AnalyticsLoadingAction | undefined => {
  if (!previewable && hasMinimalData) {
    return;
  }
  return getAnalyticsStatusFromCardStatus(status);
};

export const hasFilenameAndFilesize = (metadata?: FileDetails) =>
  !!metadata && !!metadata.name && !!metadata.size;

export const fileIsPreviewable = (metadata?: FileDetails): boolean =>
  !!metadata && !!metadata.mediaType && isPreviewableType(metadata.mediaType);

export const getLoadingStatusAnalyticsPayload = (
  action: string,
  actionSubjectId?: string,
  fileAttributes?: MediaCardAnalyticsFileAttributes,
  errorState?: AnalyticsErrorStateAttributes,
): MediaCardAnalyticsPayload => {
  const payload: MediaCardAnalyticsPayload = {
    eventType: 'operational',
    action,
    actionSubject: 'mediaCardRender',
    actionSubjectId,
  };

  if (!payload.attributes) payload.attributes = {};

  if (fileAttributes) {
    payload.attributes = { ...payload.attributes, fileAttributes };
  }

  if (errorState) {
    payload.attributes.failReason = errorState.failReason;
    payload.attributes.error = errorState.error;
  }

  return payload;
};
