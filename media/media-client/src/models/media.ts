import {
  getMediaFeatureFlag,
  MediaFeatureFlags,
  MediaTraceContext,
  MediaType,
} from '@atlaskit/media-common';

import type { MediaFileArtifacts } from './artifacts';

// Warning! You can't add new media file processing status!
// See packages/media/media-core/src/__tests__/cache-backward-compatibility.spec.ts
export type MediaFileProcessingStatus = 'pending' | 'succeeded' | 'failed';

export type { MediaType } from '@atlaskit/media-common';

export const isPreviewableType = (
  type: MediaType,
  featureFlags?: MediaFeatureFlags,
): boolean => {
  // in classic experience, only audio/video/image are previewable
  const defaultPreviewableTypes = ['audio', 'video', 'image'];

  // in the new experience, docs are previewable too
  if (getMediaFeatureFlag('newCardExperience', featureFlags)) {
    return [...defaultPreviewableTypes, 'doc'].indexOf(type) > -1;
  }

  return defaultPreviewableTypes.indexOf(type) > -1;
};

export type MediaFile = {
  readonly id: string;
  readonly mediaType: MediaType;
  readonly mimeType: string;
  readonly name: string;
  readonly processingStatus?: MediaFileProcessingStatus;
  readonly size: number;
  readonly artifacts: MediaFileArtifacts;
  readonly representations: MediaRepresentations;
  readonly createdAt?: number;
  readonly metadataTraceContext?: MediaTraceContext;
};

export type MediaItemDetails = {
  readonly mediaType: MediaType;
  readonly mimeType: string;
  readonly name: string;
  readonly processingStatus: MediaFileProcessingStatus;
  readonly size: number;
  readonly artifacts: MediaFileArtifacts;
  readonly representations: MediaRepresentations;
  readonly createdAt?: number;
  readonly metadataTraceContext?: MediaTraceContext;
};

export type MediaRepresentations = {
  image?: Object;
};

export type MediaUpload = {
  readonly id: string;
  readonly created: number;
  readonly expires: number;
};

export type MediaChunksProbe = {
  readonly results: {
    readonly [etag: string]: {
      readonly exists: boolean;
    };
  };
};

export enum DATA_UNIT {
  MB = 1024 * 1024,
  GB = 1024 * MB,
  TB = 1024 * GB,
}
