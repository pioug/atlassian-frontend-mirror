import { FileDetails, MediaType, FileState } from '@atlaskit/media-client';

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

export type MediaCardAnalyticsPayloadBase = Partial<GasCorePayload> & {
  action?: string;
  attributes?: GasCorePayload['attributes'] & {
    fileAttributes?: MediaCardAnalyticsFileAttributes;
  };
};

export type MediaCardAnalyticsPayload = MediaCardAnalyticsPayloadBase & {
  attributes: MediaCardAnalyticsPayloadBase['attributes'] & {
    packageName: string; // Mandatory attribute. It is used by Media Listener to merge this object with Context Data Object
  };
};

export function getBaseAnalyticsContext(): GasCorePayload['attributes'] {
  return {
    packageVersion,
    packageName,
    componentName: 'mediaCard',
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

export function getUIAnalyticsContext(
  actionSubjectId: string,
  metadata?: FileDetails,
  fileStatus?: FileState['status'],
): MediaCardAnalyticsPayload {
  const fileAttributes = getFileAttributes(metadata, fileStatus);

  const currentActionSujectId =
    metadata && metadata.id ? metadata.id : actionSubjectId;
  return {
    actionSubjectId: currentActionSujectId,
    attributes: {
      packageName,
      ...getBaseAnalyticsContext(),
      fileAttributes: {
        ...fileAttributes,
      },
    },
  };
}

function attachPackageName(
  basePayload: MediaCardAnalyticsPayloadBase,
): MediaCardAnalyticsPayload {
  return {
    ...basePayload,
    attributes: {
      packageName,
      ...(basePayload.attributes || {}),
    },
  };
}

export function createAndFireCustomMediaEvent(
  basePayload: MediaCardAnalyticsPayloadBase,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
) {
  const payload = attachPackageName(basePayload);
  if (createAnalyticsEvent) {
    const event = createAnalyticsEvent(payload);
    event.fire(ANALYTICS_MEDIA_CHANNEL);
  }
}

type CreateAndFireMediaEvent = (
  basePayload: MediaCardAnalyticsPayloadBase,
) => (createAnalyticsEvent: CreateUIAnalyticsEvent) => UIAnalyticsEvent;

export const createAndFireMediaEvent: CreateAndFireMediaEvent = basePayload => {
  const payload = attachPackageName(basePayload);
  return createAndFireEvent(ANALYTICS_MEDIA_CHANNEL)(payload);
};
