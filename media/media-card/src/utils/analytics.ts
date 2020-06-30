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

/*
 * Returns an empty object (success event) or an object containing an error with its corresponding failReason.
 */
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
  const fileStateIsErrorOrFailedProcessing =
    fileState && ['error', 'failed-processing'].includes(fileState.status);

  // if the fileState is undefined and theres no error message, don't fire an error event
  if (!fileState && !errorMessage) {
    return {};
  }

  // if the filestate IS undefined and has an error message, then fire an error event
  if (!fileState) {
    return {
      failReason: 'media-client-error',
      error: errorMessage,
    };
  }

  // if the file has no preview (i.e docs/pdfs/unknown files). Note, if the mediaType is undefined it is assumed to be unpreviewable
  if (!previewable) {
    // if an unpreviewable file has its filename and size (minimal metadata), then it can render successfully (card does not appear broken to the user)
    // files that are previewable i.e videos, need more than this minimal metadata as otherwise the card will appear broken
    if (hasMinimalData) {
      return {};
    }

    // If a file does not have minimal metadata, then fire an error with an error message stating this. Only do this if a pre-existing error message
    // such as a network error, does not exist. Additionally, only fire this error state if the fileState is an error or failed-processing.
    // For instance, we do not want to return an error state state if the fileState is uploading/uploaded/processing, as these states do not indicate an error.
    if (!errorMessageInFileState && fileStateIsErrorOrFailedProcessing) {
      return {
        failReason: 'file-status-error',
        error:
          'Does not have minimal metadata (filename and filesize) OR metadata/media-type is undefined',
      };
    }
  }

  // if the state of a file is an error or has failed to process, fire an error message.
  if (fileStateIsErrorOrFailedProcessing) {
    return {
      failReason: 'file-status-error',
      error: errorMessageInFileState || unknownError,
    };
  }

  // if not, then the filestate is uploading/processed/processing, and hence we should not fire an error
  return {};
};

export const getCopiedFileAnalyticsPayload = (
  identifier: Identifier,
): MediaCardAnalyticsPayload => {
  return {
    eventType: 'ui',
    action: 'copied',
    actionSubject: 'file',
    actionSubjectId:
      identifier.mediaItemType === 'file'
        ? identifier.id
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
